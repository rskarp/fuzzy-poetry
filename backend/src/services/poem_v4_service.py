from nltk.tokenize import word_tokenize, sent_tokenize
from typing import List
import requests
import io
from PIL import Image
import concurrent.futures
from typing import Optional
from src.models.poem_v4 import PoemV4CreateRequest
from lancedb.table import Table
from lancedb.embeddings import get_registry
from lancedb.pydantic import LanceModel, Vector
import lancedb
from string import punctuation
from random import sample
import json
import boto3
import os
from uuid import uuid4
from openai import OpenAI
import datamuse
import re
import nltk
import base64
import logging

logger = logging.getLogger(__name__)

func = get_registry().get("open-clip").create()
DEEPSEEK_R1 = "us.deepseek.r1-v1:0"
CLAUDE_OPUS_41 = "us.anthropic.claude-opus-4-1-20250805-v1:0"
CLAUDE_OPUS_4 = "us.anthropic.claude-opus-4-20250514-v1:0"
CLAUDE_SONNET_4 = "us.anthropic.claude-sonnet-4-20250514-v1:0"
GPT_41_NANO = "gpt-4.1-nano"
NEWLINECHAR_PLACEHOLDER = "NEWLINECHAR"


class Images(LanceModel):
    id: int
    student: str
    title: Optional[str] = None
    author: Optional[str] = None
    poem: str
    download_image_url: str
    google_drive_link: str
    image_uri: str
    image_bytes: bytes = func.SourceField()  # image bytes as the source
    # Another vector column
    vec_from_bytes: Vector(func.ndims()) = func.VectorField()


class PoemV4Service:
    def __init__(self):
        self.init_nltk()

        self.openai_client = OpenAI(
            organization=os.getenv("OPENAI_ORGANIZATION"),
            api_key=os.getenv("OPENAI_API_KEY"),
        )
        self.datamuse_client = datamuse.Datamuse()
        self.bedrock_client = boto3.client(
            service_name="bedrock-runtime", region_name="us-east-1"
        )
        self.bucket_name = os.getenv("S3_BUCKET_NAME")
        self.table_name = os.getenv("LANCEDB_TABLE_NAME")
        self.lancedb_client = lancedb.connect(f"s3://{self.bucket_name}/")
        self.lancedb_table = self.lancedb_client.open_table(self.table_name)

    def init_nltk(self):
        local_data_path = "./nltk_data"
        temp_data_path = "/tmp"

        if not os.path.exists(local_data_path):
            os.makedirs(local_data_path, exist_ok=True)

        if local_data_path not in nltk.data.path:
            nltk.data.path.insert(0, local_data_path)

        if temp_data_path not in nltk.data.path:
            nltk.data.path.insert(0, temp_data_path)

        packages_to_download = [
            "punkt_tab",
            "averaged_perceptron_tagger_eng",
            "universal_tagset",
        ]

        for package in packages_to_download:
            nltk.download(package, download_dir=temp_data_path, force=True)

    def get_tokens(self, originalText):
        tokens = []
        text = originalText.replace("\n", f" {NEWLINECHAR_PLACEHOLDER} ")
        for sent in sent_tokenize(text, language="english"):
            wordtokens = word_tokenize(sent, language="english")
            wordtokens = [token for token in wordtokens if token.strip()]
            if len(wordtokens) > 0:
                try:
                    tokens.extend(nltk.pos_tag(wordtokens, tagset="universal"))
                except AssertionError:
                    tokens.extend(nltk.pos_tag(wordtokens))
        content_tokens = [
            token for token in tokens if token[1] in ["NOUN", "VERB", "ADJ", "ADV"]
        ]
        return tokens, content_tokens

    def nltk_to_datamusePOS(self, pos):
        if pos == "NOUN":
            return "n"
        elif pos == "VERB":
            return "v"
        elif pos == "ADJ":
            return "adj"
        elif pos == "ADV":
            return "adv"
        else:
            return ""

    def get_candidates(self, token, replacement_types, max_results=50):
        text = token[0].strip(punctuation)
        ml = text if "ml" in replacement_types else None
        sp = (
            f"//{text}"
            if "ana" in replacement_types
            else text
            if "sp" in replacement_types
            else None
        )
        rel_trg = text if "rel_trg" in replacement_types else None
        rel_cns = text if "rel_cns" in replacement_types else None
        rel_hom = text if "rel_hom" in replacement_types else None

        # Get words using Datamuse API
        options = self.datamuse_client.words(
            md="p",
            ml=ml,
            sp=sp,
            rel_trg=rel_trg,
            rel_cns=rel_cns,
            rel_hom=rel_hom,
            max=max_results,
        )
        # Filter words by matching part of speech
        return [
            o
            for o in options
            if "tags" in o and self.nltk_to_datamusePOS(token[1]) in o["tags"]
        ]

    def generateNVariations(self, text, nVars, replacement_types=["ml"]):
        tokens, content_tokens = self.get_tokens(text)
        max_options = 50
        percent_to_replace = 100
        number_to_replace = int(len(content_tokens) * (percent_to_replace / 100))
        poems = [[""] * len(tokens) for _ in range(nVars)]
        # choose number_to_replace tokens to replace
        to_replace = sample(content_tokens, number_to_replace)

        def _processToken(idx, token):
            newWords = [
                "\n" if token[0] == NEWLINECHAR_PLACEHOLDER else token[0]
                for _ in range(nVars)
            ]
            if token[0] != NEWLINECHAR_PLACEHOLDER and token in to_replace:
                options = self.get_candidates(token, replacement_types, max_options)
                if len(options) > 0:
                    chosenWords = sample(options, min([nVars, len(options)]))
                    numChosen = len(chosenWords)
                    newWords = [
                        f"{chosenWords[i % numChosen]['word']}[#ORIGINAL_{token[0]}]"
                        for i in range(nVars)
                    ]
                else:
                    newWords = [
                        f"{token[0]}[#ORIGINAL_{token[0]}]" for i in range(nVars)
                    ]

            for p in range(nVars):
                poems[p][idx] = f"{newWords[p]} "

        with concurrent.futures.ThreadPoolExecutor() as executor:
            pool = executor.map(lambda a: _processToken(*a), list(enumerate(tokens)))

        for p in range(nVars):
            poems[p] = "".join(poems[p]).replace("\n\n", "\n")

        return poems

    def getLineCategory(self, original, generated):
        PROMPT = f"<original>{original}</original> : <generated>{generated}</generated>\n\n###\n\n"
        category = self.version3(PROMPT)
        return category

    def version3(self, prompt):
        system_prompt = "You are a poetry analyzer. You will be given a pair of poem segments. One segment will be labelled as <original> and the other will be labeled as <generated>. Your job is to analyze the writing style of the given segments of poetry and determine whether the <generated> poem segment is a Good, Mediocre, or Bad alternative to the <original> segment. Respond with only the label."
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ]

        completion = self.openai_client.chat.completions.create(
            model="ft:gpt-4o-mini-2024-07-18:personal::B5ohvIap", messages=messages
        )

        return completion.choices[0].message.content.split("Line")[0].strip()

    def createPoemVariation(self, text, replacementTypeCounts):
        nSyn = replacementTypeCounts.means_like
        nRel = replacementTypeCounts.triggered_by
        nAna = replacementTypeCounts.anagram
        nSp = replacementTypeCounts.spelled_like
        nCns = replacementTypeCounts.consonant_match
        nHom = replacementTypeCounts.homophone
        totalNVars = nSyn + nRel + nAna + nSp + nCns + nHom

        originalLines = [line.strip() for line in text.split("\n")]

        args = [
            (text, nSyn, ["ml"]),
            (text, nRel, ["rel_trg"]),
            (text, nAna, ["ana"]),
            (text, nSp, ["sp"]),
            (text, nCns, ["rel_cns"]),
            (text, nHom, ["rel_hom"]),
        ]
        poemVariations = []
        # Generate variations for each of the replacement types in parallel
        with concurrent.futures.ThreadPoolExecutor() as executor:
            pool = executor.map(lambda a: self.generateNVariations(*a), args)
            for res in pool:
                for p in res:
                    lines = [line.strip() for line in p.split("\n")]
                    poemVariations.append(lines)

        logger.info(f"Combining {totalNVars} variations...")
        newLines = [""] * len(originalLines)

        # Generate the final best output line from the variation options for the given original line
        def _processLine(idx, originalLine):
            labels = [{}] * len(poemVariations)

            # Get the category label (GOOD, MEDIOCRE, BAD) for a given line variation compared to the original
            def _processLineVariation(variationIdx, originalLine, variation):
                variationLine = (
                    variation[idx].replace('"', "'")
                    if idx < len(variation)
                    else originalLine
                )
                cleanLine = re.sub(r"\[#ORIGINAL_[^\]]+]", "", variationLine)
                label = self.getLineCategory(originalLine, cleanLine)
                labels[variationIdx] = {"line": variationLine, "label": label}

            # Get the label for each poem variation ion parallel
            args = [
                (i, originalLine, variation)
                for i, variation in enumerate(poemVariations)
            ]
            with concurrent.futures.ThreadPoolExecutor() as executor:
                pool = executor.map(lambda a: _processLineVariation(*a), args)

            # Find the good and mediocre labels
            good_labels = list(filter(lambda x: "good" in x["label"].lower(), labels))
            mediocre_labels = list(
                filter(lambda x: "mediocre" in x["label"].lower(), labels)
            )
            # Determine the final output line. Try random good label, then mediocre, or - placeholder
            if len(good_labels) > 0:
                newLine = sample(good_labels, 1)[0]["line"]
                newLines[idx] = newLine + "\n"
            elif len(mediocre_labels) > 0:
                newLine = sample(mediocre_labels, 1)[0]["line"]
                newLines[idx] = newLine + "\n"

        # Generate each output line in parallel
        with concurrent.futures.ThreadPoolExecutor() as executor:
            pool = executor.map(
                lambda a: _processLine(*a), list(enumerate(originalLines))
            )

        # Combine all output lines into a final output variation
        poem = "".join(newLines)
        return poem

    def get_top_k_rows(self, image: Image, table: Table, k: int = 2) -> List[Images]:
        """
        Search for the top k poems based on the input image.

        Args:
            image: The input image to search for.
            k: The number of top results to return.

        Returns:
            A DataFrame containing the top k poems and their metadata.
        """
        return (
            self.lancedb_table.search(image, vector_column_name="vec_from_bytes")
            .limit(k)
            .to_pydantic(Images)
        )

    def format_RAG_prompt(self, rows: List[Images]) -> str:
        """
        Format the retrieved rows into a prompt for RAG.

        Args:
            rows: The list of retrieved rows containing poem metadata.

        Returns:
            A formatted string prompt for RAG.
        """
        prompt = "Construct a new segment using the following context:\n\n"
        for row in rows:
            prompt += f"Poem: {row.poem}\n\n"
        return prompt + "Respond only with the segment."

    def call_anthropic_bedrock_model(
        self, model: str, prompt: str, image_b64=None
    ) -> str:
        image_content = {
            "type": "image",
            "source": {"type": "base64", "media_type": "image/png", "data": image_b64},
        }
        messages = [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prompt,
                    }
                ],
            }
        ]
        if image_b64 is not None:
            messages[0]["content"].append(image_content)
        body = json.dumps(
            {
                "messages": messages,
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1000,
            }
        )
        response = self.bedrock_client.invoke_model(
            body=body,
            modelId=model,
            accept="application/json",
            contentType="application/json",
        )
        response_body = json.loads(response.get("body").read())
        text = response_body["content"][0]["text"]
        return text

    def resize_image_b64_to_max_bytes(
        self, image_b64, max_bytes=5 * 1024 * 1024, max_dim=1024
    ):
        # Decode base64 to bytes
        image_bytes = base64.b64decode(image_b64)
        img = Image.open(io.BytesIO(image_bytes))

        # Resize if larger than max_dim
        if max(img.size) > max_dim:
            scale = max_dim / max(img.size)
            new_size = (int(img.size[0] * scale), int(img.size[1] * scale))
            img = img.resize(new_size, Image.LANCZOS)

        # Save as JPEG and reduce quality if needed
        buffer = io.BytesIO()
        img.save(buffer, format="JPEG", quality=85)
        image_bytes = buffer.getvalue()
        quality = 85
        while len(image_bytes) > max_bytes and quality > 10:
            buffer = io.BytesIO()
            quality -= 10
            img.save(buffer, format="JPEG", quality=quality)
            image_bytes = buffer.getvalue()

        # Encode back to base64
        image_b64_out = base64.b64encode(image_bytes).decode("utf-8")
        return image_b64_out, len(image_bytes)

    def get_model_id(self, model_short_name: str) -> str:
        if model_short_name == "deepseek-r1":
            return DEEPSEEK_R1
        elif model_short_name == "claude-opus-4_1":
            return CLAUDE_OPUS_41
        elif model_short_name == "claude-opus-4":
            return CLAUDE_OPUS_4
        elif model_short_name == "claude-sonnet-4":
            return CLAUDE_SONNET_4
        elif model_short_name == "gpt-4.1-nano":
            return GPT_41_NANO
        else:
            return GPT_41_NANO

    def generate_initial_text(
        self, image_source: str, k: int, model: str, passImageToModel: bool
    ) -> str:
        image_bytes = requests.get(image_source).content
        image_input = {"type": "input_image", "image_url": image_source}

        query_image = Image.open(io.BytesIO(image_bytes))
        rows = self.get_top_k_rows(query_image, self.lancedb_table, k)
        prompt = self.format_RAG_prompt(rows)
        input = [
            {
                "role": "user",
                "content": [{"type": "input_text", "text": prompt}, image_input],
            }
        ]

        modelId = self.get_model_id(model)

        if modelId not in [DEEPSEEK_R1, CLAUDE_OPUS_41, CLAUDE_OPUS_4, CLAUDE_SONNET_4]:
            # OpenAI models
            modelInput = input if passImageToModel else prompt
            response = self.openai_client.responses.create(
                model=modelId, input=modelInput
            )
            return response.output_text
        elif modelId == DEEPSEEK_R1:
            body = json.dumps(
                {
                    "prompt": prompt,
                }
            )
            response = self.bedrock_client.invoke_model(
                body=body,
                modelId=modelId,
                accept="application/json",
                contentType="application/json",
            )
            response_body = json.loads(response.get("body").read())
            return response_body["choices"][0]["text"]
        # Claude models
        else:
            if passImageToModel:
                image_b64 = base64.b64encode(image_bytes).decode("utf-8")
                image_b64, _ = self.resize_image_b64_to_max_bytes(image_b64)
                return self.call_anthropic_bedrock_model(
                    modelId, prompt, image_b64=image_b64
                )
            else:
                return self.call_anthropic_bedrock_model(
                    modelId, prompt, image_b64=None
                )

    def generatePoem(
        self,
        request: PoemV4CreateRequest,
    ) -> str:
        initial_text = self.generate_initial_text(
            request.input_image_url,
            request.num_related_images,
            request.model,
            request.pass_image_to_model,
        )
        logger.debug(f"Initial generated text: {initial_text}")
        variation = self.createPoemVariation(
            initial_text, request.replacement_type_counts
        )
        logger.debug(f"Final poem variation: {variation}")

        return variation

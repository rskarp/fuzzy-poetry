from nltk.tokenize import word_tokenize, sent_tokenize

import concurrent.futures

from src.models.poem_v1 import PoemV1CreateRequest
from src.models.poem_v2 import PoemV2CreateRequest
from src.models.poem_v3 import PoemV3CreateRequest

from lancedb.embeddings import get_registry


from string import punctuation
from random import sample

import boto3


from openai import OpenAI
import datamuse
import re
import nltk

import logging

logger = logging.getLogger(__name__)

func = get_registry().get("open-clip").create()
NEWLINECHAR_PLACEHOLDER = "NEWLINECHAR"


class PoemV3Service:
    def __init__(
        self,
        openai_client: OpenAI,
        datamuse_client: datamuse.Datamuse,
        bedrock_client: boto3.client,
    ):
        self.init_nltk()

        self.openai_client = openai_client
        self.datamuse_client = datamuse_client
        self.bedrock_client = bedrock_client

    def init_nltk(self):
        temp_data_path = "/tmp"

        if temp_data_path not in nltk.data.path:
            nltk.data.path.insert(0, temp_data_path)

        packages_to_download = [
            "punkt_tab",
            "averaged_perceptron_tagger_eng",
            "universal_tagset",
        ]

        for package in packages_to_download:
            nltk.download(package, download_dir=temp_data_path)

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

    def getLineCategory(self, original, generated, version):
        PROMPT = f"<original>{original}</original> : <generated>{generated}</generated>\n\n###\n\n"
        if version == "v2":
            res = self.openai_client.completions.create(
                model="ft:davinci-002:personal::93yZODMm", prompt=PROMPT
            )
            category = res.choices[0].text.split("Line\n", 1)[0]
        elif version == "v3":
            category = self.version3(PROMPT)
        else:
            category = None
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

    def createPoemVariation(self, text, replacementTypeCounts, version):
        nSyn = replacementTypeCounts.means_like
        nRel = replacementTypeCounts.triggered_by
        nAna = replacementTypeCounts.anagram
        nSp = replacementTypeCounts.spelled_like
        nCns = replacementTypeCounts.consonant_match
        nHom = replacementTypeCounts.homophone
        totalNVars = nSyn + nRel + nAna + nSp + nCns + nHom

        if version == "v1":
            replacementTypes = [
                ("ml", nSyn),
                ("rel_trg", nRel),
                ("ana", nAna),
                ("sp", nSp),
                ("rel_cns", nCns),
                ("rel_hom", nHom),
            ]
            selectedTypes = [name for name, count in replacementTypes if count > 0]
            variation = self.generateNVariations(text, 1, selectedTypes)
            return variation[0]

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
                label = self.getLineCategory(originalLine, cleanLine, version)
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

    def generatePoem(
        self,
        request: PoemV3CreateRequest,
    ) -> str:
        logger.debug(f"Initial poem: {request.poem}")
        variation = self.createPoemVariation(
            request.poem, request.replacement_type_counts, version="v3"
        )
        logger.debug(f"Final poem variation: {variation}")

        return variation

    def generateV2Poem(
        self,
        request: PoemV2CreateRequest,
    ) -> str:
        logger.debug(f"Initial poem: {request.poem}")
        variation = self.createPoemVariation(
            request.poem, request.replacement_type_counts, version="v2"
        )
        logger.debug(f"Final poem variation: {variation}")

        return variation

    def generateV1Poem(
        self,
        request: PoemV1CreateRequest,
    ) -> str:
        logger.debug(f"Initial poem: {request.poem}")
        variation = self.createPoemVariation(
            request.poem, request.replacement_type_counts, version="v1"
        )
        logger.debug(f"Final poem variation: {variation}")

        return variation

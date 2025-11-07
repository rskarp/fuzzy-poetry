
from nltk.tokenize import word_tokenize, sent_tokenize
from typing import List
import requests
import io
from PIL import Image
import concurrent.futures
from typing import Optional
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


def init_nltk():
    local_data_path = './nltk_data'
    temp_data_path = '/tmp'

    if not os.path.exists(local_data_path):
        os.makedirs(local_data_path, exist_ok=True)

    if local_data_path not in nltk.data.path:
        nltk.data.path.insert(0, local_data_path)

    if temp_data_path not in nltk.data.path:
        nltk.data.path.insert(0, temp_data_path)

    packages_to_download = [
        'punkt_tab',
        'averaged_perceptron_tagger_eng',
        'universal_tagset'
    ]

    for package in packages_to_download:
        nltk.download(package, download_dir=temp_data_path)


init_nltk()
DEEPSEEK_R1 = "us.deepseek.r1-v1:0"
CLAUDE_OPUS_41 = "us.anthropic.claude-opus-4-1-20250805-v1:0"
CLAUDE_OPUS_4 = "us.anthropic.claude-opus-4-20250514-v1:0"
CLAUDE_SONNET_4 = "us.anthropic.claude-sonnet-4-20250514-v1:0"
GPT_41_NANO = "gpt-4.1-nano"
NEWLINECHAR_PLACEHOLDER = 'NEWLINECHAR'
client = boto3.client("dynamodb", 'us-east-1')
TABLE = os.environ['POEM_VARIATION_TABLE_NAME']
ai = OpenAI(organization=os.environ['OPENAI_ORGANIZATION'],
            api_key=os.environ['OPENAI_API_KEY'])


def get_tokens(originalText):
    tokens = []
    text = originalText.replace('\n', f' {NEWLINECHAR_PLACEHOLDER} ')
    for sent in sent_tokenize(text, language='english'):
        wordtokens = word_tokenize(sent, language='english')
        if (len(wordtokens) > 0):
            tokens.extend(nltk.pos_tag(wordtokens, tagset='universal'))
    content_tokens = [token for token in tokens if token[1] in [
        'NOUN', 'VERB', 'ADJ', 'ADV']]
    return tokens, content_tokens


def nltk_to_datamusePOS(pos):
    if pos == 'NOUN':
        return 'n'
    elif pos == 'VERB':
        return 'v'
    elif pos == 'ADJ':
        return 'adj'
    elif pos == 'ADV':
        return 'adv'
    else:
        return ''


def get_candidates(token, replacement_types, max_results=50):
    # print(f'Replacing {token.text}...')
    dm = datamuse.Datamuse()
    text = token[0].strip(punctuation)
    ml = text if 'ml' in replacement_types else None
    sp = f'//{text}' if 'ana' in replacement_types else text if 'sp' in replacement_types else None
    rel_trg = text if 'rel_trg' in replacement_types else None
    rel_cns = text if 'rel_cns' in replacement_types else None
    rel_hom = text if 'rel_hom' in replacement_types else None

    # Get words using Datamuse API
    options = dm.words(md='p', ml=ml, sp=sp, rel_trg=rel_trg,
                       rel_cns=rel_cns, rel_hom=rel_hom, max=max_results)
    # Filter words by matching part of speech
    return [o for o in options if 'tags' in o and nltk_to_datamusePOS(token[1]) in o['tags']]


def generateNVariations(text, nVars, replacement_types=['ml']):
    tokens, content_tokens = get_tokens(text)
    max_options = 50
    percent_to_replace = 100
    number_to_replace = int(len(content_tokens) * (percent_to_replace / 100))
    poems = [['']*len(tokens) for _ in range(nVars)]
    # choose number_to_replace tokens to replace
    to_replace = sample(content_tokens, number_to_replace)

    def _processToken(idx, token):
        newWords = ['\n' if token[0] == NEWLINECHAR_PLACEHOLDER else token[0]
                    for _ in range(nVars)]
        if token[0] != NEWLINECHAR_PLACEHOLDER and token in to_replace:
            options = get_candidates(token, replacement_types, max_options)
            if len(options) > 0:
                chosenWords = sample(options, min([nVars, len(options)]))
                numChosen = len(chosenWords)
                newWords = [
                    f'{chosenWords[i%numChosen]["word"]}[#ORIGINAL_{token[0]}]' for i in range(nVars)]
            else:
                newWords = [
                    f'{token[0]}[#ORIGINAL_{token[0]}]' for i in range(nVars)]

        for p in range(nVars):
            poems[p][idx] = f'{newWords[p]} '

    with concurrent.futures.ThreadPoolExecutor() as executor:
        pool = executor.map(lambda a: _processToken(*a),
                            list(enumerate(tokens)))

    for p in range(nVars):
        poems[p] = ''.join(poems[p]).replace('\n\n', '\n')

    return poems


def getLineCategory(original, generated):
    PROMPT = f'<original>{original}</original> : <generated>{generated}</generated>\n\n###\n\n'
    category = version3(PROMPT)
    return category


def version3(prompt):
    system_prompt = "You are a poetry analyzer. You will be given a pair of poem segments. One segment will be labelled as <original> and the other will be labeled as <generated>. Your job is to analyze the writing style of the given segments of poetry and determine whether the <generated> poem segment is a Good, Mediocre, or Bad alternative to the <original> segment. Respond with only the label."
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt}
    ]

    completion = ai.chat.completions.create(
        model="ft:gpt-4o-mini-2024-07-18:personal::B5ohvIap", messages=messages
    )

    return completion.choices[0].message.content.split("Line")[0].strip()


def createPoemVariation(text, replacementTypeCounts):
    nSyn = replacementTypeCounts["means_like"]
    nRel = replacementTypeCounts["triggered_by"]
    nAna = replacementTypeCounts["anagram"]
    nSp = replacementTypeCounts["spelled_like"]
    nCns = replacementTypeCounts["consonant_match"]
    nHom = replacementTypeCounts["homophone"]
    totalNVars = nSyn+nRel+nAna+nSp+nCns+nHom

    originalLines = [line.strip() for line in text.split('\n')]

    args = [(text, nSyn, ['ml']),
            (text, nRel, ['rel_trg']),
            (text, nAna, ['ana']),
            (text, nSp, ['sp']),
            (text, nCns, ['rel_cns']),
            (text, nHom, ['rel_hom'])]
    poemVariations = []
    # Generate variations for each of the replacement types in parallel
    with concurrent.futures.ThreadPoolExecutor() as executor:
        pool = executor.map(lambda a: generateNVariations(*a), args)
        for res in pool:
            for p in res:
                lines = [line.strip() for line in p.split('\n')]
                poemVariations.append(lines)

    print(f'Combining {totalNVars} variations...')
    newLines = ['']*len(originalLines)

    # Generate the final best output line from the variation options for the given original line
    def _processLine(idx, originalLine):
        labels = [{}]*len(poemVariations)

        # Get the category label (GOOD, MEDIOCRE, BAD) for a given line variation compared to the original
        def _processLineVariation(variationIdx, originalLine, variation):
            variationLine = variation[idx].replace(
                '"', "'") if idx < len(variation) else originalLine
            cleanLine = re.sub(r'\[#ORIGINAL_[^\]]+]', '', variationLine)
            label = getLineCategory(originalLine, cleanLine)
            labels[variationIdx] = {'line': variationLine, 'label': label}
            # print(f'label: {label}')

        # Get the label for each poem variation ion parallel
        args = [(i, originalLine, variation)
                for i, variation in enumerate(poemVariations)]
        with concurrent.futures.ThreadPoolExecutor() as executor:
            pool = executor.map(lambda a: _processLineVariation(*a), args)

        # Find the good and mediocre labels
        good_labels = list(
            filter(lambda x: 'good' in x['label'].lower(), labels))
        mediocre_labels = list(
            filter(lambda x: 'mediocre' in x['label'].lower(), labels))
        # Determine the final output line. Try random good label, then mediocre, or - placeholder
        if len(good_labels) > 0:
            newLine = sample(good_labels, 1)[0]['line']
            newLines[idx] = newLine+'\n'
        elif len(mediocre_labels) > 0:
            newLine = sample(mediocre_labels, 1)[0]['line']
            newLines[idx] = newLine+'\n'

    # Generate each output line in parallel
    with concurrent.futures.ThreadPoolExecutor() as executor:
        pool = executor.map(lambda a: _processLine(
            *a), list(enumerate(originalLines)))

    # Combine all output lines into a final output variation
    poem = ''.join(newLines)
    return poem


func = get_registry().get("open-clip").create()


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


def init_lancedb_table():
    S3_PATH = "s3://fuzzy-poetry-lancedb/"
    TABLE_NAME = "images"

    db = lancedb.connect(S3_PATH)
    table = db.open_table(TABLE_NAME)
    return table


def get_top_k_rows(image: Image, table: Table, k: int = 2) -> List[Images]:
    """
    Search for the top k poems based on the input image.

    Args:
        image: The input image to search for.
        k: The number of top results to return.

    Returns:
        A DataFrame containing the top k poems and their metadata.
    """
    return (
        table.search(image, vector_column_name="vec_from_bytes")
        .limit(k)
        .to_pydantic(Images)
    )


def format_RAG_prompt(rows: List[Images]) -> str:
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


def call_anthropic_bedrock_model(model: str, prompt: str, image_b64=None) -> str:
    bedrock_runtime = boto3.client(
        service_name="bedrock-runtime", region_name="us-east-1"
    )
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
    response = bedrock_runtime.invoke_model(
        body=body,
        modelId=model,
        accept="application/json",
        contentType="application/json",
    )
    response_body = json.loads(response.get("body").read())
    text = response_body["content"][0]["text"]
    return text


def resize_image_b64_to_max_bytes(image_b64, max_bytes=5 * 1024 * 1024, max_dim=1024):
    from PIL import Image

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


def get_model_id(model_short_name: str) -> str:
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


def generate_initial_text(image_source: str, k: int, model: str, passImageToModel: bool) -> str:
    table = init_lancedb_table()
    image_bytes = requests.get(image_source).content
    image_input = {"type": "input_image", "image_url": image_source}

    query_image = Image.open(io.BytesIO(image_bytes))
    rows = get_top_k_rows(query_image, table, k)
    prompt = format_RAG_prompt(rows)
    input = [
        {
            "role": "user",
            "content": [{"type": "input_text", "text": prompt}, image_input],
        }
    ]

    modelId = get_model_id(model)

    if modelId not in [DEEPSEEK_R1, CLAUDE_OPUS_41, CLAUDE_OPUS_4, CLAUDE_SONNET_4]:
        # OpenAI models
        modelInput = input if passImageToModel else prompt
        response = client.responses.create(model=modelId, input=modelInput)
        return response.output_text
    elif modelId == DEEPSEEK_R1:
        bedrock_runtime = boto3.client(
            service_name="bedrock-runtime", region_name="us-east-1"
        )
        body = json.dumps(
            {
                "prompt": prompt,
            }
        )
        response = bedrock_runtime.invoke_model(
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
            image_b64, _ = resize_image_b64_to_max_bytes(image_b64)
            return call_anthropic_bedrock_model(
                modelId, prompt, image_b64=image_b64)
        else:
            return call_anthropic_bedrock_model(
                modelId, prompt, image_b64=None)


def handler(event, context):
    print(f'received event: {event}')

    inputImageUrl = event['arguments']['inputImageUrl']
    replacementTypeCounts = event['arguments']['replacementTypeCounts']
    numRelatedImages = event['arguments']['numRelatedImages']
    model = event['arguments']['model']
    passImageToModel = event['arguments']['passImageToModel']

    initial_text = generate_initial_text(
        inputImageUrl, numRelatedImages, model, passImageToModel)
    variation = createPoemVariation(initial_text, replacementTypeCounts)

    client.put_item(TableName=TABLE, Item={
        'id': {'S': str(uuid4())},
        'original_text': {'S': initial_text},
        'variation_text': {'S': variation},
    })
    return variation


if __name__ == '__main__':
    inputImageUrl = "https://live.staticflickr.com/65535/54638556216_146f8ac2b6_k.jpg"
    numRelatedImages = 3
    model = "claude-opus-4_1"
    passImageToModel = True
    replacementTypeCounts = {
        "means_like": 2,
        "triggered_by": 2,
        "anagram": 2,
        "spelled_like": 2,
        "consonant_match": 2,
        "homophone": 2
    }
    initial_text = generate_initial_text(
        inputImageUrl, numRelatedImages, model, passImageToModel)
    print(f'Initial Text: {initial_text}')
    variation = createPoemVariation(initial_text, replacementTypeCounts)
    print(variation)

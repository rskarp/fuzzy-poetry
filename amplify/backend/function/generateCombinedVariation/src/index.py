
import json
import boto3
import os
from uuid import uuid4
from openai import OpenAI
import datamuse
import re
import os
import nltk
from random import sample
from string import punctuation
import concurrent.futures
from nltk.tokenize import word_tokenize, sent_tokenize
nltk.data.path.append('./nltk_data')
nltk.data.path.append('/tmp')
nltk.download('punkt_tab', download_dir='/tmp')
nltk.download('averaged_perceptron_tagger_eng', download_dir='/tmp')
nltk.download('universal_tagset', download_dir='/tmp')

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


def getLineCategory(original, generated, version="v2"):
    # Get label for given poem line variation using fineTune2
    PROMPT = f'<original>{original}</original> : <generated>{generated}</generated>\n\n###\n\n'
    if version == "v2":
        res = ai.completions.create(
            model='ft:davinci-002:personal::93yZODMm',
            prompt=PROMPT)
        category = res.choices[0].text.split("Line\n", 1)[0]
    elif version == "v3":
        category = version3(PROMPT)
    else:
        category = None
    # print(f'{category}: {generated}')
    return category


def version3(prompt):
    system_prompt = "You are a poetry analyzer. You will be given a pair of poem segments. One segment will be labelled as <original> and the other will be labeled as <generated>. Your job is to analyze the writing style of the given segments of poetry and determine whether the <generated> poem segment is a Good, Mediocre, or Bad alternative to the <original> segment. Respond with only the label."
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt}
    ]

    completion = client.chat.completions.create(
        model="gpt-4o-mini-2024-07-18",
        messages=messages
    )
    # placeholder for now
    # return completion.choices[0].message.content
    return "Good"


def createPoemVariation(text, replacementTypeCounts, algo_version):
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
            label = getLineCategory(originalLine, cleanLine, algo_version)
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


def handler(event, context):
    print(f'received event: {event}')

    text = event['arguments']['originalPoem']
    replacementTypeCounts = event['arguments']['replacementTypeCounts']
    algo_version = event['arguments']['algoVersion']
    variation = createPoemVariation(text, replacementTypeCounts, algo_version)
    client.put_item(TableName=TABLE, Item={
        'id': {'S': str(uuid4())},
        'original_text': {'S': text},
        'variation_text': {'S': variation},
    })
    return variation


if __name__ == '__main__':
    poem = '''As the dead prey upon us,
        they are the dead in ourselves,
        awake, my sleeping ones, I cry out to you,
        disentangle the nets of being!'''
    poem = 'hello world\nthis is a test'
    print(createPoemVariation(
        poem, {
            "means_like": 2,
            "triggered_by": 2,
            "anagram": 2,
            "spelled_like": 2,
            "consonant_match": 2,
            "homophone": 2
        }))

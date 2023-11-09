import json
import boto3
import os
from uuid import uuid4
# import spacy
import datamuse
import nltk
from random import sample
# # import en_core_web_md
from string import punctuation
import concurrent.futures
from nltk.tokenize import word_tokenize, sent_tokenize
nltk.data.path.append('./nltk_data')
# nltk.download('averaged_perceptron_tagger')
# nltk.download('punkt')
# nltk.download('universal_tagset')

client = boto3.client("dynamodb", 'us-east-1')
# os.environ.get("STORAGE_POEMVARIATIONTABLE_NAME")
TABLE = 'PoemVariation-spjf5e27hnh5bihsf7agym7vva-staging'
# TABLE = 'PoemVariation-kvrbuteftvd5xofbsmnb4qb2lm-develop'

replacementEnum2Abbreviation = {
    'MEANS_LIKE': 'ml',
    'TRIGGERED_BY': 'rel_trg'
}
# def get_tokens_spacy(text):
#     # nlp = en_core_web_md.load()
#     try:
#         nlp = spacy.load('en_core_web_md')
#     except OSError:
#         from spacy.cli import download
#         download('en_core_web_md')
#         nlp = spacy.load('en_core_web_md')
#     doc = nlp(text)
#     tokens = [token for token in doc]
#     content_tokens = [token for token in doc if token in [
#         'NOUN', 'VERB', 'ADJ', 'ADV']]

#     return tokens, content_tokens


def get_tokens(text):
    tokens = []
    for sent in sent_tokenize(text, language='english'):
        wordtokens = word_tokenize(sent, language='english')
        tokens.extend(nltk.pos_tag(wordtokens, tagset='universal'))
    content_tokens = [token for token in tokens if token[1] in [
        'NOUN', 'VERB', 'ADJ', 'ADV']]
    return tokens, content_tokens


# def spacyPOS_to_datamusePOS(pos):
#     if pos == 'NOUN':
#         return 'n'
#     elif pos == 'VERB':
#         return 'v'
#     elif pos == 'ADJ':
#         return 'adj'
#     elif pos == 'ADV':
#         return 'adv'
#     else:
#         return ''


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


def createPoemVariation_old(text, replacement_types):
    tokens, content_tokens = get_tokens(text)

    # replaceRandomWords
    replacements = [replacementEnum2Abbreviation[rt]
                    for rt in replacement_types]
    max_options = 50
    percent_to_replace = 100
    number_to_replace = int(len(content_tokens) * (percent_to_replace / 100))
    out_words = []
    # choose number_to_replace tokens to replace
    to_replace = sample(content_tokens, number_to_replace)
    print(f'Proccessing {len(tokens)} tokens')
    for i, token in enumerate(tokens):
        newWord = token[0]
        if token in to_replace:
            options = get_candidates(token, replacements, max_options)
            # print(f'Num candidates: {len(options)}')
            if len(options) <= 1:
                print(
                    f'Num candidates: {len(options)}, word: {token[0]}, type: {",".join(replacements)}')
            if len(options) > 0:
                # print(len(options))
                chosen = sample(options, 1)
                newWord = f'{chosen[0]["word"]}[#ORIGINAL_{token[0]}]'
            else:
                newWord = f'{token[0]}[#ORIGINAL_{token[0]}]'

        out_words.append(f'{newWord} ')

    poem = ''.join(out_words).replace('\n\n', '\n')
    return poem


def createPoemVariation(text, replacement_types=['ml']):
    tokens, content_tokens = get_tokens(text)
    replacements = [replacementEnum2Abbreviation[rt]
                    for rt in replacement_types]
    max_options = 50
    percent_to_replace = 100
    number_to_replace = int(len(content_tokens) * (percent_to_replace / 100))
    poem = ['']*len(tokens)
    # choose number_to_replace tokens to replace
    to_replace = sample(content_tokens, number_to_replace)

    def _processToken(idx, token):
        newWord = token[0]
        if token in to_replace:
            options = get_candidates(token, replacements, max_options)
            if len(options) > 0:
                chosenWords = sample(options, 1)
                newWord = f'{chosenWords[0]["word"]}[#ORIGINAL_{token[0]}]'
            else:
                newWord = f'{token[0]}[#ORIGINAL_{token[0]}]'

        poem[idx] = f'{newWord} '

    with concurrent.futures.ThreadPoolExecutor() as executor:
        pool = executor.map(lambda a: _processToken(*a),
                            list(enumerate(tokens)))

    poem = ''.join(poem).replace('\n\n', '\n')
    return poem


def handler(event, context):
    print('received event:')
    print(event)
    text = event['arguments']['originalPoem']
    replacement_types = event['arguments']['replacementTypes']
    variation = createPoemVariation(text, replacement_types)
    client.put_item(TableName=TABLE, Item={
        'id': {'S': str(uuid4())},
        'original_text': {'S': text},
        'variation_text': {'S': variation},
    })
    return variation


if __name__ == '__main__':
    print(createPoemVariation(
        '''Mary had a little lamb, little lamb, little lamb. Mary had a little lamb whose fleece was white as snow''', ['MEANS_LIKE']))

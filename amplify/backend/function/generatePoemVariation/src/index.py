import json
import boto3
import os
from uuid import uuid4
# import spacy
# import datamuse
# from random import sample
# # # import en_core_web_md
# from string import punctuation

client = boto3.client("dynamodb", 'us-east-1')
# os.environ.get("STORAGE_POEMVARIATIONTABLE_NAME")
TABLE = 'PoemVariation-spjf5e27hnh5bihsf7agym7vva-staging'


# def get_tokens(text):
#     # nlp = en_core_web_md.load()
#     try:
#         nlp = spacy.load('en_core_web_md')
#     except OSError:
#         from spacy.cli import download
#         download('en_core_web_md')
#         nlp = spacy.load('en_core_web_md')
#     doc = nlp(text)
#     tokens = [token for token in doc]
#     content_tokens = [token for token in doc if token.pos_ in [
#         'NOUN', 'VERB', 'ADJ', 'ADV']]
#     return tokens, content_tokens


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


# def get_candidates(token, replacement_types, max_results=50):
#     # print(f'Replacing {token.text}...')
#     dm = datamuse.Datamuse()
#     text = token.text.strip(punctuation)
#     ml = text if 'ml' in replacement_types else None
#     sp = f'//{text}' if 'ana' in replacement_types else text if 'sp' in replacement_types else None
#     rel_trg = text if 'rel_trg' in replacement_types else None
#     rel_cns = text if 'rel_cns' in replacement_types else None
#     rel_hom = text if 'rel_hom' in replacement_types else None

#     # Get words using Datamuse API
#     options = dm.words(md='p', ml=ml, sp=sp, rel_trg=rel_trg,
#                        rel_cns=rel_cns, rel_hom=rel_hom, max=max_results)
#     # Filter words by matching part of speech
#     return [o for o in options if 'tags' in o and spacyPOS_to_datamusePOS(token.pos_) in o['tags']]


# def createPoemVariation(text):
#     tokens, content_tokens = get_tokens(text)

#     # replaceRandomWords
#     replacement_types = ['ml']
#     max_options = 50
#     percent_to_replace = 100
#     number_to_replace = int(len(content_tokens) * (percent_to_replace / 100))
#     out_words = []
#     # choose number_to_replace tokens to replace
#     to_replace = sample(content_tokens, number_to_replace)
#     print(f'Proccessing {len(tokens)} tokens')
#     for i, token in enumerate(tokens):
#         newWord = token.text
#         if token in to_replace:
#             options = get_candidates(token, replacement_types, max_options)
#             # print(f'Num candidates: {len(options)}')
#             if len(options) <= 1:
#                 print(
#                     f'Num candidates: {len(options)}, word: {token.text}, type: {",".join(replacement_types)}')
#             if len(options) > 0:
#                 # print(len(options))
#                 chosen = sample(options, 1)
#                 newWord = f'{chosen[0]["word"]}[#ORIGINAL_{token.text}]'
#             else:
#                 newWord = f'{token.text}[#ORIGINAL_{token.text}]'

#         out_words.append(f'{newWord}{token.whitespace_}')

#     poem = ''.join(out_words).replace('\n\n', '\n')
#     return poem


def handler(event, context):
    print('received event:')
    print(event)
    text = event['arguments']['originalPoem']
    variation = text  # createPoemVariation(text)
    client.put_item(TableName=TABLE, Item={
        'id': {'S': str(uuid4())},
        'original_text': {'S': variation},
        'variation_text': {'S': variation},
    })
    return text


# if __name__ == '__main__':
#     print(createPoemVariation(
#         '''Mary had a little lamb, little lamb, little lamb'''))

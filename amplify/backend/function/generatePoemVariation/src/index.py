import json
import awsgi
from flask_cors import CORS
from flask import Flask, jsonify, request

app = Flask(__name__)
CORS(app)

BASE_ROUTE = '/poem-variation'

@app.route(BASE_ROUTE, methods=['GET'])
def get_poem_variations():
    return jsonify(message="hello world")

def handler(event, context):
  print('received event:')
  print(event)

  return awsgi.response(app, event, context)
  
#   return {
#       'statusCode': 200,
#       'headers': {
#           'Access-Control-Allow-Headers': '*',
#           'Access-Control-Allow-Origin': '*',
#           'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
#       },
#       'body': json.dumps('Hello from your new Amplify Python lambda!')
#   }
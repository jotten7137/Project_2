from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'project3'
COLLECTION_NAME = 'comments'
FIELDS = {'author': True, 'body': True, 'created_date': True, 'link_url': True, 'subreddit_name': True, 'ups': True, '_id': False}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/project3/comments")
def project3_comments():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    comments = collection.find(projection=FIELDS, limit=5000)
    #comments = collection.find(projection=FIELDS)
    json_comments = []
    for comment in comments:
        json_comments.append(comment)
    json_comments = json.dumps(json_comments, default=json_util.default)
    connection.close()
    return json_comments

        


if __name__ == '__main__':
    app.run(debug=True)

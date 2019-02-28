#dependencies
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL','mysql://root:password@localhost:3306/project3')

db = SQLAlchemy(app)


#Home Route
@app.route('/')
def home():
    return render_template('index.html')

#Query database and send jsonified results
@app.route("/send",methods=)
def send():
    if request.method == "POST":
        name = request.form['1']
        


if __name__ == '__main__':
    app.run(debug=True)

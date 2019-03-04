#dependencies
import os
from flask_sqlalchemy import SQLAlchemy
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL','mysql:///root:password@localhost:3306/project3') 

db = SQLAlchemy(app)
class Reddit(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(64))
    body = db.Column(db.String(64))
    created_utd = db.Column(db.Integer)
    link_url = db.Column(db.String(64))
    display_name_prefixed = db.Column(db.String(64))
    ups = db.Column(db.Integer)

    def __repr__(self):
        return '<project3 %r>' % (self.name)

#from .model import Reddit

#Home Route
@app.route('/')
def index():
    return render_template('index.html')

#Query database and send jsonified results
@app.route("/send",methods=["GET","POST"])
def send():
    if request.method == "POST":
        author = request.form['author.name']
        body = request.form['body']
        created_utc = request.form['created_utc']
        link_url = request.form['link_url']
        display_name_prefixed = request.form['subreddit.display_name_prefixed']
        ups = request.form['ups']

        reddit_db = Reddit(author = author, body = body, created_utc = created_utc, link_url = link_url, display_name_prefixed = display_name_prefixed)
        db.session.add(reddit_db)
        db.session.commit()
        return redirect('/', code = 302)
    return render_template('form.html')

@app.route('/api/reddit')
def reddit():
    results = db.session.query(
        Reddit.author, 
        Reddit.body, 
        Reddit.created_utc, 
        Reddit.link_url,
        Reddit.display_name_prefixed,
        Reddit.ups).all()
    #hover_text = [result[0] for result in results]
    author = [result[0] for result in results]
    body = [request[1] for result in results]
    created_utc = [request[2] for result in results]
    link_url = [request[3] for result in results]
    display_name_prefixed = [request[4] for result in results]
    ups = [request[5] for result in results]

    reddit_data = [{
        #"hover_text": hover_text,
        "author_name": author,
        "body": body,
        "created_utd": created_utc,
        "link_url": link_url,
        "subreddit_display_name_prefixed": display_name_prefixed,
        "ups": ups,
    }]
    return jsonify(reddit_data)
        


if __name__ == '__main__':
    app.run(debug=True)

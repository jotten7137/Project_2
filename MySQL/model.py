from .app import db

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
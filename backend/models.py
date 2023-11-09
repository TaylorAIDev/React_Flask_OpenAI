from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import TIMESTAMP
from uuid import uuid4

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(32))
    last_name = db.Column(db.String(32))
    email = db.Column(db.String(64), unique=True)
    password = db.Column(db.Text)

    @classmethod
    def find(cls, email):
        return cls.query.filter_by(email=email).first()
    
    @classmethod
    def add(cls, email, password, first_name, last_name):
        user = cls(email=email, 
                   password=password, 
                   first_name=first_name, 
                   last_name=last_name)
        db.session.add(user)
        db.session.commit()
    
class ChatSession(db.Model):
    __tablename__ = "chat_session"
    sessionid = db.Column(db.String(32), primary_key=True, unique=True)
    email = db.Column(db.String(64))
    session_start_time = db.Column(TIMESTAMP)
    session_end_time = db.Column(TIMESTAMP)
    chat_history = db.Column(db.Text)

    @classmethod
    def add(cls, sessionid, email, session_start_time, session_end_time, chat_history):
        entry = cls(sessionid=sessionid,
                    email=email, 
                    session_start_time=session_start_time, 
                    session_end_time=session_end_time,
                    chat_history=chat_history)
        db.session.add(entry)
        db.session.commit()

class ChatResponseQuality(db.Model):
    __tablename__ = "chat_response_quality"
    id = db.Column(db.Integer, primary_key=True)
    sessionid = db.Column(db.String(32))
    email = db.Column(db.String(64))
    question_index = db.Column(db.Integer)
    question = db.Column(db.String(256))
    answer = db.Column(db.String(4096))
    rating = db.Column(db.String(16), nullable=True)

    @classmethod
    def add(cls, sessionid, email, index, question, answer):
        entry = cls(sessionid=sessionid,
                    email=email,
                    question_index=index,
                    question=question,
                    answer=answer)
        db.session.add(entry)
        db.session.commit()

    @classmethod
    def update(cls, sessionid, email, index, rating):
        entry = cls.query.filter_by(sessionid=sessionid,
                                    email=email,
                                    question_index=index).first()
        if entry is None:
            return
        
        entry.rating = rating
        db.session.commit()
        
        

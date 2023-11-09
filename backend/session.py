from chatbot import new_chat
from datetime import datetime, timedelta
from chatbot import get_response
from models import ChatSession, ChatResponseQuality
import secrets
import json
from threading import Lock

TTL = timedelta(minutes=5)

class GlobalSessionStore:
    def __init__(self):
        self.sessions = {}
        self.lock = Lock()

    def get(self, sessionid):
        with self.lock:
            return self.sessions.get(sessionid, None)
        
    def add(self, user_session):
        with self.lock:
            self.sessions[user_session.id] = user_session

    def delete(self, sessionid):
        with self.lock:
            return self.sessions.pop(sessionid, None)

class UserSession:
    def __init__(self, userid, email, vectordb):
        self.userid = userid
        self.email = email
        self.id = secrets.token_urlsafe(16)
        self.start_time = datetime.utcnow()
        self.expiry_time = self.start_time + TTL
        self.chatbot = new_chat(vectordb)
        self.history = []

    def chat(self, question):
        answer = get_response(self.chatbot, question)
        self.add_history(question, answer)
        self.store_response(len(self.history)-1, question, answer)
        return answer

    def add_history(self, question, answer):
        self.history.append((question, answer))

    def get_history(self, exclude_last=False):
        if not exclude_last:
            return self.history
        output = self.history[:len(self.history)-1]
        return output

    def serialize_chat_history(self):
        output = [{"question": q, "answer": a} for q, a in self.history]
        return json.dumps(output)
    
    def is_valid_index(self, index):
        return index >=0 and index < len(self.history)

    def extend_expiry(self):
        self.expiry_time = datetime.now() + TTL

    def has_expired(self):
        return datetime.now() > self.expiry_time
    
    def store_rating(self, index, rating):
        ChatResponseQuality.update(self.id, self.email, index, rating)
        
    def store_response(self, index, question, answer):
        ChatResponseQuality.add(self.id, self.email, index, question, answer)
    
    def store_session(self):
        ChatSession.add(self.id, 
                        self.email, 
                        self.start_time, 
                        datetime.utcnow(),
                        self.serialize_chat_history())
    


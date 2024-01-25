import pymongo
from passlib.hash import pbkdf2_sha256 
import os
import jwt
from flask import jsonify
from datetime import datetime
from openaiapi import fetch_openai_response_admin

mongo_uri = os.getenv("MONGO_URI")
database_name = "serenityharbor"

def get_db_connection():
    client = pymongo.MongoClient(mongo_uri)
    db = client[database_name]
    return db

def register_user(username, password, sex, age, nationality, usertype):
    db = get_db_connection()

    if db.users.find_one({'username': username}):
        raise ValueError('Username is already taken')

    hashed_password = pbkdf2_sha256.hash(password)

    db.users.insert_one({
        'username': username,
        'password': hashed_password,
        'usertype': usertype,
        'sex': sex,
        'age': age,
        'nationality': nationality,
    })

def authenticate_user(username, password):
    db = get_db_connection()

    user = db.users.find_one({'username': username})

    if user and pbkdf2_sha256.verify(password, user['password']):
        return True
    else:
        return False

def save_current_chat(token, chat_history):
    try:
        db = get_db_connection()

        username = jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"])['username']

        chat_history = [message for message in chat_history if message['role'] != 'system']

        if len(chat_history) == 0:
            return jsonify({'error': 'Chat history is empty'}), 400

        last_chat = db.user_chats.find_one(sort=[('id', pymongo.DESCENDING)])
        last_chat_id = last_chat['id'] + 1 if last_chat else 1

        new_chat = {
            'id': last_chat_id,
            'username': username,
            'timestamp': datetime.utcnow(),
            'messages': chat_history
        }

        db.user_chats.insert_one(new_chat)
        save_current_chat_summary(username, chat_history, last_chat_id)
        print ("Success saving chat")

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400


def save_current_chat_summary(username, messages, chat_id):
    try:
        summary = fetch_openai_response_admin(username, messages)
        db = get_db_connection()
        chat_summary = {
            'id' : chat_id,
            'username' : username,
            'summary' : summary
        }
        db.chat_summaries.insert_one(chat_summary)
        print ("Success saving chat summary")
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

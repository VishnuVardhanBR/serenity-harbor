import pymongo
from passlib.hash import pbkdf2_sha256 
import os

mongo_uri = os.getenv("MONGO_URI")
database_name = "serenityharbor"

def get_db_connection():
    client = pymongo.MongoClient(mongo_uri)
    db = client[database_name]
    return db

def register_user(username, password, sex, age, nationality, usertype="consumer"):
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
        'nationality': nationality
    })

def authenticate_user(username, password):
    db = get_db_connection()

    user = db.users.find_one({'username': username})

    if user and pbkdf2_sha256.verify(password, user['password']):
        return True
    else:
        return False

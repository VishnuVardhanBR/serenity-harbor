from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt, os
from openaiapi import fetch_openai_response
from openaiapi import chat_history
from dbutils import register_user, authenticate_user, save_current_chat, get_user_details, store_invite, fetch_invites, manage_invite, fetch_chat_summaries, fetch_consumers_with_admin
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

def generate_token(username):
    payload = {
        'username': username,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    token = jwt.encode(payload, os.getenv("JWT_SECRET_KEY"), algorithm='HS256')
    return token

def decode_token(token):
    return jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms=['HS256'])['username']

def verify_jwt_token(token):
    try:
        if not token:
            return jsonify({"error": "No token provided"}), 400

        jwt.decode(token, os.getenv("JWT_SECRET_KEY"), algorithms=["HS256"])
        return jsonify({"success": "Token is valid"}), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401

    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401


@app.route('/verify_token', methods=['POST'])
def verify_jwt_token_helper():
    token = request.json.get('token')
    verify_status =  verify_jwt_token(token)
    username = decode_token(request.json.get('token'))
    user_details_response = get_user_details(username)
    if 'error' in user_details_response.json or 'error' in verify_status:
        return jsonify({"error": "Invalid token"}), 401
    return jsonify({
        "status": "Token verification successful",
        "usertype": user_details_response.json['user_details']['usertype']
    }), 200

@app.route('/fetch_response', methods=['POST'])
async def fetch_response():
    try:
        username = decode_token(request.json.get('token'))
        user_prompt = request.json.get('userprompt')
        response = await fetch_openai_response(user_prompt, username)
        return jsonify({'response': response})

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/clear_history', methods=['POST'])
def reset_chat():
    try:
        token = request.json.get('token')
        if len(chat_history)>1:
            print(save_current_chat(token, chat_history))
        chat_history.clear()
        return {"message": "Chat save & reset was successful"}
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

@app.route('/fetch_consumers_with_admin', methods=['POST'])
def fetch_consumers_with_admin_from_db():
    try:
        token = request.json.get('token')
        admin_username = decode_token(token)
        return fetch_consumers_with_admin(admin_username)
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

@app.route('/fetch_summaries', methods=['POST'])
def fetch_summaries_from_db():
    try:
        consumer_username = request.json.get('consumer_username')
        return fetch_chat_summaries(consumer_username)
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

@app.route('/invite_user', methods=['POST'])
def invite_user():
    try:
        token = request.json.get('token')
        admin_username = decode_token(token)
        consumer_username = request.json.get('consumer_username')
        return store_invite(consumer_username, admin_username)
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

@app.route('/fetch_invites', methods=['POST'])
def fetch_invites_from_db():
    try:
        token = request.json.get('token')
        username = decode_token(token)
        return fetch_invites(username)
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

@app.route('/manage_invite', methods=['POST'])
def manage_invite_in_db():
    try:
        token = request.json.get('token')
        consumer_username = decode_token(token)
        admin_username = request.json.get('username')
        accepted = request.json.get('accepted')
        return manage_invite(consumer_username, admin_username, accepted)
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 400

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        sex = data.get('sex')
        age = data.get('age')
        nationality = data.get('nationality')
        usertype = data.get('usertype')
        #need to add usertype
        register_user(username, password, sex, age, nationality, usertype)

        token = generate_token(username)
        return jsonify({'status': 'User registered successfully', 'token': token})

    except ValueError as e:
        print(e)
        return jsonify({'error': str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if authenticate_user(username, password):
        token = generate_token(username)
        return jsonify({'status': 'User logged in successfully', 'token': token})
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

if __name__ == '__main__':
    app.run(port=8080)

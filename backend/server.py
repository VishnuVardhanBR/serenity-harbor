from flask import Flask, request, jsonify
from flask_cors import CORS
from openaiapi import fetch_openai_response
from openaiapi import chat_history, SYSTEM_PROMPT
app = Flask(__name__)
CORS(app)

@app.route('/fetch_response', methods=['POST'])
def fetch_response():
    try:
        user_prompt = request.json.get('userprompt')
        response = fetch_openai_response(user_prompt)
        return jsonify({'response': response})

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/clear_history', methods=['GET'])

def reset_chat():
    chat_history.clear()
    chat_history.append({"role": "system", "content": SYSTEM_PROMPT})
    return {"message": "Chat reset was successful"}


if __name__ == '__main__':
    app.run(port=8080)

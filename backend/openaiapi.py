import os
from dotenv import load_dotenv
from openai import OpenAI
from dbutils import get_db_connection, get_user_details  # Import your database connection function
import pymongo
import datetime  
load_dotenv()

client = OpenAI()

# def validate_user_prompt(user_prompt: str):
#     invalid_topics = ["suicide"]
#     valid_topics=[" "]
#     try:
#         guard = gd.Guard.from_string(
#     validators=[
#         OnTopic(
#             valid_topics=valid_topics,
#             invalid_topics=invalid_topics,
#             disable_classifier=False,
#             disable_llm=True,
#             on_fail="reask",
#         )
#     ]
# )
#         a=guard.parse(llm_output=user_prompt,)
#         if(a.validated_output==None):
#             return False
#         else:
#             return True
        
#     except ValidatorError as e:
#         return False

def initOpenAI(username,initial_prompts):
    try:
        db = get_db_connection()

        user_details = get_user_details(username).json['user_details']
        user_sex = user_details['sex']
        user_age = user_details['age']
        user_nationality = user_details['nationality']
        
        SYSTEM_PROMPT = f'''
        You are a mental health Counsellor. Your mission is to provide compassionate support and guidance to individuals seeking assistance. Your current conversation partner is {username}, who has reached out to you for help. You'll be conversing with an AI assistant designed to offer helpful, creative, and friendly support throughout your session. Approach each interaction with empathy and understanding, tailoring your responses to meet {username}'s unique needs. If the conversation switches to another language, adapt accordingly. For context, {username} is {user_age} years old, {user_sex}, and their nationality is {user_nationality}. Your role is pivotal in creating a safe and supportive space for {username} to explore their thoughts and feelings openly. If at any point the conversation gets sensitive, refrain from answering.
        '''
        chat_id = db.chat_sessions.count_documents({'username': username})
        db.chat_sessions.insert_one({
            'username': username,
            'active': True,
            'chat_history': [
                {'role': 'system', 'content': SYSTEM_PROMPT},
                {'role': 'assistant', 'content': "Welcome to Serenity Harbor. How can I support you today?"},
                {'role': 'user', 'content': initial_prompts[0]},
            ],
            'id': chat_id+1
        })

    except Exception as e:
        print(e)

async def fetch_openai_response(user_prompt: str, username: str,initial_prompts: list = []):
    try:
        # if(validate_user_prompt(user_prompt)==False):
        #     chat_history.append({"role": "user", "content": user_prompt})
        #     reply = "I'm sorry, please contact these numbers to get further assistance XXXXXXXXX"
        #     chat_history.append({"role": "assistant", "content": reply})
        #     return reply
        try:
            check_moderation = client.moderations.create(input=user_prompt)
            print("Moderation check successful")
            if(check_moderation.results[0].categories.self_harm or check_moderation.results[0].categories.self_harm_intent or check_moderation.results[0].categories.self_harm_instructions):
                return "I'm sorry, I cannot respond to that. Please contact a helpline number instead."
        except Exception as e:
            print("Moderation check failed")
            print("and the issue is",e)
        db = get_db_connection()
        chat_session = db.chat_sessions.find_one({'username': username, 'active': True})
        if not chat_session:
            initOpenAI(username,initial_prompts)
            chat_session = db.chat_sessions.find_one({'username': username, 'active': True})
        
        chat_history = chat_session['chat_history']
        print(chat_history)

        new_message = {
            "role": "user",
            "content": user_prompt,
        }
        chat_history.append(new_message)

        openai_response = client.chat.completions.create(
            model=os.getenv("FT_MODEL"),
            messages=chat_history
        )
        reply = openai_response.choices[0].message.content

        assistant_response = {
            "role": "assistant",
            "content": reply,
        }
        chat_history.append(assistant_response)
        db.chat_sessions.update_one({'username': username, 'active': True}, {'$set': {'chat_history': chat_history}})
        return reply

    except Exception as e:
        print(e)


def initOpenAI_admin(username):
    SYSTEM_PROMPT = f'''
        You are a chat summarizer who summarizes the chat between a mental health bot and {username}, the summary is intended to be read by a real therapist looking over {username}. Make the summary one paragraph describing the chat, and include major points of what happened during the conversation. Be concise and not verbose. Don't provide an opinion when summarizing. Use {username} instead of "user".
    '''
    return [{"role": "system", "content": SYSTEM_PROMPT}]

def format_messages(messages, username):
    formatted_string = ""

    for message in messages:
        role = message["role"]
        content = message["content"]

        if role == "user":
            formatted_string += f"{username}: {content}\n"
        elif role == "assistant":
            formatted_string += f"assistant: {content}\n"

    return formatted_string.strip()

def fetch_openai_response_admin(username, messages):
    try:
        summary_chat_history = initOpenAI_admin(username)

        summary_chat_history.append({"role": "user", "content": format_messages(messages, username)})
        openai_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=summary_chat_history
        )
        reply = openai_response.choices[0].message.content
        return reply

    except Exception as e:
        print(e)

from pathlib import Path
def text_to_speech(text, speech_file_path):
    response = client.audio.speech.create(
    model="tts-1",
    voice="nova",
    input=text,
    )
    response.stream_to_file(speech_file_path)

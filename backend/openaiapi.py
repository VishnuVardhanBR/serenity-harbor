import os, json
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
#import guardrails as gd
#from guardrails.validators import ToxicLanguage
#from rich import print

client = OpenAI()

chat_history = []
summary_chat_history = []

def initOpenAI(username):
    from dbutils import get_user_details
    user_details = get_user_details(username)
    user_sex = user_details.json['user_details']['sex']
    user_age = user_details.json['user_details']['age']
    user_nationality = user_details.json['user_details']['nationality']
    SYSTEM_PROMPT = f'''
    You are a mental health counsellor. Try to help the patient with their problems and make them feel better. The patient's name who you're talking with is {username}. The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. The assistant is a counsellor. If the prompt is in another language reply in that language. For context, the patient is of age {user_age} and their gender is {user_sex}, their nationality is {user_nationality}
    '''
    chat_history.append({"role": "system", "content": SYSTEM_PROMPT})

finetuned_model = os.getenv("FT_MODEL")



async def fetch_openai_response(user_prompt: str, username: str):
    try:
        if len(chat_history) == 0:
            initOpenAI(username)
        chat_history.append({"role": "user", "content": user_prompt})
        openai_response = client.chat.completions.create(
            model=finetuned_model,
            messages=chat_history
        )
        reply = openai_response.choices[0].message.content
        chat_history.append({"role": "assistant", "content": reply})
        return reply

    except Exception as e:
        print(e)


def initOpenAI_admin(username):
    SYSTEM_PROMPT = f'''
        You are a chat summarizer who summarizes the chat between a mental health bot and {username}, the summary is intended to be read by a real therapist looking over {username}. Make the summary one paragraph describing the chat, and include major points of what happened during the conversation. Be concise and not verbose. Don't provide an opinion when summarizing. Use {username} instead of "user".
    '''
    summary_chat_history.append({"role": "system", "content": SYSTEM_PROMPT})

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
        initOpenAI_admin(username)

        summary_chat_history.append({"role": "user", "content": format_messages(messages, username)})
        openai_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=summary_chat_history
        )
        reply = openai_response.choices[0].message.content
        summary_chat_history.clear()
        return reply

    except Exception as e:
        print(e)

from pathlib import Path
def text_To_Speech(text):
    speech_file_path = Path(__file__).parent / "speech/speech.mp3"
    response = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input=text,
    )

    response.stream_to_file(speech_file_path)
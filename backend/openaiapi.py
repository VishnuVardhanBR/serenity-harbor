from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

client = OpenAI()


SYSTEM_PROMPT = '''
You are a mental health therapist.
'''

chat_history = [{"role": "system", "content": SYSTEM_PROMPT}]

def fetch_openai_response(user_prompt: str):
    try:
        chat_history.append({"role": "user", "content": user_prompt})
        openai_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=chat_history
        )
        reply = openai_response.choices[0].message.content
        print("Assistant: "+reply)
        chat_history.append({"role": "assistant", "content": reply})
        return reply
    except Exception as e:
        print(e)

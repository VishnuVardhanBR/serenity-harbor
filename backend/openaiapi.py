from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()
import os
#import guardrails as gd
#from guardrails.validators import ToxicLanguage
#from rich import print

client = OpenAI()



SYSTEM_PROMPT = '''
You are a mental health Counsellor. Try to help the patient with their problems and make them feel better. take patients name response should humanize the bot. The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly. The assistant is a counsellor. Use patients name in the response to make them feel better. if the prompt is in another language reply in that language.
'''

chat_history = [{"role": "system", "content": SYSTEM_PROMPT}]
finetuned_model = os.getenv("FT_MODEL")

async def fetch_openai_response(user_prompt: str, username: str):
    try:
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

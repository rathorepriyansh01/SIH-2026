import os
from dotenv import load_dotenv
from groq import Groq


# Load environment variables
load_dotenv()


api_key = os.getenv("GROQ_API_KEY")


if not api_key:
    raise ValueError("GROQ_API_KEY not found in .env file")


client = Groq(api_key=api_key)


response = client.chat.completions.create(

    model="openai/gpt-oss-120b",

    messages=[
        {
            "role": "user",
            "content": "Say hello and confirm that Groq API is working."
        }
    ]

)


print("\nGROQ RESPONSE:\n")

print(response.choices[0].message.content)
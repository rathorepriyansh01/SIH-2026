import os
import json

from dotenv import load_dotenv
from groq import Groq

from app.prompts.advisory_prompt import build_advisory_prompt


load_dotenv()


class LLMService:

    def __init__(self):

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError(
                "GROQ_API_KEY not found. Check your .env file."
            )

        self.client = Groq(
            api_key=api_key
        )


    def generate_advisory(
        self,
        disease: str,
        confidence: float,
        top_predictions: list,
        context: dict
    ):

        # Build prompt using ML prediction + context
        prompt = build_advisory_prompt(
            disease=disease,
            confidence=confidence,
            top_predictions=top_predictions,
            context=context
        )


        response = self.client.chat.completions.create(

            model="openai/gpt-oss-120b",

            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a reliable agricultural advisory AI. "
                        "Always return valid JSON only. "
                        "Do not override the ML disease prediction. "
                        "Use the provided context when generating advice."
                    )
                },

                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.3,

            response_format={
                "type": "json_object"
            }

        )


        content = response.choices[0].message.content


        return json.loads(content)
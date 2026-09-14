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

        prompt = build_advisory_prompt(
            disease=disease,
            confidence=confidence,
            top_predictions=top_predictions,
            context=context
        )

        print("\n==============================")
        print("LLM REQUEST")
        print("==============================")
        print("Disease:", disease)
        print("Confidence:", confidence)
        print("Top Predictions:", top_predictions)
        print("Context:", context)
        print("Prompt Length:", len(prompt))

        try:

            response = self.client.chat.completions.create(
                model="openai/gpt-oss-120b",

                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are an agricultural advisory AI. "
                            "Return ONLY valid JSON. "
                            "Do not use markdown. "
                            "Do not use ```json. "
                            "Do not invent pesticide dosage or weather data."
                        )
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],

                temperature=0.2,

                response_format={
                    "type": "json_object"
                }
            )

            content = response.choices[0].message.content

            print("\n==============================")
            print("LLM RAW RESPONSE")
            print("==============================")
            print(content)
            print("==============================")

            if not content:
                raise ValueError(
                    "LLM returned an empty response."
                )

            try:

                advisory = json.loads(content)

            except json.JSONDecodeError as e:

                print("JSON ERROR:", e)
                print("RAW RESPONSE:", content)

                raise ValueError(
                    "LLM returned invalid JSON."
                )

            return advisory

        except Exception as e:

            print("\n==============================")
            print("LLM API ERROR")
            print("==============================")
            print(type(e).__name__)
            print(str(e))
            print("==============================")

            raise
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


    # =====================================================
    # GENERATE AI ADVISORY
    # =====================================================

    def generate_advisory(
        self,
        disease: str,
        confidence: float,
        top_predictions: list,
        context: dict,
        language: str = "English"
    ):

        # -------------------------------------------------
        # NORMALIZE LANGUAGE
        # -------------------------------------------------

        if not language:
            language = "English"

        language = str(language).strip()

        if not language:
            language = "English"


        # -------------------------------------------------
        # BUILD PROMPT
        # -------------------------------------------------

        prompt = build_advisory_prompt(
            disease=disease,
            confidence=confidence,
            top_predictions=top_predictions,
            context=context,
            language=language
        )


        # -------------------------------------------------
        # DEBUG
        # -------------------------------------------------

        print("\n==============================")
        print("LLM REQUEST")
        print("==============================")

        print("Disease:", disease)
        print("Confidence:", confidence)
        print("Language:", language)
        print("Top Predictions:", top_predictions)
        print("Context:", context)
        print("Prompt Length:", len(prompt))

        print("==============================")


        # =================================================
        # GROQ REQUEST
        # =================================================

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
                        "Do not invent weather data, pesticide dosage, "
                        "or missing farm data. "
                        f"Generate farmer-facing text in {language}."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.2,

            max_tokens=3000,

            response_format={
                "type": "json_object"
            }
        )

            # =================================================
            # READ RESPONSE
            # =================================================

            content = response.choices[0].message.content


            print("\n==============================")
            print("LLM RAW RESPONSE")
            print("==============================")

            print(content)

            print("==============================")


            # =================================================
            # EMPTY RESPONSE
            # =================================================

            if not content:

                raise ValueError(
                    "LLM returned an empty response."
                )


            # =================================================
            # PARSE JSON
            # =================================================

            try:

                advisory = json.loads(
                    content
                )

            except json.JSONDecodeError as e:

                print("\n==============================")
                print("JSON ERROR")
                print("==============================")

                print(e)
                print("RAW RESPONSE:")
                print(content)

                print("==============================")

                raise ValueError(
                    "LLM returned invalid JSON."
                )


            # =================================================
            # BASIC VALIDATION
            # =================================================

            if not isinstance(
                advisory,
                dict
            ):

                raise ValueError(
                    "LLM advisory must be a JSON object."
                )


            # =================================================
            # RETURN
            # =================================================

            return advisory


        # =================================================
        # API ERROR
        # =================================================

        except Exception as e:

            print("\n==============================")
            print("LLM API ERROR")
            print("==============================")

            print(
                type(e).__name__
            )

            print(
                str(e)
            )

            print("==============================")


            raise
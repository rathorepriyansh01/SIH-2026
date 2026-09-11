from app.services.llm_service import LLMService


llm = LLMService()


result = llm.generate_advisory(

    disease=" Early Blight",

    confidence=82.5,

    top_predictions=[
        {
            "disease": " Early Blight",
            "confidence": 82.5
        },
        {
            "disease": " Late Blight",
            "confidence": 10.2
        },
        {
            "disease": " Septoria Leaf Spot",
            "confidence": 4.8
        }
    ]
)


print("\nAI ADVISORY:\n")

print(result)
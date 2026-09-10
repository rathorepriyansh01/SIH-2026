from app.services.llm_service import LLMService


llm = LLMService()


result = llm.generate_advisory(

    disease="Tomato Early Blight",

    confidence=82.5,

    top_predictions=[
        {
            "disease": "Tomato Early Blight",
            "confidence": 82.5
        },
        {
            "disease": "Tomato Late Blight",
            "confidence": 10.2
        },
        {
            "disease": "Tomato Septoria Leaf Spot",
            "confidence": 4.8
        }
    ]
)


print("\nAI ADVISORY:\n")

print(result)
from fastapi import APIRouter, HTTPException
import requests
from api.schemas.chatbot import ChatRequest, ChatResponse

router = APIRouter()

ML_MODEL_URL = "https://your-ml-model-endpoint.com/predict"

@router.post("/chat", response_model=ChatResponse)
def chat_with_bot(request: ChatRequest):

    """
    Handles chatbot interactions.

    Steps:
    1. Takes a question from the seller.
    2. Sends it to the external chatbot model.
    3. Returns the chatbot's response.
    """

    response = requests.post(ML_MODEL_URL, json={"question": request.question})
    
    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Error processing request")

    return {"answer": response.json().get("answer")}

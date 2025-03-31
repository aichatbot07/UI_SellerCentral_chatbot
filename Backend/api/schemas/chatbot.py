from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    seller_id: str  # Seller's unique ID
    query: str  # Seller's question

class ChatResponse(BaseModel):
    reply: str  # Chatbot's response
    response_time: Optional[float]  # Time taken for the model to respond (optional)

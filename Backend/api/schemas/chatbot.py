from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    question: str  # Seller's question\
    asin:str

class ChatResponse(BaseModel):
    answer: str

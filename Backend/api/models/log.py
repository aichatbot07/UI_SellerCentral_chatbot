from pydantic import BaseModel
from datetime import datetime

class LogEntry(BaseModel):
    seller_id: str
    question: str
    response: str
    timestamp: datetime

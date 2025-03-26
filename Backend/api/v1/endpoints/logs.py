from fastapi import APIRouter, Depends
from google.cloud import bigquery
from app.schemas.log import LogEntry
from datetime import datetime

router = APIRouter()
client = bigquery.Client()

@router.post("/logs")
def log_chat(log: LogEntry):
    query = f"""
        INSERT INTO `your_project_id.your_dataset.chat_logs` (seller_id, question, response, timestamp)
        VALUES ('{log.seller_id}', '{log.question}', '{log.response}', '{datetime.utcnow()}')
    """
    client.query(query)
    return {"message": "Log entry saved successfully"}

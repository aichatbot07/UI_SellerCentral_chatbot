from pydantic import BaseModel

class Seller(BaseModel):
    id: str
    name: str
    email: str
    password: str  # Hashed password stored in BigQuery

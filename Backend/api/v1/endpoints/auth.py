from fastapi import APIRouter, HTTPException, Depends
from google.cloud import bigquery
from app.schemas.auth import LoginRequest, LoginResponse
from app.core.security import verify_password, create_access_token

router = APIRouter()

# Initialize BigQuery client
client = bigquery.Client()

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest):

    """
    Authenticates a seller and returns a JWT token.

    Steps:
    1. Query BigQuery to check if the seller exists.
    2. Verify the password using a hashing function.
    3. Generate a JWT token if authentication is successful.
    """

    query = f"SELECT * FROM `your_project_id.your_dataset.sellers` WHERE email = '{request.email}'"
    results = client.query(query).result()
    user = [row for row in results]

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = user[0]  # Get first result
    
    if not verify_password(request.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token({"email": request.email})
    return {"access_token": access_token, "token_type": "bearer"}

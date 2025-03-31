from fastapi import APIRouter, HTTPException, Depends
from google.cloud import bigquery
from pydantic import BaseModel
# from passlib.context import CryptContext

router = APIRouter()
client = bigquery.Client()
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class SellerLoginRequest(BaseModel):
    email: str
    password: str

class SellerResponse(BaseModel):
    id: int
    name: str
    email: str




@router.post("/login", response_model=SellerResponse)
def seller_login(request: SellerLoginRequest):
    """
    Authenticates a seller by email and password.
    """
    try:
        # Query to fetch seller by email
        query = """
            SELECT id, name, email, password
            FROM `spheric-engine-451615-a8.Amazon_Reviews_original_dataset_v4.Sellers`
            WHERE email = @email
        """
        
        # Parameterized query to prevent SQL injection
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("email", "STRING", request.email)
            ]
        )

        results = client.query(query, job_config=job_config).result()
        rows = list(results)  # Convert RowIterator to list

        if not rows:
            raise HTTPException(status_code=404, detail="Seller not found")

        # Get seller details
        seller = rows[0]
        
        # Verify password
        if request.password != seller["password"]:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return SellerResponse(
            id=seller["id"],
            name=seller["name"],
            email=seller["email"]
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

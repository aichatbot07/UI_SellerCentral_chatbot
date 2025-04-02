from fastapi import APIRouter, HTTPException, Query
import os
import ast
import json
from google.cloud import bigquery
from api.schemas.product import ProductListResponse, ProductDetailResponse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Set Google Application credentials from .env
google_credentials = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if google_credentials:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_credentials
else:
    raise HTTPException(status_code=500, detail="Google credentials not found in environment variables")

# Initialize FastAPI router
router = APIRouter()
client = bigquery.Client()

@router.get("/Productstest")
def get_all_products():
    """
    Test endpoint to check if products API is running.
    """
    return {"message": "products is running"}

@router.get("/products", response_model=ProductListResponse)
def get_all_products(seller_id: int):
    """
    Fetches all products from BigQuery for a given seller ID.
    """
    try:
        query = """
            SELECT 
                parent_asin,
                title,
                main_category,
                average_rating,
                rating_number,
                features,
                description,
                price,
                images,
                videos,
                store,
                categories,
                bought_together
            FROM `spheric-engine-451615-a8.Amazon_Reviews_original_dataset_v4.meta_data`
            WHERE seller_id = @seller_id
        """

        # Execute the query with parameterized query to bind seller_id safely
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("seller_id", "INT64", seller_id)
            ]
        )
        
        results = client.query(query, job_config=job_config).result()

        # If no results are found
        if not results:
            return {"products": [], "total_count": 0}

        # Process results
        products = [
            {
                "id": row["parent_asin"], 
                "name": row["title"],
                "category": row["main_category"],
                "average_rating": row.get("average_rating", None),
                "rating_number": row.get("rating_number", None),
                "features": safe_parse_list(row.get("features", '[]')),
                "description": row.get("description", ""),
                "price": row.get("price", 0.0),  # Default to 0.0 if price is missing
                "image_url": row.get("images", None),  # Handle missing images
                "videos": row.get("videos", None),  # Handle missing videos
                "store": row.get("store", None),  # Handle missing store
                "categories": safe_parse_list(row.get("categories", '[]')),
                "bought_together": safe_parse_list(row.get("bought_together", '[]')),
            } 
            for row in results
        ]

        total_count = len(products)
        return {"products": products, "total_count": total_count}

    except Exception as e:
        # Handle any errors during the querying process
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.get("/products/{product_id}", response_model=ProductDetailResponse)
def get_product_by_id(product_id: str):
    """
    Fetches a single product from BigQuery using product ID.
    """
    try:
        # Create the query using parameterized query
        query = """
            SELECT 
                parent_asin,
                title,
                main_category,
                average_rating,
                rating_number,
                features,
                description,
                price,
                images,
                videos,
                store,
                categories,
                bought_together
            FROM `spheric-engine-451615-a8.Amazon_Reviews_original_dataset_v4.meta_data`
            WHERE parent_asin = @product_id
        """
        
        # Execute the query with parameterized query to bind product_id safely
        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("product_id", "STRING", product_id)
            ]
        )
        
        # Execute the query
        results = client.query(query, job_config=job_config).result()

        # If no results are found
        rows = list(results)  # Convert RowIterator to list
        if not rows:
            raise HTTPException(status_code=404, detail="Product not found")

        # Get the first product from the results
        product = rows[0]
        
        # Construct the response with the required product details
        return ProductDetailResponse(
            id=product["parent_asin"],
            name=product["title"],
            description=product.get("description", None),
            price=product.get("price", 0.0),
            image_url=product.get("images", None),
            average_rating=product.get("average_rating", None),
            rating_number=product.get("rating_number", None),
            features=safe_parse_list(product.get("features", '[]')),
            store=product.get("store", None),
            categories=safe_parse_list(product.get("categories", '[]')),
            bought_together=safe_parse_list(product.get("bought_together", '[]')),
            additional_details=None  # You can extend this if you have more info for details
        )

    except Exception as e:
        # Handle any errors during the querying process
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def safe_parse_list(value):
    """
    A helper function to safely parse values that should be a list.
    """
    if isinstance(value, str):
        try:
            # Try to parse string as JSON (to handle cases like a list string)
            return json.loads(value) if value.startswith('[') else []
        except json.JSONDecodeError:
            return []  # Return empty list if it's not valid JSON
    return value or []  # Return original value if it's already a list, or empty list if None

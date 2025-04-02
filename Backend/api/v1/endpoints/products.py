from fastapi import APIRouter, HTTPException, Query
import os
import ast
import json
from google.cloud import bigquery
from dotenv import load_dotenv
from api.schemas.product import ProductListResponse, ProductDetailResponse

env_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env"))
load_dotenv(env_path)


credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
router = APIRouter()
client = bigquery.Client()

@router.get("/Productstest")
def get_all_products():
        return {"message": "products is running"}


@router.get("/products", response_model=ProductListResponse)
def get_all_products(seller_id : int):
    """
    Fetches all products from BigQuery.
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

        products = [
            {
                "id": row["parent_asin"], 
                "name": row["title"],
                "category": row["main_category"],
                "average_rating": row.get("average_rating", None),
                "rating_number": row.get("rating_number", None),
                "features": row.get("features", []),  # Ensure it's a list
                "description": row.get("description", ""),
                "price": row.get("price", 0.0),  # Default to 0.0 if price is missing
                "image_url": row.get("images", None),  # Handle missing images
                "videos": row.get("videos", None),  # Handle missing videos
                "store": row.get("store", None),  # Handle missing store
                "categories": row.get("categories", []),  # Ensure it's a list
                "bought_together": row.get("bought_together", []),  # Ensure it's a list
            } 
            for row in results
        ]

        # Fixing the features and categories fields if they are in a wrong format
        for product in products:
            # For features
            if isinstance(product["features"], str):
                # Check for a malformed string or 'List' and convert to proper list
                if product["features"].startswith("[") and product["features"].endswith("]"):
                    try:
                        product["features"] = ast.literal_eval(product["features"])  # Safely convert string to list
                    except (ValueError, SyntaxError):
                        product["features"] = []  # Default to empty list if eval fails
                else:
                    product["features"] = []  # Default to empty list if it's not a valid list string
            
            # For categories
            if isinstance(product["categories"], str):
                # Check for a malformed string or 'List' and convert to proper list
                if product["categories"].startswith("[") and product["categories"].endswith("]"):
                    try:
                        product["categories"] = ast.literal_eval(product["categories"])  # Safely convert string to list
                    except (ValueError, SyntaxError):
                        product["categories"] = []  # Default to empty list if eval fails
                else:
                    product["categories"] = []  # Default to empty list if it's not a valid list string

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
        
        def safe_parse_list(value):
            return json.loads(value) if isinstance(value, str) and value.startswith('[') else value or []

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
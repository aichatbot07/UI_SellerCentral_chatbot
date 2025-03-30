from fastapi import APIRouter, HTTPException, Query
import os
import ast
from google.cloud import bigquery
from api.schemas.product import ProductListResponse, ProductDetailResponse


os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\navee\\OneDrive\\Desktop\\Northeastern\\MLOPS\\UI_SellerCentral_chatbot\\Backend\\spheric-engine-451615-a8-f9523dbb5c8a.json"
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

    query = f"SELECT * FROM `spheric-engine-451615-a8.Amazon_Reviews_original_dataset_v4.meta_data` WHERE id = '{product_id}'"
    results = client.query(query).result()
    
    product = [row for row in results]
    if not product:
        return {"error": "Product not found"}

    product = product[0]
    return {"id": product["id"], "name": product["name"], "description": product["description"], "price": product["price"], "category": product["category"]}

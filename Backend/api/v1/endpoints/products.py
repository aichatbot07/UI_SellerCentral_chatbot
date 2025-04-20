from fastapi import APIRouter, Query, HTTPException
from google.cloud import bigquery

from typing import Optional

from dotenv import load_dotenv
from api.schemas.product import ProductListResponse, ProductDetailResponse
from google.cloud import secretmanager



router = APIRouter()
client = bigquery.Client()


# FastAPI route to fetch products by category
@router.get("/products/{category}")
def get_products_by_category(category: str):

@router.get("/Productstest")
def get_all_products():
        return {"message": "products is running"}

@router.get("/products/filter")
def get_products_by_seller_and_category(seller_id: int, main_category: str):
    """
    Fetches products based on seller_id and main_category from BigQuery.
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
            WHERE seller_id = @seller_id AND main_category = @main_category
        """

        job_config = bigquery.QueryJobConfig(
            query_parameters=[
                bigquery.ScalarQueryParameter("seller_id", "INT64", seller_id),
                bigquery.ScalarQueryParameter("main_category", "STRING", main_category)
            ]
        )

        results = client.query(query, job_config=job_config).result()

        products = [
            {
                "id": row["parent_asin"], 
                "name": row["title"],
                "category": row["main_category"],
                "average_rating": row.get("average_rating"),
                "rating_number": row.get("rating_number"),
                "features": row.get("features", []),
                "description": row.get("description", ""),
                "price": row.get("price", 0.0),
                "image_url": row.get("images"),
                "videos": row.get("videos"),
                "store": row.get("store"),
                "categories": row.get("categories", []),
                "bought_together": row.get("bought_together", []),
            } 
            for row in results
        ]

        return {"products": products, "total_count": len(products)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.get("/products", response_model=ProductListResponse)
def get_all_products(seller_id : int):
    """
    Fetches all products from BigQuery.
    """

    try:
        # Validate input to ensure correct category format
        valid_categories = [
            "All Beauty", 
            "Health and Personal Care", 
            "Amazon Fashion", 
            "Appliances", 
            "Musical Instruments"
        ]
        
        if category not in valid_categories:
            raise HTTPException(status_code=400, detail="Invalid category selected.")
        
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
            WHERE main_category = @category
        """

        query_parameters = [bigquery.ScalarQueryParameter("category", "STRING", category)]

        job_config = bigquery.QueryJobConfig(query_parameters=query_parameters)
        results = client.query(query, job_config=job_config).result()

        products = [
            {
                "id": row["parent_asin"], 
                "name": row["title"],
                "category": row["main_category"],
                "average_rating": row.get("average_rating"),
                "rating_number": row.get("rating_number"),
                "features": row.get("features", []),
                "description": row.get("description", ""),
                "price": row.get("price", 0.0),
                "image_url": row.get("images"),
                "videos": row.get("videos"),
                "store": row.get("store"),
                "categories": row.get("categories", []),
                "bought_together": row.get("bought_together", []),
            } 
            for row in results
        ]

        return {"products": products, "total_count": len(products)}

    except Exception as e:
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
            if not value:
                return []
            try:
                parsed = json.loads(value)
                return parsed if isinstance(parsed, list) else []
            except (json.JSONDecodeError, TypeError):
                return []


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


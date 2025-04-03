from fastapi import APIRouter, Query, HTTPException
from google.cloud import bigquery
from typing import Optional

router = APIRouter()
client = bigquery.Client()

# FastAPI route to fetch products by category
@router.get("/products/{category}")
def get_products_by_category(category: str):
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

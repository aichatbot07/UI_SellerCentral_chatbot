from fastapi import APIRouter
from google.cloud import bigquery
from app.schemas.product import ProductListResponse, ProductDetailResponse

router = APIRouter()
client = bigquery.Client()

@router.get("/products", response_model=ProductListResponse)
def get_all_products():
    query = "SELECT id, name, price, category FROM `your_project_id.your_dataset.products`"
    results = client.query(query).result()
    
    products = [{"id": row["id"], "name": row["name"], "price": row["price"], "category": row["category"]} for row in results]
    
    return {"products": products}

@router.get("/products/{product_id}", response_model=ProductDetailResponse)
def get_product_by_id(product_id: str):
    query = f"SELECT * FROM `your_project_id.your_dataset.products` WHERE id = '{product_id}'"
    results = client.query(query).result()
    
    product = [row for row in results]
    if not product:
        return {"error": "Product not found"}

    product = product[0]
    return {"id": product["id"], "name": product["name"], "description": product["description"], "price": product["price"], "category": product["category"]}

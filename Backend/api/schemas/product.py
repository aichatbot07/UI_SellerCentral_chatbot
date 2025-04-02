from pydantic import BaseModel
from typing import List, Optional

class ProductBase(BaseModel):
    id: str
    name: str
    description: Optional[str]  # Description could be missing for some products
    price: Optional[float]  # price can be missing (None) as Optional
    image_url: Optional[str]  # Images could be missing for some products
    average_rating: Optional[float]  # Might not be available for all products
    rating_number: Optional[int]  # Might not be available for all products
    features: Optional[List[str]] = []  # List of features, defaults to empty list
    store: Optional[str]  # Store might not be available
    categories: Optional[List[str]] = []  # Categories could be a list of categories, defaults to empty list
    bought_together: Optional[List[str]] = []  # Products bought together could be a list of product IDs


class ProductListResponse(BaseModel):
    products: List[ProductBase]
    total_count: int

class ProductDetailResponse(ProductBase):
    additional_details: Optional[dict]  # You can extend this if you have more info for details

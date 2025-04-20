from pydantic import BaseModel
from typing import List, Optional

class ProductBase(BaseModel):
    main_category: str
    title: str
    average_rating: Optional[float] = None
    rating_number: Optional[int] = None
    features: List[str]
    description: List[str]
    price: Optional[float] = None
    images: List[str]
    videos: List[str]
    store: Optional[str] = None
    categories: [str]
    parent_asin: str
    bought_together: List[str]


class ProductListResponse(BaseModel):
    products: List[ProductBase]

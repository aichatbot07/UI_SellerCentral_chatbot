from fastapi import FastAPI
from api.v1.endpoints import products

app = FastAPI()

@app.get("/")
def home():
    return {"message": "FastAPI is running"}


app.include_router(products.router)
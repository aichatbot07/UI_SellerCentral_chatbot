from fastapi import FastAPI
from api.v1.endpoints import products, auth

app = FastAPI()

@app.get("/")
def home():
    return {"message": "FastAPI is running"}


app.include_router(products.router)
app.include_router(auth.router)
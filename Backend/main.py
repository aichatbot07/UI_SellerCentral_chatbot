from fastapi import FastAPI
from api.v1.endpoints import products, auth

app = FastAPI()

@app.get("/")
def home():
    return {"message": "FastAPI is running"}

if __name__ == "__main__":
    import os
    import uvicorn

    # Port should be from the environment variable that Cloud Run provides
    port = int(os.getenv("PORT", 8080))
    
    uvicorn.run(app, host="0.0.0.0", port=port)


app.include_router(products.router)
app.include_router(auth.router)
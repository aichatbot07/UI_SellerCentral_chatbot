from fastapi import FastAPI
from api.v1.endpoints import products, auth, chatbot
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",  # React Frontend
    "https://chatbotfrontend-77fd1.web.app" 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows only specified origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)

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
app.include_router(chatbot.router)
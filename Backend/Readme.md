# Backend API - Amazon Seller Platform

## Overview

This backend provides authentication and product management functionalities for sellers using FastAPI and BigQuery as the database.

## Prerequisites

Ensure you have the following installed:

- Python 3.9+
- Virtual environment (venv)
- Google Cloud SDK (for BigQuery authentication)
- PostgreSQL (optional for local testing)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/aichatbot07/UI_SellerCentral_chatbot.git
cd Backend
```

### 2. Create and Activate Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Set Up Environment Variables

Create a `.env` file and add the following details:

```
BIGQUERY_PROJECT_ID=<your-gcp-project-id>
BIGQUERY_DATASET=<your-dataset-name>
BIGQUERY_CREDENTIALS_PATH=<path-to-your-service-account.json>
SECRET_KEY=<your-secret-key>
```

### 5. Authenticate with Google Cloud

Ensure your Google Cloud credentials are set up:

```bash
export GOOGLE_APPLICATION_CREDENTIALS=<path-to-your-service-account.json>
```

## Running the Server

To start the FastAPI backend:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### **Authentication**

- **Login:** `POST /auth/login`
  - Request Body:
    ```json
    {
      "email": "seller@example.com",
      "password": "yourpassword"
    }
    ```

### **Products**

- **Get All Products:** `GET /products`
- **Get Product by ID:** `GET /products/{product_id}`
- **Get All Sellers:** `GET /auth/sellers`

## Testing with Postman

1. Open Postman
2. Create a new request and enter the API URL
3. Set the method (e.g., `POST` for login)
4. Provide the request body (for `POST` requests)
5. Click **Send** and check the response

## Deployment

For production deployment, use:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Or deploy using **Docker**, **Google Cloud Run**, or **AWS Lambda**.

## License

This project is licensed under the MIT License.

import os

import requests
from dotenv import load_dotenv

load_dotenv()

LARAVEL_API_URL = os.getenv(
    "LARAVEL_API_URL",
    "http://127.0.0.1:8002/api/rag/vendors",
)


def get_vendors(filters: dict | None = None):
    try:
        response = requests.get(
            LARAVEL_API_URL,
            params=filters,
            headers={"Accept": "application/json"},
            timeout=(3, 15),
        )
        response.raise_for_status()
        return response.json().get("vendors", [])
    except requests.exceptions.RequestException as e:
        return {"error": f"Vendor service unavailable: {e}"}
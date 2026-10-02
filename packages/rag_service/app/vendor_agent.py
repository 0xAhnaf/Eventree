from typing import Optional

from langchain_core.tools import tool

from app.vendor_service import get_vendors


@tool
def search_vendors(
    min_rating: Optional[float] = None,
    category: Optional[str] = None,
    city: Optional[str] = None,
    amenity: Optional[str] = None,
    vendor_name: Optional[str] = None,
):
    """
    Search Eventree vendors using live database information.

    Use this tool when the user asks about vendors,
    ratings, categories, cities, amenities, or vendor names.
    """
    filters = {
        "min_rating": min_rating,
        "category": category,
        "city": city,
        "amenity": amenity,
        "vendor_name": vendor_name,
    }
    return get_vendors({k: v for k, v in filters.items() if v not in (None, "")})
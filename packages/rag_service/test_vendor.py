from app.vendor_service import get_vendors

vendors = get_vendors({
    "min_rating": 4
})

print(vendors)
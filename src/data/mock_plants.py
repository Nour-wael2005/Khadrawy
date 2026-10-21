"""Frontend-only My Plants mock data: 5 varied plants for each gardener.
There is no Plant SQLAlchemy model in the supplied user_model.py, so these
records are not inserted into SQLite by seed_mock_data().
"""

MOCK_MY_PLANTS = [
    # Gardener 57: Karim Adel, assigned to land 1
    {"id": 1, "gardener_id": 57, "land_id": 1, "name": "Tomato", "variety": "Roma", "category": "Vegetable", "growth_stage": "Flowering", "health_status": "Healthy", "moisture_percent": 54, "last_watered": "2026-10-21 07:30", "notes": "Regular monitoring during flowering", "is_mock": True},
    {"id": 2, "gardener_id": 57, "land_id": 1, "name": "Basil", "variety": "Sweet Basil", "category": "Herb", "growth_stage": "Vegetative", "health_status": "Healthy", "moisture_percent": 48, "last_watered": "2026-10-21 07:15", "notes": "Trim outer leaves when needed", "is_mock": True},
    {"id": 3, "gardener_id": 57, "land_id": 1, "name": "Cucumber", "variety": "Beit Alpha", "category": "Vegetable", "growth_stage": "Vegetative", "health_status": "Needs Attention", "moisture_percent": 31, "last_watered": "2026-10-20 16:20", "notes": "Check moisture and inspect lower leaves", "is_mock": True},
    {"id": 4, "gardener_id": 57, "land_id": 1, "name": "Mint", "variety": "Spearmint", "category": "Herb", "growth_stage": "Vegetative", "health_status": "Healthy", "moisture_percent": 61, "last_watered": "2026-10-21 08:00", "notes": "Growing well; avoid waterlogging", "is_mock": True},
    {"id": 5, "gardener_id": 57, "land_id": 1, "name": "Sweet Pepper", "variety": "California Wonder", "category": "Vegetable", "growth_stage": "Fruiting", "health_status": "Healthy", "moisture_percent": 57, "last_watered": "2026-10-21 07:40", "notes": "Track fruit growth", "is_mock": True},
    # Gardener 58: Huda Samir, assigned to land 5
    {"id": 6, "gardener_id": 58, "land_id": 5, "name": "Maize", "variety": "Single Cross", "category": "Cereal", "growth_stage": "Seedling", "health_status": "Healthy", "moisture_percent": 49, "last_watered": "2026-10-21 06:50", "notes": "Seedling stage; keep moisture stable", "is_mock": True},
    {"id": 7, "gardener_id": 58, "land_id": 5, "name": "Okra", "variety": "Clemson Spineless", "category": "Vegetable", "growth_stage": "Flowering", "health_status": "Healthy", "moisture_percent": 52, "last_watered": "2026-10-21 07:10", "notes": "Inspect flowers and new pods", "is_mock": True},
    {"id": 8, "gardener_id": 58, "land_id": 5, "name": "Onion", "variety": "Giza 6", "category": "Vegetable", "growth_stage": "Bulb Development", "health_status": "Needs Attention", "moisture_percent": 29, "last_watered": "2026-10-20 17:00", "notes": "Moisture is low in this demo record", "is_mock": True},
    {"id": 9, "gardener_id": 58, "land_id": 5, "name": "Parsley", "variety": "Curly Leaf", "category": "Herb", "growth_stage": "Vegetative", "health_status": "Healthy", "moisture_percent": 58, "last_watered": "2026-10-21 07:20", "notes": "Harvest outer leaves", "is_mock": True},
    {"id": 10, "gardener_id": 58, "land_id": 5, "name": "Eggplant", "variety": "Black Beauty", "category": "Vegetable", "growth_stage": "Fruiting", "health_status": "Healthy", "moisture_percent": 46, "last_watered": "2026-10-21 07:00", "notes": "Monitor developing fruits", "is_mock": True},
    # Gardener 59: Amr Nabil, assigned to land 9
    {"id": 11, "gardener_id": 59, "land_id": 9, "name": "Olive", "variety": "Picual", "category": "Fruit Tree", "growth_stage": "Mature", "health_status": "Healthy", "moisture_percent": 43, "last_watered": "2026-10-20 18:00", "notes": "Check tree base and soil moisture", "is_mock": True},
    {"id": 12, "gardener_id": 59, "land_id": 9, "name": "Lemon", "variety": "Eureka", "category": "Fruit Tree", "growth_stage": "Fruit Development", "health_status": "Healthy", "moisture_percent": 55, "last_watered": "2026-10-21 06:45", "notes": "Inspect leaves for discoloration", "is_mock": True},
    {"id": 13, "gardener_id": 59, "land_id": 9, "name": "Rosemary", "variety": "Common Rosemary", "category": "Herb", "growth_stage": "Vegetative", "health_status": "Healthy", "moisture_percent": 35, "last_watered": "2026-10-20 16:30", "notes": "Allow the top soil to dry slightly", "is_mock": True},
    {"id": 14, "gardener_id": 59, "land_id": 9, "name": "Grape", "variety": "Thompson Seedless", "category": "Fruit", "growth_stage": "Mature", "health_status": "Warning", "moisture_percent": 32, "last_watered": "2026-10-20 15:50", "notes": "Review irrigation and leaf condition", "is_mock": True},
    {"id": 15, "gardener_id": 59, "land_id": 9, "name": "Pomegranate", "variety": "Wonderful", "category": "Fruit Tree", "growth_stage": "Fruit Development", "health_status": "Healthy", "moisture_percent": 51, "last_watered": "2026-10-21 07:25", "notes": "Track fruit development", "is_mock": True},
]

PLANTS_BY_GARDENER = {
    gardener_id: [plant for plant in MOCK_MY_PLANTS if plant["gardener_id"] == gardener_id]
    for gardener_id in (57, 58, 59)
}
assert len(MOCK_MY_PLANTS) == 15
assert all(len(plants) == 5 for plants in PLANTS_BY_GARDENER.values())

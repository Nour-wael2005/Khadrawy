"""Ten mock lands; every field matches the Land SQLAlchemy model."""

# Distribution of lands across engineers is intentionally uneven:
# Engineer 2 owns lands 1-2, engineer 3 owns land 3, engineer 4 owns lands 4-6,
# engineer 5 owns land 7, and engineer 6 owns lands 8-10.
MOCK_LANDS = [
    {
        "id": 1, "name": "Nile View Farm", "location": "Beni Mazar, Minya, Egypt",
        "engineer": "Mariam Hassan", "engineer_id": 2, "device": "Online", "status": "Healthy",
        "crop_type": "Tomato", "growth_stage": "Flowering", "soil_type": "Loamy",
        "turn_on_below": 35, "turn_off_above": 70, "high_temp_override": True, "override_temp": 32,
        "operation_mode": "Auto", "max_run_time": 15, "cooldown_period": 2,
        "do_not_water_start": "12:00", "do_not_water_end": "15:00",
    },
    {
        "id": 2, "name": "East Canal Plot", "location": "Samalut, Minya, Egypt",
        "engineer": "Mariam Hassan", "engineer_id": 2, "device": "Online", "status": "Healthy",
        "crop_type": "Wheat", "growth_stage": "Vegetative", "soil_type": "Clay Loam",
        "turn_on_below": 30, "turn_off_above": 65, "high_temp_override": False, "override_temp": 33,
        "operation_mode": "Auto", "max_run_time": 18, "cooldown_period": 3,
        "do_not_water_start": "12:00", "do_not_water_end": "15:00",
    },
    {
        "id": 3, "name": "Palm Ridge", "location": "Mallawi, Minya, Egypt",
        "engineer": "Ahmed Mahmoud", "engineer_id": 3, "device": "Offline", "status": "Warning",
        "crop_type": "Date Palm", "growth_stage": "Fruit Development", "soil_type": "Sandy Loam",
        "turn_on_below": 28, "turn_off_above": 62, "high_temp_override": True, "override_temp": 34,
        "operation_mode": "Auto", "max_run_time": 20, "cooldown_period": 3,
        "do_not_water_start": "11:30", "do_not_water_end": "15:30",
    },
    {
        "id": 4, "name": "Green Horizon", "location": "Minya City, Minya, Egypt",
        "engineer": "Salma Fathy", "engineer_id": 4, "device": "Online", "status": "Healthy",
        "crop_type": "Cucumber", "growth_stage": "Vegetative", "soil_type": "Loamy",
        "turn_on_below": 36, "turn_off_above": 72, "high_temp_override": True, "override_temp": 32,
        "operation_mode": "Auto", "max_run_time": 12, "cooldown_period": 2,
        "do_not_water_start": "12:00", "do_not_water_end": "15:00",
    },
    {
        "id": 5, "name": "Sunrise Fields", "location": "Abu Qurqas, Minya, Egypt",
        "engineer": "Salma Fathy", "engineer_id": 4, "device": "Online", "status": "Needs Attention",
        "crop_type": "Maize", "growth_stage": "Seedling", "soil_type": "Clay Loam",
        "turn_on_below": 32, "turn_off_above": 68, "high_temp_override": False, "override_temp": 33,
        "operation_mode": "Manual", "max_run_time": 15, "cooldown_period": 2,
        "do_not_water_start": "12:00", "do_not_water_end": "15:00",
    },
    {
        "id": 6, "name": "West Bank Orchard", "location": "Deir Mawas, Minya, Egypt",
        "engineer": "Salma Fathy", "engineer_id": 4, "device": "Online", "status": "Healthy",
        "crop_type": "Citrus", "growth_stage": "Fruit Development", "soil_type": "Sandy Loam",
        "turn_on_below": 27, "turn_off_above": 60, "high_temp_override": True, "override_temp": 35,
        "operation_mode": "Auto", "max_run_time": 20, "cooldown_period": 4,
        "do_not_water_start": "12:00", "do_not_water_end": "15:00",
    },
    {
        "id": 7, "name": "Clover Patch", "location": "Maghagha, Minya, Egypt",
        "engineer": "Omar Khaled", "engineer_id": 5, "device": "Online", "status": "Healthy",
        "crop_type": "Clover", "growth_stage": "Vegetative", "soil_type": "Clay Loam",
        "turn_on_below": 38, "turn_off_above": 73, "high_temp_override": False, "override_temp": 32,
        "operation_mode": "Auto", "max_run_time": 14, "cooldown_period": 2,
        "do_not_water_start": "12:00", "do_not_water_end": "15:00",
    },
    {
        "id": 8, "name": "Tomato House", "location": "Matai, Minya, Egypt",
        "engineer": "Nour Ashraf", "engineer_id": 6, "device": "Online", "status": "Healthy",
        "crop_type": "Tomato", "growth_stage": "Fruiting", "soil_type": "Loamy",
        "turn_on_below": 35, "turn_off_above": 70, "high_temp_override": True, "override_temp": 32,
        "operation_mode": "Auto", "max_run_time": 15, "cooldown_period": 2,
        "do_not_water_start": "12:00", "do_not_water_end": "15:00",
    },
    {
        "id": 9, "name": "Olive Terrace", "location": "Beni Mazar, Minya, Egypt",
        "engineer": "Nour Ashraf", "engineer_id": 6, "device": "Offline", "status": "Warning",
        "crop_type": "Olive", "growth_stage": "Mature", "soil_type": "Sandy Loam",
        "turn_on_below": 26, "turn_off_above": 58, "high_temp_override": False, "override_temp": 34,
        "operation_mode": "Manual", "max_run_time": 18, "cooldown_period": 3,
        "do_not_water_start": "11:00", "do_not_water_end": "15:00",
    },
    {
        "id": 10, "name": "Pepper Garden", "location": "Minya City, Minya, Egypt",
        "engineer": "Nour Ashraf", "engineer_id": 6, "device": "Online", "status": "Healthy",
        "crop_type": "Bell Pepper", "growth_stage": "Flowering", "soil_type": "Loamy",
        "turn_on_below": 34, "turn_off_above": 69, "high_temp_override": True, "override_temp": 33,
        "operation_mode": "Auto", "max_run_time": 13, "cooldown_period": 2,
        "do_not_water_start": "12:00", "do_not_water_end": "15:00",
    },
]

LAND_ENGINEER_ASSIGNMENTS = {land["id"]: land["engineer_id"] for land in MOCK_LANDS}
FARMERS_PER_LAND = {1: 4, 2: 5, 3: 8, 4: 3, 5: 4, 6: 6, 7: 7, 8: 2, 9: 5, 10: 6}

assert len(MOCK_LANDS) == 10
assert all(set(land.keys()) == {
    "id", "name", "location", "engineer", "engineer_id", "device", "status",
    "crop_type", "growth_stage", "soil_type", "turn_on_below", "turn_off_above",
    "high_temp_override", "override_temp", "operation_mode", "max_run_time",
    "cooldown_period", "do_not_water_start", "do_not_water_end"
} for land in MOCK_LANDS)

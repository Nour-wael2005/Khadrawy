"""Deterministic Khadrawy mock users. IDs and assigned land IDs match mock_lands.py."""

DEMO_PASSWORD = "Khadrawy@123"
# This placeholder satisfies User.hashed_password for demo data only.
# seed_mock_data() can replace it with a real hash when passed your app's hash function.
MOCK_PASSWORD_HASH = "MOCK_ONLY_REPLACE_WITH_REAL_HASH"

LANDOWNER_ID = 1
ENGINEER_IDS = [2, 3, 4, 5, 6]
GARDENER_IDS = [57, 58, 59]

ENGINEERS = [
    {"id": 2, "name": "Mariam Hassan", "email": "mariam.hassan@example.com", "phone": "01020001002", "role": "agricultural_engineer", "specialization": "Irrigation Systems", "status": "Active", "assigned_land_id": None},
    {"id": 3, "name": "Ahmed Mahmoud", "email": "ahmed.mahmoud@example.com", "phone": "01020001003", "role": "agricultural_engineer", "specialization": "Crop & Soil Management", "status": "Active", "assigned_land_id": None},
    {"id": 4, "name": "Salma Fathy", "email": "salma.fathy@example.com", "phone": "01020001004", "role": "agricultural_engineer", "specialization": "Plant Pathology", "status": "Active", "assigned_land_id": None},
    {"id": 5, "name": "Omar Khaled", "email": "omar.khaled@example.com", "phone": "01020001005", "role": "agricultural_engineer", "specialization": "Smart Agriculture", "status": "Active", "assigned_land_id": None},
    {"id": 6, "name": "Nour Ashraf", "email": "nour.ashraf@example.com", "phone": "01020001006", "role": "agricultural_engineer", "specialization": "Crop Protection", "status": "Active", "assigned_land_id": None},
]

LANDOWNER = {
    "id": LANDOWNER_ID,
    "name": "Youssef Abdelrahman",
    "email": "owner@example.com",
    "phone": "01020001001",
    "role": "landowner",
    "specialization": None,
    "status": "Active",
    "assigned_land_id": None,
}

# These 50 farmers are assigned across the 10 lands. Each land's engineer is
# obtained through Land.engineer_id, so every farmer has an indirect engineer.
FARMER_NAMES = [
    "Mostafa Ali", "Hassan Ibrahim", "Mahmoud Samir", "Khaled Fawzy", "Tarek Nabil",
    "Amr Saeed", "Hany Adel", "Sherif Gamal", "Wael Emad", "Ehab Mostafa",
    "Ayman Sobhy", "Samir Hamdy", "Fathy Ramadan", "Ramy Ashour", "Ashraf Hamed",
    "Bassem Eid", "Magdy Salem", "Nader Youssef", "Islam Farid", "Reda Sayed",
    "Mohamed Gaber", "Ibrahim Anwar", "Sayed Mahmoud", "Mina Sameh", "Karim Atef",
    "Adel Hassan", "Kamal Mostafa", "Hossam Fouad", "Mazen Salah", "Fares Nasser",
    "Emad Shaban", "Saber Amin", "Bahaa Roshdy", "Mamdouh Zaki", "Hatem Kamel",
    "Gerges Milad", "Bishoy Naguib", "Ragab Taha", "Abdelaziz Saad", "Hamdy Mokhtar",
    "Fouad Hamza", "Yasser Lotfy", "Essam Mansour", "Nabil Ezzat", "Maher Karam",
    "Alaa Farouk", "Sameh Tawfik", "Fikry Abdelwahab", "Morsy Galal", "Ziad Mohamed",
]

# Farmer counts by land: [4, 5, 8, 3, 4, 6, 7, 2, 5, 6] => 50 total.
FARMERS_PER_LAND = [4, 5, 8, 3, 4, 6, 7, 2, 5, 6]

FARMERS = []
_farmer_number = 1
for land_id, count in enumerate(FARMERS_PER_LAND, start=1):
    for _ in range(count):
        name = FARMER_NAMES[_farmer_number - 1]
        FARMERS.append({
            "id": 6 + _farmer_number,
            "name": name,
            "email": f"farmer{_farmer_number:02d}@example.com",
            "phone": f"0102001{_farmer_number:04d}",
            "role": "farmer",
            "specialization": "Field Operations",
            "status": "Active" if _farmer_number % 13 else "On Leave",
            "assigned_land_id": land_id,
        })
        _farmer_number += 1

GARDENERS = [
    {"id": 57, "name": "Karim Adel", "email": "karim.adel@example.com", "phone": "01020001057", "role": "gardener", "specialization": "Plant Care", "status": "Active", "assigned_land_id": 1},
    {"id": 58, "name": "Huda Samir", "email": "huda.samir@example.com", "phone": "01020001058", "role": "gardener", "specialization": "Home & Garden Care", "status": "Active", "assigned_land_id": 5},
    {"id": 59, "name": "Amr Nabil", "email": "amr.nabil@example.com", "phone": "01020001059", "role": "gardener", "specialization": "Plant Care", "status": "Active", "assigned_land_id": 9},
]

# Exactly 59 users: 1 landowner + 5 engineers + 50 farmers + 3 gardeners.
MOCK_USERS = [LANDOWNER] + ENGINEERS + FARMERS + GARDENERS

# Add every User model column, including hashed_password, to each record.
for _user in MOCK_USERS:
    _user["hashed_password"] = MOCK_PASSWORD_HASH

assert len(MOCK_USERS) == 59
assert len({u["email"] for u in MOCK_USERS}) == 59
assert sum(1 for u in MOCK_USERS if u["role"] == "farmer") == 50

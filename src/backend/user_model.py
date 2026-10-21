# المسار: src/backend/user_model.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, default="gardener")
    specialization = Column(String, nullable=True, default="Crop & Soil Management")
    status = Column(String, nullable=True, default="Active")
    assigned_land_id = Column(Integer, ForeignKey("lands.id"), nullable=True)


class Land(Base):
    __tablename__ = "lands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, default="New Plot")
    location = Column(String, nullable=False, default="Giza, Egypt")
    engineer = Column(String, nullable=False, default="Unassigned")
    engineer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    device = Column(String, nullable=False, default="Online")
    status = Column(String, nullable=False, default="Healthy")

    # 1. Field & Crop Profile
    crop_type = Column(String, nullable=False, default="Tomato")
    growth_stage = Column(String, nullable=False, default="Vegetative")
    soil_type = Column(String, nullable=False, default="Loamy")

    # 2. Automation Thresholds
    turn_on_below = Column(Integer, nullable=False, default=35)
    turn_off_above = Column(Integer, nullable=False, default=70)
    high_temp_override = Column(Boolean, nullable=False, default=False)
    override_temp = Column(Integer, nullable=False, default=32)

    # 3. Pump & Safety Settings
    operation_mode = Column(String, nullable=False, default="Auto")
    max_run_time = Column(Integer, nullable=False, default=15)
    cooldown_period = Column(Integer, nullable=False, default=2)

    # 4. Time Restrictions
    do_not_water_start = Column(String, nullable=False, default="12:00")
    do_not_water_end = Column(String, nullable=False, default="15:00")
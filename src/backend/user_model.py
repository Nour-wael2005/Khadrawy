from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
try:
    from .database import Base
except ImportError:
    from database import Base

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
    
    plants = relationship("Plant", back_populates="owner")


class Land(Base):
    __tablename__ = "lands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, default="New Plot")
    location = Column(String, nullable=False, default="Giza, Egypt")
    engineer = Column(String, nullable=False, default="Unassigned")
    engineer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    device = Column(String, nullable=False, default="Online")
    status = Column(String, nullable=False, default="Healthy")

    crop_type = Column(String, nullable=False, default="Tomato")
    growth_stage = Column(String, nullable=False, default="Vegetative")
    soil_type = Column(String, nullable=False, default="Loamy")

    turn_on_below = Column(Integer, nullable=False, default=35)
    turn_off_above = Column(Integer, nullable=False, default=70)
    high_temp_override = Column(Boolean, nullable=False, default=False)
    override_temp = Column(Integer, nullable=False, default=32)

    operation_mode = Column(String, nullable=False, default="Auto")
    max_run_time = Column(Integer, nullable=False, default=15)
    cooldown_period = Column(Integer, nullable=False, default=2)

    do_not_water_start = Column(String, nullable=False, default="12:00")
    do_not_water_end = Column(String, nullable=False, default="15:00")


class Plant(Base):
    __tablename__ = "plants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    crop_type = Column(String, nullable=True)
    growth_stage = Column(String, nullable=True)
    soil_type = Column(String, nullable=True)
    soil_ph = Column(Float, nullable=True)
    watering_schedule = Column(String, nullable=True)
    image = Column(String, nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", back_populates="plants")
    
    reports = relationship("PlantReport", back_populates="plant", cascade="all, delete-orphan")


class PlantReport(Base):
    __tablename__ = "plant_reports"

    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False)
    image_url = Column(String, nullable=True)
    condition = Column(String, nullable=True)
    health_status = Column(String, nullable=True)
    ai_response = Column(Text, nullable=True)
    symptoms = Column(Text, nullable=True)     # 👈 الأعراض
    actions = Column(Text, nullable=True)      # 👈 الإجراءات المقترحة (نخزنها كـ Text أو JSON حسب المتاح)
    prevention = Column(Text, nullable=True)   # 👈 الوقاية
    date = Column(String, nullable=True)

    plant = relationship("Plant", back_populates="reports")
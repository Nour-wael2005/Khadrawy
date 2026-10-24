# المسار: src/backend/main.py
# =====================================================
# KHADRWY - AI AGRICULTURAL SYSTEM
# =====================================================
try:
    from ..data.mock_users import MOCK_USERS
    from ..data.mock_lands import MOCK_LANDS
    from ..data.mock_plants import MOCK_MY_PLANTS
except ImportError:
    MOCK_USERS, MOCK_LANDS, MOCK_MY_PLANTS = [], [], []

from datetime import datetime
from sqlalchemy import inspect, text
from fastapi import (
    FastAPI,
    File,
    UploadFile,
    Depends,
    HTTPException,
    Form,
    Request
)
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import timedelta
from threading import Lock
from typing import Any

# =====================================================
# PROJECT IMPORTS
# =====================================================
from .model import predict_plant
from .recommendations import get_recommendation
from .database import Base, engine, get_db
from .user_model import User, Land, Plant, PlantReport
from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from .rag.generator import generate_rag_answer

ENGINEER_ROLES = ("engineer", "agricultural_engineer")
FIELD_WORKER_ROLES = ("farmer", "gardener")

# =====================================================
# DATABASE INITIALIZATION & AUTO-MIGRATION
# =====================================================
def ensure_all_tables_updated():
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    with engine.begin() as conn:
        if "users" in tables:
            user_cols = [col["name"] for col in inspector.get_columns("users")]
            if "specialization" not in user_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN specialization VARCHAR DEFAULT 'Field Operations'"))
            if "status" not in user_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN status VARCHAR DEFAULT 'Active'"))
            if "assigned_land_id" not in user_cols:
                conn.execute(text("ALTER TABLE users ADD COLUMN assigned_land_id INTEGER"))

        if "lands" in tables:
            land_cols = [col["name"] for col in inspector.get_columns("lands")]
            if "engineer_id" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN engineer_id INTEGER"))
            if "crop_type" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN crop_type VARCHAR DEFAULT 'Tomato'"))
            if "growth_stage" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN growth_stage VARCHAR DEFAULT 'Vegetative'"))
            if "soil_type" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN soil_type VARCHAR DEFAULT 'Loamy'"))
            if "turn_on_below" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN turn_on_below INTEGER DEFAULT 35"))
            if "turn_off_above" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN turn_off_above INTEGER DEFAULT 70"))
            if "high_temp_override" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN high_temp_override BOOLEAN DEFAULT 0"))
            if "override_temp" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN override_temp INTEGER DEFAULT 32"))
            if "operation_mode" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN operation_mode VARCHAR DEFAULT 'Auto'"))
            if "max_run_time" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN max_run_time INTEGER DEFAULT 15"))
            if "cooldown_period" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN cooldown_period INTEGER DEFAULT 2"))
            if "do_not_water_start" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN do_not_water_start VARCHAR DEFAULT '12:00'"))
            if "do_not_water_end" not in land_cols:
                conn.execute(text("ALTER TABLE lands ADD COLUMN do_not_water_end VARCHAR DEFAULT '15:00'"))

ensure_all_tables_updated()

app = FastAPI(
    title="Khadrwy AI",
    description="AI Plant Disease Detection, Recommendation & Agricultural Assistant API"
)

@app.get("/api/mock/users")
def get_mock_users(role: str | None = None):
    users = MOCK_USERS
    if role:
        users = [user for user in users if user["role"] == role]
    return [{k: v for k, v in u.items() if k != "hashed_password"} for u in users]

@app.get("/api/mock/lands")
def get_mock_lands(engineer_id: int | None = None):
    lands = MOCK_LANDS
    if engineer_id is not None:
        lands = [land for land in lands if land["engineer_id"] == engineer_id]
    return lands

@app.get("/api/mock/plants")
def get_mock_plants(gardener_id: int | None = None):
    plants = MOCK_MY_PLANTS
    if gardener_id is not None:
        plants = [plant for plant in plants if plant["gardener_id"] == gardener_id]
    return plants

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# SCHEMAS
# =====================================================
class ResetPasswordRequest(BaseModel):
    identifier: str
    new_password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: str | None = None
    role: str = "gardener"

class LoginRequest(BaseModel):
    identifier: str
    password: str

class ChatRequest(BaseModel):
    message: str
    plant: str | None = None
    condition: str | None = None
    confidence: float | None = None

class CreateLandRequest(BaseModel):
    name: str
    location: str = "Giza, Egypt"
    engineer: str = "Omar El-Sayed"
    device: str = "Online"
    status: str = "Healthy"
    crop_type: str = "Tomato"
    growth_stage: str = "Vegetative"
    soil_type: str = "Loamy"
    turn_on_below: int = 35
    turn_off_above: int = 70
    high_temp_override: bool = False
    override_temp: int = 32
    operation_mode: str = "Auto"
    max_run_time: int = 15
    cooldown_period: int = 2
    do_not_water_start: str = "12:00"
    do_not_water_end: str = "15:00"

class CreateEngineerRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    specialization: str = "Crop & Soil Management"
    status: str = "Active"
    land_ids: list[int] = []

class CreateFarmerRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    specialization: str = "Irrigation & Pump Operator"
    status: str = "Active"
    assigned_land_id: int | None = None

class CreatePlantRequest(BaseModel):
    name: str
    crop_type: str | None = "Tomato"
    growth_stage: str | None = "Vegetative"
    soil_type: str | None = "Loamy"
    soil_ph: float | None = 6.5
    watering_schedule: str | None = "Every 2 hours"
    image: str | None = None

class PlantReportRequest(BaseModel):
    image_url: Any = None
    condition: Any = None
    health_status: Any = None
    ai_response: Any = None
    symptoms: Any = None
    actions: Any = None
    prevention: Any = None
    date: Any = None

# =====================================================
# INITIAL SEED DATA
# =====================================================
_seed_lock = Lock()

def seed_initial_data_if_empty(db: Session):
    with _seed_lock:
        if db.query(User).filter(User.role == "landowner").count() == 0:
            owner = User(
                name="Ahmed Landowner",
                email="landowner@khadrawy.com",
                hashed_password=hash_password("Password123@"),
                phone="01011111111",
                role="landowner",
                status="Active"
            )
            db.add(owner)
            db.commit()

        if db.query(User).filter(User.role.in_(ENGINEER_ROLES)).count() == 0:
            eng = User(
                name="Omar El-Sayed",
                email="engineer@khadrawy.com",
                hashed_password=hash_password("Password123@"),
                phone="01012345678",
                role="engineer",
                specialization="Greenhouse & Irrigation",
                status="Active"
            )
            db.add(eng)
            db.commit()
            db.refresh(eng)

            if db.query(Land).count() == 0:
                land = Land(
                    name="North Greenhouse",
                    location="Giza, Egypt",
                    engineer=eng.name,
                    engineer_id=eng.id,
                    device="Online",
                    status="Healthy",
                    crop_type="Tomato",
                    growth_stage="Vegetative",
                    soil_type="Loamy"
                )
                db.add(land)
                db.commit()

        if db.query(User).filter(User.role.in_(FIELD_WORKER_ROLES)).count() == 0:
            land_obj = db.query(Land).first()
            farmer = User(
                name="Mahmoud Ibrahim",
                email="farmer@khadrawy.com",
                hashed_password=hash_password("Password123@"),
                phone="01098765432",
                role="farmer",
                specialization="Irrigation & Pump Operator",
                status="Active",
                assigned_land_id=land_obj.id if land_obj else None
            )
            db.add(farmer)
            db.commit()

# =====================================================
# HOME & AUTH ENDPOINTS
# =====================================================
@app.get("/")
def home():
    return {"message": "Khadrwy AI API is running!"}

@app.post("/register")
def register(user_data: RegisterRequest, db: Session = Depends(get_db)):
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="البريد الإلكتروني مستخدم بالفعل")

    hashed_password = hash_password(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hashed_password,
        phone=user_data.phone,
        role=user_data.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "تم التسجيل بنجاح",
        "name": new_user.name,
        "email": new_user.email,
        "role": new_user.role
    }

@app.post("/login")
def login(user_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == user_data.identifier) | (User.phone == user_data.identifier)
    ).first()

    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="البيانات المدخلة أو كلمة المرور غير صحيحة")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )

    return {
        "message": "تم تسجيل الدخول بنجاح",
        "access_token": access_token,
        "token_type": "bearer",
        "name": user.name,
        "email": user.email,
        "role": user.role
    }

@app.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.email == data.identifier) | (User.phone == data.identifier)
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="المستخدم غير موجود")

    user.hashed_password = hash_password(data.new_password)
    db.commit()
    db.refresh(user)

    return {"message": "تم تحديث كلمة المرور بنجاح"}

# =====================================================
# GARDENER PLANTS ENDPOINTS (/api/plants/)
# =====================================================
@app.get("/api/plants/")
@app.get("/api/plants")
def get_user_plants(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plants = db.query(Plant).filter(Plant.owner_id == current_user.id).order_by(Plant.id.desc()).all()
    return plants

@app.post("/api/plants/")
@app.post("/api/plants")
def create_user_plant(
    plant_data: CreatePlantRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_plant = Plant(
        name=plant_data.name,
        crop_type=plant_data.crop_type,
        growth_stage=plant_data.growth_stage,
        soil_type=plant_data.soil_type,
        soil_ph=plant_data.soil_ph,
        watering_schedule=plant_data.watering_schedule,
        image=plant_data.image,
        owner_id=current_user.id
    )
    db.add(new_plant)
    db.commit()
    db.refresh(new_plant)
    return new_plant

# =====================================================
# DASHBOARD STATS, NOTIFICATIONS & REPORTS
# =====================================================
@app.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    seed_initial_data_if_empty(db)
    lands_count = db.query(Land).count()
    engineers_count = db.query(User).filter(User.role.in_(ENGINEER_ROLES)).count()
    farmers_count = db.query(User).filter(User.role.in_(FIELD_WORKER_ROLES)).count()

    return {
        "total_lands": lands_count,
        "lands_sub": "+2 this season",
        "total_engineers": engineers_count,
        "engineers_sub": "All accounts active",
        "total_farmers": farmers_count,
        "farmers_sub": f"Across {lands_count} lands"
    }

@app.get("/notifications")
def get_notifications(limit: int | None = None, db: Session = Depends(get_db)):
    seed_initial_data_if_empty(db)
    alerts = [
        {"id": 1, "type": "moisture", "title": "Low soil moisture", "location": "Olive Field East", "time": "18 min ago"},
        {"id": 2, "type": "sensor", "title": "Sensor needs attention", "location": "North field", "time": "1 hour ago"},
        {"id": 3, "type": "diagnosis", "title": "Diagnosis follow-up", "location": "Tomato crop", "time": "Yesterday"},
    ]
    if limit:
        return alerts[:limit]
    return alerts

@app.get("/reports/latest")
def get_latest_report():
    return {
        "periodAndLand": "May 2025 · North Greenhouse",
        "completeness": 84,
        "summary": "12 diagnoses · 18 irrigation events · 4 notes"
    }

# =====================================================
# LANDS ENDPOINTS
# =====================================================
@app.get("/lands")
def get_lands(
    limit: int | None = None,
    engineer_id: int | None = None,
    engineer_email: str | None = None,
    db: Session = Depends(get_db)
):
    seed_initial_data_if_empty(db)
    query = db.query(Land).order_by(Land.id.desc())

    if engineer_id:
        query = query.filter(Land.engineer_id == engineer_id)
    elif engineer_email:
        eng = db.query(User).filter(User.email == engineer_email).first()
        if eng:
            query = query.filter((Land.engineer_id == eng.id) | (Land.engineer == eng.name))

    if limit:
        return query.limit(limit).all()
    return query.all()

@app.post("/lands")
def create_land(land_data: CreateLandRequest, db: Session = Depends(get_db)):
    eng_user = db.query(User).filter(User.name == land_data.engineer, User.role.in_(ENGINEER_ROLES)).first()
    new_land = Land(
        **land_data.model_dump(),
        engineer_id=eng_user.id if eng_user else None
    )
    db.add(new_land)
    db.commit()
    db.refresh(new_land)
    return new_land

@app.delete("/lands/{land_id}")
def delete_land(land_id: int, db: Session = Depends(get_db)):
    land = db.query(Land).filter(Land.id == land_id).first()
    if not land:
        raise HTTPException(status_code=404, detail="Land not found")
    db.delete(land)
    db.commit()
    return {"message": "Land deleted successfully"}

# =====================================================
# ENGINEERS ENDPOINTS
# =====================================================
@app.get("/engineers")
def get_engineers(db: Session = Depends(get_db)):
    seed_initial_data_if_empty(db)
    engineers = db.query(User).filter(User.role.in_(ENGINEER_ROLES)).order_by(User.id.desc()).all()
    all_lands = db.query(Land).all()

    result = []
    for eng in engineers:
        assigned_lands = [
            {
                "id": l.id,
                "name": l.name,
                "crop_type": l.crop_type,
                "status": l.status,
                "device": l.device
            }
            for l in all_lands
            if l.engineer_id == eng.id or (l.engineer and l.engineer.lower() == eng.name.lower())
        ]
        result.append({
            "id": eng.id,
            "name": eng.name,
            "email": eng.email,
            "phone": eng.phone or "N/A",
            "specialization": eng.specialization or "Crop & Soil Management",
            "status": eng.status or "Active",
            "assigned_lands": assigned_lands
        })
    return result

@app.post("/engineers")
def create_engineer(data: CreateEngineerRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered.")

    new_eng = User(
        name=data.name.strip(),
        email=data.email.strip(),
        hashed_password=hash_password(data.password),
        phone=data.phone.strip(),
        role="agricultural_engineer",
        specialization=data.specialization,
        status=data.status
    )
    db.add(new_eng)
    db.commit()
    db.refresh(new_eng)

    if data.land_ids:
        selected_lands = db.query(Land).filter(Land.id.in_(data.land_ids)).all()
        for land in selected_lands:
            land.engineer_id = new_eng.id
            land.engineer = new_eng.name
        db.commit()

    return {
        "message": "Engineer registered and assigned to lands successfully",
        "id": new_eng.id,
        "name": new_eng.name,
        "email": new_eng.email
    }

@app.delete("/engineers/{engineer_id}")
def delete_engineer(engineer_id: int, db: Session = Depends(get_db)):
    eng = db.query(User).filter(User.id == engineer_id, User.role.in_(ENGINEER_ROLES)).first()
    if not eng:
        raise HTTPException(status_code=404, detail="Engineer not found")

    assigned_lands = db.query(Land).filter(
        (Land.engineer_id == eng.id) | (Land.engineer == eng.name)
    ).all()
    for land in assigned_lands:
        land.engineer_id = None
        land.engineer = "Unassigned"

    db.delete(eng)
    db.commit()
    return {"message": "Engineer removed successfully"}

# =====================================================
# FARMERS ENDPOINTS
# =====================================================
@app.get("/farmers")
def get_farmers(db: Session = Depends(get_db)):
    seed_initial_data_if_empty(db)
    farmers = (
        db.query(User)
        .filter(User.role.in_(FIELD_WORKER_ROLES))
        .order_by(User.id.desc())
        .all()
    )
    lands_map = {l.id: l for l in db.query(Land).all()}

    result = []
    for f in farmers:
        land_obj = lands_map.get(f.assigned_land_id)
        result.append({
            "id": f.id,
            "name": f.name,
            "email": f.email,
            "phone": f.phone or "N/A",
            "task_role": f.specialization or "Field Operations",
            "status": f.status or "Active",
            "assigned_land_id": f.assigned_land_id,
            "land_name": land_obj.name if land_obj else "Unassigned",
            "land_location": land_obj.location if land_obj else "—",
            "land_crop": land_obj.crop_type if land_obj else "—",
            "supervisor_engineer": land_obj.engineer if land_obj else "—",
        })
    return result

@app.post("/farmers")
def create_farmer(data: CreateFarmerRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == data.email.strip()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered.")

    new_farmer = User(
        name=data.name.strip(),
        email=data.email.strip(),
        hashed_password=hash_password(data.password),
        phone=data.phone.strip(),
        role="farmer",
        specialization=data.specialization,
        status=data.status,
        assigned_land_id=data.assigned_land_id,
    )
    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)

    return {
        "message": "Farmer registered successfully",
        "id": new_farmer.id,
        "name": new_farmer.name,
        "email": new_farmer.email,
    }

@app.delete("/farmers/{farmer_id}")
def delete_farmer(farmer_id: int, db: Session = Depends(get_db)):
    farmer = (
        db.query(User)
        .filter(User.id == farmer_id, User.role.in_(FIELD_WORKER_ROLES))
        .first()
    )
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    db.delete(farmer)
    db.commit()
    return {"message": "Farmer removed successfully"}

# =====================================================
# PLANT PREDICTION
# =====================================================
@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    lang: str = Form("en"),
    current_user: User = Depends(get_current_user)
):
    contents = await file.read()
    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    predicted_class, confidence = predict_plant(image)
    parts = predicted_class.split("___")
    plant = parts[0].replace("_", " ").strip()
    condition = parts[1].replace("_", " ").strip() if len(parts) > 1 else "Unknown"
    healthy = "healthy" in condition.lower()

    if confidence >= 0.90:
        confidence_level = "Very High"
    elif confidence >= 0.75:
        confidence_level = "High"
    elif confidence >= 0.60:
        confidence_level = "Medium"
    else:
        confidence_level = "Low"

    if confidence < 0.60:
        recommendation = {
            "path": "uncertain",
            "message": "The model is not confident enough. Please upload a clearer image.",
            "actions": [
                "Take a clear picture of the affected leaf.",
                "Make sure the leaf is well illuminated.",
                "Avoid blurry or distant images."
            ]
        }
    elif healthy:
        recommendation = {
            "status": "healthy",
            "message": "The plant appears to be healthy.",
            "actions": [
                "Continue regular monitoring.",
                "Maintain appropriate irrigation.",
                "Monitor the plant for new symptoms."
            ]
        }
    else:
        recommendation = get_recommendation(predicted_class, lang=lang)

    return {
        "user": current_user.name,
        "plant": plant,
        "condition": condition,
        "confidence": round(confidence * 100, 2),
        "confidence_level": confidence_level,
        "healthy": healthy,
        "recommendation": recommendation
    }

# =====================================================
# AI AGRICULTURAL ASSISTANT - RAG
# =====================================================
@app.post("/chat")
async def chat(
    message: str = Form(...),
    images: list[UploadFile] | None = File(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not message.strip() and not images:
        raise HTTPException(
            status_code=400,
            detail="Please provide a message or an image."
        )

    query_text = message.strip()
    detected_plant = None
    detected_condition = None

    for uploaded_file in images or []:
        try:
            contents = await uploaded_file.read()
            if contents:
                image = Image.open(io.BytesIO(contents)).convert("RGB")
                predicted_class, conf = predict_plant(image)
                parts = predicted_class.split("___")
                detected_plant = parts[0].replace("_", " ").strip()
                detected_condition = parts[1].replace("_", " ").strip() if len(parts) > 1 else "Unknown"
                if not query_text:
                    query_text = f"حلل حالة نبات {detected_plant} المصاب بـ {detected_condition}."
                break
        except Exception as img_err:
            print(f"Image analysis warning: {img_err}")

    if not query_text:
        query_text = "ما هي التوصيات الزراعية العامة للمحافظة على المحصول؟"

    try:
        response = generate_rag_answer(
            query=query_text,
            plant=detected_plant,
            condition=detected_condition,
            top_k=3
        )

        answer_text = (
            response.get("answer")
            if isinstance(response, dict)
            else str(response)
        )
        sources_list = (
            response.get("sources", [])
            if isinstance(response, dict)
            else []
        )

        return {
            "user": current_user.name,
            "answer": answer_text,
            "sources": sources_list,
        }

    except Exception as e:
        print(f"RAG error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"حدث خطأ أثناء توليد الإجابة: {str(e)}"
        )

# =====================================================
# PLANTS DETAILS & TIMELINE REPORTS ENDPOINTS
# =====================================================
@app.get("/api/plants/{plant_id}")
def get_plant_details(
    plant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    
    reports_list = [
        {
            "id": r.id,
            "image": r.image_url,
            "image_url": r.image_url,
            "condition": r.condition,
            "health_status": r.health_status,
            "ai_response": r.ai_response,
            "symptoms": r.symptoms,
            "actions": r.actions,
            "prevention": r.prevention,
            "date": r.date
        }
        for r in plant.reports
    ]

    return {
        "id": plant.id,
        "name": plant.name,
        "crop_type": plant.crop_type,
        "growth_stage": plant.growth_stage,
        "soil_type": plant.soil_type,
        "soil_ph": plant.soil_ph,
        "watering_schedule": plant.watering_schedule,
        "image": plant.image,
        "reports": reports_list
    }

@app.post("/api/plants/{plant_id}/reports")
@app.post("/api/plants/{plant_id}/reports/")
def save_plant_report(
    plant_id: int,
    report_data: PlantReportRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        plant = Plant(
            id=plant_id,
            name=f"Plant #{plant_id}",
            crop_type=str(report_data.condition or "Tomato"),
            owner_id=current_user.id
        )
        db.add(plant)
        db.commit()
        db.refresh(plant)

    def format_field(val):
        if isinstance(val, list):
            return ", ".join(str(v) for v in val)
        return str(val) if val is not None else ""

    new_report = PlantReport(
        plant_id=plant.id,
        image_url=format_field(report_data.image_url),
        condition=format_field(report_data.condition),
        health_status=format_field(report_data.health_status),
        ai_response=format_field(report_data.ai_response),
        symptoms=format_field(report_data.symptoms),
        actions=format_field(report_data.actions),
        prevention=format_field(report_data.prevention),
        date=format_field(report_data.date) or datetime.now().strftime("%Y-%m-%d %H:%M")
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return {"message": "تم حفظ التقرير بنجاح في الخط الزمني", "report_id": new_report.id}
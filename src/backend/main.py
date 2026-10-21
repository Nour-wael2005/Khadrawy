# المسار: src/backend/main.py
# =====================================================
# KHADRWY - AI AGRICULTURAL SYSTEM
# =====================================================
from ..data.mock_users import MOCK_USERS
from ..data.mock_lands import MOCK_LANDS
from ..data.mock_plants import MOCK_MY_PLANTS

from sqlalchemy import inspect, text
from fastapi import (
    FastAPI,
    File,
    UploadFile,
    Depends,
    HTTPException
)
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import timedelta
from threading import Lock

# =====================================================
# PROJECT IMPORTS
# =====================================================
from .model import predict_plant
from .recommendations import get_recommendation
from .database import Base, engine, get_db
from .user_model import User, Land
from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from .rag.generator import generate_rag_answer

# Accept legacy role values already stored in existing SQLite databases.
ENGINEER_ROLES = ("engineer", "agricultural_engineer")
FIELD_WORKER_ROLES = ("farmer", "gardener")

# =====================================================
# DATABASE INITIALIZATION & AUTO-MIGRATION
# =====================================================
def ensure_all_tables_updated():
    """يتأكد تلقائياً أن جداول users و lands تحتوي على كل الأعمدة المطلوبة بدون أخطاء"""
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

# =====================================================
# APP & CORS
# =====================================================
app = FastAPI(
    title="Khadrwy AI",
    description="AI Plant Disease Detection, Recommendation & Agricultural Assistant API"
)

# Get mock users, with optional role filter
@app.get("/api/mock/users")
def get_mock_users(role: str | None = None):
    users = MOCK_USERS

    if role:
        users = [user for user in users if user["role"] == role]

    # Never return password fields to the frontend
    return [
        {key: value for key, value in user.items()
         if key != "hashed_password"}
        for user in users
    ]


# Get mock lands, with optional engineer filter
@app.get("/api/mock/lands")
def get_mock_lands(engineer_id: int | None = None):
    lands = MOCK_LANDS

    if engineer_id is not None:
        lands = [
            land for land in lands
            if land["engineer_id"] == engineer_id
        ]

    return lands


# Get mock plants for a specific gardener
@app.get("/api/mock/plants")
def get_mock_plants(gardener_id: int | None = None):
    plants = MOCK_MY_PLANTS

    if gardener_id is not None:
        plants = [
            plant for plant in plants
            if plant["gardener_id"] == gardener_id
        ]

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

# =====================================================
# INITIAL SEED DATA (Engineers, Lands, Farmers)
# =====================================================
# Prevent two simultaneous requests from inserting the same default records.
_seed_lock = Lock()


def seed_initial_data_if_empty(db: Session):
    """Create the legacy demo records once, without duplicate-email inserts."""
    with _seed_lock:
        # Only seed the legacy engineers when the database has no engineer role.
        if db.query(User).filter(User.role.in_(ENGINEER_ROLES)).count() == 0:
            engineer_specs = [
                ("Omar El-Sayed", "omar@khadrwy.com", "01012345678", "Greenhouse & Irrigation"),
                ("Nour Hassan", "nour@khadrwy.com", "01123456789", "Plant Pathology & Soil"),
                ("Salma Amin", "salma@khadrwy.com", "01234567890", "Orchard & Citrus Systems"),
            ]
            engineers_by_email = {}
            for name, email, phone, specialization in engineer_specs:
                # Check by unique email too: a legacy row may have a newer role value.
                user = db.query(User).filter(User.email == email).first()
                if user is None:
                    user = User(
                        name=name,
                        email=email,
                        hashed_password=hash_password("123456"),
                        phone=phone,
                        role="engineer",
                        specialization=specialization,
                        status="Active",
                    )
                    db.add(user)
                    db.flush()
                engineers_by_email[email] = user
            db.commit()
            for user in engineers_by_email.values():
                db.refresh(user)

            # Preserve any land that already exists. Seed the legacy trio only
            # when the entire lands table is empty.
            if db.query(Land).count() == 0:
                default_lands = [
                    ("Orchard Block C", "Citrus", "Fruiting", "Sandy", 30, 65, "Manual", "salma@khadrwy.com", "Not connected", "Setup required"),
                    ("Olive Field East", "Olives", "Flowering", "Clay Loam", 28, 60, "Timer", "nour@khadrwy.com", "Online", "Attention"),
                    ("North Greenhouse", "Tomato", "Vegetative", "Loamy", 35, 70, "Auto", "omar@khadrwy.com", "Online", "Healthy"),
                ]
                for name, crop, stage, soil, turn_on, turn_off, mode, email, device, status in default_lands:
                    eng = engineers_by_email.get(email)
                    db.add(Land(
                        name=name,
                        location="Giza, Egypt",
                        engineer=eng.name if eng else "Unassigned",
                        engineer_id=eng.id if eng else None,
                        device=device,
                        status=status,
                        crop_type=crop,
                        growth_stage=stage,
                        soil_type=soil,
                        turn_on_below=turn_on,
                        turn_off_above=turn_off,
                        operation_mode=mode,
                    ))
                db.commit()

        # Only seed these legacy field workers when there are none. Email checks
        # prevent UNIQUE violations if a row exists with an older role value.
        if db.query(User).filter(User.role.in_(FIELD_WORKER_ROLES)).count() == 0:
            field_worker_specs = [
                ("Mahmoud Ibrahim", "mahmoud.farmer@khadrwy.com", "01098765432", "Irrigation & Pump Operator", "North Greenhouse"),
                ("Hassan Ali", "hassan.farmer@khadrwy.com", "01187654321", "Harvesting & Pruning", "Olive Field East"),
                ("Saeed Abdel-Rahman", "saeed.farmer@khadrwy.com", "01276543210", "Soil & Fertilizer Application", "Orchard Block C"),
            ]
            for name, email, phone, specialization, land_name in field_worker_specs:
                if db.query(User).filter(User.email == email).first():
                    continue
                land = db.query(Land).filter(Land.name == land_name).first()
                db.add(User(
                    name=name,
                    email=email,
                    hashed_password=hash_password("123456"),
                    phone=phone,
                    role="gardener",
                    specialization=specialization,
                    status="Active",
                    assigned_land_id=land.id if land else None,
                ))
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
        {
            "id": 1,
            "type": "moisture",
            "title": "Low soil moisture",
            "location": "Olive Field East",
            "time": "18 min ago"
        },
        {
            "id": 2,
            "type": "sensor",
            "title": "Sensor needs attention",
            "location": "North field",
            "time": "1 hour ago"
        },
        {
            "id": 3,
            "type": "diagnosis",
            "title": "Diagnosis follow-up",
            "location": "Tomato crop",
            "time": "Yesterday"
        },
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
    # لو المهندس المختار موجود في الداتابيز، نربط الـ engineer_id بتاعه كمان
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
        recommendation = get_recommendation(predicted_class)

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
def chat(
    chat_data: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    if not chat_data.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    try:
        response = generate_rag_answer(chat_data.message)
        answer_text = response.get("answer") if isinstance(response, dict) else str(response)
        sources_list = response.get("sources", []) if isinstance(response, dict) else []

        return {
            "user": current_user.name,
            "answer": answer_text,
            "sources": sources_list
        }
    except Exception as e:
        print(f"RAG Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"حدث خطأ أثناء توليد الإجابة من الذكاء الاصطناعي: {str(e)}"
        )

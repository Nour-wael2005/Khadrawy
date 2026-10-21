# =====================================================
# KHADRWY - AI AGRICULTURAL SYSTEM
# =====================================================

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

# =====================================================
# DATABASE
# =====================================================
Base.metadata.create_all(bind=engine)

# =====================================================
# APP
# =====================================================
app = FastAPI(
    title="Khadrwy AI",
    description="AI Plant Disease Detection, Recommendation & Agricultural Assistant API"
)

# =====================================================
# CORS
# =====================================================
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
    crop_type: str
    growth_stage: str
    soil_type: str
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

# =====================================================
# HOME
# =====================================================
@app.get("/")
def home():
    return {"message": "Khadrwy AI API is running!"}

# =====================================================
# REGISTER
# =====================================================
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

# =====================================================
# LOGIN
# =====================================================
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

# =====================================================
# RESET PASSWORD
# =====================================================
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
# SEED INITIAL DATA (Lands & Engineers)
# =====================================================
def seed_initial_data_if_empty(db: Session):
    if db.query(User).filter(User.role == "engineer").count() == 0:
        eng1 = User(
            name="Omar El-Sayed",
            email="omar@khadrwy.com",
            hashed_password=hash_password("123456"),
            phone="01012345678",
            role="engineer",
            specialization="Greenhouse & Irrigation",
            status="Active"
        )
        eng2 = User(
            name="Nour Hassan",
            email="nour@khadrwy.com",
            hashed_password=hash_password("123456"),
            phone="01123456789",
            role="engineer",
            specialization="Plant Pathology & Soil",
            status="Active"
        )
        eng3 = User(
            name="Salma Amin",
            email="salma@khadrwy.com",
            hashed_password=hash_password("123456"),
            phone="01234567890",
            role="engineer",
            specialization="Orchard & Citrus Systems",
            status="Active"
        )
        db.add_all([eng1, eng2, eng3])
        db.commit()
        db.refresh(eng1)
        db.refresh(eng2)
        db.refresh(eng3)

        if db.query(Land).count() == 0:
            initial_lands = [
                Land(
                    name="Orchard Block C",
                    location="Giza, Egypt",
                    engineer=eng3.name,
                    engineer_id=eng3.id,
                    device="Not connected",
                    status="Setup required",
                    crop_type="Citrus",
                    growth_stage="Fruiting",
                    soil_type="Sandy",
                    turn_on_below=30,
                    turn_off_above=65,
                    operation_mode="Manual",
                ),
                Land(
                    name="Olive Field East",
                    location="Giza, Egypt",
                    engineer=eng2.name,
                    engineer_id=eng2.id,
                    device="Online",
                    status="Attention",
                    crop_type="Olives",
                    growth_stage="Flowering",
                    soil_type="Clay Loam",
                    turn_on_below=28,
                    turn_off_above=60,
                    operation_mode="Timer",
                ),
                Land(
                    name="North Greenhouse",
                    location="Giza, Egypt",
                    engineer=eng1.name,
                    engineer_id=eng1.id,
                    device="Online",
                    status="Healthy",
                    crop_type="Tomato",
                    growth_stage="Vegetative",
                    soil_type="Loamy",
                    turn_on_below=35,
                    turn_off_above=70,
                    operation_mode="Auto",
                ),
            ]
            db.add_all(initial_lands)
            db.commit()

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
    new_land = Land(**land_data.model_dump())
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
# DASHBOARD & STATS
# =====================================================
@app.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    seed_initial_data_if_empty(db)
    lands_count = db.query(Land).count()
    engineers_count = db.query(User).filter(User.role == "engineer").count()
    farmers_count = db.query(User).filter(User.role.in_(["gardener", "farmer"])).count()

    return {
        "total_lands": lands_count,
        "lands_sub": "+2 this season",
        "total_engineers": engineers_count,
        "engineers_sub": "All accounts active",
        "total_farmers": farmers_count if farmers_count > 0 else 24,
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
# ENGINEERS ENDPOINTS
# =====================================================
@app.get("/engineers")
def get_engineers(db: Session = Depends(get_db)):
    seed_initial_data_if_empty(db)
    engineers = db.query(User).filter(User.role == "engineer").order_by(User.id.desc()).all()
    all_lands = db.query(Land).all()

    result = []
    for eng in engineers:
        assigned_lands = [
            {"id": l.id, "name": l.name, "crop_type": l.crop_type, "status": l.status, "device": l.device}
            for l in all_lands
            if l.engineer_id == eng.id or l.engineer.lower() == eng.name.lower()
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
        name=data.name,
        email=data.email,
        hashed_password=hash_password(data.password),
        phone=data.phone,
        role="engineer",
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
        "message": "Engineer registered and assigned successfully",
        "id": new_eng.id,
        "name": new_eng.name,
        "email": new_eng.email
    }

@app.delete("/engineers/{engineer_id}")
def delete_engineer(engineer_id: int, db: Session = Depends(get_db)):
    eng = db.query(User).filter(User.id == engineer_id, User.role == "engineer").first()
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
            "actions": ["Take a clear picture of the affected leaf.", "Make sure the leaf is well illuminated."]
        }
    elif healthy:
        recommendation = {
            "status": "healthy",
            "message": "The plant appears to be healthy.",
            "actions": ["Continue regular monitoring.", "Maintain appropriate irrigation."]
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
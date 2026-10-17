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
from .user_model import User
from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

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

class ResetPasswordRequest(BaseModel):
    identifier: str  # البريد الإلكتروني أو رقم الهاتف
    new_password: str
    
# =====================================================
# HOME
# =====================================================
@app.get("/")
def home():
    return {
        "message": "Khadrwy AI API is running!"
    }

# =====================================================
# AUTH SCHEMAS
# =====================================================
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: str | None = None
    role: str = "gardener"

class LoginRequest(BaseModel):
    identifier: str
    password: str

# =====================================================
# RAG CHAT SCHEMA
# =====================================================
class ChatRequest(BaseModel):
    message: str
    plant: str | None = None
    condition: str | None = None
    confidence: float | None = None

# =====================================================
# REGISTER
# =====================================================
@app.post("/register")
def register(user_data: RegisterRequest, db: Session = Depends(get_db)):
    # 1. التأكد أن الإيميل مش مسجل قبل كده
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="البريد الإلكتروني مستخدم بالفعل")

    # 2. تشفير كلمة المرور
    hashed_password = hash_password(user_data.password)

    # 3. إنشاء المستخدم الجديد وحفظه
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
    # البحث عن المستخدم إما بالـ email أو الـ phone
    user = db.query(User).filter(
        (User.email == user_data.identifier) | (User.phone == user_data.identifier)
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="البيانات المدخلة أو كلمة المرور غير صحيحة")

    if not verify_password(user_data.password, user.hashed_password):
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
            "status": "uncertain",
            "message": "The model is not confident enough. Please upload a clearer image.",
            "actions": ["Take a clear picture of the affected leaf.", "Make sure the leaf is well illuminated.", "Avoid blurry or distant images."]
        }
    elif healthy:
        recommendation = {
            "status": "healthy",
            "message": "The plant appears to be healthy.",
            "actions": ["Continue regular monitoring.", "Maintain appropriate irrigation.", "Monitor the plant for new symptoms."]
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
# AI AGRICULTURAL ASSISTANT - RAG (Temporary Placeholder)
# =====================================================
@app.post("/chat")
def chat(
    chat_data: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    if not chat_data.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # مؤقتاً لحد ما نفعل الـ RAG تماماً
    return {
        "user": current_user.name,
        "answer": "عذراً، مساعد الذكاء الاصطناعي قيد التحديث حالياً.",
        "sources": []
    }
    
    
    
    # =====================================================
# RESET PASSWORD
# =====================================================
@app.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    # البحث عن المستخدم بالبريد أو الهاتف
    user = db.query(User).filter(
        (User.email == data.identifier) | (User.phone == data.identifier)
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="المستخدم غير موجود")

    # تشفير كلمة المرور الجديدة
    user.hashed_password = hash_password(data.new_password)
    
    db.commit()
    db.refresh(user)

    return {
        "message": "تم تحديث كلمة المرور بنجاح"
    }
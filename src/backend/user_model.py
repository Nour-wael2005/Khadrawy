from sqlalchemy import Column, Integer, String, ForeignKey
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)                    # الاسم الحقيقي (اللي هيظهر في الناف بار)
    email = Column(String, unique=True, index=True, nullable=False) # الإيميل (الأساسي لتسجيل الدخول)
    hashed_password = Column(String, nullable=False)          # كلمة المرور المشفرة
    role = Column(String, nullable=False, default="gardener") # landowner, engineer, farmer, gardener
    phone = Column(String, nullable=True)                     # رقم التليفون
    national_id = Column(String, nullable=True)               # الرقم القومي (للمهندس والفلاح)
    landowner_id = Column(Integer, ForeignKey("users.id"), nullable=True) # ربط المهندس/الفلاح بصاحب الأرض
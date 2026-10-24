import sys
import os

# إضافة مجلد الباك إند لمسار بايثون لتجنب أي مشاكل في الاستيراد
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from user_model import User
from auth import hash_password

# حذف القديم وإنشاء قاعدة بيانات جديدة ونظيفة
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)
db = SessionLocal()

fake_accounts = [
    {"name": "Ahmed", "email": "landowner@khadrawy.com", "phone": "01011111111", "password": "Password123@", "role": "landowner"},
    {"name": "Mahmoud", "email": "engineer@khadrawy.com", "phone": "01022222222", "password": "Password123@", "role": "engineer"},
    {"name": "Saeed", "email": "farmer@khadrawy.com", "phone": "01033333333", "password": "Password123@", "role": "farmer"},
    {"name": "Sayed", "email": "gardener@khadrawy.com", "phone": "01044444444", "password": "Password123@", "role": "gardener"},
    {"name": "Nour", "email": "nour@khadrwy.com", "phone": "01099999999", "password": "Password123@", "role": "gardener"},
    {"name": "Sama", "email": "sama@khadrwy.com", "phone": "01088888888", "password": "Password123@", "role": "gardener"},
]

for acc in fake_accounts:
    new_user = User(
        name=acc["name"],
        email=acc["email"],
        phone=acc["phone"],
        hashed_password=hash_password(acc["password"]),
        role=acc["role"]
    )
    db.add(new_user)
    print(f"✅ تم إضافة: {acc['email']} برول: {acc['role']}")

db.commit()
db.close()
print("🎉 تم إنشاء قاعدة البيانات والحسابات بنجاح في مكانها الصحيح!")
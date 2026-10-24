# المسار: src/backend/auth.py
# =====================================================
# KHADRWY - AUTHENTICATION (Real Database & JWT)
# =====================================================

from datetime import datetime, timedelta, timezone
import os

import bcrypt
from jose import JWTError, jwt

from dotenv import load_dotenv

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy.orm import Session

try:
    from .database import get_db
    from .user_model import User
except ImportError:
    from database import get_db
    from user_model import User


# =====================================================
# ENVIRONMENT
# =====================================================

load_dotenv()


# =====================================================
# JWT CONFIG
# =====================================================

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError(
        "SECRET_KEY is not configured in .env"
    )

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# =====================================================
# PASSWORD HASHING
# =====================================================

def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    hashed = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt()
    )
    return hashed.decode("utf-8")


# =====================================================
# PASSWORD VERIFICATION
# =====================================================

def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return bcrypt.checkpw(
        plain_password.encode("utf-8"),
        hashed_password.encode("utf-8")
    )


# =====================================================
# HTTP BEARER
# =====================================================

security = HTTPBearer()


# =====================================================
# CREATE ACCESS TOKEN
# =====================================================

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None
):
    to_encode = data.copy()

    if expires_delta:
        expire = (
            datetime.now(timezone.utc)
            + expires_delta
        )
    else:
        expire = (
            datetime.now(timezone.utc)
            + timedelta(minutes=15)
        )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# =====================================================
# GET CURRENT USER (التحقق الحقيقي من الـ JWT في الداتابيز)
# =====================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    if not credentials:
        raise credentials_exception

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if username is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    # البحث عن المستخدم الحقيقي في قاعدة البيانات باستخدام البريد الإلكتروني الوارد في الـ Token
    user = (
        db.query(User)
        .filter(
            User.email == username
        )
        .first()
    )

    if user is None:
        raise credentials_exception

    return user


# =====================================================
# CREATE ACCESS TOKEN
# =====================================================

def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None
):

    to_encode = data.copy()

    if expires_delta:

        expire = (
            datetime.now(timezone.utc)
            + expires_delta
        )

    else:

        expire = (
            datetime.now(timezone.utc)
            + timedelta(minutes=15)
        )

    to_encode.update({
        "exp": expire
    })

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


# =====================================================
# GET CURRENT USER
# =====================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    ),
    db: Session = Depends(get_db)
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if username is None:
            raise credentials_exception

    except JWTError:

        raise credentials_exception

    user = (
        db.query(User)
        .filter(
            User.email == username  # هنا بنستقبل الإيميل في الـ sub بتاع التوكن
        )
        .first()
    )

    if user is None:
        raise credentials_exception

    return user
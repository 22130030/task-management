import os
import jwt

from datetime import datetime, timedelta, timezone
from pwdlib import PasswordHash
from fastapi import Depends, HTTPException
from fastapi.security import (HTTPBearer,HTTPAuthorizationCredentials)
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User


SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "dev-secret-key-change-this-later"
)

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


password_hash = PasswordHash.recommended()
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get("type") != "access":
            raise HTTPException(
                status_code=401,
                detail="Invalid access token"
            )

        user_id = int(payload.get("sub"))

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Access token expired"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid access token"
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user


def verify_password(
    plain_password: str,
    hashed_password: str
):
    return password_hash.verify(
        plain_password,
        hashed_password
    )


def create_access_token(user_id: int):
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "type": "access",
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def create_refresh_token(user_id: int):
    expire = datetime.now(timezone.utc) + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )

    payload = {
        "sub": str(user_id),
        "type": "refresh",
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
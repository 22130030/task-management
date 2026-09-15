import jwt

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pwdlib import PasswordHash

from app.database import get_db
from app.models import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import LoginRequest, TokenResponse, RefreshRequest
from app.auth import (
    SECRET_KEY,
    ALGORITHM,
    verify_password,
    create_access_token,
    create_refresh_token
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

password_hash = PasswordHash.recommended()

# Đăng ký người dùng
@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed_password = password_hash.hash(
        user_data.password
    )

    user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

# Đang nhập
@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == login_data.email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Email or password is incorrect"
        )

    if not verify_password(
        login_data.password,
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Email or password is incorrect"
        )

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

# Refresh token
@router.post("/refresh")
def refresh_access_token(
    refresh_data: RefreshRequest,
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(
            refresh_data.refresh_token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token"
            )

        user_id = int(payload.get("sub"))

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Refresh token expired"
        )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token"
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

    new_access_token = create_access_token(user.id)

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }
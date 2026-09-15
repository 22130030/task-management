from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)
from sqlalchemy.orm import Session
from pwdlib import PasswordHash

from app.database import get_db
from app.models import User
from app.schemas.user import (UserResponse,UserUpdate,ChangePassword)
from app.auth import (get_current_user, verify_password, password_hash)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.put(
    "/me",
    response_model=UserResponse
)

def update_profile(
    user_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_email = (
        db.query(User)
        .filter(
            User.email == user_data.email,
            User.id != current_user.id
        )
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    current_user.username = user_data.username
    current_user.email = user_data.email

    db.commit()
    db.refresh(current_user)

    return current_user

@router.put("/me/password")
def change_password(
    password_data: ChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not verify_password(
        password_data.current_password,
        current_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )

    if len(password_data.new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="New password must be at least 6 characters"
        )

    current_user.password = password_hash(
        password_data.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }


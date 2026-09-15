from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    model_config = {
        "from_attributes": True
    }

# Sửa thông tin cá nhân
class UserUpdate(BaseModel):
    username: str
    email: EmailStr


# Đổi mật khẩu
class ChangePassword(BaseModel):
    current_password: str
    new_password: str
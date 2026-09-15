from sqlalchemy import Column, BigInteger, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True)
    username = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    tasks = relationship(
        "Task",
        back_populates="user",
        cascade="all, delete-orphan"
    )
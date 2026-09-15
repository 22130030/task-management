from sqlalchemy import (
    Column,
    BigInteger,
    String,
    Text,
    DateTime,
    ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(BigInteger, primary_key=True)

    user_id = Column(
        BigInteger,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="TODO")
    priority = Column(String(20), default="MEDIUM")
    created_at = Column(DateTime, server_default=func.now())

    user = relationship(
        "User",
        back_populates="tasks"
    )
# app/models.py
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Enum, Boolean, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class SeriousnessLevel(PyEnum):
    SLIP = "slip"
    STUMBLE = "stumble"
    BLUNDER = "blunder"
    CRISIS = "crisis"
    CATASTROPHE = "catastrophe"

class MistakeCategory(Base):
    __tablename__ = "mistake_categories"
    
    mistake_id = Column(Integer, ForeignKey('mistakes.id', ondelete="CASCADE"), primary_key=True)
    category_id = Column(Integer, ForeignKey('categories.id', ondelete="CASCADE"), primary_key=True)
    
    # Relationships
    mistake = relationship("Mistake", back_populates="category_associations")
    category = relationship("Category", back_populates="mistake_associations")
    
    __table_args__ = (
        Index('idx_mistake_category', 'mistake_id', 'category_id'),
    )

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    color = Column(String(20))
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Updated relationships
    mistake_associations = relationship("MistakeCategory", back_populates="category")
    mistakes = relationship(
        "Mistake", 
        secondary="mistake_categories",
        back_populates="categories",
        viewonly=True
    )

class Mistake(Base):
    __tablename__ = "mistakes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    count = Column(Integer, default=1)
    seriousness = Column(Enum(SeriousnessLevel), default=SeriousnessLevel.SLIP)
    last_occurred_at = Column(DateTime(timezone=True), server_default=func.now())
    is_relevant = Column(Boolean, default=True)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Updated relationships
    category_associations = relationship("MistakeCategory", back_populates="mistake")
    categories = relationship(
        "Category", 
        secondary="mistake_categories",
        back_populates="mistakes",
        viewonly=True
    )
    occurrences = relationship(
        "MistakeOccurrence", 
        back_populates="mistake", 
        cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index('idx_mistake_seriousness', 'seriousness'),
        Index('idx_mistake_relevance', 'is_relevant'),
    )

class MistakeOccurrence(Base):
    __tablename__ = "mistake_occurrences"
    
    id = Column(Integer, primary_key=True, index=True)
    mistake_id = Column(Integer, ForeignKey("mistakes.id", ondelete="CASCADE"))
    description = Column(Text, nullable=False)
    lesson = Column(Text)
    made_by = Column(String(100))
    is_archived = Column(Boolean, default=False)
    occurred_on = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    mistake = relationship("Mistake", back_populates="occurrences")

    __table_args__ = (
        Index('idx_occurrence_mistake', 'mistake_id'),
    )

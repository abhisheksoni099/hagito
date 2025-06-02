# app/schemas.py
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MistakeOccurrenceBase(BaseModel):
    comment: str

class MistakeOccurrenceCreate(MistakeOccurrenceBase):
    pass

class MistakeOccurrence(MistakeOccurrenceBase):
    id: int
    mistake_id: int
    created_at: datetime

    class Config:
        orm_mode = True

class MistakeCategoryLink(BaseModel):
    category_id: int

    class Config:
        orm_mode = True

class MistakeCreate(BaseModel):
    name: str = ''
    category_ids: List[int] = []
    seriousness: str = ''
    description: str = ''
    lesson: str = ''
    made_by: str = ''
    occurred_on: datetime = datetime.now()

class Mistake(BaseModel):
    id: int
    name: str
    count: int
    created_at: datetime
    updated_at: datetime
    categories: List['Category'] = []
    seriousness: str
    last_occurred_at: datetime

    class Config:
        orm_mode = True

class MistakeDetail(BaseModel):
    mistake: Mistake
    entries: List[MistakeOccurrence]

    class Config:
        orm_mode = True

class MistakeResponse(BaseModel):
    id: int
    name: str
    count: int
    created_at: datetime
    updated_at: datetime
    category_ids: List[int] = []
    seriousness: str
    last_occurred_at: datetime

    class Config:
        orm_mode = True

class PaginatedMistakes(BaseModel):
    total: int
    items: List[MistakeResponse]

class Message(BaseModel):
    message: str

class Category(BaseModel):
    id: int
    name: str
    color: str
    mistakes: List[Mistake] = []

    class Config:
        orm_mode = True

class CategoryCreate(BaseModel):
    name: str
    color: str

# app/main.py
from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
from database import SessionLocal, engine

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hagito")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# @app.get("/")
# def read_root():
#     return {"message": "Welcome to the Mistakes Tracker API"}

@app.post("/mistakes/", response_model=schemas.Mistake)
def create_mistake(mistake: schemas.MistakeCreate, db: Session = Depends(get_db)):
    # Check if mistake with the same name exists
    db_mistake = db.query(models.Mistake).filter(
        models.Mistake.name == mistake.name,
        models.Mistake.is_archived == False).first()
    if db_mistake:
        raise HTTPException(status_code=400, detail="Mistake already exists")
    # Create new mistake
    new_mistake = models.Mistake(
        name=mistake.name,
        count=1,
        seriousness=mistake.seriousness,
        last_occurred_at=mistake.occurred_on,
        is_relevant=True,
        is_archived=False
    )
    db.add(new_mistake)
    db.commit()
    db.refresh(new_mistake)

    # Add categories if provided
    if mistake.category_ids:
        # Verify all categories exist
        existing_categories = db.query(models.Category).filter(
            models.Category.id.in_(mistake.category_ids),
            models.Category.is_archived == False
        ).all()
        
        if len(existing_categories) != len(mistake.category_ids):
            raise HTTPException(
                status_code=404,
                detail="One or more categories not found"
            )
        
        # Create category associations
        for category in existing_categories:
            db.add(models.MistakeCategory(
                mistake_id=new_mistake.id,
                category_id=category.id
            ))
        db.commit()

    # Create first occurrence
    new_mistake_occurrence = models.MistakeOccurrence(
        mistake_id=new_mistake.id,
        description=mistake.description,
        lesson=mistake.lesson,
        made_by=mistake.made_by,
        occurred_on=mistake.occurred_on
    )
    db.add(new_mistake_occurrence)
    db.commit()
    db.refresh(new_mistake)
    return new_mistake

@app.get("/mistakes/", response_model=schemas.PaginatedMistakes)
def read_mistakes(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    sort_by: str = Query("name", regex="^(name|count|date)$"),
    sort_dir: str = Query("asc", regex="^(asc|desc)$"),
    db: Session = Depends(get_db)
):
    # Determine sort column
    if sort_by == "name":
        sort_column = models.Mistake.name
    elif sort_by == "count":
        sort_column = models.Mistake.count
    elif sort_by == "date":
        sort_column = models.Mistake.created_at
    
    # Apply sort direction
    if sort_dir == "desc":
        sort_column = sort_column.desc()
    
    # Get total count for pagination
    total = db.query(models.Mistake).count()
    
    # Query with sorting and pagination
    mistakes = db.query(models.Mistake).filter(models.Mistake.is_archived == False).order_by(sort_column).offset(skip).limit(limit).all()
    category_ids = []
    for category in mistakes.categories:
      category_ids.append(category.id)
    mistakes_response = []
    for mistake in mistakes:
        mistakes_response.append(schemas.MistakeResponse(
            id=mistake.id,
            name=mistake.name,
            count=mistake.count,
            seriousness=mistake.seriousness,
            last_occurred_at=mistake.last_occurred_at,
            created_at=mistake.created_at,
            updated_at=mistake.updated_at,
            category_ids=category_ids
        ))
    return {"total": total, "items": mistakes_response}

@app.delete("/mistakes/{mistake_id}")
def delete_mistake(mistake_id: int, db: Session = Depends(get_db)):
    mistake = db.query(models.Mistake).filter(models.Mistake.id == mistake_id).first()
    if not mistake:
        raise HTTPException(status_code=404, detail="Mistake not found")
    mistake.is_archived = True
    db.commit()
    db.refresh(mistake)
    return {}

# @app.get("/mistakes/{mistake_id}", response_model=schemas.MistakeDetail)
# def read_mistake(mistake_id: int, db: Session = Depends(get_db)):
#     mistake = db.query(models.Mistake).filter(models.Mistake.id == mistake_id).first()
#     if not mistake:
#         raise HTTPException(status_code=404, detail="Mistake not found")
    
#     entries = db.query(models.MistakeOccurrence).filter(
#         models.MistakeOccurrence.mistake_id == mistake_id
#     ).order_by(models.MistakeOccurrence.created_at.desc()).all()
    
#     return {"mistake": mistake, "entries": entries}

# @app.put("/mistakes/{mistake_id}", response_model=schemas.Mistake)
# def increment_mistake(
#     mistake_id: int, 
#     entry: schemas.MistakeOccurrenceCreate, 
#     db: Session = Depends(get_db)
# ):
#     mistake = db.query(models.Mistake).filter(models.Mistake.id == mistake_id).first()
#     if not mistake:
#         raise HTTPException(status_code=404, detail="Mistake not found")
    
#     # Increment count
#     mistake.count += 1
#     db.commit()
#     db.refresh(mistake)
    
#     # Add new entry
#     new_entry = models.MistakeOccurrence(
#         mistake_id=mistake.id,
#         comment=entry.comment
#     )
#     db.add(new_entry)
#     db.commit()
    
#     return mistake

# @app.delete("/mistakes/{mistake_id}", response_model=schemas.Message)
# def delete_mistake(mistake_id: int, db: Session = Depends(get_db)):
#     mistake = db.query(models.Mistake).filter(models.Mistake.id == mistake_id).first()
#     if not mistake:
#         raise HTTPException(status_code=404, detail="Mistake not found")
    
#     # Delete related entries first (cascade should handle this, but being explicit)
#     db.query(models.MistakeOccurrence).filter(models.MistakeOccurrence.mistake_id == mistake_id).delete()
#     db.delete(mistake)
#     db.commit()
    
#     return {"message": f"Mistake '{mistake.name}' deleted successfully"}

@app.post("/categories/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.name == category.name).first()
    if db_category:
        if db_category.is_archived == True:
            db_category.is_archived = False
            db_category.color = category.color
            db.commit()
            db.refresh(db_category)
            return db_category
        raise HTTPException(status_code=500, detail="Category already exist")
    new_category = models.Category(
        name=category.name,
        color=category.color
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@app.put("/categories/{category_id}", response_model=schemas.Category)
def update_category(category_id: int, category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    db_category.name = category.name
    db_category.color = category.color
    db.commit()
    db.refresh(db_category)
    return db_category

@app.get("/categories/")
def read_categories(db: Session = Depends(get_db)):
    categories = db.query(models.Category).filter(models.Category.is_archived == False).order_by('name').all()
    return {"items": categories}

@app.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    mistakes = db.query(models.Mistake).filter(models.Mistake.categories.any(id=category_id)).all()
    if mistakes:
        raise HTTPException(status_code=500, detail="Category is in use")
    category.is_archived = True
    db.commit()
    db.refresh(category)
    return {}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from database import get_db
from models import MoodEntry, User
from schemas import MoodEntryCreate, MoodEntryResponse
from utils.auth import get_current_user

router = APIRouter(prefix="/entries", tags=["entries"])

@router.get("/", response_model=List[MoodEntryResponse])
def get_all_entries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(MoodEntry)\
             .filter(MoodEntry.owner_id == current_user.id)\
             .order_by(MoodEntry.created_at.desc())\
             .all()

@router.get("/last30", response_model=List[MoodEntryResponse])
def get_last_30_days(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    since = datetime.utcnow() - timedelta(days=30)
    return db.query(MoodEntry)\
             .filter(
                 MoodEntry.owner_id == current_user.id,
                 MoodEntry.created_at >= since
             )\
             .order_by(MoodEntry.created_at.desc())\
             .all()

@router.get("/last7", response_model=List[MoodEntryResponse])
def get_last_7_days(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    since = datetime.utcnow() - timedelta(days=7)
    return db.query(MoodEntry)\
             .filter(
                 MoodEntry.owner_id == current_user.id,
                 MoodEntry.created_at >= since
             )\
             .order_by(MoodEntry.created_at.desc())\
             .all()

@router.get("/export")
def export_entries_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from fastapi.responses import StreamingResponse
    import csv
    import io

    entries = db.query(MoodEntry)\
                .filter(MoodEntry.owner_id == current_user.id)\
                .order_by(MoodEntry.created_at.desc())\
                .all()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Date", "Mood", "Score", "Tags", "Note"])
    for e in entries:
        writer.writerow([
            e.created_at.strftime("%Y-%m-%d %H:%M"),
            e.mood_label,
            e.mood_score,
            e.tags,
            e.note
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=moodly_entries.csv"}
    )

@router.get("/{entry_id}", response_model=MoodEntryResponse)
def get_single_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = db.query(MoodEntry)\
              .filter(
                  MoodEntry.id == entry_id,
                  MoodEntry.owner_id == current_user.id
              ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return entry

@router.post("/", response_model=MoodEntryResponse)
def create_entry(
    entry: MoodEntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_entry = MoodEntry(
        **entry.model_dump(),
        owner_id=current_user.id
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

@router.delete("/{entry_id}")
def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    entry = db.query(MoodEntry)\
              .filter(
                  MoodEntry.id == entry_id,
                  MoodEntry.owner_id == current_user.id
              ).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(entry)
    db.commit()
    return {"message": "Entry deleted successfully"}
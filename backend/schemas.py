from pydantic import BaseModel, validator, EmailStr
from datetime import datetime
from typing import Optional, List

# ── User schemas ──────────────────────────────
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

    @validator("username")
    def username_valid(cls, v):
        if len(v) < 3:
            raise ValueError("Username must be at least 3 characters")
        if len(v) > 20:
            raise ValueError("Username must be under 20 characters")
        return v.strip()

    @validator("password")
    def password_valid(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v

class UserLogin(BaseModel):
    username: str
    password: str
    
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    user_id: int

class TokenData(BaseModel):
    user_id: Optional[int] = None

# ── Entry schemas ─────────────────────────────
class MoodEntryCreate(BaseModel):
    mood_score: int
    mood_label: str
    note: Optional[str] = ""
    tags: Optional[str] = ""

    @validator("mood_score")
    def score_must_be_valid(cls, v):
        if v < 1 or v > 5:
            raise ValueError("mood_score must be between 1 and 5")
        return v

    @validator("mood_label")
    def label_must_be_valid(cls, v):
        allowed = ["sad", "meh", "okay", "good", "great"]
        if v not in allowed:
            raise ValueError(f"mood_label must be one of {allowed}")
        return v

class MoodEntryResponse(BaseModel):
    id: int
    mood_score: int
    mood_label: str
    note: str
    tags: str
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True

# ── Insight schemas ───────────────────────────
class InsightItem(BaseModel):
    type: str
    text: str

class InsightsResponse(BaseModel):
    insights: List[InsightItem]
    message: Optional[str] = None
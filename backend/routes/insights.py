from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import MoodEntry, User
from datetime import datetime, timedelta
from utils.auth import get_current_user
import os
import json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/insights", tags=["insights"])

def build_prompt(entries):
    lines = []
    for e in entries:
        day = e.created_at.strftime("%A %d %b")
        lines.append(
            f"- {day}: mood={e.mood_label} ({e.mood_score}/5), "
            f"tags=[{e.tags}], note='{e.note[:100]}'"
        )
    return "\n".join(lines)

def detect_language(entries):
    for e in entries:
        for c in e.note:
            if 0x0B80 <= ord(c) <= 0x0BFF:
                return "tamil"
    combined = " ".join(e.note.lower() for e in entries)
    tanglish_words = ["romba", "illa", "iruku", "pannren", "paaru", "nalla",
                      "enna", "epdi", "adhigam", "konjam", "ippo", "vandha",
                      "solren", "theriyum", "poyitten", "vandhen", "irunthen"]
    if any(word in combined for word in tanglish_words):
        return "tanglish"
    return "english"

@router.get("/weekly")
def get_weekly_insights(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    since = datetime.utcnow() - timedelta(days=7)
    entries = db.query(MoodEntry)\
                .filter(
                    MoodEntry.created_at >= since,
                    MoodEntry.owner_id == current_user.id
                )\
                .order_by(MoodEntry.created_at.asc())\
                .all()

    if len(entries) < 2:
        return {
            "insights": [],
            "message": "Log at least 2 entries this week to unlock AI insights."
        }

    avg = round(sum(e.mood_score for e in entries) / len(entries), 1)
    best = max(entries, key=lambda e: e.mood_score)
    worst = min(entries, key=lambda e: e.mood_score)
    all_tags = [t.strip() for e in entries for t in e.tags.split(",") if t.strip()]
    top_tag = max(set(all_tags), key=all_tags.count) if all_tags else "general"
    high_mood_days = [e for e in entries if e.mood_score >= 4]
    low_mood_days = [e for e in entries if e.mood_score <= 2]
    lang = detect_language(entries)

    try:
        from openai import OpenAI
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=os.getenv("OPENROUTER_API_KEY"),
        )

        prompt = build_prompt(entries)

        response = client.chat.completions.create(
            model="openrouter/auto",
            messages=[
                {
                    "role": "system",
                    "content": """You are an empathetic mood journal analyst who understands English, Tamil, and Tanglish (Tamil mixed with English).

LANGUAGE RULES — follow strictly:
- If entries are mostly in Tamil → respond in Tamil
- If entries are mostly in Tanglish → respond in Tanglish
- If entries are mostly in English → respond in English
- If entries are mixed → respond in Tanglish

Always respond with raw JSON only. No markdown, no explanation, no code fences."""
                },
                {
                    "role": "user",
                    "content": f"""Analyze these mood journal entries from the past week.
Detect the language used in the entries (English / Tamil / Tanglish) and respond in that same language.
Return ONLY a raw JSON array with exactly 3 insight objects. No markdown, no code fences, just raw JSON.

Journal entries:
{prompt}

Return exactly this format:
[
  {{
    "type": "pattern",
    "text": "Write this in the same language as the journal entries"
  }},
  {{
    "type": "tip",
    "text": "Write this in the same language as the journal entries"
  }},
  {{
    "type": "alert",
    "text": "Write this in the same language as the journal entries"
  }}
]"""
                }
            ]
        )

        raw = response.choices[0].message.content.strip()
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()
        insights = json.loads(raw)
        return {"insights": insights}

    except Exception:
        # Smart fallback based on detected language
        if lang == "tamil":
            insights = [
                {
                    "type": "pattern",
                    "text": (
                        f"இந்த வாரம் உங்கள் சராசரி மனநிலை {avg}/5 ஆக இருந்தது. "
                        f"{best.created_at.strftime('%A')} அன்று நீங்கள் மிகவும் மகிழ்ச்சியாக "
                        f"({best.mood_label}) இருந்தீர்கள். "
                        f"{len(high_mood_days)} நல்ல நாட்கள் இருந்தன."
                    )
                },
                {
                    "type": "tip",
                    "text": (
                        f"'{top_tag}' tag அதிகமாக உள்ளது. "
                        f"{best.created_at.strftime('%A')} அன்று என்ன நடந்தது என்று யோசியுங்கள் "
                        f"— அதை மீண்டும் செய்ய முயற்சிக்கவும்."
                    )
                },
                {
                    "type": "alert",
                    "text": (
                        f"{worst.created_at.strftime('%A')} அன்று மனநிலை குறைவாக இருந்தது "
                        f"({worst.mood_label}, {worst.mood_score}/5). "
                        f"{'இந்த வாரம் ' + str(len(low_mood_days)) + ' கஷ்டமான நாட்கள் இருந்தன — கவனமாக இருங்கள்.' if low_mood_days else 'உங்கள் தூக்கம் மற்றும் ஆற்றலை கவனிக்கவும்.'}"
                    )
                }
            ]
        elif lang == "tanglish":
            insights = [
                {
                    "type": "pattern",
                    "text": (
                        f"Intha week unga average mood {avg}/5 irunthuchu. "
                        f"{best.created_at.strftime('%A')} na romba nalla feel panninga ({best.mood_label}). "
                        f"{len(high_mood_days)} good days irunthuchu!"
                    )
                },
                {
                    "type": "tip",
                    "text": (
                        f"'{top_tag}' tag romba frequently use pannirukinga. "
                        f"{best.created_at.strftime('%A')} na enna nalla nadanthuchu nu dippa yosi "
                        f"— adha repeat panna try pannunga!"
                    )
                },
                {
                    "type": "alert",
                    "text": (
                        f"{worst.created_at.strftime('%A')} na mood romba low ah irunthuchu "
                        f"({worst.mood_label}, {worst.mood_score}/5). "
                        f"{'Intha week ' + str(len(low_mood_days)) + ' tough days irunthuchu — kavanam.' if low_mood_days else 'Unga sleep and energy level monitor pannunga.'}"
                    )
                }
            ]
        else:
            insights = [
                {
                    "type": "pattern",
                    "text": (
                        f"Your average mood this week was {avg}/5. "
                        f"You felt best on {best.created_at.strftime('%A')} ({best.mood_label}) "
                        f"and had {len(high_mood_days)} high-mood days out of {len(entries)} entries."
                    )
                },
                {
                    "type": "tip",
                    "text": (
                        f"The tag '{top_tag}' appears most in your entries. "
                        f"On your best day ({best.created_at.strftime('%A')}), you noted: "
                        f"'{best.note[:80]}'. Try to recreate those conditions."
                    )
                },
                {
                    "type": "alert",
                    "text": (
                        f"Your lowest mood was on {worst.created_at.strftime('%A')} "
                        f"({worst.mood_label}, {worst.mood_score}/5). "
                        f"{'You had ' + str(len(low_mood_days)) + ' low-mood days this week — worth reflecting on.' if low_mood_days else 'Keep monitoring your energy and sleep patterns.'}"
                    )
                }
            ]
        return {"insights": insights}


@router.get("/stats")
def get_mood_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    since_30 = datetime.utcnow() - timedelta(days=30)
    since_7 = datetime.utcnow() - timedelta(days=7)

    all_entries = db.query(MoodEntry)\
                    .filter(
                        MoodEntry.created_at >= since_30,
                        MoodEntry.owner_id == current_user.id
                    ).all()

    week_entries = db.query(MoodEntry)\
                     .filter(
                         MoodEntry.created_at >= since_7,
                         MoodEntry.owner_id == current_user.id
                     ).all()

    if not all_entries:
        return {
            "total_entries": 0,
            "avg_mood": 0,
            "streak": 0,
            "weekly_avg": 0
        }

    avg_mood = sum(e.mood_score for e in all_entries) / len(all_entries)
    weekly_avg = sum(e.mood_score for e in week_entries) / len(week_entries) if week_entries else 0
    streak = calculate_streak(db, current_user.id)

    return {
        "total_entries": len(all_entries),
        "avg_mood": round(avg_mood, 1),
        "streak": streak,
        "weekly_avg": round(weekly_avg, 1)
    }


def calculate_streak(db: Session, user_id: int):
    entries = db.query(MoodEntry)\
                .filter(MoodEntry.owner_id == user_id)\
                .order_by(MoodEntry.created_at.desc())\
                .all()

    if not entries:
        return 0

    streak = 0
    check_date = datetime.utcnow().date()
    dates_with_entries = set(e.created_at.date() for e in entries)

    while check_date in dates_with_entries:
        streak += 1
        check_date = check_date - timedelta(days=1)

    return streak
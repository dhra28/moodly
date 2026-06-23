# 🌙 Moodly — AI-Powered Mood Journal

A full-stack mood journaling app with AI-generated weekly insights, beautiful data visualizations, and a complete authentication system.

![Moodly](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI%20%2B%20PostgreSQL-7c6fe0)
![AI](https://img.shields.io/badge/AI-OpenRouter%20%2F%20LLM-a78bfa)
![License](https://img.shields.io/badge/License-MIT-22c55e)

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure register/login with bcrypt password hashing
- 😊 **Mood Tracking** — Log daily mood (1–5 scale) with emoji picker
- 📝 **Journal Entries** — Write notes and tag entries across 25+ life categories
- 🧠 **AI Weekly Insights** — Pattern detection, tips, and alerts powered by LLM
- 📅 **Mood Heatmap** — Month-based calendar view with prev/next navigation
- 📊 **Analytics Dashboard** — Mood trend line chart, breakdown, and top tags
- 🔍 **Search & Filter** — Search history by note, tag, or mood
- 📥 **Export CSV** — Download all entries as a spreadsheet
- 🌙 **Dark/Light Mode** — Full theme system with persistence
- 🔥 **Streak Tracking** — Daily journaling streak with badge milestones
- 💬 **Motivational Quotes** — Rotating psychology-backed quotes
- 📈 **Patterns Page** — Word cloud, tag analysis, week comparison

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | CSS Variables + Custom Design System |
| Backend | FastAPI (Python) |
| Database | PostgreSQL + SQLAlchemy ORM |
| Auth | JWT + bcrypt |
| AI | OpenRouter API (free LLM inference) |
| Charts | Recharts |
| Icons | Lucide React |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 13+

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

pip install -r requirements.txt

# Create .env from example
cp .env.example .env
# Fill in your DATABASE_URL, OPENROUTER_API_KEY, SECRET_KEY

uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## 📁 Project Structure
moodly/

├── backend/

│   ├── main.py              # FastAPI app entry point

│   ├── database.py          # SQLAlchemy connection

│   ├── models.py            # User + MoodEntry models

│   ├── schemas.py           # Pydantic validation schemas

│   ├── requirements.txt

│   └── routes/

│       ├── auth.py          # Register + Login + JWT

│       ├── entries.py       # CRUD + CSV export

│       └── insights.py      # AI insights + stats

└── frontend/

└── src/

├── components/

│   ├── journal/     # MoodPicker, JournalForm, HeatMap

│   ├── insights/    # InsightsPanel, WeekChart

│   ├── layout/      # Sidebar, TopBar, Layout

│   └── ui/          # PageWrapper, EmptyState

├── context/         # AuthContext, ThemeContext

├── hooks/           # useMoodData

├── pages/           # All page components

├── utils/           # api.js (Axios)

└── styles/          # globals.css (Design system)
---

## 🔑 Environment Variables

### Backend `.env`
DATABASE_URL=postgresql://user:password@localhost:5432/moodly

OPENROUTER_API_KEY=sk-or-...

SECRET_KEY=your-random-secret-key

---

## 📸 Pages

| Page | Description |
|---|---|
| **Today** | Mood picker, journal form, heatmap, AI insights |
| **History** | Searchable entry list with mood filters + CSV export |
| **Analytics** | Mood trend chart, breakdown by mood, top tags |
| **Weekly Insight** | Full AI analysis panel + weekly bar chart |
| **Patterns** | Streak stats, word cloud, week comparison, best/worst days |
| **Settings** | Account info, theme toggle, data export |

---

## 🤝 What I Learned

- Building a full-stack app from scratch with FastAPI + React
- JWT authentication flow with secure password hashing
- SQLAlchemy ORM with PostgreSQL relationships
- React Context API for global state (auth + theme)
- Custom React hooks for data fetching
- Integrating free LLM APIs for AI features
- CSS variables for a complete design system with dark/light modes
- Data visualization with Recharts

---
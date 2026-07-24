# CricHeroes - Full-Stack Grassroots Cricket Web Application

A full-stack, high-performance web application inspired by **CricHeroes** — built for grassroots cricket scoring, live match centers, tournament management, leaderboards, and player career analytics.

![CricHeroes Platform](https://img.shields.io/badge/Stack-Python%20%7C%20FastAPI%20%7C%20Django%20%7C%20PostgreSQL%20%7C%20React-00D26A?style=for-the-badge)

---

## 🌟 Key Features

- **🏏 Ball-by-Ball Live Scorer Console**: Touch deck for runs (0, 1, 2, 3, 4, 6, Wicket), extras (Wide, No Ball, Bye, Leg Bye), wagon wheel shot direction picker, striker swap, and single-click Undo Ball.
- **🔐 JWT Authentication & Authorization (RBAC)**: Dedicated login & registration for Official Scorers (`SCORER`), Tournament Organizers (`ORGANIZER`), and Players/Fans (`PLAYER`).
- **📊 Live Match Center**: Real-time scorecards, automated commentary stream, canvas Worm run-rate graph, and interactive Wagon Wheel shot distribution.
- **📱 Social Shareable Match Poster**: Instagram/WhatsApp story card with top performers and one-click copy summary.
- **🏆 Tournament Standings & Leaderboards**: Points table with Net Run Rate (NRR) calculation, 🧢 **Orange Cap**, and 🟣 **Purple Cap** rankings.
- **👤 Player Career Profiles**: Digital player passes, complete batting/bowling statistics, and career achievement badges (*"Century Maker"*, *"Yorker King"*).
- **🧮 NRR Calculator Tool**: Interactive Net Run Rate formula calculator.
- **🔊 Web Audio API Synthesizer**: Custom audio feedback for 4s, 6s, and wickets.
- **🐘 PostgreSQL & Django ORM**: Django Admin panel management (`/admin/`) with database migration and seeding support.

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS v4, Lucide Icons, Canvas API, Canvas Confetti, Web Audio API.
- **Backend (Python)**:
  - **FastAPI**: High-performance asynchronous REST endpoints for real-time live scoring, commentary, NRR calculator, and auth verification.
  - **Django**: ORM data models (`Team`, `Player`, `Tournament`, `Match`, `Ball`) and Django Admin panel.
  - **PostgreSQL**: Production relational database (`psycopg2-binary`).

---

## ⚡ How to Run Locally

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main_fastapi:app --host 127.0.0.1 --port 8000 --reload
```
Open **`http://127.0.0.1:8000`** for backend index & docs (**`http://127.0.0.1:8000/docs`**).

---

## 📤 How to Push to GitHub

1. Create a new repository on [GitHub](https://github.com/new) named `cricheroes-web-app`.
2. Run the following commands in your terminal:

```bash
git init
git add .
git commit -m "Initial commit: CricHeroes Full Stack Web App (FastAPI + Django + PostgreSQL + React)"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/cricheroes-web-app.git
git push -u origin main
```

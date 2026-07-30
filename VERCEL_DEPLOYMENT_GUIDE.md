# 🚀 Deploying CricHeroes Web Application to Vercel (100% Free)

This guide provides step-by-step instructions to deploy the CricHeroes Web Application (React + Python FastAPI + MongoDB Atlas) to Vercel completely for free.

---

## 🛠️ Project Architecture Ready for Vercel
- **Frontend**: Vite + React SPA (Configured in `frontend/`)
- **Backend API**: Python FastAPI Serverless Function (Configured in `backend/main_fastapi.py`)
- **Database Options**:
  - **Local/Default**: JSON database (`database.json`)
  - **Production (Free Cloud DB)**: MongoDB Atlas via `MONGODB_URI` environment variable.

---

## 📋 Step 1: Push Code to GitHub Repository
Ensure your repository contains the latest changes:
```bash
git add .
git commit -m "Configure project for Vercel free serverless deployment & MongoDB Atlas connection"
git push origin main
```

---

## ☁️ Step 2: (Optional) Set Up Free Cloud MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Free Shared Cluster (M0)**.
3. Under **Database Access**, create a database user and password.
4. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow Access from Anywhere).
5. Copy your Connection String:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`

---

## 🚀 Step 3: Deploy to Vercel (Web UI)

1. Sign in to [Vercel](https://vercel.com) using your GitHub account.
2. Click **"Add New..."** ➔ **"Project"**.
3. Import your GitHub repository: `https://github.com/Sandeep-yadavz/cricheroes-web-app.git`.
4. Configure Project Settings:
   - **Framework Preset**: Other / Vite
   - **Root Directory**: `./` (leave default)
5. **Environment Variables** (Optional for Cloud DB):
   - Key: `MONGODB_URI`
   - Value: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`
6. Click **"Deploy"**!

---

## 🎉 Step 4: Verify Deployment
Once Vercel finishes building:
- Your live web app URL will be generated (e.g., `https://cricheroes-web-app.vercel.app`).
- The frontend will automatically connect to `/api/matches`, `/api/search`, `/api/auth`, and `/api/matches/m1/score-ball` via Vercel serverless functions!

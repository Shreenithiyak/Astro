# 🏗️ Voora Construction — MERN Stack Full Application

Voora Construction website with full CRUD operations using MongoDB, Express, React, and Node.js.

---

## 📁 Project Structure

```
voora-mern/
├── backend/          → Node.js + Express + MongoDB API
│   ├── models/
│   │   ├── Enquiry.js
│   │   └── Project.js
│   ├── routes/
│   │   ├── enquiryRoutes.js
│   │   └── projectRoutes.js
│   ├── server.js
│   └── .env.example
└── frontend/         → React App
    ├── src/
    │   ├── api/index.js
    │   ├── pages/
    │   │   ├── Home.jsx        → Public website
    │   │   └── AdminDashboard.jsx → CRUD admin panel
    │   ├── App.js
    │   └── App.css
    └── .env.example
```

---

## 🔧 CRUD Operations

### Enquiries (Contact Form Submissions)
| Operation | Endpoint | Description |
|-----------|----------|-------------|
| CREATE | `POST /api/enquiries` | Submit new enquiry (public) |
| READ ALL | `GET /api/enquiries` | Get all with search/filter/pagination |
| READ ONE | `GET /api/enquiries/:id` | Get single enquiry |
| UPDATE | `PUT /api/enquiries/:id` | Update status, notes, details |
| DELETE | `DELETE /api/enquiries/:id` | Delete enquiry |
| STATS | `GET /api/enquiries/stats/overview` | Dashboard stats |

### Projects
| Operation | Endpoint | Description |
|-----------|----------|-------------|
| CREATE | `POST /api/projects` | Add new project |
| READ ALL | `GET /api/projects` | Get all projects |
| READ ONE | `GET /api/projects/:id` | Get single project |
| UPDATE | `PUT /api/projects/:id` | Update project details |
| DELETE | `DELETE /api/projects/:id` | Delete project |
| SEED | `POST /api/projects/seed/defaults` | Add 4 default Voora projects |

---

## 🚀 Local Development Setup

### Step 1 — MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com
2. Create free cluster → Connect → Get connection string
3. Replace `<username>` and `<password>` in the URI

### Step 2 — Backend
```bash
cd backend
cp .env.example .env
# Edit .env → add your MONGO_URI
npm install
npm run dev    # runs on http://localhost:5000
```

### Step 3 — Frontend
```bash
cd frontend
cp .env.example .env
# .env already points to localhost:5000
npm install
npm start      # runs on http://localhost:3000
```

---

## ☁️ Deploy to Production

### Backend → Render (Free)
1. Push this repo to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGO_URI` → your MongoDB Atlas connection string
   - `CLIENT_URL` → your Vercel frontend URL (after deploying frontend)
6. Deploy → Copy your Render URL (e.g. `https://voora-backend.onrender.com`)

### Frontend → Vercel (Free)
1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Settings:
   - **Root Directory**: `frontend`
   - **Framework**: Create React App
4. Add Environment Variable:
   - `REACT_APP_API_URL` → `https://your-render-url.onrender.com/api`
5. Deploy → Get your Vercel URL

### After Both Are Deployed
1. Go back to Render → Environment Variables
2. Set `CLIENT_URL` = your Vercel URL
3. Redeploy backend

---

## 🌐 URLs After Deployment
- **Public Site**: `https://voora-frontend.vercel.app`
- **Admin Panel**: `https://voora-frontend.vercel.app/admin`
- **API**: `https://voora-backend.onrender.com/api`

---

## 📋 Admin Panel Features
- Dashboard stats (Total, New, Site Visits, Converted)
- Search enquiries by name/email/phone
- Filter by status
- Pagination
- Edit enquiry details + status + admin notes
- Delete enquiries
- Add/Edit/Delete projects
- Seed default Voora projects

---

## 🔑 Tech Stack
- **Frontend**: React 18, React Router v6, Axios
- **Backend**: Node.js, Express 4, Mongoose
- **Database**: MongoDB Atlas (free tier)
- **Deploy**: Render (backend) + Vercel (frontend)

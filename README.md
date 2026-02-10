# Nomad

Nomad is a full-stack travel planning app with a React frontend and a Python FastAPI backend. It generates personalized travel plans using AI and vector search.

---

## Project Structure

```
nomad/
├── backend/        
│   ├── main.py                         # FastAPI app entrypoint
│   ├── prep_vectorstore.py             # Vector DB setup
│   └── vectorstore/                    # Vector DB files
└── frontend/       
    ├── public/     
    └── src/        
        ├── pages/                      # Page components
        │   ├── Home.jsx                # Main landing page (form input UI)
        │   ├── TravelPlan.jsx          # Displays generated travel plan
        └── components/                 # Reusable UI components
            └── LoadingOverlay.jsx      # Full-screen loading/progress overlay

```

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone <repo-url>
cd nomad
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

#### (Optional) Prepare Vectorstore
If you need to (re)build the vectorstore:
```bash
python prep_vectorstore.py
```

### 3. Start the Backend Server
```bash
uvicorn main:app --reload
```
---

### 4. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

### 5. Start the Frontend
```bash
npm run dev
```
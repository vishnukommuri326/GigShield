# GigShield

AI-powered gig worker protection platform that helps drivers and delivery workers fight unfair account deactivations across Uber, DoorDash, Instacart, and more.

## Features

- **Deactivation Analyzer** — Upload your deactivation notice and get analysis of the reason, platform ToS violations claimed, and your appeal options
- **Appeal Assistant** — Answer questions about your situation and get personalized appeal strategies powered by platform ToS + labor law RAG
- **Letter Generator** — Generate professional, evidence-based appeal letters tailored to your platform and deactivation reason

## Tech Stack

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore

**Backend**
- Python + FastAPI
- Firebase Admin SDK
- Claude AI (Anthropic)
- PyMuPDF (PDF parsing)

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Firebase project (with Authentication & Firestore enabled)
- Anthropic API key (for Claude AI)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

**Firebase Configuration:**
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Copy your Firebase config to `frontend/src/config/firebase.ts`

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Runs on `http://localhost:8000`

### Environment Variables

Create `backend/.env`:

```
ANTHROPIC_API_KEY=your_claude_api_key_here
FIREBASE_CREDENTIALS_PATH=path/to/serviceAccountKey.json
```

**Firebase Admin Setup:**
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file and reference its path in `.env`

## Project Structure

```
appealshield/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── services/
│   │   ├── models/
│   │   └── core/
│   ├── .env
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

## License

MIT
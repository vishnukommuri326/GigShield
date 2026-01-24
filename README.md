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

**Backend**
- Python + FastAPI
- OpenAI GPT-4
- Pinecone (vector database)
- PyMuPDF (PDF parsing)

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- OpenAI API key
- Pinecone API key

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

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
OPENAI_API_KEY=your_key_here
PINECONE_API_KEY=your_key_here
```

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
# RentShield

AI-powered tenant rights platform that helps renters analyze leases, understand their rights, and communicate with landlords.

## Features

- **Lease Analyzer** — Upload a lease PDF and get a clause-by-clause breakdown with risk flags and plain-English explanations
- **Rights Chatbot** — Ask questions about tenant rights and get state-specific answers powered by RAG
- **Letter Generator** — Create professional dispute letters to send to your landlord

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
rentshield/
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
# GigShield

**A case-based system for analyzing opaque platform enforcement decisions**

GigShield helps gig workers understand deactivation notices and prepare structured appeal documentation. The system demonstrates data modeling, aggregation analysis, and explainable decision-support logic for navigating platform enforcement processes.

---

## Problem Statement

Gig platforms (Uber, DoorDash, Instacart, etc.) deactivate worker accounts with minimal transparency. Workers receive vague notices, unclear appeal processes, and inconsistent enforcement standards. This creates information asymmetry that makes it difficult to:

- Understand why deactivation occurred
- Know what evidence is needed
- Prepare effective appeals
- Identify patterns across platforms

GigShield addresses this by structuring the appeal preparation process and surfacing aggregated insights about enforcement patterns.

---

## Core Features

### 1. **Notice Analyzer**
Upload deactivation notices (PDF/image) → Extract platform, reason, deadline, missing information

**Includes explainable probability scoring:**
- Rule-based likelihood assessment (Low/Medium/High)
- Visible factor breakdown (violation type, evidence gaps, timing, platform patterns)
- Confidence bands with explicit disclaimers
- **NOT a prediction** — assists decision-making, doesn't guarantee outcomes

### 2. **Appeal Wizard**
Multi-step form to generate structured appeal summaries with:
- Platform-specific context
- Evidence organization
- Neutral, factual tone (capped at 1 page)
- PDF export

### 3. **Analytics Dashboard**
Aggregated insights across cases (may include simulated data for demonstration):
- **Cases by Platform** — Distribution across 7+ platforms
- **Outcomes by Platform** — Approval rates (only shown when n ≥ 5)
- **Time to Response** — Histogram with avg/median
- **Reason Categories** — Includes "Unknown" category (acknowledges ambiguity)

### 4. **Evidence Organizer**
Checklist-driven file management:
- Deactivation-type-specific evidence checklists
- File upload with Firebase Storage
- Incident logging with timestamps
- Strength assessment

### 5. **Policy Insights Explorer**
Read-only FAQ system (no live chat):
- 10+ precomputed Q&As about platform policies
- Category filtering (deactivation reasons, appeals, evidence, policies)
- Explicit disclaimers about data currency

---

## System Architecture

### **Tech Stack**

**Frontend:** React + TypeScript, Vite, Tailwind CSS, Firebase Auth/Firestore  
**Backend:** Python FastAPI, Firebase Admin SDK, Anthropic Claude (text generation only)  
**Storage:** Firebase Storage (evidence files), Firestore (user data, appeals)  
**PDF Processing:** PDF.js (client-side extraction)

### **Data Flow**

```
User uploads notice → PDF.js extracts text → Backend analyzes with Claude
→ Returns structured data → Frontend calculates explainable score
→ User fills appeal form → Backend generates 1-page summary → Firestore saves

Evidence files → Firebase Storage (10MB limit, public URLs)
Analytics → Hardcoded synthetic data (clearly labeled)
```

### **Key Design Choices** (see [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) for details)

- **Firestore over PostgreSQL** — Rapid prototyping, real-time sync, no ORM complexity
- **Rule-based scoring over ML** — Explainability, no training data requirements, maintainable
- **AI used sparingly** — Only for text generation (notice analysis, appeal drafting), not decision-making
- **Client-side PDF extraction** — Faster, more private than server upload

---

## Core Data Model

### **Appeals Collection**
```typescript
{
  userId: string
  platform: string
  reason: string
  deactivationNotice: string
  userStory: string
  evidence: string
  appealLetter: string
  appealDeadline: ISO datetime
  status: 'pending' | 'approved' | 'denied'
  createdAt: timestamp
  lastUpdated: timestamp
}
```

### **Evidence Items**
```typescript
{
  name: string
  type: 'image' | 'document' | 'video'
  url: string (Firebase Storage)
  category: string
  tags: string[]
  uploadDate: ISO date
}
```

---

## End-to-End Case Flow

1. **User logs in** → Firebase Auth (email/password)
2. **Uploads deactivation notice** → PDF.js extracts text on client
3. **Notice Analyzer** → Backend calls Claude, returns structured analysis
4. **Explainable scoring** → Frontend calculates likelihood with visible factors
5. **Evidence Organizer** → User uploads docs to Firebase Storage, checks off items
6. **Appeal Wizard** → Multi-step form pre-filled from analyzer
7. **Generate appeal** → Backend calls Claude with structured prompt, returns 1-page summary
8. **Save to Firestore** → Appeal stored with deadline, user can track status
9. **Analytics Dashboard** → View aggregated patterns (synthetic data for demo)

---

## Aggregated Insights

The Analytics Dashboard demonstrates systems-level thinking:

- **178 total cases** across 7 platforms (synthetic data)
- **Approval rates** vary from 31-59% (only shown when n ≥ 5)
- **Response times** range 6-14 days avg (median typically 1-2 days faster)
- **Reason distribution**: Ratings (38%), Safety (25%), Completion (18%), Fraud (10%), Unknown (8%)
- **Unknown category** deliberately included (7.9% of cases lack clear categorization)

This proves capability to aggregate, analyze, and surface patterns — not just individual case processing.

---

## Design Tradeoffs & Decisions

See [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) for detailed explanations of:

- Why Firestore instead of relational DB
- Why rule-based scoring instead of machine learning
- Why AI is used sparingly (and only for assistive text generation)
- What was intentionally NOT built (live chat, outcome prediction, legal advice engine)
- Scope decisions that prioritize signal over feature sprawl

---

## Limitations & Ethics

### **What This System IS:**
✅ A structured workflow for organizing appeal information  
✅ A demonstration of data modeling and aggregation analysis  
✅ An explainable decision-support tool with visible reasoning  
✅ A portfolio project showcasing systems thinking

### **What This System IS NOT:**
❌ **Not legal advice** — No attorney-client relationship, no legal counsel  
❌ **Not a prediction** — Likelihood scores are heuristic estimates, not statistical forecasts  
❌ **Not authoritative** — AI-generated text is assistive, requires human review  
❌ **Not verified data** — Analytics include simulated data, real-world patterns vary significantly  
❌ **Not suitable for actual legal proceedings** — Use qualified legal counsel for representation

### **Explicit Disclaimers:**
- **Data Currency:** Platform policies change frequently. Information may be outdated.
- **Sample Size:** Aggregated insights based on limited/simulated data. Not statistically robust.
- **AI Limitations:** Claude-generated text may contain errors, biases, or hallucinations. Always verify.
- **No Guarantees:** Appeal success depends on evidence quality, platform policies, and case specifics.

### **Ethical Considerations:**
- Transparent about capabilities (rule-based vs. ML, synthetic vs. real data)
- Avoids legal framing ("rights," "protections") in favor of neutral policy language
- Provides confidence bands, not false precision
- Acknowledges "Unknown" categories rather than forcing classifications

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- Firebase project (Authentication + Firestore + Storage)
- Anthropic API key

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

**Firebase Config:** Update `frontend/src/config/firebase.ts` with your project credentials

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

**Environment Variables** (create `backend/.env`):
```
ANTHROPIC_API_KEY=your_key_here
FIREBASE_CREDENTIALS_PATH=path/to/serviceAccountKey.json
```

---

## Project Structure

```
GigShield/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app entry
│   │   ├── api/                 # Route handlers
│   │   │   ├── appeals.py       # Appeal CRUD + generation
│   │   │   └── chat.py          # (Legacy, unused)
│   │   ├── services/            # Business logic
│   │   │   ├── ai_service.py    # Claude integration
│   │   │   └── firebase_service.py
│   │   └── models/              # Pydantic schemas
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/               # Page components
│   │   │   ├── NoticeAnalyzer.tsx
│   │   │   ├── AppealWizard.tsx
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── EvidenceOrganizer.tsx
│   │   │   └── InsightsExplorer.tsx
│   │   ├── services/            # API clients
│   │   ├── config/              # Firebase config
│   │   └── components/          # Shared UI
│   ├── package.json
│   └── vite.config.ts
├── DESIGN_DECISIONS.md          # Technical tradeoffs explained
├── README.md                     # This file
└── LICENSE
```

---

## Future Enhancements (Out of Scope)

**Not planned for portfolio version:**
- Live platform API integrations (privacy/legal concerns)
- Real-time chat (replaced with read-only FAQ)
- Machine learning models (rule-based sufficient, more explainable)
- Multi-language support
- Mobile apps
- Monetization features

**Portfolio focus:** Demonstrate systems thinking, data modeling, and honest scope management — not feature sprawl.

---

## License

MIT License — See [LICENSE](LICENSE) for details

---

## Acknowledgments

Built as a portfolio project to demonstrate:
- Full-stack development (React + FastAPI)
- Firebase integration (Auth, Firestore, Storage)
- AI integration with proper guardrails
- Systems-level thinking (aggregation, explainable scoring)
- Honest documentation and limitation acknowledgment

**Not affiliated with any gig platform.** Platform names used for demonstration purposes only.
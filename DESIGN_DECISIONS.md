# Design Decisions & Technical Tradeoffs

This document explains key architectural choices made in GigShield and the reasoning behind them. These decisions prioritize **demonstrating systems thinking** and **honest scope management** over feature sprawl.

---

## 1. Firestore vs. PostgreSQL

### **Choice:** Firebase Firestore (NoSQL document store)

### **Rationale:**

**Advantages:**
- **Rapid prototyping** — No schema migrations, ORM configuration, or SQL query writing
- **Real-time sync** — Built-in websocket support for live updates (appeal status changes)
- **Integrated ecosystem** — Auth, Storage, and Database in one platform (reduced setup complexity)
- **Serverless scaling** — No database hosting/maintenance overhead
- **Document model fits use case** — Appeals are naturally document-shaped (not heavily relational)

**Tradeoffs:**
- **Limited query complexity** — No JOINs, complex aggregations harder (but not needed for this scope)
- **Vendor lock-in** — Firestore is GCP-specific (acceptable for portfolio project)
- **Cost at scale** — Pay-per-read/write (not a concern for demo/portfolio usage)

### **Alternative Considered:** PostgreSQL + SQLAlchemy

**Why not chosen:**
- Requires separate hosting (Render, Railway, or local Docker)
- Schema design and migrations add complexity without portfolio value
- ORM boilerplate obscures core logic
- Portfolio reviewers care more about **data modeling** (which Firestore still demonstrates) than SQL skills

### **Result:**
Firestore enabled focus on **business logic and user experience** rather than database administration. The document model is clear in code, demonstrating data modeling skills without SQL overhead.

---

## 2. Rule-Based Scoring vs. Machine Learning

### **Choice:** Explainable rule-based probability scoring

### **Implementation:**
```typescript
// Visible factor breakdown in NoticeAnalyzer
score = 50 (baseline)
+ 15 if performance-based deactivation
- 25 if safety/fraud flag
+ 20 if no missing info
- 15 if >3 gaps
+ 10 if >14 days remaining
...
```

### **Rationale:**

**Advantages:**
- **Explainability** — Every point adjustment is visible and justified
- **No training data** — Doesn't require historical outcome data (which doesn't exist)
- **Maintainability** — Rules can be updated without retraining
- **Honest about uncertainty** — "This is NOT a prediction" disclaimer is accurate
- **Fast execution** — Runs client-side in milliseconds

**Tradeoffs:**
- **No learning** — Can't improve from new data automatically
- **Manual tuning** — Rules based on heuristics, not empirical validation
- **Less "impressive"** — Doesn't use trendy ML buzzwords

### **Alternative Considered:** Logistic Regression or Neural Network

**Why not chosen:**
- **No ground truth data** — Would require hundreds of labeled appeal outcomes
- **Black box problem** — Model predictions hard to explain (defeats decision-support purpose)
- **Overengineering** — Adds complexity for marginal portfolio value
- **False precision** — ML model implies statistical rigor we can't support

### **Result:**
Rule-based scoring **better demonstrates systems thinking** than a poorly-trained ML model. Shows judgment about when NOT to use machine learning.

---

## 3. AI Used Sparingly

### **Choice:** Claude only for text generation (notice analysis, appeal drafting)

### **Where AI is NOT used:**
- ❌ Not for decision-making (appeal likelihood)
- ❌ Not for data extraction (PDF.js handles that client-side)
- ❌ Not for live chat (replaced with static FAQ)
- ❌ Not for outcome prediction

### **Rationale:**

**Advantages:**
- **Cost control** — Each Claude call costs $0.01-0.10 (vs. thousands of calls for chat)
- **Determinism** — Rule-based logic is reproducible, AI is not
- **Privacy** — Less user data sent to third-party APIs
- **Appropriate use** — AI excels at text generation, not reasoning/classification

**Tradeoffs:**
- **Less "AI-powered"** — Doesn't maximize LLM usage (but that's not the goal)
- **Manual rule maintenance** — Scoring logic requires human updates

### **Alternative Considered:** RAG-powered chatbot for everything

**Why not chosen:**
- **Expensive** — Live chat generates 10-100x API calls
- **Unnecessary** — Static FAQ answers 90% of questions
- **Latency** — Chat responses take 2-5 seconds, read-only is instant
- **Scope creep** — Chat requires moderation, conversation history, context management

### **Result:**
Using AI strategically (only where it adds unique value) shows **engineering maturity** — not every problem needs LLMs.

---

## 4. Client-Side PDF Extraction

### **Choice:** PDF.js in browser (vs. backend processing)

### **Rationale:**

**Advantages:**
- **Faster** — No file upload to server, extraction happens instantly
- **Privacy** — Sensitive notices never leave user's device
- **Reduced backend load** — No file storage/processing on server
- **Better UX** — Immediate feedback, no loading spinner

**Tradeoffs:**
- **Client bundle size** — PDF.js adds ~500KB (acceptable with lazy loading)
- **Limited OCR** — Can't extract text from images (but backend could add this later)

### **Alternative Considered:** Upload to backend, use PyMuPDF

**Why not chosen:**
- **Privacy concerns** — Uploading deactivation notices to server is sensitive
- **Slower UX** — File upload + processing adds 2-5 second delay
- **Backend complexity** — Requires file storage, cleanup, size limits

### **Result:**
Client-side extraction prioritizes **user experience and privacy** while reducing backend complexity.

---

## 5. Synthetic Data in Analytics Dashboard

### **Choice:** Hardcoded dataset with clear disclaimer

### **Rationale:**

**Advantages:**
- **Immediate demonstration** — Shows full analytics capability without seeding database
- **Controlled showcase** — Data highlights intended patterns (outcome distribution, response times, etc.)
- **Honest labeling** — Disclaimer acknowledges simulation ("may include simulated data")
- **Portfolio-appropriate** — Proves data modeling and aggregation skills

**Tradeoffs:**
- **Not "real"** — Doesn't reflect actual user appeals
- **Static** — Doesn't update with new cases

### **Alternative Considered:** Real-time Firestore aggregation

**Why not chosen:**
- **Empty state problem** — New users would see blank dashboard
- **Backend complexity** — Requires aggregation queries, caching, or Cloud Functions
- **Scope creep** — Adds significant engineering work for limited portfolio value

### **Result:**
Synthetic data with disclaimer shows **systems thinking** (aggregation, statistical judgment, temporal analysis) without overbuilding.

---

## 6. What Was Intentionally NOT Built

### **Out of Scope (By Design):**

1. **Live Platform API Integrations**
   - **Why not:** Legal/privacy risks, platform ToS violations, maintenance burden
   - **Alternative:** Manual user input with platform-specific guidance

2. **Outcome Prediction ML Model**
   - **Why not:** No training data, would give false confidence
   - **Alternative:** Rule-based likelihood with visible factors

3. **Real-Time Chat Interface**
   - **Why not:** Expensive, slow, requires moderation
   - **Alternative:** Read-only FAQ with precomputed answers

4. **Automated Appeal Filing**
   - **Why not:** Requires platform credentials, legal liability
   - **Alternative:** Export PDF for manual submission

5. **Legal Advice Engine**
   - **Why not:** Unauthorized practice of law, ethical concerns
   - **Alternative:** Policy insights without legal framing

6. **Multi-Language Support**
   - **Why not:** Translation adds complexity without demonstrating new skills
   - **Alternative:** English-only with clear scope

### **Signal vs. Noise:**
These omissions demonstrate **mature scope management** — knowing what NOT to build is as important as knowing what to build.

---

## 7. Tone & Language Choices

### **Original Framing (Rejected):**
- "AI-powered gig worker **protection**"
- "Fight **unfair** deactivations"
- "Know Your **Rights**"
- "60% success rate"

### **New Framing (Adopted):**
- "Case-based system for analyzing **opaque platform enforcement**"
- "Prepare structured appeals"
- "**Policy Insights** Explorer"
- "Outcomes vary significantly" (no unsupported percentages)

### **Rationale:**
- **Avoids legal framing** — "Rights" implies legal counsel, which this isn't
- **Honest about uncertainty** — No guarantees or unverified claims
- **Neutral tone** — Analysis tool, not advocacy platform
- **Portfolio-safe** — Doesn't signal legal naivety or overclaiming

---

## 8. Architecture: Monolith vs. Microservices

### **Choice:** Single FastAPI backend

### **Rationale:**

**Advantages:**
- **Simplicity** — One codebase, one deployment
- **Faster development** — No inter-service communication overhead
- **Appropriate scale** — Expected usage doesn't justify microservices
- **Easier debugging** — Single process to monitor

**Tradeoffs:**
- **Less "enterprise"** — Doesn't showcase distributed systems
- **Scaling limitations** — Can't scale components independently

### **Result:**
For a portfolio project processing <1000 requests/day, microservices would be **premature optimization**.

---

## Summary: Portfolio-Driven Engineering

Every decision optimizes for:

1. **Demonstrating systems thinking** (not just CRUD)
2. **Honest scope management** (not feature sprawl)
3. **Appropriate technology choices** (not resume-driven development)
4. **Clear communication** (explainability over black boxes)

**Key Principle:** Build what showcases engineering judgment, not what sounds impressive in buzzwords.

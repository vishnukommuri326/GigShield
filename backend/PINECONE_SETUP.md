# Pinecone Setup Guide

## Step 1: Get Pinecone API Key

1. Go to https://www.pinecone.io/
2. Sign up for free account (generous free tier)
3. Go to API Keys section
4. Copy your API key

## Step 2: Add to Environment Variables

Add to your `backend/.env` file:

```
PINECONE_API_KEY=your-api-key-here
```

## Step 3: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

This will install:
- `pinecone-client==5.0.1` - Pinecone SDK
- `sentence-transformers==3.3.1` - For generating embeddings

## Step 4: Start Backend

When you start the backend, it will automatically:
1. Connect to Pinecone
2. Create index named `gigshield-knowledge` (if doesn't exist)
3. Generate embeddings for all 10 knowledge base articles
4. Upload vectors to Pinecone

You'll see:
```
✓ Pinecone vector search enabled
Creating Pinecone index: gigshield-knowledge
✓ Index 'gigshield-knowledge' created
Indexing 10 documents...
✓ Indexed 10 documents to Pinecone
```

## How It Works

### Vector Search
- User searches: "california deactivation rights"
- System converts query to embedding (384-dimensional vector)
- Pinecone finds semantically similar documents
- Returns most relevant articles with confidence scores

### RAG-Enhanced Appeals
When generating an appeal:
1. System searches knowledge base for relevant policies
2. Retrieves platform-specific ToS, state laws, appeal strategies
3. Claude uses this context to write appeal with:
   - Specific policy citations
   - State law references
   - Platform-specific requirements
   - Relevant legal protections

### Example
**Without RAG**: Generic appeal about being deactivated
**With RAG**: "Under California's AB5 and Proposition 22, I have the right to a detailed explanation for deactivation and a human review of my appeal. According to DoorDash's policy..."

## Free Tier Limits
- 100,000 vectors
- 1 index
- Plenty for this app (only 10 documents currently)

## Adding More Documents

To add more knowledge base articles, edit `backend/app/services/knowledge_base.py`:

```python
{
    "id": "new-article",
    "title": "Article Title",
    "category": "State Laws|Platform Policies|Appeal Strategies|Common Issues",
    "state": "California|All",
    "platform": "DoorDash|All",
    "content": "Full article content...",
    "tags": ["tag1", "tag2", "tag3"]
}
```

Restart backend and it will auto-index new documents.

## Fallback Mode

If Pinecone is not configured, the system automatically falls back to keyword search. No errors, just less intelligent search results.

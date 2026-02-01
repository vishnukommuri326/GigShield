"""
Clear Pinecone index to allow re-indexing with fixed metadata
"""

from pinecone import Pinecone
import os

# Initialize Pinecone
pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index("gigshield-knowledge")

print("Deleting all vectors from Pinecone index...")
index.delete(delete_all=True)
print("✓ Index cleared. Restart backend to re-index with fixed metadata.")

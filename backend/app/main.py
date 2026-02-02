# backend/app/main.py
# REPLACE YOUR EXISTING FILE WITH THIS

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import Firebase initialization (this initializes Firebase on startup)
from app.core import firebase

# Import routers
from app.api.appeals import router as appeals_router
from app.api.analytics import router as analytics_router

# Create FastAPI app
app = FastAPI(
    title="GigShield API",
    description="API for gig worker deactivation appeals and rights information",
    version="1.0.0"
)

# CORS middleware - allows frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default
        "http://localhost:5174",  # Vite alternate port
        "http://localhost:3000",  # React default
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(appeals_router)
app.include_router(analytics_router, prefix="/api")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "GigShield API",
        "status": "running",
        "docs": "/docs",
        "firebase_initialized": True
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
# backend/app/main.py
# REPLACE YOUR EXISTING FILE WITH THIS

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from dotenv import load_dotenv
import os
from collections import defaultdict
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

# Import Firebase initialization (this initializes Firebase on startup)
from app.core import firebase

# Import routers
from app.api.appeals import router as appeals_router
from app.api.analytics import router as analytics_router
from app.api.scoring import router as scoring_router

# Simple in-memory rate limiter
class RateLimiter:
    def __init__(self):
        self.requests = defaultdict(list)
        self.max_requests = 100  # requests per window
        self.window = timedelta(minutes=1)  # 1 minute window
        self.login_max = 5  # login attempts per window
        self.login_window = timedelta(minutes=15)  # 15 minute window
    
    def is_rate_limited(self, identifier: str, endpoint: str = "general") -> bool:
        now = datetime.now()
        
        # Different limits for login endpoints
        if "login" in endpoint.lower() or "auth" in endpoint.lower():
            max_req = self.login_max
            window = self.login_window
        else:
            max_req = self.max_requests
            window = self.window
        
        # Clean old requests
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if now - req_time < window
        ]
        
        # Check if rate limited
        if len(self.requests[identifier]) >= max_req:
            return True
        
        # Add new request
        self.requests[identifier].append(now)
        return False

rate_limiter = RateLimiter()

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
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "127.0.0.1", "0.0.0.0"]
)

# Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Rate limiting middleware
@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    # Get client IP
    client_ip = request.client.host if request.client else "unknown"
    
    # Check rate limit
    if rate_limiter.is_rate_limited(client_ip, request.url.path):
        from fastapi.responses import JSONResponse
        return JSONResponse(
            status_code=429,
            content={
                "detail": "Too many requests. Please try again later.",
                "retry_after": "60 seconds"
            }
        )
    
    response = await call_next(request)
    return response

# Include routers
app.include_router(appeals_router)
app.include_router(analytics_router, prefix="/api")
app.include_router(scoring_router, prefix="/api")

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
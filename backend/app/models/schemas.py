# backend/app/models/schemas.py

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Appeal models
class AppealCreate(BaseModel):
    platform: str
    deactivation_reason: str
    user_story: str
    account_tenure: Optional[str] = None
    current_rating: Optional[str] = None
    completion_rate: Optional[str] = None
    total_deliveries: Optional[str] = None
    appeal_tone: Optional[str] = "professional"
    user_state: Optional[str] = None
    evidence: Optional[str] = None
    deadline_days: Optional[int] = 10

class AppealResponse(BaseModel):
    id: int
    user_id: int
    platform: str
    deactivation_reason: str
    appeal_letter: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Notice Analysis models
class NoticeAnalyzeRequest(BaseModel):
    notice_text: str

class NoticeAnalyzeResponse(BaseModel):
    platform: str
    reason: str
    urgency_level: str
    deadline_days: Optional[int]
    risk_level: str
    missing_info: List[str]
    recommendations: List[str]

# Chatbot models
class ChatRequest(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    suggested_actions: Optional[List[dict]] = []
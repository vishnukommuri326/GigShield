# backend/app/api/appeals.py
# REPLACE YOUR EXISTING FILE WITH THIS

from fastapi import APIRouter, HTTPException, Depends
from app.models.schemas import (
    NoticeAnalyzeRequest,
    NoticeAnalyzeResponse,
    AppealCreate,
    ChatRequest,
    ChatResponse
)
from app.core.auth_middleware import get_current_user
from app.core.firebase import save_appeal, get_user_appeals

router = APIRouter(prefix="/api", tags=["appeals"])

# ============================================
# PUBLIC ENDPOINTS (No Auth Required)
# ============================================

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    import os
    return {
        "status": "healthy",
        "firebase_configured": bool(os.getenv("FIREBASE_PROJECT_ID")),
        "anthropic_configured": bool(os.getenv("ANTHROPIC_API_KEY"))
    }

# ============================================
# PROTECTED ENDPOINTS (Auth Required)
# ============================================

@router.post("/analyze-notice", response_model=NoticeAnalyzeResponse)
async def analyze_notice(
    request: NoticeAnalyzeRequest,
    current_user: dict = Depends(get_current_user)  # ← Requires auth!
):
    """
    Analyze deactivation notice using AI.
    Requires authentication.
    """
    try:
        # TODO: Import and use AI service when ready
        # from app.services.ai_service import ai_service
        # result = await ai_service.analyze_notice(request.notice_text)
        
        # Mock response for now
        print(f"✓ Notice analyzed for user: {current_user['email']}")
        return NoticeAnalyzeResponse(
            platform="DoorDash",
            reason="Customer Complaint",
            urgency_level="URGENT",
            deadline_days=7,
            risk_level="Medium",
            missing_info=["GPS proof", "Customer communication screenshots"],
            recommendations=[
                "Gather delivery completion photos",
                "Document your account metrics",
                "Review platform ToS regarding complaints"
            ]
        )
        
    except Exception as e:
        print(f"Error analyzing notice: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-appeal")
async def generate_appeal(
    request: AppealCreate,
    current_user: dict = Depends(get_current_user)  # ← Requires auth!
):
    """
    Generate personalized appeal letter using AI.
    Requires authentication.
    Saves the appeal to Firestore.
    """
    try:
        # TODO: Import and use AI service when ready
        # from app.services.ai_service import ai_service
        # letter = await ai_service.generate_appeal(request)
        
        # Mock letter for now
        letter = f"""Dear {request.platform} Support Team,

I am writing to respectfully appeal my account deactivation due to {request.deactivation_reason}.

{request.user_story}

I have been a dedicated driver on your platform for {request.account_tenure or 'several months'}, maintaining a {request.current_rating or '4.8'} rating with a {request.completion_rate or '95%'} completion rate across {request.total_deliveries or '1000+'} deliveries.

I respectfully request that you review my case and reinstate my account.

Thank you for your consideration.

Sincerely,
A Dedicated {request.platform} Partner
"""
        
        # Save appeal to Firestore
        appeal_data = {
            'platform': request.platform,
            'deactivationReason': request.deactivation_reason,
            'userStory': request.user_story,
            'accountTenure': request.account_tenure,
            'currentRating': request.current_rating,
            'completionRate': request.completion_rate,
            'totalDeliveries': request.total_deliveries,
            'appealTone': request.appeal_tone,
            'userState': request.user_state,
            'generatedLetter': letter,
            'status': 'generated'
        }
        
        appeal_id = await save_appeal(current_user['uid'], appeal_data)
        
        print(f"✓ Appeal generated and saved for: {current_user['email']}")
        
        return {
            "appeal_id": appeal_id,
            "appeal_letter": letter,
            "status": "generated",
            "platform": request.platform,
            "tone_used": request.appeal_tone
        }
        
    except Exception as e:
        print(f"Error generating appeal: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/my-appeals")
async def get_my_appeals(
    current_user: dict = Depends(get_current_user)  # ← Requires auth!
):
    """
    Get all appeals for the authenticated user.
    """
    try:
        appeals = await get_user_appeals(current_user['uid'])
        print(f"✓ Retrieved {len(appeals)} appeals for: {current_user['email']}")
        
        return {
            "appeals": appeals,
            "count": len(appeals)
        }
        
    except Exception as e:
        print(f"Error fetching appeals: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)  # ← Requires auth!
):
    """
    Chat endpoint for the rights chatbot.
    Requires authentication.
    """
    try:
        # TODO: Import and use AI service when ready
        # from app.services.ai_service import ai_service
        # result = await ai_service.chat(request.message, request.conversation_history)
        
        # Mock response for now
        print(f"✓ Chat message from: {current_user['email']}")
        return ChatResponse(
            response="I understand you're asking about your rights. Based on platform policies and labor laws, here's what you need to know...",
            suggested_actions=[
                {"label": "Analyze Notice", "action": "notice-analyzer"},
                {"label": "Start Appeal", "action": "wizard"}
            ]
        )
        
    except Exception as e:
        print(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))
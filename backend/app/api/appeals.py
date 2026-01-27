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
from app.core.firebase import save_appeal, get_user_appeals, delete_appeal
from app.services.ai_service import ai_service  

router = APIRouter(prefix="/api", tags=["appeals"])



@router.get("/health")
async def health_check():
    """Health check endpoint"""
    import os
    
    # Check if Anthropic key exists AND is valid format
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    anthropic_configured = (
        anthropic_key is not None and
        anthropic_key.startswith("sk-ant-") and
        len(anthropic_key) > 20
    )
    
    return {
        "status": "healthy",
        "firebase_configured": bool(os.getenv("FIREBASE_PROJECT_ID")),
        "anthropic_configured": anthropic_configured
    }

# ============================================
# PROTECTED ENDPOINTS (Auth Required)
# ============================================

@router.post("/analyze-notice", response_model=NoticeAnalyzeResponse)
async def analyze_notice(
    request: NoticeAnalyzeRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Analyze deactivation notice using Claude AI.
    Requires authentication.
    """
    try:
        print(f"✓ Analyzing notice for user: {current_user['email']}")
        
        # Use AI service to analyze notice
        result = await ai_service.analyze_notice(request.notice_text)
        
        print(f"✓ AI Analysis complete: Platform={result.get('platform')}, Reason={result.get('reason')}")
        
        # Convert to response model
        return NoticeAnalyzeResponse(
            platform=result.get("platform", "Unknown"),
            reason=result.get("reason", "Unable to determine"),
            urgency_level=result.get("urgency_level", "MODERATE"),
            deadline_days=result.get("deadline_days"),
            risk_level=result.get("risk_level", "Medium"),
            missing_info=result.get("missing_info", []),
            recommendations=result.get("recommendations", [])
        )
        
    except Exception as e:
        print(f"❌ Error analyzing notice: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-appeal")
async def generate_appeal(
    request: AppealCreate,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate personalized appeal letter using Claude AI.
    Requires authentication.
    Saves the appeal to Firestore.
    """
    try:
        print(f"✓ Generating appeal for user: {current_user['email']}")
        
        # Prepare account details
        account_details = {
            'account_tenure': request.account_tenure,
            'current_rating': request.current_rating,
            'completion_rate': request.completion_rate,
            'total_deliveries': request.total_deliveries,
            'user_state': request.user_state,
            'appeal_tone': request.appeal_tone or 'professional'
        }
        
        # Use AI service to generate letter
        letter = await ai_service.generate_appeal(
            platform=request.platform,
            deactivation_reason=request.deactivation_reason,
            user_story=request.user_story,
            account_details=account_details
        )
        
        print(f"✓ AI-generated letter ({len(letter)} chars)")
        
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
        
        print(f"✓ Appeal saved to Firestore: {appeal_id}")
        
        return {
            "appeal_id": appeal_id,
            "appeal_letter": letter,
            "status": "generated",
            "platform": request.platform,
            "tone_used": request.appeal_tone
        }
        
    except Exception as e:
        print(f"❌ Error generating appeal: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/my-appeals")
async def get_my_appeals(
    current_user: dict = Depends(get_current_user)
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
        print(f"❌ Error fetching appeals: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Chat endpoint for the rights chatbot using Claude AI.
    Requires authentication.
    """
    try:
        print(f"✓ Chat message from: {current_user['email']}")
        
        # Use AI service for chat
        result = await ai_service.chat(
            message=request.message,
            conversation_history=request.conversation_history
        )
        
        return ChatResponse(
            response=result["response"],
            suggested_actions=result.get("suggested_actions", [])
        )
        
    except Exception as e:
        print(f"❌ Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/appeals/{appeal_id}")
async def delete_appeal_endpoint(
    appeal_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete an appeal by ID.
    Only the user who created the appeal can delete it.
    """
    try:
        await delete_appeal(appeal_id, current_user['uid'])
        print(f"✓ Appeal deleted: {appeal_id} by {current_user['email']}")
        
        return {
            "success": True,
            "message": "Appeal deleted successfully"
        }
        
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        print(f"❌ Error deleting appeal: {e}")
        raise HTTPException(status_code=500, detail=str(e))
# backend/app/api/appeals.py

from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from app.models.schemas import (
    NoticeAnalyzeRequest,
    NoticeAnalyzeResponse,
    AppealCreate,
    ChatRequest,
    ChatResponse
)
from app.core.auth_middleware import get_current_user
from app.core.firebase import save_appeal, get_user_appeals, delete_appeal, get_user_data, upload_evidence_file
from app.services.ai_service import ai_service
from app.services.knowledge_base import knowledge_base_service
from typing import Optional

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
    
    # Check Pinecone configuration
    pinecone_configured = bool(os.getenv("PINECONE_API_KEY"))
    
    return {
        "status": "healthy",
        "firebase_configured": bool(os.getenv("FIREBASE_PROJECT_ID")),
        "anthropic_configured": anthropic_configured,
        "pinecone_configured": pinecone_configured
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
    Generate personalized appeal letter using Claude AI with RAG.
    Requires authentication.
    Saves the appeal to Firestore.
    """
    try:
        print(f"✓ Generating appeal for user: {current_user['email']}")
        
        # Fetch user data from Firestore for contact info
        user_data = await get_user_data(current_user['uid'])
        
        # Merge Firestore data with auth token data to ensure we have all fields
        if user_data:
            # Add email and name from auth token if not in Firestore
            if 'email' not in user_data or not user_data.get('email'):
                user_data['email'] = current_user.get('email', '')
            if 'displayName' not in user_data or not user_data.get('displayName'):
                user_data['displayName'] = current_user.get('name', '')
        else:
            # If no Firestore data, use auth token data
            user_data = {
                'email': current_user.get('email', ''),
                'displayName': current_user.get('name', ''),
                'phoneNumber': ''
            }
        
        # Get relevant knowledge base context for RAG
        knowledge_context = knowledge_base_service.get_relevant_context(
            platform=request.platform,
            state=request.user_state or 'California',
            reason=request.deactivation_reason,
            top_k=3
        )
        
        print(f"✓ Retrieved {len(knowledge_context)} chars of knowledge context")
        
        # Prepare account details
        account_details = {
            'account_tenure': request.account_tenure,
            'current_rating': request.current_rating,
            'completion_rate': request.completion_rate,
            'total_deliveries': request.total_deliveries,
            'user_state': request.user_state,
            'appeal_tone': request.appeal_tone or 'professional'
        }
        
        # Use AI service to generate letter with user data and knowledge context
        letter = await ai_service.generate_appeal(
            platform=request.platform,
            deactivation_reason=request.deactivation_reason,
            user_story=request.user_story,
            account_details=account_details,
            user_data=user_data,
            knowledge_context=knowledge_context
        )
        
        print(f"✓ AI-generated letter ({len(letter)} chars)")
        
        # Save appeal to Firestore
        from datetime import datetime, timedelta
        
        # Calculate deadline date
        deadline_date = datetime.utcnow() + timedelta(days=request.deadline_days or 10)
        
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
            'status': 'generated',
            'createdAt': datetime.utcnow().isoformat(),
            'appealDeadline': deadline_date.isoformat()
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


@router.get("/knowledge-base/search")
async def search_knowledge_base(
    query: str,
    category: Optional[str] = None,
    state: Optional[str] = None,
    platform: Optional[str] = None,
    top_k: int = 5
):
    """
    Search the knowledge base for relevant articles.
    Public endpoint - no authentication required.
    """
    try:
        # Get search results
        results = knowledge_base_service.search(query, top_k=top_k)
        
        # Apply additional filters if provided
        if category:
            results = [r for r in results if r['category'] == category]
        if state:
            results = [r for r in results if r['state'] == state or r['state'] == 'All']
        if platform:
            results = [r for r in results if platform in r['platform'] or r['platform'] == 'All']
        
        return {
            "query": query,
            "results": results,
            "total": len(results)
        }
        
    except Exception as e:
        print(f"❌ Error searching knowledge base: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/knowledge-base/categories")
async def get_categories():
    """Get all available categories in the knowledge base"""
    try:
        return {
            "categories": knowledge_base_service.get_all_categories()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/knowledge-base/states")
async def get_states():
    """Get all available states in the knowledge base"""
    try:
        return {
            "states": knowledge_base_service.get_all_states()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/knowledge-base/platforms")
async def get_platforms():
    """Get all available platforms in the knowledge base"""
    try:
        return {
            "platforms": knowledge_base_service.get_all_platforms()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload-evidence")
async def upload_evidence(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload evidence file (image, PDF, document) to Firebase Storage.
    Returns public download URL.
    """
    try:
        # Validate file type
        allowed_types = [
            'image/jpeg', 'image/png', 'image/jpg', 'image/heic', 'image/webp',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type {file.content_type} not allowed. Allowed: images, PDF, Word docs"
            )
        
        # Validate file size (max 10MB)
        file_bytes = await file.read()
        max_size = 10 * 1024 * 1024  # 10MB
        if len(file_bytes) > max_size:
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum size is 10MB"
            )
        
        # Upload to Firebase Storage
        download_url = await upload_evidence_file(
            file_bytes=file_bytes,
            filename=file.filename,
            user_id=current_user['uid'],
            content_type=file.content_type
        )
        
        print(f"✓ Evidence uploaded for user: {current_user['email']}")
        
        return {
            "success": True,
            "url": download_url,
            "filename": file.filename,
            "contentType": file.content_type
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error uploading evidence: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/appeals/{appeal_id}/status")
async def update_appeal_status(
    appeal_id: str,
    status_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """
    Update appeal status (pending/approved/denied).
    Requires authentication.
    """
    try:
        from datetime import datetime
        from app.core.firebase import db
        
        # Verify appeal belongs to user
        appeal_ref = db.collection('appeals').document(appeal_id)
        appeal = appeal_ref.get()
        
        if not appeal.exists:
            raise HTTPException(status_code=404, detail="Appeal not found")
        
        appeal_data = appeal.to_dict()
        if appeal_data.get('userId') != current_user['uid']:
            raise HTTPException(status_code=403, detail="Not authorized to update this appeal")
        
        # Update status
        new_status = status_data.get('status')
        if new_status not in ['pending', 'approved', 'denied', 'generated']:
            raise HTTPException(status_code=400, detail="Invalid status")
        
        appeal_ref.update({
            'status': new_status,
            'lastUpdated': datetime.utcnow().isoformat(),
            'submittedAt': datetime.utcnow().isoformat() if new_status == 'pending' else appeal_data.get('submittedAt')
        })
        
        print(f"✓ Updated appeal {appeal_id} status to {new_status} for user: {current_user['email']}")
        
        return {
            "success": True,
            "status": new_status,
            "lastUpdated": datetime.utcnow().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error updating appeal status: {e}")
        raise HTTPException(status_code=500, detail=str(e))
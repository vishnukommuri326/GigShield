# backend/app/api/appeals.py

from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
import time
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
        print(f" Analyzing notice for user: {current_user['email']}")
        
        # Use AI service to analyze notice
        result = await ai_service.analyze_notice(request.notice_text)
        
        print(f"AI Analysis complete: Platform={result.get('platform')}, Reason={result.get('reason')}")
        
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
        print(f"Error analyzing notice: {e}")
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
        print(f" Generating appeal for user: {current_user['email']}")
        
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
        
        print(f"Retrieved {len(knowledge_context)} chars of knowledge context")
        
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
        
        print(f" AI-generated letter ({len(letter)} chars)")
        
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
        
        print(f"Appeal saved to Firestore: {appeal_id}")
        
        return {
            "appeal_id": appeal_id,
            "appeal_letter": letter,
            "status": "generated",
            "platform": request.platform,
            "tone_used": request.appeal_tone
        }
        
    except Exception as e:
        print(f" Error generating appeal: {e}")
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
    case_id: str = Form(None),  # Make optional
    current_user: dict = Depends(get_current_user)
):
    """
    Upload evidence file (images and PDFs only) to Firebase Storage.
    SECURITY: Files are stored privately and require authentication to access.
    WARNING: Do not upload sensitive personal documents. This tool is experimental.
    
    If case_id is provided, file is attached to that case.
    If case_id is None, file is uploaded to temporary storage for the user.
    """
    print(f"[DEBUG] Upload request received:")
    print(f"  - File: {file.filename if file else 'MISSING'}")
    print(f"  - Content-Type: {file.content_type if file else 'MISSING'}")
    print(f"  - Case ID: {case_id if case_id else 'NONE (temporary upload)'}")
    print(f"  - User: {current_user.get('email', 'UNKNOWN')}")
    
    try:
        # If case_id is provided, verify it exists and belongs to user
        if case_id:
            from app.core.firebase import db
            case_ref = db.collection('appeals').document(case_id)
            case_doc = case_ref.get()
            
            if not case_doc.exists:
                raise HTTPException(status_code=404, detail="Case not found")
            
            case_data = case_doc.to_dict()
            if case_data.get('userId') != current_user['uid']:
                raise HTTPException(status_code=403, detail="Not authorized to upload evidence for this case")
        
        # Validate file type - STRICT: Images and PDFs only
        allowed_types = [
            'image/jpeg', 'image/png', 'image/jpg', 'image/webp',
            'application/pdf'
        ]
        
        if file.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Only images (JPEG, PNG, WebP) and PDFs are accepted."
            )
        
        # Validate file size (max 10MB)
        file_bytes = await file.read()
        max_size = 10 * 1024 * 1024  # 10MB
        if len(file_bytes) > max_size:
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum size is 10MB"
            )
        
        # Upload to Firebase Storage (private)
        from app.core.firebase import upload_evidence_file, save_evidence_metadata
        
        # Use temporary case_id if not provided
        temp_case_id = case_id or f"temp_{current_user['uid']}_{int(time.time())}"
        
        file_metadata = await upload_evidence_file(
            file_bytes=file_bytes,
            filename=file.filename,
            user_id=current_user['uid'],
            case_id=temp_case_id,
            content_type=file.content_type
        )
        
        # Only save metadata to Firestore if case_id is provided
        evidence_id = None
        if case_id:
            evidence_id = await save_evidence_metadata(
                user_id=current_user['uid'],
                case_id=case_id,
                metadata=file_metadata
            )
        
        print(f"✓ Evidence uploaded for user: {current_user['email']}, case: {temp_case_id}")
        
        return {
            "success": True,
            "evidenceId": evidence_id,
            "filename": file.filename,
            "contentType": file.content_type,
            "size": len(file_bytes),
            "url": file_metadata.get('storagePath'),  # Return storage path
            "message": "Evidence uploaded successfully. File is stored privately and requires authentication to access."
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error uploading evidence: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cases/{case_id}/evidence")
async def get_case_evidence_list(
    case_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get all evidence for a specific case.
    Returns metadata only (not download URLs).
    """
    try:
        from app.core.firebase import get_case_evidence, db
        
        # Verify case belongs to user
        case_ref = db.collection('appeals').document(case_id)
        case_doc = case_ref.get()
        
        if not case_doc.exists:
            raise HTTPException(status_code=404, detail="Case not found")
        
        case_data = case_doc.to_dict()
        if case_data.get('userId') != current_user['uid']:
            raise HTTPException(status_code=403, detail="Not authorized to view this case")
        
        # Get evidence
        evidence_list = await get_case_evidence(case_id, current_user['uid'])
        
        return {
            "caseId": case_id,
            "evidence": evidence_list,
            "count": len(evidence_list)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error fetching evidence: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/evidence/{evidence_id}/download")
async def download_evidence(
    evidence_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get time-limited download URL for evidence file.
    URL expires after 1 hour.
    """
    try:
        from app.core.firebase import db, get_evidence_download_url
        
        # Get evidence metadata
        evidence_ref = db.collection('evidence').document(evidence_id)
        evidence_doc = evidence_ref.get()
        
        if not evidence_doc.exists:
            raise HTTPException(status_code=404, detail="Evidence not found")
        
        evidence_data = evidence_doc.to_dict()
        
        # Verify ownership
        if evidence_data.get('userId') != current_user['uid']:
            raise HTTPException(status_code=403, detail="Not authorized to download this evidence")
        
        # Generate signed URL
        storage_path = evidence_data.get('storagePath')
        download_url = await get_evidence_download_url(storage_path, current_user['uid'])
        
        return {
            "evidenceId": evidence_id,
            "downloadUrl": download_url,
            "filename": evidence_data.get('filename'),
            "expiresIn": "1 hour"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error generating download URL: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/evidence/{evidence_id}")
async def delete_evidence_endpoint(
    evidence_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete evidence file and metadata.
    Only the user who uploaded can delete.
    """
    try:
        from app.core.firebase import db, delete_evidence_file, delete_evidence_metadata
        
        # Get evidence metadata
        evidence_ref = db.collection('evidence').document(evidence_id)
        evidence_doc = evidence_ref.get()
        
        if not evidence_doc.exists:
            raise HTTPException(status_code=404, detail="Evidence not found")
        
        evidence_data = evidence_doc.to_dict()
        
        # Verify ownership
        if evidence_data.get('userId') != current_user['uid']:
            raise HTTPException(status_code=403, detail="Not authorized to delete this evidence")
        
        # Delete file from Storage
        storage_path = evidence_data.get('storagePath')
        await delete_evidence_file(storage_path, current_user['uid'])
        
        # Delete metadata from Firestore
        await delete_evidence_metadata(evidence_id, current_user['uid'])
        
        print(f"✓ Evidence deleted: {evidence_id} by {current_user['email']}")
        
        return {
            "success": True,
            "message": "Evidence deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error deleting evidence: {e}")
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
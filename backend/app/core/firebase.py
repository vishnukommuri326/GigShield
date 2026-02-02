# backend/app/core/firebase.py
# CREATE THIS NEW FILE

import os
import firebase_admin
from firebase_admin import credentials, auth, firestore, storage
from dotenv import load_dotenv

load_dotenv()

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Check if already initialized
        firebase_admin.get_app()
        print("✓ Firebase already initialized")
    except ValueError:
        # Not initialized yet, so initialize now
        print("Initializing Firebase Admin SDK...")
        
        # Get credentials from environment variables
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id": os.getenv("FIREBASE_PROJECT_ID"),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            "token_uri": "https://oauth2.googleapis.com/token",
        })
        
        firebase_admin.initialize_app(cred, {
            'projectId': os.getenv("FIREBASE_PROJECT_ID"),
            'storageBucket': 'gigshield-22319.firebasestorage.app'
        })
        
        print("✓ Firebase initialized successfully")

# Initialize on import
initialize_firebase()

# Firestore client
db = firestore.client()

# Storage bucket
bucket = storage.bucket()

# Helper Functions
async def verify_token(id_token: str) -> dict:
    """
    Verify Firebase ID token from frontend
    Returns user info if valid, raises exception if invalid
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        raise ValueError(f"Invalid token: {str(e)}")

async def get_user_data(uid: str) -> dict:
    """Get user data from Firestore"""
    user_ref = db.collection('users').document(uid)
    user_doc = user_ref.get()
    
    if user_doc.exists:
        return user_doc.to_dict()
    return None

async def save_appeal(user_id: str, appeal_data: dict) -> str:
    """Save appeal to Firestore"""
    from datetime import datetime
    
    appeal_ref = db.collection('appeals').document()
    
    appeal_doc = {
        **appeal_data,
        'userId': user_id,
        'createdAt': datetime.utcnow().isoformat()
    }
    
    appeal_ref.set(appeal_doc)
    print(f"✓ Appeal saved: {appeal_ref.id}")
    return appeal_ref.id

async def get_user_appeals(user_id: str) -> list:
    """Get all appeals for a user"""
    appeals_ref = db.collection('appeals').where('userId', '==', user_id)
    appeals = appeals_ref.stream()
    
    return [
        {
            'id': appeal.id,
            **appeal.to_dict()
        }
        for appeal in appeals
    ]

async def delete_appeal(appeal_id: str, user_id: str) -> bool:
    """Delete an appeal from Firestore"""
    appeal_ref = db.collection('appeals').document(appeal_id)
    appeal_doc = appeal_ref.get()
    
    if not appeal_doc.exists:
        raise ValueError("Appeal not found")
    
    # Verify the appeal belongs to the user
    appeal_data = appeal_doc.to_dict()
    if appeal_data.get('userId') != user_id:
        raise ValueError("Unauthorized to delete this appeal")
    
    appeal_ref.delete()
    print(f"✓ Appeal deleted: {appeal_id}")
    return True

async def upload_evidence_file(file_bytes: bytes, filename: str, user_id: str, case_id: str, content_type: str) -> dict:
    """
    Upload evidence file to Firebase Storage with proper security.
    Path structure: evidence/{userId}/{caseId}/{fileName}
    Returns: dict with file metadata (no public URL)
    """
    from datetime import datetime
    import uuid
    
    # Generate unique filename
    file_extension = filename.split('.')[-1] if '.' in filename else 'jpg'
    unique_filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}.{file_extension}"
    
    # Path following security rules: evidence/{userId}/{caseId}/{fileName}
    storage_path = f"evidence/{user_id}/{case_id}/{unique_filename}"
    
    # Upload to Firebase Storage (private by default)
    blob = bucket.blob(storage_path)
    blob.upload_from_string(file_bytes, content_type=content_type)
    
    # DO NOT make public - file is private and requires authentication
    
    print(f"✓ File uploaded privately: {storage_path}")
    
    # Return metadata (not public URL)
    return {
        'storagePath': storage_path,
        'filename': filename,
        'originalFilename': filename,
        'size': len(file_bytes),
        'contentType': content_type,
        'uploadedAt': datetime.utcnow().isoformat()
    }

async def get_evidence_download_url(storage_path: str, user_id: str) -> str:
    """
    Generate time-limited signed URL for evidence download.
    URL expires after 1 hour for security.
    """
    from datetime import timedelta
    
    # Verify user owns this file (path must start with evidence/{userId}/)
    if not storage_path.startswith(f"evidence/{user_id}/"):
        raise ValueError("Unauthorized access to evidence file")
    
    blob = bucket.blob(storage_path)
    
    # Generate signed URL valid for 1 hour
    url = blob.generate_signed_url(
        version="v4",
        expiration=timedelta(hours=1),
        method="GET"
    )
    
    return url

async def delete_evidence_file(storage_path: str, user_id: str) -> bool:
    """
    Delete evidence file from Storage.
    Verifies user owns the file before deletion.
    """
    # Verify user owns this file
    if not storage_path.startswith(f"evidence/{user_id}/"):
        raise ValueError("Unauthorized to delete this file")
    
    blob = bucket.blob(storage_path)
    
    if blob.exists():
        blob.delete()
        print(f"✓ Evidence file deleted: {storage_path}")
        return True
    
    return False

async def save_evidence_metadata(user_id: str, case_id: str, metadata: dict) -> str:
    """
    Save evidence metadata to Firestore.
    Returns evidence document ID.
    """
    from datetime import datetime
    
    evidence_ref = db.collection('evidence').document()
    
    evidence_doc = {
        **metadata,
        'userId': user_id,
        'caseId': case_id,
        'createdAt': datetime.utcnow().isoformat()
    }
    
    evidence_ref.set(evidence_doc)
    print(f"✓ Evidence metadata saved: {evidence_ref.id}")
    return evidence_ref.id

async def get_case_evidence(case_id: str, user_id: str) -> list:
    """
    Get all evidence for a specific case.
    Verifies user owns the case.
    """
    evidence_ref = db.collection('evidence').where('caseId', '==', case_id).where('userId', '==', user_id)
    evidence_docs = evidence_ref.stream()
    
    return [
        {
            'id': doc.id,
            **doc.to_dict()
        }
        for doc in evidence_docs
    ]

async def delete_evidence_metadata(evidence_id: str, user_id: str) -> bool:
    """
    Delete evidence metadata from Firestore.
    Verifies user owns the evidence.
    """
    evidence_ref = db.collection('evidence').document(evidence_id)
    evidence_doc = evidence_ref.get()
    
    if not evidence_doc.exists:
        raise ValueError("Evidence not found")
    
    # Verify ownership
    evidence_data = evidence_doc.to_dict()
    if evidence_data.get('userId') != user_id:
        raise ValueError("Unauthorized to delete this evidence")
    
    evidence_ref.delete()
    print(f"✓ Evidence metadata deleted: {evidence_id}")
    return True
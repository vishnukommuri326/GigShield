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

async def upload_evidence_file(file_bytes: bytes, filename: str, user_id: str, content_type: str) -> str:
    """
    Upload evidence file to Firebase Storage
    Returns: Public download URL
    """
    from datetime import datetime
    import uuid
    
    # Generate unique filename
    file_extension = filename.split('.')[-1] if '.' in filename else 'jpg'
    unique_filename = f"evidence/{user_id}/{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}.{file_extension}"
    
    # Upload to Firebase Storage
    blob = bucket.blob(unique_filename)
    blob.upload_from_string(file_bytes, content_type=content_type)
    
    # Make publicly accessible
    blob.make_public()
    
    print(f"✓ File uploaded: {unique_filename}")
    return blob.public_url
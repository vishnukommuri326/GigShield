# backend/app/core/auth_middleware.py
# CREATE THIS NEW FILE

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.firebase import verify_token

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Dependency to verify Firebase token and get current user.
    Use this in any route that requires authentication.
    
    Example:
        @app.post("/protected")
        async def protected_route(user: dict = Depends(get_current_user)):
            return {"user_id": user["uid"]}
    """
    token = credentials.credentials
    
    try:
        # Verify the token with Firebase
        decoded_token = await verify_token(token)
        
        return {
            'uid': decoded_token['uid'],
            'email': decoded_token.get('email'),
            'name': decoded_token.get('name')
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
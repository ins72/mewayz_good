"""
Team Invitation System for MEWAYZ V2
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import uuid
import jwt
from api.deps import get_current_user
from core.config import settings

router = APIRouter()

# In-memory storage for invitations (in production, use database)
invitations_db = {}

class InvitationCreate(BaseModel):
    email: EmailStr
    workspace_id: str
    role: str = "member"
    message: Optional[str] = None

class InvitationValidate(BaseModel):
    invitation_token: str

class InvitationAccept(BaseModel):
    invitation_token: str

class InvitationResponse(BaseModel):
    id: str
    email: EmailStr
    workspace_id: str
    workspace_name: str
    role: str
    message: Optional[str] = None
    inviter_name: str
    expires_at: str
    status: str

def create_invitation_token(invitation_data: dict) -> str:
    """Create a JWT token for invitation"""
    expire = datetime.utcnow() + timedelta(days=7)  # 7 days expiry
    payload = {
        "exp": expire,
        "invitation_id": invitation_data["id"],
        "workspace_id": invitation_data["workspace_id"],
        "email": invitation_data["email"],
        "role": invitation_data["role"]
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGO)

def verify_invitation_token(token: str) -> dict:
    """Verify and decode invitation token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.JWT_ALGO])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Invitation has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=400, detail="Invalid invitation token")

@router.post("/create", response_model=dict)
async def create_invitation(
    invitation: InvitationCreate,
    current_user=Depends(get_current_user)
):
    """Create a new team invitation"""
    try:
        # Generate invitation ID
        invitation_id = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(days=7)
        
        # Create invitation data
        invitation_data = {
            "id": invitation_id,
            "email": invitation.email,
            "workspace_id": invitation.workspace_id,
            "workspace_name": f"Workspace {invitation.workspace_id}",  # In production, get from database
            "role": invitation.role,
            "message": invitation.message,
            "inviter_id": str(current_user.id),
            "inviter_name": current_user.full_name or current_user.email,
            "expires_at": expires_at.isoformat(),
            "status": "pending",
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Store invitation
        invitations_db[invitation_id] = invitation_data
        
        # Create invitation token
        invitation_token = create_invitation_token(invitation_data)
        
        return {
            "invitation_id": invitation_id,
            "invitation_token": invitation_token,
            "invitation_url": f"{settings.BACKEND_CORS_ORIGINS[0]}/invitation?invitation={invitation_token}",
            "expires_at": expires_at.isoformat(),
            "message": "Invitation created successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create invitation: {str(e)}")

@router.post("/validate", response_model=InvitationResponse)
async def validate_invitation(validation: InvitationValidate):
    """Validate invitation token and return invitation details"""
    try:
        # Verify token
        payload = verify_invitation_token(validation.invitation_token)
        invitation_id = payload.get("invitation_id")
        
        # Check if invitation exists
        if invitation_id not in invitations_db:
            raise HTTPException(status_code=404, detail="Invitation not found")
        
        invitation = invitations_db[invitation_id]
        
        # Check if invitation is still valid
        if invitation["status"] != "pending":
            raise HTTPException(status_code=400, detail="Invitation has already been processed")
        
        # Check expiry
        expires_at = datetime.fromisoformat(invitation["expires_at"])
        if datetime.utcnow() > expires_at:
            raise HTTPException(status_code=400, detail="Invitation has expired")
        
        return InvitationResponse(**invitation)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to validate invitation: {str(e)}")

@router.post("/accept", response_model=dict)
async def accept_invitation(
    acceptance: InvitationAccept,
    current_user=Depends(get_current_user)
):
    """Accept team invitation"""
    try:
        # Verify token
        payload = verify_invitation_token(acceptance.invitation_token)
        invitation_id = payload.get("invitation_id")
        
        # Check if invitation exists
        if invitation_id not in invitations_db:
            raise HTTPException(status_code=404, detail="Invitation not found")
        
        invitation = invitations_db[invitation_id]
        
        # Check if invitation is for the current user
        if invitation["email"] != current_user.email:
            raise HTTPException(status_code=403, detail="This invitation is not for you")
        
        # Check if invitation is still valid
        if invitation["status"] != "pending":
            raise HTTPException(status_code=400, detail="Invitation has already been processed")
        
        # Mark invitation as accepted
        invitation["status"] = "accepted"
        invitation["accepted_at"] = datetime.utcnow().isoformat()
        invitation["accepted_by"] = str(current_user.id)
        
        # In production, you would:
        # 1. Add user to workspace
        # 2. Set appropriate permissions
        # 3. Send welcome email
        
        return {
            "message": "Invitation accepted successfully",
            "workspace_id": invitation["workspace_id"],
            "role": invitation["role"],
            "workspace_name": invitation["workspace_name"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to accept invitation: {str(e)}")

@router.get("/", response_model=list[InvitationResponse])
async def list_invitations(current_user=Depends(get_current_user)):
    """List all invitations created by the current user"""
    try:
        user_invitations = [
            invitation for invitation in invitations_db.values()
            if invitation["inviter_id"] == str(current_user.id)
        ]
        
        return [InvitationResponse(**invitation) for invitation in user_invitations]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list invitations: {str(e)}")

@router.get("/received", response_model=list[InvitationResponse])
async def list_received_invitations(current_user=Depends(get_current_user)):
    """List all invitations received by the current user"""
    try:
        received_invitations = [
            invitation for invitation in invitations_db.values()
            if invitation["email"] == current_user.email and invitation["status"] == "pending"
        ]
        
        return [InvitationResponse(**invitation) for invitation in received_invitations]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list received invitations: {str(e)}")

@router.delete("/{invitation_id}")
async def cancel_invitation(
    invitation_id: str,
    current_user=Depends(get_current_user)
):
    """Cancel an invitation"""
    try:
        if invitation_id not in invitations_db:
            raise HTTPException(status_code=404, detail="Invitation not found")
        
        invitation = invitations_db[invitation_id]
        
        # Check if current user is the inviter
        if invitation["inviter_id"] != str(current_user.id):
            raise HTTPException(status_code=403, detail="You can only cancel your own invitations")
        
        # Mark invitation as cancelled
        invitation["status"] = "cancelled"
        invitation["cancelled_at"] = datetime.utcnow().isoformat()
        
        return {"message": "Invitation cancelled successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to cancel invitation: {str(e)}")
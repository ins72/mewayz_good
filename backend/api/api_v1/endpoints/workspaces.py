"""
Workspace Management for MEWAYZ V2
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid
from api.deps import get_current_user

router = APIRouter()

class WorkspaceCreate(BaseModel):
    name: str
    industry: str
    team_size: str
    main_goals: List[str]
    selected_bundles: List[str]
    payment_method: str

class WorkspaceResponse(BaseModel):
    id: str
    name: str
    industry: str
    team_size: str
    main_goals: List[str]
    selected_bundles: List[str]
    payment_method: str
    owner_id: str
    created_at: str
    status: str

# Simple in-memory storage for demo purposes
# In production, this would be stored in MongoDB
workspaces_db = {}

@router.post("/", response_model=WorkspaceResponse)
async def create_workspace(
    workspace: WorkspaceCreate,
    current_user=Depends(get_current_user)
):
    """Create a new workspace for the authenticated user"""
    try:
        # Generate workspace ID
        workspace_id = str(uuid.uuid4())
        
        # Create workspace data
        workspace_data = {
            "id": workspace_id,
            "name": workspace.name,
            "industry": workspace.industry,
            "team_size": workspace.team_size,
            "main_goals": workspace.main_goals,
            "selected_bundles": workspace.selected_bundles,
            "payment_method": workspace.payment_method,
            "owner_id": str(current_user.id),
            "created_at": datetime.utcnow().isoformat(),
            "status": "active"
        }
        
        # Store workspace (in production, save to MongoDB)
        workspaces_db[workspace_id] = workspace_data
        
        return WorkspaceResponse(**workspace_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create workspace: {str(e)}")

@router.get("/", response_model=List[WorkspaceResponse])
async def get_user_workspaces(current_user=Depends(get_current_user)):
    """Get all workspaces for the authenticated user"""
    try:
        user_workspaces = [
            workspace for workspace in workspaces_db.values()
            if workspace["owner_id"] == str(current_user.id)
        ]
        
        return [WorkspaceResponse(**workspace) for workspace in user_workspaces]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch workspaces: {str(e)}")

@router.get("/{workspace_id}", response_model=WorkspaceResponse)
async def get_workspace(
    workspace_id: str,
    current_user=Depends(get_current_user)
):
    """Get a specific workspace"""
    try:
        if workspace_id not in workspaces_db:
            raise HTTPException(status_code=404, detail="Workspace not found")
        
        workspace = workspaces_db[workspace_id]
        
        # Check if user has access to this workspace
        if workspace["owner_id"] != str(current_user.id):
            raise HTTPException(status_code=403, detail="Access denied")
        
        return WorkspaceResponse(**workspace)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch workspace: {str(e)}")

@router.put("/{workspace_id}", response_model=WorkspaceResponse)
async def update_workspace(
    workspace_id: str,
    workspace_update: WorkspaceCreate,
    current_user=Depends(get_current_user)
):
    """Update a workspace"""
    try:
        if workspace_id not in workspaces_db:
            raise HTTPException(status_code=404, detail="Workspace not found")
        
        workspace = workspaces_db[workspace_id]
        
        # Check if user has access to this workspace
        if workspace["owner_id"] != str(current_user.id):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Update workspace data
        workspace.update({
            "name": workspace_update.name,
            "industry": workspace_update.industry,
            "team_size": workspace_update.team_size,
            "main_goals": workspace_update.main_goals,
            "selected_bundles": workspace_update.selected_bundles,
            "payment_method": workspace_update.payment_method,
        })
        
        workspaces_db[workspace_id] = workspace
        
        return WorkspaceResponse(**workspace)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update workspace: {str(e)}")

@router.delete("/{workspace_id}")
async def delete_workspace(
    workspace_id: str,
    current_user=Depends(get_current_user)
):
    """Delete a workspace"""
    try:
        if workspace_id not in workspaces_db:
            raise HTTPException(status_code=404, detail="Workspace not found")
        
        workspace = workspaces_db[workspace_id]
        
        # Check if user has access to this workspace
        if workspace["owner_id"] != str(current_user.id):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Delete workspace
        del workspaces_db[workspace_id]
        
        return {"message": "Workspace deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete workspace: {str(e)}")

@router.get("/user/has-workspace")
async def check_user_has_workspace(current_user=Depends(get_current_user)):
    """Check if the user has any workspaces"""
    try:
        user_workspaces = [
            workspace for workspace in workspaces_db.values()
            if workspace["owner_id"] == str(current_user.id)
        ]
        
        return {
            "has_workspace": len(user_workspaces) > 0,
            "workspace_count": len(user_workspaces)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to check workspace status: {str(e)}")
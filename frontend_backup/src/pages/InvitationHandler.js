import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '../components/Logo';
import './Auth.css';

const InvitationHandler = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invitationData, setInvitationData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const invitationToken = searchParams.get('invitation');

  useEffect(() => {
    if (!invitationToken) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    // Validate invitation token and get invitation details
    validateInvitation();
  }, [invitationToken]);

  const validateInvitation = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/invitations/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invitation_token: invitationToken
        })
      });

      if (response.ok) {
        const data = await response.json();
        setInvitationData(data);
        setLoading(false);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Invalid or expired invitation');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error validating invitation:', error);
      setError('Failed to validate invitation. Please try again.');
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    if (!invitationData) return;

    setProcessing(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/invitations/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          invitation_token: invitationToken
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update local storage to indicate user has workspace access
        localStorage.setItem('has_workspace', 'true');
        localStorage.setItem('workspace_role', result.role || 'member');
        localStorage.setItem('workspace_id', result.workspace_id);
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
      setError('Failed to accept invitation. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const declineInvitation = () => {
    // For now, just redirect to dashboard or landing page
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="loading-state">
            <div className="spinner"></div>
            <h2>Validating invitation...</h2>
            <p>Please wait while we check your invitation.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h2>Invalid Invitation</h2>
            <p>{error}</p>
            <button 
              className="auth-button primary"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <Logo size="large" />
          </div>
          <h2>Team Invitation</h2>
          <p>You've been invited to join a workspace!</p>
        </div>

        <div className="invitation-details">
          <div className="invitation-info">
            <h3>Invitation Details</h3>
            <div className="info-item">
              <strong>Workspace:</strong> {invitationData?.workspace_name || 'Loading...'}
            </div>
            <div className="info-item">
              <strong>Invited by:</strong> {invitationData?.inviter_name || 'Loading...'}
            </div>
            <div className="info-item">
              <strong>Role:</strong> {invitationData?.role || 'Member'}
            </div>
            {invitationData?.message && (
              <div className="info-item">
                <strong>Message:</strong> 
                <p className="invitation-message">{invitationData.message}</p>
              </div>
            )}
          </div>

          <div className="invitation-actions">
            <button 
              className="auth-button primary"
              onClick={acceptInvitation}
              disabled={processing}
            >
              {processing ? 'Accepting...' : 'Accept Invitation'}
            </button>
            
            <button 
              className="auth-button secondary"
              onClick={declineInvitation}
              disabled={processing}
            >
              Maybe Later
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            By accepting this invitation, you'll gain access to the workspace and its features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvitationHandler;
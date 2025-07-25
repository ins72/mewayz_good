import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/login/oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store the access token
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user_email', formData.username);
        
        // Check if user has workspace
        try {
          const workspaceResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/users/me`, {
            headers: {
              'Authorization': `Bearer ${data.access_token}`
            }
          });
          
          const userData = await workspaceResponse.json();
          
          // For now, assume new users don't have workspace (you can implement workspace check logic)
          const hasWorkspace = userData.workspaces && userData.workspaces.length > 0;
          localStorage.setItem('has_workspace', hasWorkspace ? 'true' : 'false');
          
          // Redirect based on workspace status
          if (hasWorkspace) {
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
          }
        } catch (error) {
          console.error('Error checking workspace:', error);
          // Default to onboarding if we can't check workspace status
          localStorage.setItem('has_workspace', 'false');
          navigate('/onboarding');
        }
      } else {
        setError(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <h1>MEWAYZ</h1>
            <span className="version-badge">V2</span>
          </div>
          <h2>Sign in to your account</h2>
          <p>Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Email</label>
            <input
              type="email"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="form-input"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button 
            type="button" 
            className="auth-button secondary"
            onClick={() => navigate('/register')}
          >
            Create new account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Forgot your password? 
            <button 
              type="button" 
              className="link-button"
              onClick={() => {/* Handle forgot password */}}
            >
              Reset it here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
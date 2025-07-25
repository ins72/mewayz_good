import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logo.css';

const Logo = ({ 
  size = 'medium', 
  clickable = true, 
  className = '', 
  showVersion = true,
  onClick = null 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (clickable) {
      navigate('/');
    }
  };

  return (
    <div 
      className={`mewayz-logo ${size} ${clickable ? 'clickable' : ''} ${className}`}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyPress={clickable ? (e) => e.key === 'Enter' && handleClick() : undefined}
    >
      <h1>MEWAYZ</h1>
      {showVersion && <span className="version-badge">V2</span>}
    </div>
  );
};

export default Logo;
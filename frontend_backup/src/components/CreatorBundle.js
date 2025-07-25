import React, { useState, useEffect } from 'react';
import { HiGlobeAlt, HiViewGrid, HiBookOpen, HiLightningBolt, HiSparkles } from 'react-icons/hi';
import { AiFillInstagram } from 'react-icons/ai';
import { RiTwitterFill, RiGithubFill, RiLinkedinBoxFill } from 'react-icons/ri';

// Bio Link Button Component (inspired by chroline/lynk)
const BioLinkButton = ({ 
  title, 
  url, 
  icon: IconComponent, 
  color = "blue.500", 
  style = "default",
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getColorValue = (color) => {
    const colorMap = {
      'blue.500': '#3b82f6',
      'indigo.500': '#6366f1',
      'green.500': '#10b981',
      'red.500': '#ef4444',
      'yellow.500': '#f59e0b',
      'purple.500': '#8b5cf6',
      'pink.500': '#ec4899',
      'gray.800': '#1f2937'
    };
    return colorMap[color] || color;
  };
  
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 24px',
    margin: '8px 0',
    borderRadius: '12px',
    backgroundColor: style === 'muted' ? 'transparent' : getColorValue(color),
    color: style === 'muted' ? getColorValue(color) : 'white',
    border: style === 'muted' ? `2px solid ${getColorValue(color)}` : 'none',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: isHovered ? '0 8px 25px rgba(0,0,0,0.15)' : '0 4px 6px rgba(0,0,0,0.1)',
    minHeight: '50px'
  };
  
  const handleClick = () => {
    if (onClick) onClick();
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {IconComponent && (
        <div style={{ marginRight: '12px', width: '20px', height: '20px' }}>
          <IconComponent size="100%" />
        </div>
      )}
      <span>{title}</span>
    </div>
  );
};

// Bio Link Page Component
const BioLinkPage = ({ pageData, isPreview = false }) => {
  const [clickStats, setClickStats] = useState({});
  
  const handleButtonClick = async (buttonId) => {
    if (!isPreview) {
      // Track click analytics
      try {
        await fetch(`/api/creator/p/${pageData.slug}/click/${buttonId}`, {
          method: 'POST'
        });
        setClickStats(prev => ({
          ...prev,
          [buttonId]: (prev[buttonId] || 0) + 1
        }));
      } catch (error) {
        console.error('Failed to track click:', error);
      }
    }
  };
  
  const pageStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
    backgroundColor: pageData.theme?.background_color || '#ffffff',
    color: pageData.theme?.text_color || '#111827',
    fontFamily: pageData.theme?.font_family || 'Inter, system-ui, sans-serif',
    minHeight: '100vh',
    background: pageData.theme?.gradient_enabled 
      ? `linear-gradient(135deg, ${pageData.theme.gradient_start}, ${pageData.theme.gradient_end})`
      : pageData.theme?.background_color || '#ffffff'
  };
  
  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px'
  };
  
  const avatarStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    margin: '0 auto 20px',
    backgroundImage: pageData.avatar_url ? `url(${pageData.avatar_url})` : 'none',
    backgroundColor: '#e5e7eb',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  
  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    margin: '0 0 8px 0',
    color: pageData.theme?.text_color || '#111827'
  };
  
  const descriptionStyle = {
    fontSize: '16px',
    color: pageData.theme?.text_color || '#6b7280',
    margin: '0 0 30px 0',
    lineHeight: '1.6'
  };
  
  const socialLinksStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    marginTop: '30px',
    flexWrap: 'wrap'
  };
  
  const socialIconStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  };
  
  const getSocialIcon = (platform) => {
    const icons = {
      instagram: AiFillInstagram,
      twitter: RiTwitterFill,
      github: RiGithubFill,
      linkedin: RiLinkedinBoxFill
    };
    return icons[platform.toLowerCase()] || HiGlobeAlt;
  };
  
  const getButtonIcon = (iconName) => {
    const icons = {
      'globe': HiGlobeAlt,
      'grid': HiViewGrid,
      'book': HiBookOpen,
      'lightning': HiLightningBolt,
      'sparkles': HiSparkles,
      'instagram': AiFillInstagram,
      'twitter': RiTwitterFill,
      'github': RiGithubFill,
      'linkedin': RiLinkedinBoxFill
    };
    return icons[iconName] || null;
  };
  
  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div style={avatarStyle}></div>
        <h1 style={titleStyle}>{pageData.title}</h1>
        {pageData.description && (
          <p style={descriptionStyle}>{pageData.description}</p>
        )}
      </div>
      
      <div>
        {pageData.buttons && pageData.buttons
          .sort((a, b) => a.position - b.position)
          .filter(button => button.is_active)
          .map((button) => {
            const IconComponent = getButtonIcon(button.icon);
            return (
              <BioLinkButton
                key={button.id}
                title={button.title}
                url={button.url}
                icon={IconComponent}
                color={button.color}
                style={button.style}
                onClick={() => handleButtonClick(button.id)}
              />
            );
          })}
      </div>
      
      {pageData.social_links && pageData.social_links.length > 0 && (
        <div style={socialLinksStyle}>
          {pageData.social_links
            .filter(social => social.is_visible)
            .map((social, index) => {
              const IconComponent = getSocialIcon(social.platform);
              return (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={socialIconStyle}
                  title={`@${social.username}`}
                >
                  <IconComponent size="20" />
                </a>
              );
            })}
        </div>
      )}
      
      {!isPreview && (
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          fontSize: '12px', 
          color: '#9ca3af' 
        }}>
          <p>Powered by MEWAYZ V2 Creator Bundle</p>
          <p>Views: {pageData.view_count || 0} • Total Clicks: {pageData.total_clicks || 0}</p>
        </div>
      )}
    </div>
  );
};

// Bio Link Creator Dashboard
const CreatorDashboard = () => {
  const [bioPages, setBioPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newPageData, setNewPageData] = useState({
    slug: '',
    title: '',
    description: ''
  });
  
  useEffect(() => {
    fetchBioPages();
  }, []);
  
  const fetchBioPages = async () => {
    try {
      // This would be connected to your auth system
      const response = await fetch('/api/creator/bio-pages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const pages = await response.json();
        setBioPages(pages);
      }
    } catch (error) {
      console.error('Failed to fetch bio pages:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const createBioPage = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      const response = await fetch('/api/creator/bio-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newPageData)
      });
      
      if (response.ok) {
        const createdPage = await response.json();
        setBioPages([...bioPages, createdPage]);
        setNewPageData({ slug: '', title: '', description: '' });
      } else {
        const error = await response.json();
        alert(error.detail || 'Failed to create bio page');
      }
    } catch (error) {
      console.error('Failed to create bio page:', error);
      alert('Failed to create bio page');
    } finally {
      setCreating(false);
    }
  };
  
  const dashboardStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Inter, system-ui, sans-serif'
  };
  
  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px'
  };
  
  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px'
  };
  
  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    marginBottom: '16px'
  };
  
  const buttonStyle = {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    disabled: creating
  };
  
  if (loading) {
    return (
      <div style={{ ...dashboardStyle, textAlign: 'center', paddingTop: '100px' }}>
        <p>Loading your bio pages...</p>
      </div>
    );
  }
  
  return (
    <div style={dashboardStyle}>
      <div style={headerStyle}>
        <h1>🎨 Creator Dashboard</h1>
        <p style={{ color: '#6b7280' }}>Manage your bio link pages and content</p>
      </div>
      
      <div style={cardStyle}>
        <h2>Create New Bio Page</h2>
        <form onSubmit={createBioPage}>
          <input
            type="text"
            placeholder="Unique slug (e.g., your-username)"
            value={newPageData.slug}
            onChange={(e) => setNewPageData({...newPageData, slug: e.target.value})}
            style={inputStyle}
            required
          />
          <input
            type="text"
            placeholder="Page title"
            value={newPageData.title}
            onChange={(e) => setNewPageData({...newPageData, title: e.target.value})}
            style={inputStyle}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={newPageData.description}
            onChange={(e) => setNewPageData({...newPageData, description: e.target.value})}
            style={{...inputStyle, minHeight: '80px'}}
          />
          <button type="submit" style={buttonStyle} disabled={creating}>
            {creating ? 'Creating...' : 'Create Bio Page'}
          </button>
        </form>
      </div>
      
      <div>
        <h2>Your Bio Pages ({bioPages.length})</h2>
        {bioPages.length === 0 ? (
          <div style={cardStyle}>
            <p>No bio pages yet. Create your first one above!</p>
          </div>
        ) : (
          bioPages.map((page) => (
            <div key={page.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>{page.title}</h3>
                  <p style={{ color: '#6b7280' }}>mewayz.app/{page.slug}</p>
                  <p style={{ fontSize: '14px', color: '#9ca3af' }}>
                    {page.view_count} views • {page.total_clicks} clicks • {page.buttons.length} buttons
                  </p>
                </div>
                <div>
                  <button 
                    style={{...buttonStyle, marginRight: '8px', backgroundColor: '#6b7280'}}
                    onClick={() => window.open(`/api/creator/p/${page.slug}`, '_blank')}
                  >
                    View Page
                  </button>
                  <button style={{...buttonStyle, backgroundColor: '#10b981'}}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Sample Bio Page Data for Demo
const sampleBioPageData = {
  id: "sample-id",
  slug: "demo-creator",
  title: "Alex Thompson",
  description: "Digital Creator & Entrepreneur • Building the future of content",
  avatar_url: null,
  view_count: 1247,
  total_clicks: 89,
  theme: {
    background_color: "#ffffff",
    text_color: "#111827",
    font_family: "Inter",
    gradient_enabled: true,
    gradient_start: "#667eea",
    gradient_end: "#764ba2"
  },
  buttons: [
    {
      id: "1",
      title: "Visit My Website",
      url: "https://alexthompson.com",
      icon: "globe",
      color: "blue.500",
      style: "default",
      position: 0,
      is_active: true,
      click_count: 45
    },
    {
      id: "2", 
      title: "My Portfolio",
      url: "https://portfolio.alexthompson.com",
      icon: "grid",
      color: "indigo.500",
      style: "default",
      position: 1,
      is_active: true,
      click_count: 23
    },
    {
      id: "3",
      title: "Latest Blog Posts",
      url: "https://blog.alexthompson.com",
      icon: "book",
      color: "green.500",
      style: "muted",
      position: 2,
      is_active: true,
      click_count: 12
    },
    {
      id: "4",
      title: "Subscribe to Newsletter",
      url: "https://newsletter.alexthompson.com",
      icon: "lightning",
      color: "yellow.500",
      style: "default",
      position: 3,
      is_active: true,
      click_count: 9
    }
  ],
  social_links: [
    {
      platform: "instagram",
      username: "alexthompson",
      url: "https://instagram.com/alexthompson",
      icon: "instagram",
      is_visible: true
    },
    {
      platform: "twitter", 
      username: "alex_codes",
      url: "https://twitter.com/alex_codes",
      icon: "twitter",
      is_visible: true
    },
    {
      platform: "github",
      username: "alexthompson",
      url: "https://github.com/alexthompson",
      icon: "github", 
      is_visible: true
    }
  ]
};

// Export components
export { BioLinkPage, BioLinkButton, CreatorDashboard, sampleBioPageData };
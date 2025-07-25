import React, { useState, useEffect } from 'react';
import './BioLinkBuilder.css';

const BioLinkBuilder = () => {
  const [bioLinks, setBioLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBioLink, setNewBioLink] = useState({
    name: '',
    description: '',
    custom_url: '',
    theme: 'default',
    links: []
  });

  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    type: 'link',
    icon: '🔗'
  });

  useEffect(() => {
    fetchBioLinks();
  }, []);

  const fetchBioLinks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/bundle-services/creator/bio-links`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBioLinks(data.data || []);
      } else if (response.status === 403) {
        // Bundle access denied - show upgrade prompt
        setBioLinks([]);
      } else {
        console.error('Failed to fetch bio links');
        // Mock data for development
        setBioLinks([
          {
            id: '1',
            name: 'My Main Bio Link',
            description: 'All my social media links',
            custom_url: 'myhandle',
            theme: 'default',
            links: [
              { title: 'Instagram', url: 'https://instagram.com/myhandle', type: 'social', icon: '📷' },
              { title: 'YouTube', url: 'https://youtube.com/mychannel', type: 'social', icon: '📺' },
              { title: 'Website', url: 'https://mywebsite.com', type: 'link', icon: '🌐' }
            ],
            is_active: true,
            created_at: '2025-07-25T10:00:00Z'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching bio links:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBioLink = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_REACT_APP_BACKEND_URL;
      
      const response = await fetch(`${backendUrl}/api/bundle-services/creator/bio-links`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBioLink)
      });

      if (response.ok) {
        const data = await response.json();
        setBioLinks([...bioLinks, data.data]);
        setShowCreateForm(false);
        setNewBioLink({
          name: '',
          description: '',
          custom_url: '',
          theme: 'default',
          links: []
        });
      } else if (response.status === 403) {
        alert('Creator Bundle required to create bio links. Please upgrade your plan.');
      } else {
        console.error('Failed to create bio link');
      }
    } catch (error) {
      console.error('Error creating bio link:', error);
    } finally {
      setLoading(false);
    }
  };

  const addLinkToNewBioLink = () => {
    if (newLink.title && newLink.url) {
      setNewBioLink({
        ...newBioLink,
        links: [...newBioLink.links, { ...newLink, id: Date.now() }]
      });
      setNewLink({ title: '', url: '', type: 'link', icon: '🔗' });
    }
  };

  const removeLinkFromNewBioLink = (linkId) => {
    setNewBioLink({
      ...newBioLink,
      links: newBioLink.links.filter(link => link.id !== linkId)
    });
  };

  const linkIcons = {
    social: '📱',
    link: '🔗',
    video: '📺',
    music: '🎵',
    store: '🛍️',
    contact: '✉️'
  };

  const themes = [
    { value: 'default', name: 'Default', color: 'from-purple-500 to-pink-500' },
    { value: 'dark', name: 'Dark', color: 'from-gray-800 to-black' },
    { value: 'light', name: 'Light', color: 'from-white to-gray-100' },
    { value: 'neon', name: 'Neon', color: 'from-green-400 to-blue-500' },
    { value: 'sunset', name: 'Sunset', color: 'from-orange-400 to-red-500' }
  ];

  if (loading && bioLinks.length === 0) {
    return (
      <div className="bio-link-builder">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your bio links...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bio-link-builder">
      {/* Header */}
      <div className="builder-header">
        <div className="header-content">
          <h1>Bio Link Builder</h1>
          <p>Create beautiful link-in-bio pages to showcase all your content</p>
        </div>
        <button 
          className="create-btn"
          onClick={() => setShowCreateForm(true)}
          disabled={loading}
        >
          <span>+</span>
          Create New Bio Link
        </button>
      </div>

      {/* Bio Links Grid */}
      <div className="bio-links-grid">
        {bioLinks.map((bioLink) => (
          <div key={bioLink.id} className="bio-link-card">
            <div className="card-header">
              <div className="bio-info">
                <h3>{bioLink.name}</h3>
                <p>{bioLink.description}</p>
                {bioLink.custom_url && (
                  <div className="custom-url">
                    <span>🔗</span>
                    <code>mewayz.com/{bioLink.custom_url}</code>
                  </div>
                )}
              </div>
              <div className="bio-status">
                <span className={`status-badge ${bioLink.is_active ? 'active' : 'inactive'}`}>
                  {bioLink.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="links-preview">
              <h4>Links ({bioLink.links?.length || 0})</h4>
              <div className="links-list">
                {bioLink.links?.slice(0, 3).map((link, idx) => (
                  <div key={idx} className="link-item">
                    <span className="link-icon">{link.icon}</span>
                    <span className="link-title">{link.title}</span>
                  </div>
                ))}
                {bioLink.links?.length > 3 && (
                  <div className="link-item more">
                    <span>+{bioLink.links.length - 3} more</span>
                  </div>
                )}
              </div>
            </div>

            <div className="card-actions">
              <button className="edit-btn">
                <span>✏️</span>
                Edit
              </button>
              <button className="view-btn">
                <span>👁️</span>
                View
              </button>
              <button className="stats-btn">
                <span>📊</span>
                Analytics
              </button>
            </div>
          </div>
        ))}

        {bioLinks.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🔗</div>
            <h2>No Bio Links Yet</h2>
            <p>Create your first bio link page to get started</p>
            <button 
              className="primary-btn"
              onClick={() => setShowCreateForm(true)}
            >
              Create Your First Bio Link
            </button>
          </div>
        )}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="create-form-modal">
            <div className="modal-header">
              <h2>Create New Bio Link Page</h2>
              <button 
                className="close-btn"
                onClick={() => setShowCreateForm(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <div className="form-section">
                <h3>Basic Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Page Name *</label>
                    <input
                      type="text"
                      value={newBioLink.name}
                      onChange={(e) => setNewBioLink({...newBioLink, name: e.target.value})}
                      placeholder="My Awesome Bio Link"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Custom URL</label>
                    <div className="url-input-group">
                      <span className="url-prefix">mewayz.com/</span>
                      <input
                        type="text"
                        value={newBioLink.custom_url}
                        onChange={(e) => setNewBioLink({...newBioLink, custom_url: e.target.value})}
                        placeholder="yourhandle"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newBioLink.description}
                    onChange={(e) => setNewBioLink({...newBioLink, description: e.target.value})}
                    placeholder="Tell people what they'll find on your bio link page"
                    className="form-textarea"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Theme Selection</h3>
                <div className="themes-grid">
                  {themes.map((theme) => (
                    <div
                      key={theme.value}
                      className={`theme-option ${newBioLink.theme === theme.value ? 'selected' : ''}`}
                      onClick={() => setNewBioLink({...newBioLink, theme: theme.value})}
                    >
                      <div className={`theme-preview bg-gradient-to-r ${theme.color}`}></div>
                      <span>{theme.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h3>Add Links</h3>
                <div className="link-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Link Title</label>
                      <input
                        type="text"
                        value={newLink.title}
                        onChange={(e) => setNewLink({...newLink, title: e.target.value})}
                        placeholder="Instagram Profile"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>URL</label>
                      <input
                        type="url"
                        value={newLink.url}
                        onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                        placeholder="https://instagram.com/yourhandle"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Type</label>
                      <select
                        value={newLink.type}
                        onChange={(e) => setNewLink({
                          ...newLink, 
                          type: e.target.value,
                          icon: linkIcons[e.target.value]
                        })}
                        className="form-select"
                      >
                        <option value="link">Link</option>
                        <option value="social">Social</option>
                        <option value="video">Video</option>
                        <option value="music">Music</option>
                        <option value="store">Store</option>
                        <option value="contact">Contact</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      className="add-link-btn"
                      onClick={addLinkToNewBioLink}
                      disabled={!newLink.title || !newLink.url}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {newBioLink.links.length > 0 && (
                  <div className="added-links">
                    <h4>Added Links ({newBioLink.links.length})</h4>
                    <div className="links-list">
                      {newBioLink.links.map((link, idx) => (
                        <div key={link.id || idx} className="link-item">
                          <span className="link-icon">{link.icon}</span>
                          <div className="link-info">
                            <span className="link-title">{link.title}</span>
                            <span className="link-url">{link.url}</span>
                          </div>
                          <button
                            className="remove-link-btn"
                            onClick={() => removeLinkFromNewBioLink(link.id)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
              <button 
                className="create-submit-btn"
                onClick={createBioLink}
                disabled={!newBioLink.name || loading}
              >
                {loading ? 'Creating...' : 'Create Bio Link Page'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BioLinkBuilder;
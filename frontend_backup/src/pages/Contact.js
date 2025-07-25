import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Get help from our support team',
      contact: 'support@mewayz.com',
      response: '24 hours'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our team in real-time',
      contact: 'Available 9AM-6PM EST',
      response: 'Instant'
    },
    {
      icon: '📞',
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      contact: '+1 (555) 123-MEWAYZ',
      response: 'Business hours'
    }
  ];

  const faqs = [
    {
      question: 'How quickly can I get started?',
      answer: 'You can start using MEWAYZ V2 immediately after signing up. Our onboarding wizard will guide you through setting up your workspace in under 5 minutes.'
    },
    {
      question: 'Can I switch between bundle plans?',
      answer: 'Yes! You can upgrade or change your bundle combination at any time. Multi-bundle discounts apply automatically when you select multiple plans.'
    },
    {
      question: 'Do you offer custom enterprise solutions?',
      answer: 'Absolutely! We offer custom enterprise plans with revenue sharing models and dedicated support. Contact our sales team for a personalized quote.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes! We offer a 14-day free trial on all bundle plans so you can explore all features before committing to a subscription.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Navigation Header */}
      <header className="contact-header">
        <div className="header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <h1>MEWAYZ</h1>
            <span className="version-badge">V2</span>
          </div>
          <button 
            className="back-btn" 
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </header>

      <div className="contact-container">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="hero-content">
            <h1>Get in Touch</h1>
            <p>We're here to help you succeed with MEWAYZ V2. Reach out to our team for support, questions, or partnership opportunities.</p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="contact-methods">
          <div className="methods-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="method-card">
                <div className="method-icon">{method.icon}</div>
                <h3>{method.title}</h3>
                <p>{method.description}</p>
                <div className="method-contact">{method.contact}</div>
                <div className="method-response">Response time: {method.response}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="contact-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="sales">Sales & Pricing</option>
                    <option value="enterprise">Enterprise Solutions</option>
                    <option value="partnership">Partnership</option>
                    <option value="bug">Bug Report</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief subject line"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {submitStatus === 'success' && (
                <div className="success-message">
                  ✅ Message sent successfully! We'll get back to you within 24 hours.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="error-message">
                  ❌ Failed to send message. Please try again or contact us directly.
                </div>
              )}

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner"></div>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions about MEWAYZ V2</p>
          </div>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>MEWAYZ V2</h3>
            <p>The Complete Creator Economy Platform</p>
          </div>
          <div className="footer-links">
            <a href="#" onClick={() => navigate('/privacy')}>Privacy Policy</a>
            <a href="#" onClick={() => navigate('/terms')}>Terms of Service</a>
            <a href="#" onClick={() => navigate('/help')}>Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
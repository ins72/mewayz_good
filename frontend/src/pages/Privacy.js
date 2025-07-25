import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Legal.css';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="legal-page">
      {/* Navigation Header */}
      <header className="legal-header">
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

      <div className="legal-container">
        {/* Hero Section */}
        <section className="legal-hero">
          <div className="hero-content">
            <h1>Privacy Policy</h1>
            <p>Your privacy is important to us. This policy explains how we collect, use, and protect your information when you use MEWAYZ V2.</p>
            <div className="last-updated">
              Last updated: January 25, 2025
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="legal-content">
          <div className="content-container">
            <div className="table-of-contents">
              <h3>Table of Contents</h3>
              <ul>
                <li><a href="#information-collection">1. Information We Collect</a></li>
                <li><a href="#usage">2. How We Use Your Information</a></li>
                <li><a href="#sharing">3. Information Sharing</a></li>
                <li><a href="#data-security">4. Data Security</a></li>
                <li><a href="#cookies">5. Cookies and Tracking</a></li>
                <li><a href="#third-party">6. Third-Party Services</a></li>
                <li><a href="#retention">7. Data Retention</a></li>
                <li><a href="#rights">8. Your Rights</a></li>
                <li><a href="#international">9. International Users</a></li>
                <li><a href="#changes">10. Policy Changes</a></li>
                <li><a href="#contact">11. Contact Us</a></li>
              </ul>
            </div>

            <div className="legal-sections">
              <section id="information-collection" className="legal-section">
                <h2>1. Information We Collect</h2>
                
                <h3>Personal Information</h3>
                <p>When you create an account or use our services, we may collect:</p>
                <ul>
                  <li><strong>Account Information:</strong> Name, email address, password</li>
                  <li><strong>Profile Information:</strong> Business details, workspace preferences</li>
                  <li><strong>Payment Information:</strong> Billing address, payment method details (processed securely by Stripe)</li>
                  <li><strong>Communication Data:</strong> Messages, support requests, feedback</li>
                </ul>

                <h3>Usage Information</h3>
                <p>We automatically collect information about how you use our services:</p>
                <ul>
                  <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
                  <li><strong>Usage Data:</strong> Pages viewed, features used, time spent on platform</li>
                  <li><strong>Log Data:</strong> IP address, access times, error logs</li>
                </ul>
              </section>

              <section id="usage" className="legal-section">
                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li><strong>Provide Services:</strong> Create and manage your account, process payments, deliver features</li>
                  <li><strong>Improve Platform:</strong> Analyze usage patterns, develop new features, enhance user experience</li>
                  <li><strong>Customer Support:</strong> Respond to inquiries, troubleshoot issues, provide assistance</li>
                  <li><strong>Marketing:</strong> Send product updates, promotional materials (with your consent)</li>
                  <li><strong>Legal Compliance:</strong> Comply with legal obligations, prevent fraud, ensure security</li>
                </ul>
              </section>

              <section id="sharing" className="legal-section">
                <h2>3. Information Sharing</h2>
                <p>We do not sell your personal information. We may share your information in these limited circumstances:</p>
                
                <h3>Service Providers</h3>
                <p>We work with trusted third-party providers who help us operate our business:</p>
                <ul>
                  <li><strong>Payment Processing:</strong> Stripe for secure payment handling</li>
                  <li><strong>Cloud Services:</strong> MongoDB Atlas for data storage</li>
                  <li><strong>Analytics:</strong> Anonymous usage analytics for platform improvement</li>
                  <li><strong>Communication:</strong> Email service providers for transactional messages</li>
                </ul>

                <h3>Legal Requirements</h3>
                <p>We may disclose your information when required by law or to:</p>
                <ul>
                  <li>Comply with legal processes or government requests</li>
                  <li>Protect our rights, property, or safety</li>
                  <li>Prevent fraud or security threats</li>
                  <li>Enforce our Terms of Service</li>
                </ul>
              </section>

              <section id="data-security" className="legal-section">
                <h2>4. Data Security</h2>
                <p>We implement industry-standard security measures to protect your information:</p>
                <ul>
                  <li><strong>Encryption:</strong> Data in transit and at rest is encrypted using AES-256</li>
                  <li><strong>Access Controls:</strong> Limited employee access with authentication requirements</li>
                  <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                  <li><strong>Secure Infrastructure:</strong> Enterprise-grade cloud hosting with redundancy</li>
                  <li><strong>PCI Compliance:</strong> Payment data handled according to PCI DSS standards</li>
                </ul>
              </section>

              <section id="cookies" className="legal-section">
                <h2>5. Cookies and Tracking</h2>
                <p>We use cookies and similar technologies to enhance your experience:</p>
                
                <h3>Essential Cookies</h3>
                <ul>
                  <li>Authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Core platform functionality</li>
                </ul>

                <h3>Analytics Cookies</h3>
                <ul>
                  <li>Usage statistics and performance monitoring</li>
                  <li>Feature usage analysis</li>
                  <li>Error tracking and debugging</li>
                </ul>

                <p>You can manage cookie preferences in your browser settings.</p>
              </section>

              <section id="third-party" className="legal-section">
                <h2>6. Third-Party Services</h2>
                <p>Our platform integrates with various third-party services. Each has their own privacy policies:</p>
                <ul>
                  <li><strong>Stripe:</strong> Payment processing (Stripe Privacy Policy)</li>
                  <li><strong>MongoDB:</strong> Database hosting (MongoDB Privacy Policy)</li>
                  <li><strong>Social Media:</strong> Optional integrations with your consent</li>
                </ul>
                <p>We encourage you to review the privacy policies of any third-party services you choose to use.</p>
              </section>

              <section id="retention" className="legal-section">
                <h2>7. Data Retention</h2>
                <p>We retain your information for as long as necessary to provide our services:</p>
                <ul>
                  <li><strong>Account Data:</strong> Retained while your account is active</li>
                  <li><strong>Usage Data:</strong> Anonymized after 24 months</li>
                  <li><strong>Payment Data:</strong> Retained per legal requirements (typically 7 years)</li>
                  <li><strong>Support Data:</strong> Deleted after issue resolution</li>
                </ul>
              </section>

              <section id="rights" className="legal-section">
                <h2>8. Your Rights</h2>
                <p>You have the following rights regarding your personal information:</p>
                <ul>
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Restriction:</strong> Limit how we process your information</li>
                </ul>
                <p>To exercise these rights, contact us at privacy@mewayz.com</p>
              </section>

              <section id="international" className="legal-section">
                <h2>9. International Users</h2>
                <p>MEWAYZ V2 is operated from the United States. If you're located outside the US:</p>
                <ul>
                  <li>Your information may be transferred to and processed in the US</li>
                  <li>We comply with applicable data protection laws</li>
                  <li>Appropriate safeguards are in place for international transfers</li>
                  <li>You consent to this transfer by using our services</li>
                </ul>
              </section>

              <section id="changes" className="legal-section">
                <h2>10. Policy Changes</h2>
                <p>We may update this Privacy Policy from time to time. When we do:</p>
                <ul>
                  <li>We'll post the updated policy on this page</li>
                  <li>We'll update the "Last updated" date</li>
                  <li>For material changes, we'll notify you via email</li>
                  <li>Continued use of our services constitutes acceptance</li>
                </ul>
              </section>

              <section id="contact" className="legal-section">
                <h2>11. Contact Us</h2>
                <p>If you have questions about this Privacy Policy or our data practices:</p>
                <div className="contact-info">
                  <div className="contact-item">
                    <strong>Email:</strong> privacy@mewayz.com
                  </div>
                  <div className="contact-item">
                    <strong>Support:</strong> <span className="contact-link" onClick={() => navigate('/contact')}>Contact Form</span>
                  </div>
                  <div className="contact-item">
                    <strong>Address:</strong> MEWAYZ V2 Privacy Team<br />
                    123 Business Ave<br />
                    Suite 100<br />
                    Tech City, TC 12345
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="legal-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>MEWAYZ V2</h3>
            <p>The Complete Creator Economy Platform</p>
          </div>
          <div className="footer-links">
            <a href="#" onClick={() => navigate('/privacy')}>Privacy Policy</a>
            <a href="#" onClick={() => navigate('/terms')}>Terms of Service</a>
            <a href="#" onClick={() => navigate('/contact')}>Contact</a>
            <a href="#" onClick={() => navigate('/help')}>Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
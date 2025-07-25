import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

const Terms = () => {
  return (
    <div className="legal-page">
      {/* Navigation */}
      <nav className="legal-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <Link to="/">MEWAYZ V2</Link>
          </div>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/help">Help</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="legal-container">
        <div className="legal-header">
          <h1>Terms of Service</h1>
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="legal-content">
          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using MEWAYZ V2 ("Service"), you accept and agree to be bound by the terms 
              and provision of this agreement. These Terms of Service ("Terms") govern your use of our 
              platform, including all tools, services, and content available through our website.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Description of Service</h2>
            <p>
              MEWAYZ V2 is a comprehensive creator economy platform that provides:
            </p>
            <ul>
              <li>Bio link building and website creation tools</li>
              <li>E-commerce store functionality</li>
              <li>Social media management capabilities</li>
              <li>Educational course platform features</li>
              <li>Business CRM and automation tools</li>
              <li>Operational management systems</li>
              <li>Template marketplace access</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. User Accounts and Registration</h2>
            <div className="subsection">
              <h3>3.1 Account Creation</h3>
              <p>
                To access certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </div>
            <div className="subsection">
              <h3>3.2 Account Eligibility</h3>
              <p>
                You must be at least 18 years old to create an account. By creating an account, you 
                represent and warrant that you are at least 18 years of age.
              </p>
            </div>
          </section>

          <section className="legal-section">
            <h2>4. Subscription Plans and Billing</h2>
            <div className="subsection">
              <h3>4.1 Subscription Plans</h3>
              <p>We offer several subscription plans:</p>
              <ul>
                <li><strong>Free Starter:</strong> $0/month with basic features</li>
                <li><strong>Creator Bundle:</strong> $19/month for content creators</li>
                <li><strong>E-commerce Bundle:</strong> $24/month for online stores</li>
                <li><strong>Social Media Bundle:</strong> $29/month for social management</li>
                <li><strong>Education Bundle:</strong> $29/month for course creators</li>
                <li><strong>Business Bundle:</strong> $39/month for advanced CRM</li>
                <li><strong>Operations Bundle:</strong> $24/month for business operations</li>
                <li><strong>Enterprise Plan:</strong> 15% revenue share model</li>
              </ul>
            </div>
            <div className="subsection">
              <h3>4.2 Billing and Payments</h3>
              <p>
                Subscription fees are billed in advance on a monthly or annual basis. All fees are 
                non-refundable except as required by law. We reserve the right to change our pricing 
                with 30 days advance notice.
              </p>
            </div>
            <div className="subsection">
              <h3>4.3 Multi-Bundle Discounts</h3>
              <p>When subscribing to multiple bundles, you receive automatic discounts:</p>
              <ul>
                <li>2 bundles: 20% discount</li>
                <li>3 bundles: 30% discount</li>
                <li>4+ bundles: 40% discount</li>
              </ul>
            </div>
          </section>

          <section className="legal-section">
            <h2>5. Acceptable Use Policy</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Violate any laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload malicious code or engage in harmful activities</li>
              <li>Spam, harass, or abuse other users</li>
              <li>Distribute illegal, harmful, or offensive content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated tools to access the Service without permission</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Content and Intellectual Property</h2>
            <div className="subsection">
              <h3>6.1 Your Content</h3>
              <p>
                You retain ownership of content you create using our Service. By using the Service, 
                you grant us a license to host, store, and display your content as necessary to 
                provide the Service.
              </p>
            </div>
            <div className="subsection">
              <h3>6.2 Our Content</h3>
              <p>
                The Service and its original content, features, and functionality are owned by MEWAYZ V2 
                and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
            </div>
          </section>

          <section className="legal-section">
            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and 
              protect your information when you use our Service. By using the Service, you agree to 
              the collection and use of information in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="legal-section">
            <h2>8. Service Availability and Modifications</h2>
            <p>
              We strive to maintain high service availability but cannot guarantee uninterrupted access. 
              We reserve the right to modify, suspend, or discontinue the Service at any time with or 
              without notice.
            </p>
          </section>

          <section className="legal-section">
            <h2>9. Termination</h2>
            <div className="subsection">
              <h3>9.1 Termination by You</h3>
              <p>
                You may terminate your account at any time by contacting our support team or through 
                your account settings.
              </p>
            </div>
            <div className="subsection">
              <h3>9.2 Termination by Us</h3>
              <p>
                We may terminate or suspend your account immediately if you breach these Terms or engage 
                in prohibited activities.
              </p>
            </div>
          </section>

          <section className="legal-section">
            <h2>10. Disclaimers and Limitation of Liability</h2>
            <p>
              The Service is provided "as is" without warranties of any kind. To the fullest extent 
              permitted by law, we disclaim all warranties and limit our liability for any damages 
              arising from your use of the Service.
            </p>
          </section>

          <section className="legal-section">
            <h2>11. Governing Law and Disputes</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of [Jurisdiction]. 
              Any disputes arising from these Terms or your use of the Service will be resolved through 
              binding arbitration.
            </p>
          </section>

          <section className="legal-section">
            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. We will notify users of significant 
              changes via email or through the Service. Continued use of the Service after changes 
              constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="legal-section">
            <h2>13. Contact Information</h2>
            <p>
              If you have questions about these Terms, please contact us:
            </p>
            <ul>
              <li>Email: legal@mewayz.com</li>
              <li>Address: [Company Address]</li>
              <li>Phone: [Phone Number]</li>
            </ul>
          </section>
        </div>

        <div className="legal-footer">
          <p>
            By using MEWAYZ V2, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
          <div className="legal-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/contact">Contact Support</Link>
            <Link to="/help">Help Center</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
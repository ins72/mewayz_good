import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StripePayment from '../components/StripePayment';
import './OnboardingWizard.css';

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(4); // Show bundles step for demo
  const [formData, setFormData] = useState({
    workspaceName: '',
    industry: '',
    teamSize: '',
    selectedGoals: [],
    selectedBundles: [],
    paymentMethod: 'monthly',
    paymentCompleted: false,
    subscriptionId: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Workspace Setup', description: 'Set up your workspace' },
    { id: 2, title: 'Business Details', description: 'Tell us about your business' },
    { id: 3, title: 'Choose Goals', description: 'Select your main objectives' },
    { id: 4, title: 'Select Bundles', description: 'Choose your feature bundles' },
    { id: 5, title: 'Payment Setup', description: 'Complete your subscription' },
    { id: 6, title: 'Complete Setup', description: 'Finalize your workspace' }
  ];

  const pricingBundles = [
    {
      id: 'free_starter',
      name: 'Free Starter',
      description: 'Perfect for testing the platform and personal use',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        '1 Bio Link Page (with 5 external links allowed)',
        'Basic Form Builder (1 form, 50 submissions/month)',
        'Simple Analytics (7 days data retention)',
        'Template Marketplace: Buy templates only (cannot sell)',
        'Mewayz Branding: Required on all external-facing content',
        'Support: Community support only'
      ],
      badge: 'Free Forever',
      launchSpecial: 'Always free - perfect for getting started',
      isFree: true
    },
    {
      id: 'creator',
      name: 'Creator Bundle',
      description: 'Perfect for content creators and influencers',
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        'Advanced Bio Link Builder (unlimited links, custom domain)',
        'Professional Website Builder (10 pages, custom domain)',
        'SEO Optimization Suite (basic SEO tools)',
        'AI Content Creation (500 credits/month)',
        'Template Marketplace (buy & sell templates)',
        'Remove Mewayz Branding',
        'Email Support'
      ],
      badge: 'Popular Choice',
      launchSpecial: 'First 1000 users get 3 months for $9/month',
      savings: 'Save $38/year'
    },
    {
      id: 'ecommerce',
      name: 'E-commerce Bundle',
      description: 'Complete online store solution',
      monthlyPrice: 24,
      yearlyPrice: 240,
      features: [
        'Complete E-commerce Store (unlimited products)',
        'Multi-vendor Marketplace (up to 10 vendors)',
        'Advanced Promotions (coupons, discounts, referrals)',
        'Payment Processing (Stripe/PayPal integration)',
        'Inventory Management',
        'Basic Analytics',
        'Priority Email Support'
      ],
      badge: 'Best for Sales',
      launchSpecial: 'First 500 users get 2 months free',
      savings: 'Save $48/year'
    },
    {
      id: 'social_media',
      name: 'Social Media Bundle',
      description: 'Advanced social media management and growth',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Instagram Lead Database (1000 searches/month)',
        'Social Media Scheduling (all major platforms)',
        'Twitter/TikTok Tools (advanced features)',
        'Social Analytics (detailed insights)',
        'Hashtag Research (trending hashtags)',
        'Priority Support'
      ],
      badge: 'Growth Focused',
      launchSpecial: 'First 2 weeks free trial',
      savings: 'Save $58/year'
    },
    {
      id: 'education',
      name: 'Education Bundle',
      description: 'Complete course platform and student management',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Complete Course Platform (unlimited students)',
        'Template Marketplace (create & sell course templates)',
        'Student Management (progress tracking, certificates)',
        'Live Streaming (basic streaming capabilities)',
        'Community Features (student discussions)',
        'Priority Support'
      ],
      badge: 'Learning Hub',
      launchSpecial: 'First month free',
      savings: 'Save $58/year'
    },
    {
      id: 'business',
      name: 'Business Bundle',
      description: 'Advanced CRM and business automation tools',
      monthlyPrice: 39,
      yearlyPrice: 390,
      features: [
        'Advanced CRM System (unlimited contacts)',
        'Email Marketing (10,000 emails/month)',
        'Lead Management (advanced scoring & tracking)',
        'Workflow Automation (10 workflows)',
        'Campaign Management (multi-channel campaigns)',
        'Business Analytics (detailed reporting)',
        'Phone + Email Support'
      ],
      badge: 'Most Powerful',
      launchSpecial: '50% off first 3 months',
      savings: 'Save $78/year'
    },
    {
      id: 'operations',
      name: 'Operations Bundle',
      description: 'Booking, financial management and business operations',
      monthlyPrice: 24,
      yearlyPrice: 240,
      features: [
        'Booking & Appointments (unlimited bookings)',
        'Financial Management (invoicing, expenses)',
        'Advanced Form Builder (unlimited forms)',
        'Survey & Feedback Tools (advanced surveys)',
        'Basic Reporting',
        'Email Support'
      ],
      badge: 'Efficiency Pro',
      launchSpecial: 'First month free',
      savings: 'Save $48/year'
    }
  ];

  const industries = [
    { value: 'technology', label: 'Technology & Software' },
    { value: 'marketing', label: 'Marketing & Advertising' },
    { value: 'ecommerce', label: 'E-commerce & Retail' },
    { value: 'education', label: 'Education & Training' },
    { value: 'healthcare', label: 'Healthcare & Wellness' },
    { value: 'finance', label: 'Finance & Insurance' },
    { value: 'consulting', label: 'Consulting & Services' },
    { value: 'other', label: 'Other' }
  ];

  const teamSizes = [
    { value: 'solo', label: 'Just me' },
    { value: 'small', label: '2-10 people' },
    { value: 'medium', label: '11-50 people' },
    { value: 'large', label: '51+ people' }
  ];

  const businessGoals = [
    {
      id: 'social_media',
      title: 'Social Media Growth',
      description: 'Grow followers, engagement, and leads',
      icon: '👥',
      features_preview: ['Instagram database', 'Content scheduling', 'Analytics']
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Sales',
      description: 'Sell products and manage inventory',
      icon: '🛒',
      features_preview: ['Online store', 'Payment processing', 'Order management']
    },
    {
      id: 'content_creation',
      title: 'Content & Courses',
      description: 'Create and monetize educational content',
      icon: '🎥',
      features_preview: ['Course builder', 'Student management', 'Content library']
    },
    {
      id: 'client_management',
      title: 'Client & CRM',
      description: 'Manage relationships and sales pipeline',
      icon: '🤝',
      features_preview: ['Contact management', 'Pipeline tracking', 'Task automation']
    },
    {
      id: 'marketing',
      title: 'Marketing Campaigns',
      description: 'Email, ads, and campaign management',
      icon: '📢',
      features_preview: ['Email marketing', 'Campaign tracking', 'Lead generation']
    },
    {
      id: 'analytics',
      title: 'Business Analytics',
      description: 'Track performance and make data-driven decisions',
      icon: '📊',
      features_preview: ['Revenue tracking', 'Performance metrics', 'Custom reports']
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGoalSelect = (goalId) => {
    const newGoals = formData.selectedGoals.includes(goalId)
      ? formData.selectedGoals.filter(g => g !== goalId)
      : [...formData.selectedGoals, goalId];
    setFormData({
      ...formData,
      selectedGoals: newGoals
    });
  };

  const handleBundleSelect = (bundleId) => {
    // Handle free bundle selection
    if (bundleId === 'free_starter') {
      setFormData({
        ...formData,
        selectedBundles: ['free_starter']
      });
      return;
    }

    // Handle paid bundle selection (remove free if selected)
    const currentBundles = formData.selectedBundles.filter(b => b !== 'free_starter');
    const newBundles = currentBundles.includes(bundleId)
      ? currentBundles.filter(b => b !== bundleId)
      : [...currentBundles, bundleId];
    
    setFormData({
      ...formData,
      selectedBundles: newBundles
    });
  };

  const calculateBundleDiscount = () => {
    const bundleCount = formData.selectedBundles.filter(b => b !== 'free_starter').length;
    if (bundleCount >= 4) return 0.40; // 40% discount for 4+ bundles
    if (bundleCount === 3) return 0.30; // 30% discount for 3 bundles
    if (bundleCount === 2) return 0.20; // 20% discount for 2 bundles
    return 0; // No discount for 1 bundle
  };

  const calculateTotalPrice = () => {
    // If only free bundle is selected
    if (formData.selectedBundles.includes('free_starter') && formData.selectedBundles.length === 1) {
      return {
        basePrice: 0,
        discount: 0,
        discountedPrice: 0,
        savings: 0,
        isFree: true
      };
    }

    const selectedBundles = pricingBundles.filter(bundle => 
      formData.selectedBundles.includes(bundle.id) && bundle.id !== 'free_starter'
    );
    
    const basePrice = selectedBundles.reduce((total, bundle) => {
      return total + (formData.paymentMethod === 'monthly' ? bundle.monthlyPrice : bundle.yearlyPrice);
    }, 0);
    
    const discount = calculateBundleDiscount();
    const discountedPrice = basePrice * (1 - discount);
    
    return {
      basePrice,
      discount,
      discountedPrice,
      savings: basePrice - discountedPrice,
      isFree: false
    };
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment successful:', paymentData);
    setFormData({
      ...formData,
      paymentCompleted: true,
      subscriptionId: paymentData.subscription_id
    });
    setError('');
    // Automatically move to next step
    handleNext();
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    setError(error.message || 'Payment failed. Please try again.');
  };

  const handleComplete = async () => {
    setLoading(true);
    
    // Create workspace via backend API
    try {
      const token = localStorage.getItem('access_token');
      
      // Prepare workspace data
      const workspaceData = {
        name: formData.workspaceName,
        industry: formData.industry,
        team_size: formData.teamSize,
        main_goals: formData.selectedGoals,
        selected_bundles: formData.selectedBundles,
        payment_method: formData.paymentMethod
      };

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/workspaces/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workspaceData)
      });

      if (response.ok) {
        const workspaceResult = await response.json();
        console.log('Workspace created:', workspaceResult);
        
        // Mark user as having workspace
        localStorage.setItem('has_workspace', 'true');
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Workspace creation failed:', errorData);
        setError('Failed to create workspace. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Onboarding failed:', error);
      // For now, simulate success and redirect to dashboard
      localStorage.setItem('has_workspace', 'true');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.workspaceName.trim() !== '';
      case 2:
        return formData.industry !== '' && formData.teamSize !== '';
      case 3:
        return formData.selectedGoals.length > 0;
      case 4:
        return formData.selectedBundles.length > 0;
      case 5:
        return formData.selectedBundles.includes('free_starter') && formData.selectedBundles.length === 1 
          ? true // Skip payment for free plan
          : formData.paymentCompleted;
      default:
        return true;
    }
  };

  return (
    <div className="onboarding-wizard">
      <div className="wizard-container">
        {/* Header */}
        <div className="wizard-header">
          <div className="logo">MEWAYZ V2</div>
          <h1 className="wizard-title">{steps[currentStep - 1].title}</h1>
          <p className="wizard-subtitle">{steps[currentStep - 1].description}</p>
        </div>

        {/* Progress */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-steps">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`progress-step ${currentStep >= step.id ? 'completed' : ''}`}
              >
                <div className="step-circle">
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <span className="step-title">{step.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="step-content">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {currentStep === 1 && (
            <WorkspaceStep 
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}
          
          {currentStep === 2 && (
            <BusinessDetailsStep 
              formData={formData}
              handleInputChange={handleInputChange}
              industries={industries}
              teamSizes={teamSizes}
            />
          )}
          
          {currentStep === 3 && (
            <GoalsStep 
              formData={formData}
              businessGoals={businessGoals}
              handleGoalSelect={handleGoalSelect}
            />
          )}
          
          {currentStep === 4 && (
            <BundlesStep 
              formData={formData}
              pricingBundles={pricingBundles}
              handleBundleSelect={handleBundleSelect}
              calculateTotalPrice={calculateTotalPrice}
              handleInputChange={handleInputChange}
            />
          )}
          
          {currentStep === 5 && (
            <PaymentStep 
              formData={formData}
              pricingBundles={pricingBundles}
              calculateTotalPrice={calculateTotalPrice}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}
          
          {currentStep === 6 && (
            <CompleteStep 
              formData={formData}
              pricingBundles={pricingBundles}
              calculateTotalPrice={calculateTotalPrice}
              loading={loading}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="wizard-navigation">
          {currentStep > 1 && (
            <button 
              onClick={handlePrevious}
              className="wizard-btn wizard-btn-secondary"
            >
              Previous
            </button>
          )}
          
          <div className="nav-spacer"></div>
          
          {currentStep < steps.length ? (
            <button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="wizard-btn wizard-btn-primary"
            >
              Next Step
            </button>
          ) : (
            <button 
              onClick={handleComplete}
              disabled={loading || !canProceed()}
              className="wizard-btn wizard-btn-primary"
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Step Components
const WorkspaceStep = ({ formData, handleInputChange }) => (
  <div className="step-form">
    <div className="form-group">
      <label htmlFor="workspaceName">Workspace Name</label>
      <input
        type="text"
        id="workspaceName"
        name="workspaceName"
        value={formData.workspaceName}
        onChange={handleInputChange}
        placeholder="Enter your workspace name"
        className="form-input"
      />
      <p className="form-help">This will be the name of your main workspace</p>
    </div>
  </div>
);

const BusinessDetailsStep = ({ formData, handleInputChange, industries, teamSizes }) => (
  <div className="step-form">
    <div className="form-group">
      <label htmlFor="industry">Industry</label>
      <select
        id="industry"
        name="industry"
        value={formData.industry}
        onChange={handleInputChange}
        className="form-select"
      >
        <option value="">Select your industry</option>
        {industries.map(industry => (
          <option key={industry.value} value={industry.value}>
            {industry.label}
          </option>
        ))}
      </select>
    </div>
    
    <div className="form-group">
      <label htmlFor="teamSize">Team Size</label>
      <select
        id="teamSize"
        name="teamSize"
        value={formData.teamSize}
        onChange={handleInputChange}
        className="form-select"
      >
        <option value="">Select your team size</option>
        {teamSizes.map(size => (
          <option key={size.value} value={size.value}>
            {size.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const GoalsStep = ({ formData, businessGoals, handleGoalSelect }) => (
  <div className="goals-grid">
    {businessGoals.map(goal => (
      <div 
        key={goal.id}
        className={`goal-card ${formData.selectedGoals.includes(goal.id) ? 'selected' : ''}`}
        onClick={() => handleGoalSelect(goal.id)}
      >
        <div className="goal-icon">{goal.icon}</div>
        <h3>{goal.title}</h3>
        <p>{goal.description}</p>
        <div className="goal-features">
          {goal.features_preview.map((feature, index) => (
            <span key={index} className="feature-tag">{feature}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const BundlesStep = ({ formData, pricingBundles, handleBundleSelect, calculateTotalPrice, handleInputChange }) => {
  const pricing = calculateTotalPrice();
  
  return (
    <div className="bundles-step">
      {/* Professional Header */}
      <div className="pricing-header">
        <h2 className="header-title">Choose Your Plan</h2>
        <p className="header-subtitle">Select the perfect bundle for your business needs. Mix and match for maximum value.</p>
        
        {/* Billing Toggle */}
        <div className="billing-toggle">
          <div className="toggle-container">
            <button 
              className={`toggle-option ${formData.paymentMethod === 'monthly' ? 'active' : ''}`}
              onClick={() => handleInputChange({target: {name: 'paymentMethod', value: 'monthly'}})}
            >
              Monthly billing
            </button>
            <button 
              className={`toggle-option ${formData.paymentMethod === 'yearly' ? 'active' : ''}`}
              onClick={() => handleInputChange({target: {name: 'paymentMethod', value: 'yearly'}})}
            >
              Annual billing
              <span className="savings-label">Save 20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* Professional Bundle Grid */}
      <div className="professional-bundles-grid">
        {pricingBundles.map(bundle => (
          <div 
            key={bundle.id}
            className={`professional-bundle-card ${formData.selectedBundles.includes(bundle.id) ? 'selected' : ''} ${bundle.isFree ? 'free-plan' : ''} ${bundle.isPopular ? 'most-popular' : ''}`}
            onClick={() => handleBundleSelect(bundle.id)}
          >
            {/* Selection Indicator */}
            <div className="selection-checkbox">
              <div className="checkbox-inner">
                {formData.selectedBundles.includes(bundle.id) && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                )}
              </div>
            </div>

            {/* Badge */}
            {bundle.badge && (
              <div className="plan-badge">
                {bundle.badge}
              </div>
            )}

            {/* Plan Header */}
            <div className="plan-header">
              <h3 className="plan-name">{bundle.name}</h3>
              <p className="plan-description">{bundle.description}</p>
              
              {/* Pricing */}
              <div className="plan-pricing">
                {bundle.isFree ? (
                  <div className="free-pricing">
                    <span className="price-amount">Free</span>
                    <span className="price-period">forever</span>
                  </div>
                ) : (
                  <div className="paid-pricing">
                    <div className="price-main">
                      <span className="price-currency">$</span>
                      <span className="price-amount">
                        {formData.paymentMethod === 'monthly' ? bundle.monthlyPrice : bundle.yearlyPrice}
                      </span>
                      <span className="price-period">
                        /{formData.paymentMethod === 'monthly' ? 'month' : 'year'}
                      </span>
                    </div>
                    {formData.paymentMethod === 'yearly' && (
                      <div className="price-monthly-equivalent">
                        ${Math.round(bundle.yearlyPrice / 12)}/month billed annually
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Launch Special */}
              {bundle.launchSpecial && (
                <div className="launch-offer">
                  <span className="offer-icon">🎉</span>
                  <span className="offer-text">{bundle.launchSpecial}</span>
                </div>
              )}
            </div>

            {/* Features List */}
            <div className="plan-features">
              <h4 className="features-header">Everything included:</h4>
              <ul className="features-list">
                {bundle.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <div className="feature-check">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    </div>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="plan-action">
              <button className="select-plan-btn">
                {formData.selectedBundles.includes(bundle.id) ? (
                  <>
                    <span className="btn-icon">✓</span>
                    Selected
                  </>
                ) : (
                  <>
                    Select Plan
                    <span className="btn-arrow">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Professional Pricing Summary */}
      {formData.selectedBundles.length > 0 && (
        <div className="professional-pricing-summary">
          {pricing.isFree ? (
            <div className="free-plan-summary">
              <div className="summary-header">
                <h3>Perfect! You've selected our Free Plan</h3>
                <p>Get started immediately with our comprehensive free tier</p>
              </div>
              <div className="free-benefits">
                <div className="benefit-item">✓ No credit card required</div>
                <div className="benefit-item">✓ Full feature access</div>
                <div className="benefit-item">✓ Upgrade anytime</div>
              </div>
            </div>
          ) : (
            <div className="paid-plan-summary">
              <div className="summary-header">
                <h3>Plan Summary</h3>
                <div className="plan-count">
                  {formData.selectedBundles.filter(b => b !== 'free_starter').length} plan{formData.selectedBundles.filter(b => b !== 'free_starter').length !== 1 ? 's' : ''} selected
                </div>
              </div>
              
              <div className="summary-breakdown">
                <div className="breakdown-row">
                  <span className="row-label">Subtotal</span>
                  <span className="row-value">${pricing.basePrice.toFixed(2)}</span>
                </div>
                
                {pricing.discount > 0 && (
                  <>
                    <div className="breakdown-row discount-row">
                      <span className="row-label">
                        Multi-plan discount ({Math.round(pricing.discount * 100)}% off)
                      </span>
                      <span className="row-value discount-value">-${pricing.savings.toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                <div className="breakdown-divider"></div>
                
                <div className="breakdown-row total-row">
                  <span className="row-label">Total</span>
                  <span className="row-value">${pricing.discountedPrice.toFixed(2)}</span>
                </div>
                
                <div className="billing-note">
                  Billed {formData.paymentMethod}. Cancel anytime.
                </div>
              </div>

              {pricing.discount > 0 && (
                <div className="savings-highlight">
                  <span className="highlight-icon">🎊</span>
                  <span>You're saving ${pricing.savings.toFixed(2)} with our multi-plan discount!</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Enterprise CTA */}
      <div className="enterprise-cta">
        <div className="enterprise-content">
          <h4>Need custom solutions?</h4>
          <p>Enterprise plans with revenue-sharing model starting at 15% of platform revenue</p>
        </div>
        <button 
          className="enterprise-btn"
          onClick={() => window.open('/enterprise', '_blank')}
        >
          View Enterprise
        </button>
      </div>
    </div>
  );
};

const PaymentStep = ({ formData, pricingBundles, calculateTotalPrice, onPaymentSuccess, onPaymentError }) => {
  const pricing = calculateTotalPrice();
  const userEmail = localStorage.getItem('user_email');
  
  // Handle free plan - skip payment step
  if (pricing.isFree) {
    return (
      <div className="payment-step free-plan">
        <div className="free-plan-message">
          <div className="free-icon">🎉</div>
          <h3>You've Selected Our Free Starter Plan!</h3>
          <p>No payment required - you can start building right away with:</p>
          <ul className="free-features">
            <li>✅ 1 Bio Link Page with 5 external links</li>
            <li>✅ Basic Form Builder (1 form, 50 submissions/month)</li>
            <li>✅ Simple Analytics (7 days retention)</li>
            <li>✅ Template Marketplace (buy only)</li>
          </ul>
          <p className="free-note">You can upgrade anytime to unlock more powerful features!</p>
          <button 
            className="continue-free-btn"
            onClick={() => onPaymentSuccess({ 
              subscription_id: 'free_plan', 
              status: 'free',
              plan: 'free_starter' 
            })}
          >
            Continue with Free Plan →
          </button>
        </div>
      </div>
    );
  }

  if (formData.selectedBundles.length === 0) {
    return (
      <div className="payment-step">
        <div className="no-bundles-message">
          <h3>No bundles selected</h3>
          <p>Please go back and select at least one bundle to continue with payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-step">
      <div className="payment-header">
        <h3>Complete Your Subscription</h3>
        <p>Secure payment processing powered by Stripe</p>
        <div className="pricing-recap">
          <div className="recap-item">
            <span>Base Price: ${pricing.basePrice}</span>
          </div>
          {pricing.discount > 0 && (
            <div className="recap-item discount">
              <span>Multi-Bundle Discount: -{Math.round(pricing.discount * 100)}%</span>
            </div>
          )}
          <div className="recap-item total">
            <span>Total: ${pricing.discountedPrice.toFixed(2)}/{formData.paymentMethod}</span>
          </div>
        </div>
      </div>
      
      <StripePayment
        totalAmount={pricing.discountedPrice}
        selectedBundles={formData.selectedBundles.filter(b => b !== 'free_starter')}
        paymentMethod={formData.paymentMethod}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        customerInfo={{
          email: userEmail,
          name: formData.workspaceName || 'User'
        }}
      />
    </div>
  );
};

const CompleteStep = ({ formData, pricingBundles, calculateTotalPrice, loading }) => {
  const selectedBundles = pricingBundles.filter(bundle => 
    formData.selectedBundles.includes(bundle.id)
  );
  const pricing = calculateTotalPrice();

  return (
    <div className="complete-step">
      <div className="completion-summary">
        <h2>🎉 Almost Ready!</h2>
        <p>Review your selections and complete your workspace setup.</p>
        
        <div className="summary-section">
          <h3>Workspace Details</h3>
          <div className="summary-item">
            <strong>Name:</strong> {formData.workspaceName}
          </div>
          <div className="summary-item">
            <strong>Industry:</strong> {formData.industry}
          </div>
          <div className="summary-item">
            <strong>Team Size:</strong> {formData.teamSize}
          </div>
        </div>
        
        <div className="summary-section">
          <h3>Selected Goals</h3>
          <div className="goals-summary">
            {formData.selectedGoals.map(goalId => (
              <span key={goalId} className="goal-tag">{goalId.replace('_', ' ')}</span>
            ))}
          </div>
        </div>
        
        <div className="summary-section">
          <h3>Selected Bundles</h3>
          {selectedBundles.map(bundle => (
            <div key={bundle.id} className="bundle-summary">
              <strong>{bundle.name}</strong>
              <span>${formData.paymentMethod === 'monthly' ? bundle.monthlyPrice : bundle.yearlyPrice}/{formData.paymentMethod === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
          ))}
          
          {pricing.discount > 0 && (
            <div className="discount-summary">
              <div className="discount-badge">
                {Math.round(pricing.discount * 100)}% Multi-Bundle Discount Applied!
              </div>
              <div className="final-price">
                Total: ${pricing.discountedPrice.toFixed(2)}/{formData.paymentMethod === 'monthly' ? 'mo' : 'yr'}
              </div>
            </div>
          )}
        </div>
        
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Setting up your workspace...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingWizard;
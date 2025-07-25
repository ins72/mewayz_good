import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OnboardingWizard.css';

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    workspaceName: '',
    industry: '',
    teamSize: '',
    selectedGoals: [],
    selectedBundles: [],
    paymentMethod: 'monthly'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: 'Workspace Setup', description: 'Set up your workspace' },
    { id: 2, title: 'Business Details', description: 'Tell us about your business' },
    { id: 3, title: 'Choose Goals', description: 'Select your main objectives' },
    { id: 4, title: 'Select Bundles', description: 'Choose your feature bundles' },
    { id: 5, title: 'Complete Setup', description: 'Finalize your workspace' }
  ];

  const pricingBundles = [
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
      badge: null,
      launchSpecial: 'First 1000 users get 3 months for $9/month'
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
      badge: 'Most Popular',
      launchSpecial: 'First 500 users get 2 months free'
    },
    {
      id: 'social_media',
      name: 'Social Media Bundle',
      description: 'Advanced social media management',
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
      badge: null,
      launchSpecial: 'First 2 weeks free trial'
    },
    {
      id: 'business',
      name: 'Business Bundle',
      description: 'Advanced CRM and business tools',
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
      badge: 'Best Value',
      launchSpecial: '50% off first 3 months'
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
    const newBundles = formData.selectedBundles.includes(bundleId)
      ? formData.selectedBundles.filter(b => b !== bundleId)
      : [...formData.selectedBundles, bundleId];
    setFormData({
      ...formData,
      selectedBundles: newBundles
    });
  };

  const calculateBundleDiscount = () => {
    const bundleCount = formData.selectedBundles.length;
    if (bundleCount >= 4) return 0.40; // 40% discount for 4+ bundles
    if (bundleCount === 3) return 0.30; // 30% discount for 3 bundles
    if (bundleCount === 2) return 0.20; // 20% discount for 2 bundles
    return 0; // No discount for 1 bundle
  };

  const calculateTotalPrice = () => {
    const selectedBundles = pricingBundles.filter(bundle => 
      formData.selectedBundles.includes(bundle.id)
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
      savings: basePrice - discountedPrice
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
            />
          )}
          
          {currentStep === 5 && (
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

const BundlesStep = ({ formData, pricingBundles, handleBundleSelect, calculateTotalPrice }) => {
  const pricing = calculateTotalPrice();
  
  return (
    <div className="bundles-step">
      <div className="bundles-grid">
        {pricingBundles.map(bundle => (
          <div 
            key={bundle.id}
            className={`bundle-card ${formData.selectedBundles.includes(bundle.id) ? 'selected' : ''}`}
            onClick={() => handleBundleSelect(bundle.id)}
          >
            {bundle.badge && <div className="bundle-badge">{bundle.badge}</div>}
            <div className="bundle-header">
              <h3>{bundle.name}</h3>
              <div className="bundle-price">
                <span className="currency">$</span>
                <span className="amount">{formData.paymentMethod === 'monthly' ? bundle.monthlyPrice : bundle.yearlyPrice}</span>
                <span className="period">/{formData.paymentMethod === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              <p>{bundle.description}</p>
            </div>
            
            <div className="bundle-features">
              {bundle.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="feature-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  {feature}
                </div>
              ))}
              {bundle.features.length > 4 && (
                <div className="feature-item">
                  <span>+{bundle.features.length - 4} more features</span>
                </div>
              )}
            </div>
            
            {bundle.launchSpecial && (
              <div className="launch-special">
                🎉 {bundle.launchSpecial}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {formData.selectedBundles.length > 0 && (
        <div className="pricing-summary">
          <h3>Pricing Summary</h3>
          <div className="summary-row">
            <span>Base Price:</span>
            <span>${pricing.basePrice}/{formData.paymentMethod === 'monthly' ? 'mo' : 'yr'}</span>
          </div>
          {pricing.discount > 0 && (
            <>
              <div className="summary-row discount">
                <span>Multi-Bundle Discount ({Math.round(pricing.discount * 100)}%):</span>
                <span>-${pricing.savings.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${pricing.discountedPrice.toFixed(2)}/{formData.paymentMethod === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
            </>
          )}
        </div>
      )}
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
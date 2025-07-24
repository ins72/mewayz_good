import React, { useState, useEffect } from 'react';
import { BioLinkPage, CreatorDashboard, sampleBioPageData } from './components/CreatorBundle';
import './App.css';

const App = () => {
  const [currentView, setCurrentView] = useState('landing');
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch pricing data from our API
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    try {
      const response = await fetch('/api/bundles/pricing');
      if (response.ok) {
        const data = await response.json();
        setPricingData(data);
      }
    } catch (error) {
      console.error('Failed to fetch pricing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const NavigationHeader = () => (
    <header style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>MEWAYZ V2</h1>
        <nav>
          <button 
            onClick={() => setCurrentView('landing')}
            style={{ 
              background: currentView === 'landing' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px 16px',
              margin: '0 8px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentView('creator-demo')}
            style={{ 
              background: currentView === 'creator-demo' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px 16px',
              margin: '0 8px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🎨 Creator Demo
          </button>
          <button 
            onClick={() => setCurrentView('dashboard')}
            style={{ 
              background: currentView === 'dashboard' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: '2px solid rgba(255,255,255,0.3)',
              color: 'white',
              padding: '8px 16px',
              margin: '0 8px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Dashboard
          </button>
        </nav>
      </div>
    </header>
  );

  const LandingPage = () => (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '48px', fontWeight: '700', margin: '0 0 20px 0' }}>
          Complete Creator Economy Platform
        </h2>
        <p style={{ fontSize: '20px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
          Everything you need to build, manage, and scale your online business. 
          From bio links to e-commerce, courses to analytics - all in one powerful platform.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading pricing information...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '60px' }}>
          {pricingData && Object.entries(pricingData.bundles).map(([key, bundle]) => (
            <div key={key} style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              border: bundle.status?.includes('✅') ? '3px solid #10b981' : '2px solid #e5e7eb',
              position: 'relative'
            }}>
              {bundle.status?.includes('✅') && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  AVAILABLE NOW!
                </div>
              )}
              
              <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px 0' }}>
                {bundle.name}
              </h3>
              
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '36px', fontWeight: '700', color: '#3b82f6' }}>
                  ${bundle.price}
                </span>
                {bundle.price > 0 && <span style={{ color: '#6b7280' }}>/month</span>}
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0' }}>
                {bundle.features.map((feature, idx) => (
                  <li key={idx} style={{ 
                    padding: '8px 0', 
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#10b981', marginRight: '8px' }}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              {bundle.status && (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: bundle.status.includes('✅') ? '#ecfdf5' : '#fef3c7',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: bundle.status.includes('✅') ? '#065f46' : '#92400e',
                  marginBottom: '16px'
                }}>
                  {bundle.status}
                </div>
              )}
              
              <button style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: bundle.status?.includes('✅') ? '#3b82f6' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: bundle.status?.includes('✅') ? 'pointer' : 'not-allowed'
              }}>
                {bundle.status?.includes('✅') ? 'Get Started' : 'Coming Soon'}
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        backgroundColor: '#f9fafb',
        borderRadius: '16px',
        marginBottom: '40px'
      }}>
        <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 16px 0' }}>
          🎯 Multi-Bundle Discounts
        </h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#3b82f6' }}>20% OFF</div>
            <div style={{ color: '#6b7280' }}>2 Bundles</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#10b981' }}>30% OFF</div>
            <div style={{ color: '#6b7280' }}>3 Bundles</div>
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b' }}>40% OFF</div>
            <div style={{ color: '#6b7280' }}>4+ Bundles</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 20px 0' }}>
          Ready to Get Started?
        </h3>
        <button 
          onClick={() => setCurrentView('creator-demo')}
          style={{
            padding: '16px 32px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            marginRight: '16px'
          }}
        >
          🎨 Try Creator Bundle Demo
        </button>
        <button 
          onClick={() => setCurrentView('dashboard')}
          style={{
            padding: '16px 32px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
        >
          📊 View Dashboard
        </button>
      </div>
    </div>
  );

  const CreatorDemo = () => (
    <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', padding: '20px 0' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 16px 0' }}>
            🎨 Creator Bundle Demo
          </h2>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>
            Live preview of a professional bio link page - powered by MEWAYZ V2
          </p>
        </div>
        
        <div style={{ 
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <BioLinkPage pageData={sampleBioPageData} isPreview={true} />
        </div>
        
        <div style={{ 
          textAlign: 'center', 
          marginTop: '40px',
          padding: '30px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 16px 0' }}>
            ✨ Creator Bundle Features
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div>
              <h4 style={{ color: '#3b82f6', margin: '0 0 8px 0' }}>🔗 Bio Link Pages</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>Professional link-in-bio pages with custom domains and themes</p>
            </div>
            <div>
              <h4 style={{ color: '#10b981', margin: '0 0 8px 0' }}>📊 Analytics</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>Track views, clicks, and engagement with detailed insights</p>
            </div>
            <div>
              <h4 style={{ color: '#f59e0b', margin: '0 0 8px 0' }}>✍️ Content Creation</h4>
              <p style={{ color: '#6b7280', margin: 0 }}>Blog posts, articles, and content management system</p>
            </div>
          </div>
          
          <div style={{ marginTop: '30px' }}>
            <button 
              onClick={() => setCurrentView('dashboard')}
              style={{
                padding: '14px 28px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Start Creating - $19/month
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'creator-demo':
        return <CreatorDemo />;
      case 'dashboard':
        return <CreatorDashboard />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <NavigationHeader />
      {renderCurrentView()}
    </div>
  );
};

export default App;

import {
  ProductList,
  ProductEdit,
  ProductCreate,
  ProductShow
} from './components/products';

import {
  OrderList,
  OrderEdit,
  OrderShow
} from './components/orders';

import {
  CourseList,
  CourseEdit,
  CourseCreate,
  CourseShow
} from './components/courses';

import {
  BioLinkList,
  BioLinkEdit,
  BioLinkCreate,
  BioLinkShow
} from './components/biolinks';

import {
  WebsiteList,
  WebsiteEdit,
  WebsiteCreate,
  WebsiteShow
} from './components/websites';

import { PricingPage } from './components/Pricing';
import { SubscriptionList } from './components/subscriptions';

// Create data provider
const dataProvider = MewayzsDataProvider();

function App() {
  return (
    <Admin
      dataProvider={dataProvider}
      dashboard={MewayzDashboard}
      layout={MewayzLayout}
      theme={MewayzTheme}
      title="MEWAYZ V2 - Business Platform"
    >
      {/* Core CRM Resources */}
      <Resource
        name="customers"
        list={CustomerList}
        edit={CustomerEdit}
        create={CustomerCreate}
        show={CustomerShow}
        icon={People}
        options={{ label: 'Customers' }}
      />
      
      {/* E-commerce Resources */}
      <Resource
        name="products"
        list={ProductList}
        edit={ProductEdit}
        create={ProductCreate}
        show={ProductShow}
        icon={ShoppingCart}
        options={{ label: 'Products' }}
      />
      
      <Resource
        name="orders"
        list={OrderList}
        edit={OrderEdit}
        show={OrderShow}
        icon={Business}
        options={{ label: 'Orders' }}
      />
      
      {/* Education Resources */}
      <Resource
        name="courses"
        list={CourseList}
        edit={CourseEdit}
        create={CourseCreate}
        show={CourseShow}
        icon={School}
        options={{ label: 'Courses' }}
      />
      
      {/* Creator Resources */}
      <Resource
        name="biolinks"
        list={BioLinkList}
        edit={BioLinkEdit}
        create={BioLinkCreate}
        show={BioLinkShow}
        icon={Share}
        options={{ label: 'Bio Links' }}
      />
      
      <Resource
        name="websites"
        list={WebsiteList}
        edit={WebsiteEdit}
        create={WebsiteCreate}
        show={WebsiteShow}
        icon={Language}
        options={{ label: 'Websites' }}
      />
      
      {/* Business Resources */}
      <Resource
        name="subscriptions"
        list={SubscriptionList}
        icon={CreditCard}
        options={{ label: 'Subscriptions' }}
      />
      
      {/* Custom Routes */}
      <CustomRoutes>
        <Route path="/pricing" element={<PricingPage />} />
      </CustomRoutes>
    </Admin>
  );
}

export default App;
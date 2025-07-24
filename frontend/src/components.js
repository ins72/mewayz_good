import React, { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  UserGroupIcon, 
  ShoppingCartIcon, 
  CogIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
  ShareIcon,
  GlobeAltIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Mock data for dashboard
const mockData = {
  user: {
    name: "John Smith",
    company: "Tech Solutions Inc.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
  },
  metrics: {
    revenue: "$45,670",
    customers: "1,234",
    orders: "567",
    products: "89"
  },
  recentActivities: [
    { id: 1, type: "sale", description: "New order from ABC Corp", amount: "$2,450", time: "2 hours ago" },
    { id: 2, type: "customer", description: "Customer inquiry received", time: "4 hours ago" },
    { id: 3, type: "inventory", description: "Low stock alert: Product A", time: "6 hours ago" },
    { id: 4, type: "payment", description: "Payment received from XYZ Ltd", amount: "$1,200", time: "1 day ago" }
  ]
};

// Main modules/apps configuration
const modules = [
  {
    id: 'biolinks',
    name: 'Bio Links',
    description: 'Create stunning bio link pages',
    icon: ShareIcon,
    color: 'bg-purple-500',
    bundle: 'Creator',
    features: ['Unlimited links', 'Custom domains', 'Analytics']
  },
  {
    id: 'website',
    name: 'Website Builder',
    description: 'Professional website creation',
    icon: GlobeAltIcon,
    color: 'bg-blue-500',
    bundle: 'Creator',
    features: ['Drag & drop', 'SEO optimization', 'Mobile responsive']
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    description: 'Complete online store solution',
    icon: ShoppingCartIcon,
    color: 'bg-green-500',
    bundle: 'E-commerce',
    features: ['Product catalog', 'Payment processing', 'Inventory management']
  },
  {
    id: 'crm',
    name: 'CRM',
    description: 'Customer relationship management',
    icon: UserGroupIcon,
    color: 'bg-indigo-500',
    bundle: 'Business',
    features: ['Lead tracking', 'Contact management', 'Sales pipeline']
  },
  {
    id: 'social',
    name: 'Social Media',
    description: 'Social media management tools',
    icon: ShareIcon,
    color: 'bg-pink-500',
    bundle: 'Social Media',
    features: ['Post scheduling', 'Analytics', 'Multi-platform']
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Complete learning platform',
    icon: AcademicCapIcon,
    color: 'bg-yellow-500',
    bundle: 'Education',
    features: ['Course creation', 'Student management', 'Certificates']
  },
  {
    id: 'accounting',
    name: 'Accounting',
    description: 'Financial management',
    icon: CurrencyDollarIcon,
    color: 'bg-emerald-500',
    bundle: 'Operations',
    features: ['Invoicing', 'Expense tracking', 'Reports']
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Business intelligence and reporting',
    icon: ChartBarIcon,
    color: 'bg-orange-500',
    bundle: 'Business',
    features: ['Custom reports', 'Data visualization', 'KPI tracking']
  }
];

// Pricing bundles
const pricingBundles = [
  {
    id: 'free',
    name: 'Free Starter',
    price: '$0',
    period: 'month',
    color: 'bg-gray-500',
    features: [
      '1 Bio Link Page (5 external links)',
      'Basic Form Builder (1 form, 50 submissions)',
      'Simple Analytics (7 days retention)',
      'Buy templates only',
      'Mewayz branding required',
      'Community support'
    ]
  },
  {
    id: 'creator',
    name: 'Creator Bundle',
    price: '$19',
    period: 'month',
    originalPrice: '$228',
    yearlyPrice: '$190',
    color: 'bg-purple-500',
    popular: true,
    features: [
      'Advanced Bio Link Builder (unlimited links)',
      'Professional Website Builder (10 pages)',
      'SEO Optimization Suite',
      'AI Content Creation (500 credits/month)',
      'Buy & sell templates',
      'Remove Mewayz branding',
      'Email support'
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Bundle',
    price: '$24',
    period: 'month',
    originalPrice: '$288',
    yearlyPrice: '$240',
    color: 'bg-green-500',
    features: [
      'Complete E-commerce Store (unlimited products)',
      'Multi-vendor Marketplace (up to 10 vendors)',
      'Advanced Promotions (coupons, discounts)',
      'Payment Processing (Stripe/PayPal)',
      'Inventory Management',
      'Basic Analytics',
      'Priority Email Support'
    ]
  },
  {
    id: 'social',
    name: 'Social Media Bundle',
    price: '$29',
    period: 'month',
    originalPrice: '$348',
    yearlyPrice: '$290',
    color: 'bg-pink-500',
    features: [
      'Instagram Lead Database (1000 searches/month)',
      'Social Media Scheduling (all platforms)',
      'Twitter/TikTok Tools (advanced features)',
      'Social Analytics (detailed insights)',
      'Hashtag Research (trending hashtags)',
      'Priority Support'
    ]
  },
  {
    id: 'education',
    name: 'Education Bundle',
    price: '$29',
    period: 'month',
    originalPrice: '$348',
    yearlyPrice: '$290',
    color: 'bg-yellow-500',
    features: [
      'Complete Course Platform (unlimited students)',
      'Template Marketplace (create & sell)',
      'Student Management (progress tracking)',
      'Live Streaming (basic capabilities)',
      'Community Features (discussions)',
      'Priority Support'
    ]
  },
  {
    id: 'business',
    name: 'Business Bundle',
    price: '$39',
    period: 'month',
    originalPrice: '$468',
    yearlyPrice: '$390',
    color: 'bg-indigo-500',
    features: [
      'Advanced CRM System (unlimited contacts)',
      'Email Marketing (10,000 emails/month)',
      'Lead Management (scoring & tracking)',
      'Workflow Automation (10 workflows)',
      'Campaign Management (multi-channel)',
      'Business Analytics (detailed reporting)',
      'Phone + Email Support'
    ]
  }
];

// Header Component
export const Header = ({ user, onMenuToggle, isSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">MEWAYZ V2</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <button className="p-2 text-gray-500 hover:text-gray-700 relative">
            <BellIcon className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.company}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Sidebar Component
export const Sidebar = ({ activeModule, onModuleSelect, isSidebarOpen }) => {
  const navigation = [
    { name: 'Dashboard', icon: HomeIcon, id: 'dashboard' },
    { name: 'Apps', icon: CogIcon, id: 'apps' },
    { name: 'Pricing', icon: CurrencyDollarIcon, id: 'pricing' },
    { name: 'Settings', icon: CogIcon, id: 'settings' }
  ];

  return (
    <>
      <div className={`fixed inset-0 z-40 lg:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
      </div>
      
      <div className={`fixed top-0 left-0 z-50 w-64 h-full bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onModuleSelect(item.id)}
                    className={`${
                      activeModule === item.id
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md border-l-4 w-full text-left`}
                  >
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.name}
                  </button>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Quick Access
                </h3>
                <div className="mt-2 space-y-1">
                  {modules.slice(0, 6).map((module) => (
                    <button
                      key={module.id}
                      onClick={() => onModuleSelect(`module-${module.id}`)}
                      className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                    >
                      <div className={`mr-3 w-4 h-4 rounded ${module.color}`}></div>
                      {module.name}
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

// Dashboard Component
export const Dashboard = ({ metrics, activities }) => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
      </div>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.revenue}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Customers</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.customers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShoppingCartIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Orders</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.orders}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Products</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.products}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMGRhc2hib2FyZHxlbnwwfHx8fDE3NTMzNzA0ODR8MA&ixlib=rb-4.1.0&q=85" 
              alt="Revenue Chart" 
              className="w-full h-full object-cover rounded"
            />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                {activity.amount && (
                  <span className="text-sm font-medium text-green-600">{activity.amount}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Apps Component
export const Apps = ({ modules, onModuleSelect }) => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Apps</h2>
        <p className="text-gray-600">Discover and manage your business applications.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module) => (
          <div
            key={module.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onModuleSelect(`module-${module.id}`)}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center`}>
                <module.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{module.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  {module.bundle}
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">{module.description}</p>
            <div className="space-y-1">
              {module.features.slice(0, 3).map((feature, index) => (
                <div key={index} className="flex items-center text-xs text-gray-500">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                  {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pricing Component
export const Pricing = ({ bundles }) => {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  
  return (
    <div className="p-6">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">MEWAYZ V2 Smart Launch Pricing</h2>
        <p className="text-gray-600 mt-2">Aggressive user acquisition pricing for platform launch</p>
        
        <div className="mt-6 flex justify-center">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Yearly (Save up to 20%)
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bundles.map((bundle) => (
          <div
            key={bundle.id}
            className={`bg-white rounded-lg shadow-sm border-2 p-6 relative ${
              bundle.popular ? 'border-purple-500' : 'border-gray-200'
            }`}
          >
            {bundle.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">{bundle.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-gray-900">
                  {billingPeriod === 'yearly' && bundle.yearlyPrice ? 
                    `$${parseInt(bundle.yearlyPrice) / 12}` : bundle.price}
                </span>
                <span className="text-gray-500">/{bundle.period}</span>
              </div>
              {billingPeriod === 'yearly' && bundle.yearlyPrice && (
                <p className="text-sm text-green-600 mt-1">
                  Save ${parseInt(bundle.originalPrice) - parseInt(bundle.yearlyPrice)} yearly
                </p>
              )}
            </div>
            
            <ul className="space-y-3 mb-6">
              {bundle.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                bundle.popular
                  ? 'bg-purple-500 text-white hover:bg-purple-600'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {bundle.id === 'free' ? 'Get Started Free' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Enterprise Plan</h3>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
          <h4 className="text-2xl font-bold mb-2">MEWAYZ ENTERPRISE</h4>
          <p className="text-lg mb-4">15% of all revenue generated through the platform</p>
          <p className="text-sm opacity-90 mb-4">Minimum: $99/month • Aligned incentives: We succeed when you succeed</p>
          <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
};

// Module Detail Component
export const ModuleDetail = ({ moduleId, modules }) => {
  const module = modules.find(m => m.id === moduleId.replace('module-', ''));
  
  if (!module) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Module Not Found</h2>
          <p className="text-gray-600">The requested module could not be found.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-16 h-16 ${module.color} rounded-lg flex items-center justify-center`}>
            <module.icon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{module.name}</h2>
            <p className="text-gray-600">{module.description}</p>
            <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {module.bundle} Bundle
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Features</h3>
          <ul className="space-y-3">
            {module.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Getting Started</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-purple-600">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Choose your bundle</p>
                <p className="text-xs text-gray-500">Select the {module.bundle} bundle to access this module</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-purple-600">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Set up your account</p>
                <p className="text-xs text-gray-500">Complete the initial configuration</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-purple-600">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Start using {module.name}</p>
                <p className="text-xs text-gray-500">Begin creating and managing your content</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-600">
              Get Started with {module.name}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Demo Preview</h3>
          <div className="bg-white rounded-lg border-2 border-gray-200 h-64 flex items-center justify-center">
            <div className="text-center">
              <div className={`w-16 h-16 ${module.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <module.icon className="h-8 w-8 text-white" />
              </div>
              <p className="text-gray-500">Interactive demo coming soon</p>
              <p className="text-sm text-gray-400">This will show a live preview of {module.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export mock data and modules
export { mockData, modules, pricingBundles };
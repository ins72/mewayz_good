import { DataProvider } from 'react-admin';

// Mock data for all resources
const mockData = {
  customers: [
    {
      id: 1,
      name: 'John Smith',
      email: 'john@techsolutions.com',
      company: 'Tech Solutions Inc.',
      phone: '+1-555-0123',
      status: 'active',
      subscription: 'Creator Bundle',
      created_at: '2024-01-15T10:30:00Z',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      total_revenue: 2450.00,
      orders_count: 12
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@creativestudio.com',
      company: 'Creative Studio',
      phone: '+1-555-0124',
      status: 'active',
      subscription: 'E-commerce Bundle',
      created_at: '2024-02-20T14:15:00Z',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5cd?w=100&h=100&fit=crop&crop=face',
      total_revenue: 3200.00,
      orders_count: 8
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael@edutech.com',
      company: 'EduTech Solutions',
      phone: '+1-555-0125',
      status: 'trial',
      subscription: 'Education Bundle',
      created_at: '2024-03-10T09:45:00Z',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      total_revenue: 890.00,
      orders_count: 3
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily@socialboost.com',
      company: 'Social Boost Agency',
      phone: '+1-555-0126',
      status: 'active',
      subscription: 'Social Media Bundle',
      created_at: '2024-02-28T16:20:00Z',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      total_revenue: 1750.00,
      orders_count: 6
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david@bizmanage.com',
      company: 'Business Management Pro',
      phone: '+1-555-0127',
      status: 'active',
      subscription: 'Business Bundle',
      created_at: '2024-01-05T11:10:00Z',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      total_revenue: 4200.00,
      orders_count: 15
    }
  ],
  
  products: [
    {
      id: 1,
      name: 'Premium Bio Link Page',
      description: 'Professional bio link page with analytics',
      price: 29.99,
      category: 'Bio Links',
      status: 'active',
      stock: 999,
      sales: 156,
      image: 'https://images.unsplash.com/photo-1610834651699-1d76adff0c6c?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'E-commerce Store Template',
      description: 'Complete e-commerce solution with payment integration',
      price: 199.99,
      category: 'E-commerce',
      status: 'active',
      stock: 50,
      sales: 43,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Online Course Platform',
      description: 'Complete LMS with student management',
      price: 149.99,
      category: 'Education',
      status: 'active',
      stock: 75,
      sales: 28,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Social Media Dashboard',
      description: 'Multi-platform social media management tool',
      price: 79.99,
      category: 'Social Media',
      status: 'active',
      stock: 100,
      sales: 67,
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop'
    }
  ],
  
  orders: [
    {
      id: 1,
      customer_id: 1,
      customer_name: 'John Smith',
      total: 199.99,
      status: 'completed',
      created_at: '2024-06-20T10:30:00Z',
      items: [
        { product: 'E-commerce Store Template', quantity: 1, price: 199.99 }
      ]
    },
    {
      id: 2,
      customer_id: 2,
      customer_name: 'Sarah Johnson',
      total: 149.99,
      status: 'processing',
      created_at: '2024-06-21T14:15:00Z',
      items: [
        { product: 'Online Course Platform', quantity: 1, price: 149.99 }
      ]
    },
    {
      id: 3,
      customer_id: 3,
      customer_name: 'Michael Chen',
      total: 79.99,
      status: 'shipped',
      created_at: '2024-06-22T09:45:00Z',
      items: [
        { product: 'Social Media Dashboard', quantity: 1, price: 79.99 }
      ]
    }
  ],
  
  courses: [
    {
      id: 1,
      title: 'Digital Marketing Mastery',
      description: 'Complete guide to digital marketing strategies',
      instructor: 'Sarah Johnson',
      price: 199.99,
      students: 342,
      rating: 4.8,
      duration: '12 hours',
      lessons: 45,
      status: 'published',
      image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'E-commerce Business Building',
      description: 'Learn to build and scale your online store',
      instructor: 'Michael Chen',
      price: 299.99,
      students: 178,
      rating: 4.9,
      duration: '18 hours',
      lessons: 62,
      status: 'published',
      image: 'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Social Media Growth Strategies',
      description: 'Advanced tactics for social media growth',
      instructor: 'Emily Rodriguez',
      price: 149.99,
      students: 456,
      rating: 4.7,
      duration: '8 hours',
      lessons: 28,
      status: 'published',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop'
    }
  ],
  
  biolinks: [
    {
      id: 1,
      title: 'John\'s Professional Links',
      url: 'mewayz.com/john-smith',
      owner: 'John Smith',
      links_count: 8,
      clicks: 1240,
      status: 'active',
      created_at: '2024-05-15T10:30:00Z',
      theme: 'Professional Dark'
    },
    {
      id: 2,
      title: 'Creative Studio Hub',
      url: 'mewayz.com/creative-studio',
      owner: 'Sarah Johnson',
      links_count: 12,
      clicks: 2180,
      status: 'active',
      created_at: '2024-04-20T14:15:00Z',
      theme: 'Colorful Gradient'
    },
    {
      id: 3,
      title: 'EduTech Resources',
      url: 'mewayz.com/edutech',
      owner: 'Michael Chen',
      links_count: 6,
      clicks: 890,
      status: 'active',
      created_at: '2024-06-10T09:45:00Z',
      theme: 'Minimal Clean'
    }
  ],
  
  websites: [
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      domain: 'techsolutions.com',
      owner: 'John Smith',
      status: 'live',
      template: 'Business Pro',
      pages: 8,
      visitors: 2340,
      created_at: '2024-03-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Creative Studio Portfolio',
      domain: 'creativestudio.art',
      owner: 'Sarah Johnson',
      status: 'live',
      template: 'Portfolio Modern',
      pages: 12,
      visitors: 1890,
      created_at: '2024-04-20T14:15:00Z'
    },
    {
      id: 3,
      name: 'EduTech Learning',
      domain: 'edutechlearning.com',
      owner: 'Michael Chen',
      status: 'draft',
      template: 'Education Hub',
      pages: 6,
      visitors: 450,
      created_at: '2024-06-10T09:45:00Z'
    }
  ],
  
  subscriptions: [
    {
      id: 1,
      customer: 'John Smith',
      plan: 'Creator Bundle',
      price: 19.00,
      status: 'active',
      next_billing: '2024-07-24',
      created_at: '2024-06-24T10:30:00Z'
    },
    {
      id: 2,
      customer: 'Sarah Johnson',
      plan: 'E-commerce Bundle',
      price: 24.00,
      status: 'active',
      next_billing: '2024-07-28',
      created_at: '2024-06-28T14:15:00Z'
    },
    {
      id: 3,
      customer: 'Michael Chen',
      plan: 'Education Bundle',
      price: 29.00,
      status: 'trial',
      next_billing: '2024-07-10',
      created_at: '2024-06-10T09:45:00Z'
    },
    {
      id: 4,
      customer: 'Emily Rodriguez',
      plan: 'Social Media Bundle',
      price: 29.00,
      status: 'active',
      next_billing: '2024-07-25',
      created_at: '2024-06-25T16:20:00Z'
    },
    {
      id: 5,
      customer: 'David Wilson',
      plan: 'Business Bundle',
      price: 39.00,
      status: 'active',
      next_billing: '2024-07-22',
      created_at: '2024-06-22T11:10:00Z'
    }
  ]
};

// Simulate API delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const MewayzsDataProvider = (): DataProvider => ({
  getList: async (resource, params) => {
    await delay(300); // Simulate API delay
    
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const filters = params.filter;
    
    let data = mockData[resource] || [];
    
    // Apply filters
    if (filters && Object.keys(filters).length > 0) {
      data = data.filter(item => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          const itemValue = item[key];
          if (typeof itemValue === 'string') {
            return itemValue.toLowerCase().includes(value.toLowerCase());
          }
          return itemValue === value;
        });
      });
    }
    
    // Apply sorting
    if (field) {
      data.sort((a, b) => {
        if (order === 'ASC') {
          return a[field] > b[field] ? 1 : -1;
        }
        return a[field] < b[field] ? 1 : -1;
      });
    }
    
    const total = data.length;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    
    return {
      data: data.slice(start, end),
      total,
    };
  },

  getOne: async (resource, params) => {
    await delay(200);
    const data = mockData[resource]?.find(item => item.id == params.id);
    if (!data) {
      throw new Error(`Record not found: ${resource}/${params.id}`);
    }
    return { data };
  },

  getMany: async (resource, params) => {
    await delay(200);
    const data = mockData[resource]?.filter(item => params.ids.includes(item.id)) || [];
    return { data };
  },

  getManyReference: async (resource, params) => {
    await delay(300);
    const { target, id } = params;
    let data = mockData[resource] || [];
    
    // Filter by reference
    data = data.filter(item => item[target] == id);
    
    return {
      data,
      total: data.length,
    };
  },

  create: async (resource, params) => {
    await delay(300);
    const newRecord = {
      id: Math.max(...mockData[resource].map(r => r.id)) + 1,
      ...params.data,
      created_at: new Date().toISOString(),
    };
    
    mockData[resource].push(newRecord);
    return { data: newRecord };
  },

  update: async (resource, params) => {
    await delay(300);
    const index = mockData[resource].findIndex(item => item.id == params.id);
    if (index === -1) {
      throw new Error(`Record not found: ${resource}/${params.id}`);
    }
    
    const updatedRecord = {
      ...mockData[resource][index],
      ...params.data,
      updated_at: new Date().toISOString(),
    };
    
    mockData[resource][index] = updatedRecord;
    return { data: updatedRecord };
  },

  updateMany: async (resource, params) => {
    await delay(300);
    const updatedIds = [];
    
    params.ids.forEach(id => {
      const index = mockData[resource].findIndex(item => item.id == id);
      if (index !== -1) {
        mockData[resource][index] = {
          ...mockData[resource][index],
          ...params.data,
          updated_at: new Date().toISOString(),
        };
        updatedIds.push(id);
      }
    });
    
    return { data: updatedIds };
  },

  delete: async (resource, params) => {
    await delay(300);
    const index = mockData[resource].findIndex(item => item.id == params.id);
    if (index === -1) {
      throw new Error(`Record not found: ${resource}/${params.id}`);
    }
    
    const deletedRecord = mockData[resource][index];
    mockData[resource].splice(index, 1);
    return { data: deletedRecord };
  },

  deleteMany: async (resource, params) => {
    await delay(300);
    const deletedIds = [];
    
    params.ids.forEach(id => {
      const index = mockData[resource].findIndex(item => item.id == id);
      if (index !== -1) {
        mockData[resource].splice(index, 1);
        deletedIds.push(id);
      }
    });
    
    return { data: deletedIds };
  },
});
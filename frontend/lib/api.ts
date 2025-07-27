/**
 * MEWAYZ V2 - Production API Service Layer
 * Replaces all mock data with real API calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  role?: 'creator' | 'business' | 'enterprise';
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
  };
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id?: string;
  category_name: string;
  image_urls: string[];
  stock: number;
  sku: string;
  is_active: boolean;
  tags: string[];
  vendor_id?: string;
  vendor_name: string;
  bundle_type?: string;
  is_digital: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCreate {
  name: string;
  description: string;
  price: number;
  category_id?: string;
  category_name: string;
  image_urls: string[];
  stock: number;
  sku: string;
  is_active: boolean;
  tags: string[];
  bundle_type?: string;
  is_digital: boolean;
}

// User/Customer Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  login: string;
  email: string;
  avatar: string;
  price: number;
  percentage: number;
  purchased: number;
  comments: number;
  likes: number;
  created_at: string;
}

// Order Types
export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  created_at: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

// Message Types
export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  is_read: boolean;
  is_deleted: boolean;
  created_at: string;
}

// Comment Types
export interface Comment {
  id: string;
  user_id: string;
  product_id: string;
  content: string;
  rating?: number;
  is_approved: boolean;
  created_at: string;
  user: {
    name: string;
    avatar: string;
  };
}

// Notification Types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  created_at: string;
}

// BioLink Types
export interface BioLink {
  id: string;
  user_id: string;
  title: string;
  url: string;
  theme: string;
  links_count: number;
  clicks: number;
  status: 'active' | 'inactive';
  created_at: string;
}

// Analytics Types
export interface AnalyticsData {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  revenue_chart: ChartData[];
  orders_chart: ChartData[];
  customers_chart: ChartData[];
}

export interface ChartData {
  date: string;
  value: number;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadTokens();
  }

  private loadTokens() {
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('access_token');
      this.refreshToken = localStorage.getItem('refresh_token');
    }
  }

  private saveTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401 && this.refreshToken) {
        // Try to refresh token
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request
          headers.Authorization = `Bearer ${this.accessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          
          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }
          
          return await retryResponse.json();
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh_token: this.refreshToken,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        this.saveTokens(data.access_token, data.refresh_token);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    this.clearTokens();
    return false;
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.access_token) {
      this.saveTokens(response.access_token, response.refresh_token);
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.access_token) {
      this.saveTokens(response.access_token, response.refresh_token);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearTokens();
    }
  }

  // Product Methods
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category_id?: string;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<Product>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<PaginatedResponse<Product>>(`/products?${searchParams}`);
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async createProduct(product: ProductCreate): Promise<Product> {
    return this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async updateProduct(id: string, product: Partial<ProductCreate>): Promise<Product> {
    return this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.request<void>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // User/Customer Methods
  async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedResponse<Customer>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<PaginatedResponse<Customer>>(`/users?${searchParams}`);
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.request<Customer>(`/users/${id}`);
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Order Methods
  async getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Order>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<PaginatedResponse<Order>>(`/orders?${searchParams}`);
  }

  async getOrder(id: string): Promise<Order> {
    return this.request<Order>(`/orders/${id}`);
  }

  async createOrder(orderData: {
    items: Array<{ product_id: string; quantity: number }>;
  }): Promise<Order> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  // Message Methods
  async getMessages(params?: {
    page?: number;
    limit?: number;
    is_read?: boolean;
  }): Promise<PaginatedResponse<Message>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<PaginatedResponse<Message>>(`/messages?${searchParams}`);
  }

  async sendMessage(messageData: {
    recipient_id: string;
    subject: string;
    content: string;
    message_type?: 'text' | 'image' | 'file';
  }): Promise<Message> {
    return this.request<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async markMessageAsRead(id: string): Promise<void> {
    return this.request<void>(`/messages/${id}/read`, {
      method: 'PUT',
    });
  }

  // Comment Methods
  async getComments(params?: {
    page?: number;
    limit?: number;
    product_id?: string;
    is_approved?: boolean;
  }): Promise<PaginatedResponse<Comment>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<PaginatedResponse<Comment>>(`/comments?${searchParams}`);
  }

  async createComment(commentData: {
    product_id: string;
    content: string;
    rating?: number;
  }): Promise<Comment> {
    return this.request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async approveComment(id: string): Promise<void> {
    return this.request<void>(`/comments/${id}/approve`, {
      method: 'PUT',
    });
  }

  // Notification Methods
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    is_read?: boolean;
  }): Promise<PaginatedResponse<Notification>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<PaginatedResponse<Notification>>(`/notifications?${searchParams}`);
  }

  async markNotificationAsRead(id: string): Promise<void> {
    return this.request<void>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  // BioLink Methods
  async getBioLinks(params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<BioLink>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }
    
    return this.request<PaginatedResponse<BioLink>>(`/biolinks?${searchParams}`);
  }

  async createBioLink(bioLinkData: {
    title: string;
    theme: string;
  }): Promise<BioLink> {
    return this.request<BioLink>('/biolinks', {
      method: 'POST',
      body: JSON.stringify(bioLinkData),
    });
  }

  // Analytics Methods
  async getAnalytics(): Promise<AnalyticsData> {
    return this.request<AnalyticsData>('/analytics/dashboard');
  }

  async getRevenueChart(period: '7d' | '30d' | '90d' | '1y'): Promise<ChartData[]> {
    return this.request<ChartData[]>(`/analytics/revenue?period=${period}`);
  }

  async getOrdersChart(period: '7d' | '30d' | '90d' | '1y'): Promise<ChartData[]> {
    return this.request<ChartData[]>(`/analytics/orders?period=${period}`);
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getCurrentUser(): User | null {
    // This would typically decode the JWT token
    // For now, we'll return null and let the backend handle user info
    return null;
  }
}

// Create and export the API client instance
export const apiClient = new ApiClient(API_BASE_URL); 
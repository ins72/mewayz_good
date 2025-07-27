/**
 * API Test Suite for MEWAYZ V2 Real Data Integration
 * Tests all API endpoints and data fetching functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import API hooks
import { 
    useProducts, 
    useCustomers, 
    useUserMessages, 
    useUserNotifications,
    useProductComments,
    useCreators,
    useUserTransactions,
    useDashboardOverview,
    useRevenueAnalytics
} from '@/hooks/useApi';

// Mock API responses
const mockProducts = [
    {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        category_id: '1',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z'
    }
];

const mockCustomers = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active',
        created_at: '2024-01-01T00:00:00Z'
    }
];

const mockMessages = [
    {
        id: '1',
        sender_id: '1',
        recipient_id: '2',
        content: 'Test message',
        is_read: false,
        created_at: '2024-01-01T00:00:00Z'
    }
];

const mockNotifications = [
    {
        id: '1',
        user_id: '1',
        title: 'Test Notification',
        message: 'Test notification message',
        notification_type: 'info',
        is_read: false,
        created_at: '2024-01-01T00:00:00Z'
    }
];

const mockComments = [
    {
        id: '1',
        user_id: '1',
        product_id: '1',
        content: 'Test comment',
        rating: 5,
        is_approved: true,
        created_at: '2024-01-01T00:00:00Z'
    }
];

const mockCreators = [
    {
        id: '1',
        name: 'Test Creator',
        bio: 'Test bio',
        avatar: '/images/avatar.jpg',
        followers_count: 100,
        created_at: '2024-01-01T00:00:00Z'
    }
];

const mockTransactions = [
    {
        id: '1',
        user_id: '1',
        product_id: '1',
        amount: 99.99,
        status: 'completed',
        created_at: '2024-01-01T00:00:00Z'
    }
];

const mockDashboardData = {
    metrics: {
        revenue: { value: '10,000', growth: 15.5 },
        customers: { value: '1,234', growth: 8.2 },
        orders: { value: '567', growth: 12.1 },
        products: { value: '89', growth: 5.3 }
    },
    recent_activity: []
};

const mockRevenueData = {
    total_revenue: 10000,
    monthly_growth: 15.5,
    top_products: [],
    revenue_by_period: []
};

// Mock fetch function
global.fetch = vi.fn();

// Create test wrapper
const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe('API Hooks', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('useProducts', () => {
        it('should fetch products successfully', async () => {
            (fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: mockProducts, total: 1 })
            });

            const { result } = renderHook(() => useProducts({ limit: 10 }), {
                wrapper: createWrapper()
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data?.data).toEqual(mockProducts);
            expect(result.current.error).toBeNull();
        });

        it('should handle API errors', async () => {
            (fetch as any).mockRejectedValueOnce(new Error('API Error'));

            const { result } = renderHook(() => useProducts({ limit: 10 }), {
                wrapper: createWrapper()
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.error).toBeTruthy();
            expect(result.current.data).toBeNull();
        });
    });

    describe('useCustomers', () => {
        it('should fetch customers successfully', async () => {
            (fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: mockCustomers, total: 1 })
            });

            const { result } = renderHook(() => useCustomers({ limit: 10 }), {
                wrapper: createWrapper()
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data?.data).toEqual(mockCustomers);
            expect(result.current.error).toBeNull();
        });
    });

    describe('useUserMessages', () => {
        it('should fetch user messages successfully', async () => {
            (fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: mockMessages, total: 1 })
            });

            const { result } = renderHook(() => useUserMessages(), {
                wrapper: createWrapper()
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data?.data).toEqual(mockMessages);
            expect(result.current.error).toBeNull();
        });
    });

    describe('useUserNotifications', () => {
        it('should fetch user notifications successfully', async () => {
            (fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: mockNotifications, total: 1 })
            });

            const { result } = renderHook(() => useUserNotifications(), {
                wrapper: createWrapper()
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data?.data).toEqual(mockNotifications);
            expect(result.current.error).toBeNull();
        });
    });

    describe('useProductComments', () => {
        it('should fetch product comments successfully', async () => {
            (fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: mockComments, total: 1 })
            });

            const { result } = renderHook(() => useProductComments('1'), {
                wrapper: createWrapper()
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data?.data).toEqual(mockComments);
            expect(result.current.error).toBeNull();
        });
    });

    describe('useCreators', () => {
        it('should fetch creators successfully', async () => {
            (fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: mockCreators, total: 1 })
            });

            const { result } = renderHook(() => useCreators({ limit: 10 }), {
                wrapper: createWrapper()
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data?.data).toEqual(mockCreators);
            expect(result.current.error).toBeNull();
        });
    });

    describe('useUserTransactions', () => {
        it('should fetch user transactions successfully', async () => {
            (fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ data: mockTransactions, total: 1 })
            });

            const { result } = renderHook(() => useUserTransactions({ period: '30d' }), {
                wrapper: createWrapper()
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data?.data).toEqual(mockTransactions);
            expect(result.current.error).toBeNull();
        });
    });

    describe('useDashboardOverview', () => {
        it('should fetch dashboard data successfully', async () => {
            (fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockDashboardData
            });

            const { result } = renderHook(() => useDashboardOverview('30d'), {
                wrapper: createWrapper()
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data).toEqual(mockDashboardData);
            expect(result.current.error).toBeNull();
        });
    });

    describe('useRevenueAnalytics', () => {
        it('should fetch revenue analytics successfully', async () => {
            (fetch as any).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRevenueData
            });

            const { result } = renderHook(() => useRevenueAnalytics('30d'), {
                wrapper: createWrapper()
            });

            await waitFor(() => {
                expect(result.current.loading).toBe(false);
            });

            expect(result.current.data).toEqual(mockRevenueData);
            expect(result.current.error).toBeNull();
        });
    });
});

describe('API Error Handling', () => {
    it('should handle network errors', async () => {
        (fetch as any).mockRejectedValueOnce(new Error('Network Error'));

        const { result } = renderHook(() => useProducts({ limit: 10 }), {
            wrapper: createWrapper()
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toContain('Network Error');
    });

    it('should handle HTTP errors', async () => {
        (fetch as any).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error'
        });

        const { result } = renderHook(() => useProducts({ limit: 10 }), {
            wrapper: createWrapper()
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBeTruthy();
    });

    it('should handle authentication errors', async () => {
        (fetch as any).mockResolvedValueOnce({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        });

        const { result } = renderHook(() => useProducts({ limit: 10 }), {
            wrapper: createWrapper()
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toContain('Unauthorized');
    });
});

describe('API Data Validation', () => {
    it('should validate product data structure', async () => {
        const invalidProduct = {
            id: '1',
            name: 'Test Product'
            // Missing required fields
        };

        (fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [invalidProduct], total: 1 })
        });

        const { result } = renderHook(() => useProducts({ limit: 10 }), {
            wrapper: createWrapper()
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        // Should handle invalid data gracefully
        expect(result.current.data?.data).toBeDefined();
    });

    it('should handle empty responses', async () => {
        (fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: [], total: 0 })
        });

        const { result } = renderHook(() => useProducts({ limit: 10 }), {
            wrapper: createWrapper()
        });

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.data?.data).toEqual([]);
        expect(result.current.data?.total).toBe(0);
    });
}); 
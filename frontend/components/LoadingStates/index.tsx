import React from 'react';
import Spinner from '@/components/Spinner';

// Loading Skeleton Components
export const SkeletonCard = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}>
        <div className="h-4 bg-gray-300 rounded mb-2"></div>
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
    </div>
);

export const SkeletonProduct = () => (
    <div className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-lg mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    </div>
);

export const SkeletonCustomer = () => (
    <div className="animate-pulse flex items-center space-x-3 p-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
    </div>
);

export const SkeletonMessage = () => (
    <div className="animate-pulse flex items-center space-x-3 p-4 border-b">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>
);

export const SkeletonNotification = () => (
    <div className="animate-pulse p-4 border-b">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
);

export const SkeletonComment = () => (
    <div className="animate-pulse p-4 border-b">
        <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
);

// Loading State Components
export const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
    <div className="flex flex-col items-center justify-center py-8">
        <Spinner />
        <p className="mt-2 text-gray-600">{message}</p>
    </div>
);

export const LoadingGrid = ({ count = 6, type = "product" }: { count?: number; type?: "product" | "customer" | "message" | "notification" | "comment" }) => {
    const SkeletonComponent = {
        product: SkeletonProduct,
        customer: SkeletonCustomer,
        message: SkeletonMessage,
        notification: SkeletonNotification,
        comment: SkeletonComment
    }[type] || SkeletonProduct;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonComponent key={index} />
            ))}
        </div>
    );
};

export const LoadingList = ({ count = 5, type = "message" }: { count?: number; type?: "product" | "customer" | "message" | "notification" | "comment" }) => {
    const SkeletonComponent = {
        product: SkeletonProduct,
        customer: SkeletonCustomer,
        message: SkeletonMessage,
        notification: SkeletonNotification,
        comment: SkeletonComment
    }[type] || SkeletonMessage;

    return (
        <div className="space-y-2">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonComponent key={index} />
            ))}
        </div>
    );
};

// Table Loading State
export const LoadingTable = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
    <div className="overflow-x-auto">
        <table className="min-w-full">
            <thead>
                <tr>
                    {Array.from({ length: columns }).map((_, index) => (
                        <th key={index} className="px-4 py-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <td key={colIndex} className="px-4 py-2">
                                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Dashboard Loading State
export const LoadingDashboard = () => (
    <div className="space-y-6">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} className="h-24" />
            ))}
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonCard className="h-64" />
            <SkeletonCard className="h-64" />
        </div>
        
        {/* Recent Activity */}
        <SkeletonCard className="h-48" />
    </div>
);

// Page Loading State
export const LoadingPage = ({ title }: { title?: string }) => (
    <div className="min-h-screen flex flex-col items-center justify-center">
        <Spinner />
        {title && <h2 className="mt-4 text-xl font-semibold text-gray-700">{title}</h2>}
        <p className="mt-2 text-gray-600">Loading your content...</p>
    </div>
); 
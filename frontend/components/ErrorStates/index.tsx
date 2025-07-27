import React from 'react';
import Button from '@/components/Button';
import Icon from '@/components/Icon';

// Error State Components
export const ErrorMessage = ({ 
    title = "Something went wrong", 
    message = "An error occurred while loading your data. Please try again.",
    onRetry,
    className = ""
}: {
    title?: string;
    message?: string;
    onRetry?: () => void;
    className?: string;
}) => (
    <div className={`text-center py-8 ${className}`}>
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Icon name="warning" className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">{message}</p>
        {onRetry && (
            <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700">
                Try Again
            </Button>
        )}
    </div>
);

export const NetworkError = ({ onRetry }: { onRetry?: () => void }) => (
    <ErrorMessage
        title="Network Error"
        message="Unable to connect to the server. Please check your internet connection and try again."
        onRetry={onRetry}
    />
);

export const NotFoundError = ({ 
    title = "Not Found", 
    message = "The requested resource could not be found.",
    onGoBack 
}: {
    title?: string;
    message?: string;
    onGoBack?: () => void;
}) => (
    <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Icon name="search" className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">{message}</p>
        {onGoBack && (
            <Button onClick={onGoBack} className="bg-gray-600 hover:bg-gray-700">
                Go Back
            </Button>
        )}
    </div>
);

export const EmptyState = ({ 
    title = "No data found", 
    message = "There are no items to display at the moment.",
    icon = "inbox",
    action,
    actionLabel = "Create New"
}: {
    title?: string;
    message?: string;
    icon?: string;
    action?: () => void;
    actionLabel?: string;
}) => (
    <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Icon name={icon} className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">{message}</p>
        {action && (
            <Button onClick={action} className="bg-blue-600 hover:bg-blue-700">
                {actionLabel}
            </Button>
        )}
    </div>
);

export const PermissionError = ({ 
    title = "Access Denied", 
    message = "You don't have permission to access this resource.",
    onContactSupport 
}: {
    title?: string;
    message?: string;
    onContactSupport?: () => void;
}) => (
    <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <Icon name="lock" className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 max-w-md mx-auto">{message}</p>
        {onContactSupport && (
            <Button onClick={onContactSupport} className="bg-yellow-600 hover:bg-yellow-700">
                Contact Support
            </Button>
        )}
    </div>
);

export const ServerError = ({ 
    title = "Server Error", 
    message = "The server encountered an error. Please try again later.",
    onRetry,
    errorCode 
}: {
    title?: string;
    message?: string;
    onRetry?: () => void;
    errorCode?: string;
}) => (
    <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Icon name="server" className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-2 max-w-md mx-auto">{message}</p>
        {errorCode && (
            <p className="text-sm text-gray-500 mb-4">Error Code: {errorCode}</p>
        )}
        {onRetry && (
            <Button onClick={onRetry} className="bg-red-600 hover:bg-red-700">
                Try Again
            </Button>
        )}
    </div>
);

export const ValidationError = ({ 
    errors,
    onFix 
}: {
    errors: string[];
    onFix?: () => void;
}) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center mb-3">
            <Icon name="warning" className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="text-sm font-semibold text-red-800">Validation Errors</h3>
        </div>
        <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
                <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    {error}
                </li>
            ))}
        </ul>
        {onFix && (
            <Button onClick={onFix} className="mt-3 bg-red-600 hover:bg-red-700 text-sm">
                Fix Errors
            </Button>
        )}
    </div>
);

export const LoadingError = ({ 
    error,
    onRetry,
    loading 
}: {
    error: string | null;
    onRetry?: () => void;
    loading: boolean;
}) => {
    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
            </div>
        );
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={onRetry} />;
    }

    return null;
};

// Page Error States
export const PageError = ({ 
    error,
    onRetry 
}: {
    error: string;
    onRetry?: () => void;
}) => (
    <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage
            title="Page Error"
            message={error}
            onRetry={onRetry}
        />
    </div>
);

export const PageNotFound = ({ onGoHome }: { onGoHome?: () => void }) => (
    <div className="min-h-screen flex items-center justify-center">
        <NotFoundError
            title="Page Not Found"
            message="The page you're looking for doesn't exist."
            onGoBack={onGoHome}
        />
    </div>
); 
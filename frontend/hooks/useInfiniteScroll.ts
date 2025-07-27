import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
    threshold?: number;
    rootMargin?: string;
    enabled?: boolean;
}

interface UseInfiniteScrollReturn {
    isIntersecting: boolean;
    ref: (node: Element | null) => void;
    reset: () => void;
}

export const useInfiniteScroll = (
    onIntersect: () => void,
    options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn => {
    const { threshold = 0.1, rootMargin = '0px', enabled = true } = options;
    const [isIntersecting, setIsIntersecting] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const elementRef = useRef<Element | null>(null);

    const reset = useCallback(() => {
        setIsIntersecting(false);
        if (observerRef.current && elementRef.current) {
            observerRef.current.unobserve(elementRef.current);
        }
    }, []);

    const ref = useCallback((node: Element | null) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        elementRef.current = node;

        if (node && enabled) {
            observerRef.current = new IntersectionObserver(
                ([entry]) => {
                    setIsIntersecting(entry.isIntersecting);
                    if (entry.isIntersecting) {
                        onIntersect();
                    }
                },
                {
                    threshold,
                    rootMargin,
                }
            );

            observerRef.current.observe(node);
        }
    }, [onIntersect, threshold, rootMargin, enabled]);

    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return { isIntersecting, ref, reset };
};

// Hook for paginated data with infinite scroll
export const useInfiniteData = <T>(
    fetchData: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
    initialPage = 1
) => {
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(initialPage);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        setError(null);

        try {
            const result = await fetchData(page);
            setData(prev => [...prev, ...result.data]);
            setHasMore(result.hasMore);
            setPage(prev => prev + 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, [fetchData, page, loading, hasMore]);

    const reset = useCallback(() => {
        setData([]);
        setPage(initialPage);
        setHasMore(true);
        setLoading(false);
        setError(null);
    }, [initialPage]);

    return {
        data,
        loading,
        error,
        hasMore,
        loadMore,
        reset,
    };
};

// Hook for virtual scrolling (for large lists)
export const useVirtualScroll = <T>(
    items: T[],
    itemHeight: number,
    containerHeight: number
) => {
    const [scrollTop, setScrollTop] = useState(0);

    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;

    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
        setScrollTop(event.currentTarget.scrollTop);
    }, []);

    return {
        visibleItems,
        offsetY,
        handleScroll,
        totalHeight: items.length * itemHeight,
    };
};

// Hook for debounced search
export const useDebouncedSearch = (
    searchFunction: (query: string) => void,
    delay = 300
) => {
    const [searchTerm, setSearchTerm] = useState('');
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (searchTerm) {
            timeoutRef.current = setTimeout(() => {
                searchFunction(searchTerm);
            }, delay);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchTerm, searchFunction, delay]);

    return { searchTerm, setSearchTerm };
};

// Hook for optimized list rendering
export const useOptimizedList = <T>(
    items: T[],
    keyExtractor: (item: T, index: number) => string | number,
    options: {
        batchSize?: number;
        delay?: number;
    } = {}
) => {
    const { batchSize = 50, delay = 16 } = options;
    const [visibleItems, setVisibleItems] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setVisibleItems([]);

        let currentIndex = 0;

        const loadBatch = () => {
            const batch = items.slice(currentIndex, currentIndex + batchSize);
            setVisibleItems(prev => [...prev, ...batch]);
            currentIndex += batchSize;

            if (currentIndex < items.length) {
                setTimeout(loadBatch, delay);
            } else {
                setIsLoading(false);
            }
        };

        if (items.length > 0) {
            loadBatch();
        } else {
            setIsLoading(false);
        }
    }, [items, batchSize, delay]);

    return {
        visibleItems,
        isLoading,
        totalCount: items.length,
    };
}; 
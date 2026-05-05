import { useCallback, useEffect, useMemo, useState } from "react";

interface UsePaginationResult<T> {
    currentPage: number;
    totalPages: number;
    paginatedItems: T[];
    canNext: boolean;
    canPrev: boolean;
    setPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    resetPage: () => void;
}

export function usePagination<T>(items: T[], pageSize = 9): UsePaginationResult<T> {
    const safePageSize = Math.max(1, pageSize);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(items.length / safePageSize));

    useEffect(() => {
        setCurrentPage(prev => Math.min(prev, totalPages));
    }, [totalPages]);

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * safePageSize;
        return items.slice(startIndex, startIndex + safePageSize);
    }, [items, currentPage, safePageSize]);

    const setPage = useCallback((page: number) => {
        const normalizedPage = Math.min(Math.max(1, Math.trunc(page)), totalPages);
        setCurrentPage(normalizedPage);
    }, [totalPages]);

    const nextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const prevPage = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    const resetPage = useCallback(() => {
        setCurrentPage(1);
    }, []);

    return {
        currentPage,
        totalPages,
        paginatedItems,
        canNext: currentPage < totalPages,
        canPrev: currentPage > 1,
        setPage,
        nextPage,
        prevPage,
        resetPage,
    };
}

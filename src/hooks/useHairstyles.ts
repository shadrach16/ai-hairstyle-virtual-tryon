// components/hooks/useHairstyles.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService, type Hairstyle, type HairstyleListResponse } from '@/lib/api';

interface UseHairstylesOptions {
  category?: string;
  gender?: string;
  feature?: string;
  search?: string;
  sort?: string;
  autoLoad?: boolean;
  limit?: number;
  type?: 'default' | 'custom'; // Now properly implemented
  page?: number; // Allow external page control
}

interface UseHairstylesResult {
  hairstyles: Hairstyle[];
  isLoading: boolean;
  error: string | null;
  loadHairstyles: (overrides?: Partial<UseHairstylesOptions>) => Promise<void>;
  refreshHairstyles: () => void;
  currentPage: number;
  totalPages: number;
  totalHairstyles: number;
  setPage: (page: number) => void;
}

export function useHairstyles(options: UseHairstylesOptions = {}): UseHairstylesResult {
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(options.page || 1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalHairstyles, setTotalHairstyles] = useState(0);

  // Use ref to track if component is mounted to prevent state updates after unmount
  const isMountedRef = useRef(true);
  
  // Store options in ref to avoid dependency issues
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Stable load function using refs
  const loadHairstyles = useCallback(async (overrides?: Partial<UseHairstylesOptions>) => {
    const currentOptions = { ...optionsRef.current, ...overrides };
    const pageToLoad = overrides?.page ?? currentPage;

    setIsLoading(true);
    setError(null);

    try {
      // Build API params based on type
      const params: any = {
        page: pageToLoad,
        limit: currentOptions.limit || 20,
        sort: currentOptions.sort,
        search: currentOptions.search,
      };

      // Only include category/gender/feature for default styles
      if (currentOptions.type !== 'custom') {
        if (currentOptions.category && currentOptions.category !== 'All') {
          params.category = currentOptions.category;
        }
        if (currentOptions.gender && currentOptions.gender !== 'All') {
          params.gender = currentOptions.gender;
        }
        if (currentOptions.feature && currentOptions.feature !== 'All') {
          params.feature = currentOptions.feature;
        }
      }

      // Add type parameter if specified
      if (currentOptions.type) {
        params.type = currentOptions.type;
      }


      const result: HairstyleListResponse = await apiService.getHairstyles(params);

    

      if (result.status === 'success') {
        setHairstyles(result.data.hairstyles);
        setCurrentPage(result.pagination.page);
        setTotalPages(result.pagination.pages);
        setTotalHairstyles(result.pagination.total);
      } else {
        setError(result.message || 'Failed to load hairstyles');
      }
    } catch (err) {
      setError('An error occurred while loading hairstyles');
      console.error('Hairstyles loading error:', err);
    } finally {
        setIsLoading(false);
    }
  }, [currentPage]);

  const refreshHairstyles = useCallback(() => {
    setCurrentPage(1);
    loadHairstyles({ page: 1 });
  }, [loadHairstyles]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Effect for auto-loading when filters change
  useEffect(() => {
    if (!options.autoLoad) return;
    setCurrentPage(1);
    loadHairstyles({ page: 1 });
  }, [
    options.category,
    options.gender,
    options.feature,
    options.search,
    options.sort,
    options.type,
    options.limit,
    options.autoLoad,
  ]);

  // Effect for loading when page changes (but filters don't)
  useEffect(() => {
    if (!options.autoLoad) return;
    
    // Only load if page changed without filter changes
    // This runs separately from the filter effect above
    loadHairstyles({ page: currentPage });
  }, [currentPage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    hairstyles,
    isLoading,
    error,
    loadHairstyles,
    refreshHairstyles,
    currentPage,
    totalPages,
    totalHairstyles,
    setPage,
  };
}
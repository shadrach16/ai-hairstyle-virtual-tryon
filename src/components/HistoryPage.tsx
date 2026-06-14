// src/components/HistoryPage.tsx
// Generation history page - mobile-first responsive design

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiService } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CheckCircle2, AlertCircle, History, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HistorySkeleton } from '@/components/skeletons';
import { cn } from '@/lib/utils';

interface HistoryPageProps {
  embedded?: boolean;
  onShowAuth?: () => void;
  onStartTryOn?: () => void;
}

interface Generation {
  _id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  originalImage?: { url: string; publicId?: string };
  generatedImage?: { url: string; publicId?: string };
  hairstyle?: { name: string; thumbnail: string; category: string };
  creditsUsed: number;
  createdAt: string;
  errorMessage?: string;
}

interface HistoryResponse {
  success: boolean;
  data: Generation[];
  pagination?: {
    current: number;
    pages: number;
    total: number;
  };
}

const GenerationCard: React.FC<{ generation: Generation }> = ({ generation }) => {
  // Show generated image if completed, otherwise show original
  const imageUrl = generation.status === 'completed' 
    ? generation.generatedImage?.url 
    : generation.originalImage?.url;
  
  const statusColor = generation.status === 'completed' 
    ? 'border-l-4 border-l-green-500' 
    : generation.status === 'failed' 
      ? 'border-l-4 border-l-red-500' 
      : 'border-l-4 border-l-amber-500';

  const statusText = {
    pending: 'Pending',
    processing: 'Processing...',
    completed: 'Completed',
    failed: 'Failed'
  };

  return (
    <Card className={`overflow-hidden transition-shadow duration-300 hover:shadow-md ${statusColor} bg-white`}>
      <CardContent className="p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4">
        {/* Thumbnail - larger on mobile for better tap targets */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Generation result" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <History className="w-8 h-8 text-slate-400" />
            </div>
          )}
        </div>
        
        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-semibold truncate text-slate-800">
            {generation.hairstyle?.name || 'Custom Hairstyle'}
          </p>
          <p className={`text-xs sm:text-sm font-medium mt-0.5 ${
            generation.status === 'completed' ? 'text-green-600' : 
            generation.status === 'failed' ? 'text-red-600' : 'text-amber-600'
          }`}>
            {statusText[generation.status]}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {new Date(generation.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          {generation.status === 'failed' && generation.errorMessage && (
            <p className="text-xs text-red-500 mt-1 truncate">
              {generation.errorMessage}
            </p>
          )}
        </div>
        
        {/* Status icon */}
        <div className="flex-shrink-0">
          {generation.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-500" />}
          {generation.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
          {generation.status === 'processing' && <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />}
        </div>
      </CardContent>
    </Card>
  );
};

export default function HistoryPage({ embedded = false, onShowAuth, onStartTryOn }: HistoryPageProps) {
  const [history, setHistory] = useState<Generation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { isAuthenticated, user } = useAuth();

  // Debounce search query
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  const fetchHistory = useCallback(async (page: number, search?: string, status?: string) => {
    setIsLoading(true);
    try {
      const result = await apiService.getGenerationHistory({
        page,
        limit: 20,
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
      }) as unknown as HistoryResponse;
      if (result.success) {
        setHistory(result.data || []);
        if (result.pagination) {
          setTotalPages(result.pagination.pages);
        }
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory(currentPage, debouncedSearch || undefined, statusFilter);
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentPage, debouncedSearch, statusFilter, fetchHistory]);

  // Track page view
  useEffect(() => {
    apiService.trackEvent('page_view', { page: 'history' });
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <History className="w-16 h-16 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Sign In Required</h2>
        <p className="text-slate-600 mb-6 max-w-sm">
          Please sign in to view your past hairstyle generations.
        </p>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2" onClick={onShowAuth}>
          Sign In Now
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header - sticky on mobile */}
      <div className={embedded ? 'px-4 py-4' : 'sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 sm:px-6 sm:py-4'}>
        <h1 className="text-lg sm:text-2xl font-bold text-slate-800 flex items-center">
          <History className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-amber-600" />
          Generation History
        </h1>
        {user && (
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {history.length} generation{history.length !== 1 ? 's' : ''} total
          </p>
        )}
      </div>

      {/* Search + Filter strip */}
      <div className="px-4 pt-3 pb-2 space-y-2">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by hairstyle name…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-gray-100 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center"
              aria-label="Clear search"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </div>

        {/* Status filter chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {([undefined, 'completed', 'processing', 'failed'] as const).map((status) => (
            <button
              key={status ?? 'all'}
              onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
              className={cn(
                'flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors',
                statusFilter === status
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              )}
            >
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {isLoading ? (
          <HistorySkeleton count={5} />
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <History className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-lg font-semibold text-slate-700">No Generations Yet</p>
            <p className="text-sm text-slate-500 mt-2 max-w-xs">
              Head to the Studio to create your first AI hairstyle transformation!
            </p>
            {onStartTryOn && (
              <Button className="mt-5 bg-amber-600 hover:bg-amber-700 text-white" onClick={onStartTryOn}>
                Start Try-On
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Generation cards - optimized for touch */}
            <div className="space-y-3 sm:space-y-4">
              {history.map(gen => (
                <GenerationCard key={gen._id} generation={gen} />
              ))}
            </div>

            {/* Pagination - mobile-friendly large touch targets */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-6 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-10 w-10 p-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-10 w-10 p-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

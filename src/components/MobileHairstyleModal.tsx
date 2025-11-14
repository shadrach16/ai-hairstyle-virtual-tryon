import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useHairstyles } from '@/hooks/useHairstyles';
import { useDebounce } from '@/hooks/useDebounce';
import { apiService, type Hairstyle } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  Search,
  Filter,
  Coins,
  Loader2,
  SortAsc,
  ChevronDown,
  Check,
  Lock,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Upload,
  Palette 
} from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface MobileHairstyleModalProps {
  isOpen: boolean;
  isDesktop: boolean;
  setShowPricing: (value: boolean) => void;
  onClose: () => void;
  onHairstyleSelect: (hairstyle: Hairstyle) => void;
  selectedHairstyle: Hairstyle | null;
  userCredits?: number;
}

interface Category {
  name: string;
  count: number;
}

interface ContentSectionProps {
  hairstyles: Hairstyle[];
  isLoading: boolean;
  error: string | null;
  selectedHairstyle: Hairstyle | null;
  canAfford: (price: number) => boolean;
  handleStyleSelect: (hairstyle: Hairstyle) => void;
  setShowPricing: (value: boolean) => void;
}

// Haptics utility with safety check
const triggerHapticFeedback = async (style: ImpactStyle = 'light') => {
  try {
    await Haptics.impact({ style });
  } catch (error) {
    console.debug('Haptics not available');
  }
};

// Skeleton loader component
const HairstyleCardSkeleton = React.memo(() => (
  <div className="rounded-lg border-2 border-transparent overflow-hidden">
    <div className="aspect-[4/5] relative bg-slate-200 rounded-lg animate-pulse">
      <div className="absolute top-2 right-2 h-5 w-12 bg-slate-300 rounded-full" />
      <div className="absolute bottom-3 left-3 h-4 w-3/4 bg-slate-300 rounded-md" />
    </div>
  </div>
));

HairstyleCardSkeleton.displayName = 'HairstyleCardSkeleton';

// Hairstyle card component with memoization
const HairstyleCard = React.memo(({
  hairstyle,
  isSelected,
  canAfford,
  onSelect,
  setShowPricing,
}: {
  hairstyle: Hairstyle;
  isSelected: boolean;
  canAfford: boolean;
  onSelect: () => void;
  setShowPricing: (value: boolean) => void;
}) => {
  const handleClick = useCallback(() => {
    triggerHapticFeedback('light');
    if (hairstyle.isCustom || canAfford) {
      onSelect();
    } else {
      setShowPricing(true);
    }
  }, [hairstyle.isCustom, canAfford, onSelect, setShowPricing]);

  const priceDisplay = useMemo(() => {
    if (hairstyle.isCustom) {
      return <span className="text-amber-300 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Custom</span>;
    }

    const tierEmoji = hairstyle.price >= 4 ? '🦁' : hairstyle.price === 3 ? '🔥' : '🦌';
    
    return (
      <>
        <span className="sm:w-3 sm:h-3">{tierEmoji}</span>
        <Coins className="w-4 h-4 text-amber-300 sm:w-3 sm:h-3" />
        <span>{hairstyle.price}</span>
      </>
    );
  }, [hairstyle.isCustom, hairstyle.price, canAfford]);

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Select ${hairstyle.name} hairstyle${hairstyle.isCustom ? ' (custom)' : `, costs ${hairstyle.price} credits`}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={cn(
        'cursor-pointer transition-all duration-300 group overflow-hidden rounded-lg border-2',
        'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
        'sm:hover:shadow-sm sm:hover:-translate-y-0.5',
        isSelected ? 'border-amber-500 shadow-md ring-2 ring-amber-500' : 'border-transparent hover:shadow-sm',
        !canAfford && !hairstyle.isCustom && 'opacity-50 sm:hover:shadow-none sm:hover:-translate-y-0 cursor-not-allowed'
      )}
    >
      <div className="aspect-[4/5] overflow-hidden relative bg-slate-100">
        <img
          src={hairstyle.thumbnail}
          alt={hairstyle.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-full text-sm font-semibold sm:text-xs sm:py-0.5">
          {priceDisplay}
        </div>

        {!canAfford && !hairstyle.isCustom && (
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] flex items-center justify-center">
            <div className="bg-black/60 rounded-full p-3">
              <Lock className="w-6 h-6 text-white" />
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 p-3 sm:p-2 right-0">
          <h4 className="font-semibold text-sm text-white leading-tight line-clamp-2 sm:text-xs">
            { hairstyle.isCustom ? hairstyle._id: hairstyle.name}
          </h4>
        </div>
      </div>
    </div>
  );
});

HairstyleCard.displayName = 'HairstyleCard';



const ContentSection = React.memo(({
  hairstyles,
  isLoading,
  error,
  selectedHairstyle,
  canAfford,
  handleStyleSelect,
  setShowPricing,
}: ContentSectionProps) => {
  // 1. Create a ref for the ScrollArea component
  const scrollAreaRef = React.useRef(null);

  // 2. Use useEffect to scroll to the top when 'hairstyles' changes
  useEffect(() => {

    const scrollableElement = scrollAreaRef.current?.firstChild;
 scrollableElement?.scrollIntoView();

  }, [hairstyles]); // Effect runs when the list of hairstyles changes

  return (
    // 3. Attach the ref to the ScrollArea component
    <ScrollArea className="w-full h-full" >
      <div className="px-4 bg-slate-100/70">
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <HairstyleCardSkeleton key={index} />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-slate-500" role="alert">
            <p className="font-medium text-red-600">Error loading styles</p>
            <p className="text-sm mt-2">{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {hairstyles?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2" ref={scrollAreaRef}>
                {hairstyles.map((hairstyle) => (
                  <HairstyleCard
                    key={hairstyle._id}
                    hairstyle={hairstyle}
                    isSelected={selectedHairstyle?._id === hairstyle._id}
                    canAfford={canAfford(hairstyle.price)}
                    onSelect={() => handleStyleSelect(hairstyle)}
                    setShowPricing={setShowPricing}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">
                {/* Ensure your Filter component is imported */}
                <Filter className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-semibold text-slate-700">No Hairstyles Found</p>
                <p className="text-sm mt-2">Try adjusting your search or filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </ScrollArea>
  );
});

ContentSection.displayName = 'ContentSection';

// Main modal component
export default function MobileHairstyleModal({
  isOpen,
  onClose,
  onHairstyleSelect,
  selectedHairstyle,
  setShowPricing,
  userCredits = 0,
  isDesktop
}: MobileHairstyleModalProps) {
  const [activeTab, setActiveTab] = useState<'default' | 'custom'>('default');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTab, setSearchTab] = useState(false);

  const [defaultFilters, setDefaultFilters] = useState({
    category: 'All',
    gender: 'All',
    feature: 'All',
    search: '',
    sort: 'popularity',
  });

  const [customFilters, setCustomFilters] = useState({
    search: '',
    sort: 'newest',
  });

  const debouncedDefaultSearch = useDebounce(defaultFilters.search, 300);
  const debouncedCustomSearch = useDebounce(customFilters.search, 300);

  const defaultHook = useHairstyles({
    category: defaultFilters.category,
    gender: defaultFilters.gender,
    feature: defaultFilters.feature,
    search: debouncedDefaultSearch,
    sort: defaultFilters.sort,
    limit: 12,
    type: 'default',
    autoLoad: activeTab === 'default',
  });

  const customHook = useHairstyles({
    search: debouncedCustomSearch,
    sort: customFilters.sort,
    limit: 12,
    type: 'custom',
    autoLoad: activeTab === 'custom',
  });

  const currentHook = activeTab === 'default' ? defaultHook : customHook;
  const currentFilters = activeTab === 'default' ? defaultFilters : customFilters;

  useEffect(() => {
    if (activeTab === 'default') {
      const fetchCategories = async () => {
        try {
          const result = await apiService.getHairstyleCategories();
          if (result.success) {
            const totalCount = result.data.reduce((sum, cat) => sum + cat.count, 0);
            const allCategory = { name: 'All', count: totalCount };
            setCategories([allCategory, ...result.data]);
          }
        } catch (error) {
          console.error('Failed to fetch categories:', error);
        }
      };
      fetchCategories();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'custom') {
      setIsFilterOpen(false);
    }
  }, [activeTab]);

  const canAfford = useCallback((price: number) => userCredits >= price, [userCredits]);

  const handleStyleSelect = useCallback((hairstyle: Hairstyle) => {
    if (!hairstyle.isCustom && !canAfford(hairstyle.price)) return;
    onHairstyleSelect(hairstyle);
    onClose();
  }, [canAfford, onHairstyleSelect, onClose]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as 'default' | 'custom');
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= currentHook.totalPages) {
      currentHook.setPage(newPage);
      const scrollArea = document.querySelector('.MobileHairstyleModal-scrollArea [data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = 0;
      }
    }
  }, [currentHook]);

  const updateDefaultFilter = useCallback((key: string, value: string) => {
    triggerHapticFeedback('light');
    setDefaultFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateCustomFilter = useCallback((key: string, value: string) => {
    triggerHapticFeedback('light');
    setCustomFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateFilter = activeTab === 'default' ? updateDefaultFilter : updateCustomFilter;

  const genderOptions = ['All', 'Female', 'Male', 'Unisex'];
  const featureOptions = ['All', 'Basic', 'Trending', 'Premium'];
  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'newest', label: 'Newest' },
    { value: 'name', label: 'Name (A-Z)' },
    { value: 'price', label: 'Price (Low to High)' },
  ];


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'w-full mx-auto p-0 gap-0 flex flex-col overflow-hidden',
          'fixed bottom-0 left-0 right-0 top-auto translate-x-0 translate-y-0',
          'h-[95vh] rounded-t-3xl border-t-4 border-amber-500',
          'sm:h-[95vh] sm:max-w-2xl sm:left-1/2 sm:right-auto sm:-translate-x-1/2',
          'lg:fixed lg:top-1/2 lg:left-1/2 lg:bottom-auto lg:-translate-x-1/2 lg:-translate-y-1/2',
          'lg:max-w-4xl lg:h-[95vh] lg:rounded-2xl lg:border-0 lg:shadow-2xl',
          'xl:max-w-6xl'
        )}
      >
        <DialogHeader className="px-4 py-1 border-b shrink-0 border-amber-500">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-800 sm:text-lg flex items-center gap-2">
              Choose a Hairstyle
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                triggerHapticFeedback('light');
                onClose();
              }}
              className="w-10 h-10 rounded-full sm:w-8 sm:h-8"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col overflow-hidden">
            <TabsList className="shrink-0 grid   grid-cols-2 border border-gray-200 bg-gray-200  mx-4 my-2 h-12 rounded-xl">
              <TabsTrigger
                value="default"
                className="text-sm font-semibold h-9 rounded-lg text-slate-600 transition-all duration-200 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Palette className="w-4 h-4 mr-1.5" />
                Default Styles
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="text-sm font-semibold h-8 rounded-lg text-slate-600 transition-all duration-200 data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Upload className="w-4 h-4 mr-1.5" />
                My Uploads
              </TabsTrigger>
            </TabsList>

            <div className="shrink-0 px-4 space-y-3 bg-slate-50 pb-3">
             


              {activeTab === 'default' && (
                <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <div className="flex items-center gap-2 items-center">

               <span className=' w-10 bg-white h-10 rounded-lg border border-gray-200 items-center flex justify-center ' 
                onClick={()=>setSearchTab(!searchTab)}>
                 <Search  className="    text-gray-700  pointer-events-none" />
               </span>


                    <Select
                      value={currentFilters.sort}
                      onValueChange={(value) => updateFilter('sort', value)}
                    >
                      <SelectTrigger
                        className="flex-1 h-10 bg-white text-slate-600 font-medium text-base sm:h-9 sm:text-sm"
                        aria-label="Sort hairstyles"
                      >
                        <div className="flex items-center gap-2 sm:gap-1.5">
                          <SortAsc className="w-5 h-5 sm:w-4 sm:h-4" />
                          <SelectValue placeholder="Sort by..." />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="py-2 text-base sm:py-1.5 sm:text-sm"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <CollapsibleTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-base text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-10 px-4 sm:text-sm sm:h-9 sm:px-3 shrink-0"
                        aria-label="Toggle filters"
                      >
                        <Filter className="w-5 h-5 mr-2 sm:w-4 sm:h-4 sm:mr-1.5" />
                        Filters
                        <ChevronDown
                          className={cn(
                            'w-5 h-5 ml-2 transition-transform duration-200 sm:w-4 sm:h-4 sm:ml-1.5',
                            isFilterOpen && 'rotate-180'
                          )}
                        />
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent className="space-y-4 pt-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-3 block sm:text-xs sm:mb-2">
                        Category
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category.name}
                            variant={defaultFilters.category === category.name ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateDefaultFilter('category', category.name)}
                            className="text-sm h-9 px-3 sm:text-xs sm:h-7 sm:px-2.5"
                          >
                            {category.name} ({category.count})
                          </Button>
                        ))}
                      </div>
                    </div>

                
                  </CollapsibleContent>
                </Collapsible>
              )}
              {searchTab && activeTab === 'default' &&  <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 sm:w-4 sm:h-4 pointer-events-none" />
                <Input
                  placeholder={activeTab === 'default' ? 'Search styles...' : 'Search your uploads...'}
                  value={activeTab === 'default' ? defaultFilters.search : customFilters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pl-12 h-11 bg-gray-100 border text-base sm:pl-10 sm:h-10 sm:text-sm rounded-full"
                  aria-label="Search hairstyles"
                />
              </div>}

              {activeTab === 'custom' ? (<div className='space-y-1 mt-1' >

                <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 sm:w-4 sm:h-4 pointer-events-none" />
                <Input
                  placeholder={activeTab === 'default' ? 'Search styles...' : 'Search your uploads...'}
                  value={activeTab === 'default' ? defaultFilters.search : customFilters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pl-12 h-11 bg-gray-100 border text-base sm:pl-10 sm:h-10 sm:text-sm rounded-full"
                  aria-label="Search hairstyles"
                />
              </div>
 

                </div>
              ): <>

    <div>
                    
                      <div className="flex flex-wrap gap-2">
                        {featureOptions.map((feature) => (
                          <Button
                            key={feature}
                            variant={defaultFilters.feature === feature ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateDefaultFilter('feature', feature)}
                            className="text-sm h-9 px-3 sm:text-xs sm:h-7 sm:px-2.5"
                          >
                            {feature === 'Premium' ? (
                              <span>Premium 🦁</span>
                            ) : feature === 'Basic' ? (
                              <span>Novice 🦌</span>
                            ) : feature === 'Trending' ? (
                              <span>Trending 🔥</span>
                            ) : (
                              'All'
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                   
                      <div className="flex flex-wrap gap-2 ">
                        {genderOptions.map((gender) => (
                          <Button
                            key={gender}
                            variant={defaultFilters.gender === gender ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateDefaultFilter('gender', gender)}
                            className="text-sm h-9 px-3 sm:text-xs sm:h-7 sm:px-2.5"
                          >
                            {gender}
                          </Button>
                        ))}
                      </div>
                    </div>
              </>}
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="default" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ContentSection
                  hairstyles={currentHook.hairstyles}
                  isLoading={currentHook.isLoading}
                  error={currentHook.error}
                  selectedHairstyle={selectedHairstyle}
                  canAfford={canAfford}
                  handleStyleSelect={handleStyleSelect}
                  setShowPricing={setShowPricing}
                />
              </TabsContent>

              <TabsContent value="custom" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
                <ContentSection
                  hairstyles={currentHook.hairstyles}
                  isLoading={currentHook.isLoading}
                  error={currentHook.error}
                  selectedHairstyle={selectedHairstyle}
                  canAfford={canAfford}
                  handleStyleSelect={handleStyleSelect}
                  setShowPricing={setShowPricing}
                />
              </TabsContent>
            </div>

            {!currentHook.isLoading && currentHook.totalPages > 1 && (
              <div className="shrink-0 px-4 py-1 border-t border-slate-200 flex items-center justify-between bg-white">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentHook.currentPage - 1)}
                  disabled={currentHook.currentPage === 1}
                  className="h-9 px-3 text-sm"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Prev
                </Button>
                
                <span className="text-sm font-medium" aria-live="polite">
             
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentHook.currentPage + 1)}
                  disabled={currentHook.currentPage === currentHook.totalPages}
                  className="h-9 px-3 text-sm border border-gray-200"
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
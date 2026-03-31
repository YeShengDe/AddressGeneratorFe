'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type React from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  Info,
  Landmark,
  Loader2,
  MapPin,
  MoreHorizontal,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/components/ui/responsive-dialog';
import { getSearchAddress } from '../_api';
import { useStore } from '../_store';
import type { IUser } from '../_type';
import { cn, getPerson, type RandomCoordinateTarget } from '@/lib/utils';
import { featuredPopulationCountries } from '@/lib/population';
import { useDebounce } from '@/hooks/use-debounce';

interface MapSearchProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  onGenerateAddress: (
    target?: string | RandomCoordinateTarget
  ) => Promise<void> | void;
  disabled?: boolean;
}

interface HotCountryOption {
  code: string;
  label: string;
}

interface TaxFreeStateOption {
  code: string;
  label: string;
  description: string;
  target: RandomCoordinateTarget;
}

interface HoverTooltipProps {
  text: string;
  children: React.ReactNode;
}

const HOT_REGIONS = featuredPopulationCountries;
const PRIMARY_HOT_REGIONS = HOT_REGIONS.slice(0, 5);
const MORE_HOT_COUNTRIES: HotCountryOption[] = [
  { code: 'AU', label: '澳大利亚' },
  { code: 'GB', label: '英国' },
  { code: 'DE', label: '德国' },
  { code: 'FR', label: '法国' },
  { code: 'KR', label: '韩国' },
  { code: 'NG', label: '尼日利亚' },
  { code: 'VN', label: '越南' },
  { code: 'IN', label: '印度' },
  { code: 'MY', label: '马来西亚' },
  { code: 'PH', label: '菲律宾' },
  { code: 'TH', label: '泰国' },
  { code: 'AE', label: '阿联酋' },
  { code: 'BR', label: '巴西' },
  { code: 'MX', label: '墨西哥' },
  { code: 'TW', label: '中国台湾' },
];
const US_TAX_FREE_STATES: TaxFreeStateOption[] = [
  {
    code: 'AK',
    label: '阿拉斯加',
    description: '无州销售税',
    target: {
      countryCode: 'US',
      origin: [61.217381, -149.863129],
      radius: 8,
    },
  },
  {
    code: 'DE',
    label: '特拉华',
    description: '无州销售税',
    target: {
      countryCode: 'US',
      origin: [39.744655, -75.54839],
      radius: 8,
    },
  },
  {
    code: 'MT',
    label: '蒙大拿',
    description: '无州销售税',
    target: {
      countryCode: 'US',
      origin: [45.783286, -108.50069],
      radius: 8,
    },
  },
  {
    code: 'NH',
    label: '新罕布什尔',
    description: '无州销售税',
    target: {
      countryCode: 'US',
      origin: [42.99564, -71.45479],
      radius: 8,
    },
  },
  {
    code: 'OR',
    label: '俄勒冈',
    description: '无州销售税',
    target: {
      countryCode: 'US',
      origin: [45.515232, -122.678385],
      radius: 8,
    },
  },
];

function HoverTooltip({ text, children }: HoverTooltipProps) {
  return (
    <div className="group relative inline-flex">
      <div className="pointer-events-none absolute bottom-full left-1/2 z-[1010] mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900/90 px-2 py-1 text-[11px] text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100 md:block">
        {text}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gray-900/90"
        />
      </div>
      {children}
    </div>
  );
}

export default function MapSearch({
  onLocationSelect,
  onGenerateAddress,
  disabled = false,
}: MapSearchProps) {
  const { setUser, country_code } = useStore();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMoreHotRegionsOpen, setIsMoreHotRegionsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 500);

  const { isLoading, data, error } = useQuery({
    queryKey: ['searchAddress', debouncedQuery, country_code],
    queryFn: () =>
      getSearchAddress({
        q: debouncedQuery,
        'accept-language': country_code,
      }),
    enabled: !!debouncedQuery.trim() && debouncedQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const searchResults = useMemo(() => {
    return data?.data || [];
  }, [data?.data]);

  const hasResults = searchResults.length > 0;
  const shouldShowResults =
    showResults && (hasResults || (query.trim() && !isLoading && !hasResults));

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      searchRef.current &&
      !searchRef.current.contains(event.target as Node)
    ) {
      setShowResults(false);
      setSelectedIndex(-1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (hasResults && query.trim()) {
      setShowResults(true);
      setSelectedIndex(-1);
    }
  }, [hasResults, query]);

  const handleLocationSelect = useCallback(
    (result: IUser.getCoorAddressResponse) => {
      if (!result || disabled) {
        return;
      }

      onLocationSelect(result.lat, result.lon, result.display_name);
      const newUser = getPerson(result?.address?.country_code ?? '');
      setUser(newUser);
      setQuery(result.display_name);
      setShowResults(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    },
    [disabled, onLocationSelect, setUser]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) {
        return;
      }

      const value = e.target.value;
      setQuery(value);
      setSelectedIndex(-1);

      if (!value.trim()) {
        setShowResults(false);
      }
    },
    [disabled]
  );

  const handleInputFocus = useCallback(() => {
    if (disabled) {
      return;
    }

    if (hasResults && query.trim()) {
      setShowResults(true);
    }
  }, [disabled, hasResults, query]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setShowResults(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleHotRegionSelect = useCallback(
    (target?: string | RandomCoordinateTarget) => {
      if (disabled) {
        return;
      }

      void onGenerateAddress(target);
      setQuery('');
      setShowResults(false);
      setSelectedIndex(-1);
      setIsMoreHotRegionsOpen(false);
      inputRef.current?.blur();
    },
    [disabled, onGenerateAddress]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!shouldShowResults || disabled) {
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            handleLocationSelect(searchResults[selectedIndex]);
          }
          break;
        case 'Escape':
          setShowResults(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [
      disabled,
      shouldShowResults,
      searchResults,
      selectedIndex,
      handleLocationSelect,
    ]
  );

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      selectedElement?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  const hotRegionBadgeClassName = cn(
    'gap-1 border-border bg-background text-foreground shadow-sm',
    disabled
      ? 'cursor-not-allowed opacity-60'
      : 'cursor-pointer hover:bg-accent hover:text-accent-foreground'
  );

  return (
    <ResponsiveDialog
      open={isMoreHotRegionsOpen}
      onOpenChange={setIsMoreHotRegionsOpen}
    >
      <div
        className="absolute left-1 top-4 z-[1000] w-[calc(100%-0.5rem)] md:left-4 md:max-w-[400px] md:min-w-[200px]"
        ref={searchRef}
        data-map-control
      >
        <Card className="border-border bg-background shadow-lg">
          <div className="relative">
            <div className="flex items-center px-3 py-1">
              <Search className="mr-2 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="搜索地点..."
                value={query}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className="flex-1 border-0 bg-transparent px-0 text-sm shadow-none outline-none focus-visible:ring-0"
                aria-label="搜索地点"
                aria-expanded={!!shouldShowResults}
                aria-haspopup="listbox"
                aria-activedescendant={
                  selectedIndex >= 0 ? `result-${selectedIndex}` : undefined
                }
                autoComplete="off"
              />

              {isLoading && (
                <Loader2 className="ml-2 h-4 w-4 animate-spin text-muted-foreground" />
              )}

              {query && !isLoading && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-6 w-6 p-0"
                  onClick={clearSearch}
                  aria-label="清除搜索"
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {shouldShowResults && (
              <div className="border-t border-border">
                {hasResults ? (
                  <div
                    ref={resultsRef}
                    className="max-h-64 overflow-y-auto"
                    role="listbox"
                    aria-label="搜索结果"
                  >
                    {searchResults.map((result, index) => (
                      <button
                        key={result.place_id}
                        id={`result-${index}`}
                        className="w-full border-b border-border px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-accent"
                        onClick={() => handleLocationSelect(result)}
                        role="option"
                        aria-selected={index === selectedIndex}
                      >
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium text-foreground">
                              {result.display_name.split(',')[0]}
                            </div>
                            <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {result.display_name}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-sm text-destructive">
                    搜索出错，请重试
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    未找到相关地点
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        <div className="mt-2 px-1">
          <div className="flex flex-wrap items-center gap-2">
            {PRIMARY_HOT_REGIONS.map((item) => (
              <HoverTooltip
                key={item.code}
                text={`点击快速生成${item.label}地址`}
              >
                <Badge
                  variant="outline"
                  className={hotRegionBadgeClassName}
                  title={`点击生成${item.label}地址`}
                  onClick={() => handleHotRegionSelect(item.code)}
                  aria-disabled={disabled}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://flagcdn.com/${item.code.toLowerCase()}.svg`}
                    alt={`${item.label}国旗`}
                    className="mr-0.5 h-2 rounded-[2px] object-cover"
                    loading="lazy"
                  />
                  <span>{item.label}</span>
                </Badge>
              </HoverTooltip>
            ))}

            <HoverTooltip text="查看更多热门国家和免税地区">
              <ResponsiveDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 rounded-md p-0 text-xs font-semibold shadow-sm"
                  disabled={disabled}
                  aria-label="查看更多热门国家和免税地区"
                  title="查看更多热门国家和免税地区"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </ResponsiveDialogTrigger>
            </HoverTooltip>
          </div>
        </div>
      </div>

      <ResponsiveDialogContent className="sm:max-w-[520px]">
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>更多热门国家和免税地区</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            点击标签可直接生成对应地区地址
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>

        <div className="px-4 pb-4 pt-0 sm:px-0 sm:pb-0">
          <Accordion
            type="multiple"
            defaultValue={['countries', 'us-tax-free']}
            className="w-full"
          >
            <AccordionItem value="countries">
              <AccordionTrigger className="py-3 text-sm hover:no-underline">
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  更多热门国家
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="flex flex-wrap gap-2">
                  {MORE_HOT_COUNTRIES.map((item) => (
                    <HoverTooltip
                      key={item.code}
                      text={`点击快速生成${item.label}地址`}
                    >
                      <Badge
                        variant="outline"
                        className={hotRegionBadgeClassName}
                        title={`点击生成${item.label}地址`}
                        onClick={() => handleHotRegionSelect(item.code)}
                        aria-disabled={disabled}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://flagcdn.com/${item.code.toLowerCase()}.svg`}
                          alt={`${item.label}国旗`}
                          className="h-3.5 w-5 rounded-[2px] object-cover"
                          loading="lazy"
                        />
                        <span>{item.label}</span>
                      </Badge>
                    </HoverTooltip>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="us-tax-free">
              <AccordionTrigger className="py-3 text-sm hover:no-underline">
                <span className="inline-flex items-center gap-2">
                  <Landmark className="h-4 w-4 text-muted-foreground" />
                  美国免税地区
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <div className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                    <Info className="h-3.5 w-3.5" />
                    <span>免税州说明</span>
                  </div>
                  <div className="space-y-1 text-sm text-foreground">
                    {US_TAX_FREE_STATES.map((state) => (
                      <div key={state.code}>
                        • {state.label} ({state.code}) - {state.description}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {US_TAX_FREE_STATES.map((state) => (
                    <HoverTooltip
                      key={state.code}
                      text={`点击生成${state.label}地址，${state.description}`}
                    >
                      <Badge
                        variant="outline"
                        className={hotRegionBadgeClassName}
                        title={`点击生成${state.label}地址`}
                        onClick={() => handleHotRegionSelect(state.target)}
                        aria-disabled={disabled}
                      >
                        <span>{state.label}</span>
                        <span className="text-muted-foreground">
                          {state.code}
                        </span>
                      </Badge>
                    </HoverTooltip>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}

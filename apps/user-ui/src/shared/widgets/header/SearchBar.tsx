'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../lib/utils';

// Mock data for search suggestions and categories
const searchSuggestions = [
  {
    id: 1,
    name: 'Apple Vision Pro with Mirror (ZM201)',
    price: '$369.99',
    originalPrice: '$469.99',
  },
  {
    id: 2,
    name: 'Apple Vision Pro with Mirror (ZM201)',
    price: '$369.99',
    originalPrice: '$469.99',
  },
  {
    id: 3,
    name: 'Apple Vision Pro with Mirror (ZM201)',
    price: '$369.99',
    originalPrice: '$469.99',
  },
  {
    id: 4,
    name: 'Apple Vision Pro with Mirror (ZM201)',
    price: '$369.99',
    originalPrice: '$469.99',
  },
];

const categories = [
  'Mobile Accessories',
  'Smartphones',
  'Gadget',
  'Apple',
  'Electronics',
  'Gaming',
  'Fashion',
  'Home & Garden',
];

const popularSearches = [
  'Mobile Cover',
  'Fashion Shop',
  'Air Condition price',
  'coffee',
  'mask',
  'diabetes machine pressure',
  'Hoody price',
];

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className = '' }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchFocus = () => {
    setShowSuggestions(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const filteredSuggestions = searchQuery
    ? searchSuggestions.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className={cn('relative', className)} ref={searchRef}>
      <div className="flex items-center bg-white border border-brand-muted/20 rounded-full overflow-hidden shadow-sm">
        {/* Category Dropdown */}
        <div className="relative hidden md:block" ref={categoryRef}>
          <div className="pl-1">
            <Button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="rounded-r-full rounded-l-full bg-brand-accent/20"
              variant={'outline'}
            >
              <span className="text-sm font-medium">{selectedCategory}</span>
              <Image
                src="/downarrow.svg"
                alt="Dropdown"
                width={12}
                height={12}
                className={`transition-transform ${
                  showCategoryDropdown ? 'rotate-180' : ''
                }`}
                priority={true}
              />
            </Button>
          </div>

          {/* Category Dropdown Menu */}
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            placeholder="Search here anything"
            className="w-full px-4 py-3 text-sm text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none"
          />
        </div>

        {/* Search Button */}
        <div className="absolute right-1">
          <Button
            variant={'outline'}
            size={'icon'}
            className="bg-brand-primary hover:bg-brand-primary-dark text-white rounded-full"
          >
            <Image
              src="/searchIcon.svg"
              alt="Search"
              width={20}
              height={20}
              className="w-5 h-5"
              priority={true}
            />
          </Button>
        </div>
      </div>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {searchQuery ? (
            <>
              {/* Search Results */}
              {filteredSuggestions.length > 0 ? (
                <div className="p-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Search results for &ldquo;
                    <span className="text-search-primary font-medium">
                      {searchQuery}
                    </span>
                    &rdquo;
                  </p>
                  {filteredSuggestions.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {item.price}
                          </span>
                          <span className="text-xs text-gray-500 line-through">
                            {item.originalPrice}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* No Results Found */
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Result Found!!!
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {searchQuery} did not match any product. Please try again or
                    search new products
                  </p>
                </div>
              )}

              {/* Category Suggestions - Only show if there are results */}
              {filteredSuggestions.length > 0 && (
                <div className="border-t border-gray-100 p-3">
                  <div className="mb-2">
                    <span className="text-sm text-gray-900 font-medium">
                      Apple Vision Pro
                    </span>
                    <span className="text-xs text-search-primary ml-2">
                      in Mobile Accessories
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-900 font-medium">
                      Apple Vision Pro
                    </span>
                    <span className="text-xs text-search-primary ml-2">
                      in Smartphones
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-900 font-medium">
                      Apple Vision Pro
                    </span>
                    <span className="text-xs text-search-primary ml-2">
                      in Gadget
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-sm text-gray-900 font-medium">
                      Apple Vision Pro
                    </span>
                    <span className="text-xs text-search-primary ml-2">
                      in Apple
                    </span>
                  </div>
                  <button className="text-sm text-search-primary hover:underline">
                    View All Products (495)
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Popular Searches */
            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(search)}
                    className="px-3 py-1 text-sm text-gray-600 bg-gray-100 hover:bg-search-light hover:text-search-primary rounded-full transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

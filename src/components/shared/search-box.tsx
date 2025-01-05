// components/shared/search-box.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    HiSearch,
    HiX,
    HiArrowRight,
    HiClock
} from 'react-icons/hi';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchResult {
    episodeId: string;
    displayTitle: string;
    thumbnail: string;
    duration: string;
}

export default function SearchBox() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const searchBoxRef = useRef<HTMLDivElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch results when query changes
    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&limit=5`);
                const data = await res.json();
                setResults(data.results);
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/filter?q=${encodeURIComponent(query.trim())}`);
            setQuery('');
            setIsFocused(false);
        }
    };

    return (
        <div className="relative w-[400px]" ref={searchBoxRef}>
            {/* Search Input */}
            <div className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Search episodes..."
                    className="w-full px-4 py-2.5 pl-11 rounded-lg bg-neutral-800/50 
                        text-white placeholder:text-gray-400 
                        focus:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50
                        transition-all duration-200"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                {/* Search Icon */}
                <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 
                    group-focus-within:text-blue-500 transition-colors duration-200" />

                {/* Clear Button */}
                {query && (
                    <button
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 
                            text-gray-400 hover:text-white transition-colors"
                    >
                        <HiX className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isFocused && (query.length >= 2 || results.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 rounded-lg shadow-lg border border-neutral-700 overflow-hidden">
                    {isLoading ? (
                        // Loading State
                        <div className="p-4 space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 animate-pulse">
                                    <div className="w-24 h-14 bg-neutral-700 rounded" />
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-neutral-700 rounded w-3/4" />
                                        <div className="h-3 bg-neutral-700 rounded w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            {/* Results List */}
                            <div className="p-2">
                                {results.map((result) => (
                                    <Link
                                        key={result.episodeId}
                                        href={`/watch/${result.episodeId}`}
                                        className="flex items-center gap-3 p-2 hover:bg-neutral-700 rounded-lg transition-colors"
                                        onClick={() => {
                                            setQuery('');
                                            setIsFocused(false);
                                        }}
                                    >
                                        <div className="relative w-24 h-14 rounded overflow-hidden flex-shrink-0">
                                            <Image
                                                src={result.thumbnail}
                                                alt={result.displayTitle}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs flex items-center gap-1">
                                                <HiClock className="w-3 h-3" />
                                                {result.duration}
                                            </div>
                                        </div>
                                        <span className="flex-1 text-sm line-clamp-2">
                                            {result.displayTitle}
                                        </span>
                                    </Link>
                                ))}
                            </div>

                            {/* View All Results */}
                            <button
                                onClick={handleSearch}
                                className="w-full p-3 flex items-center justify-center gap-2 border-t border-neutral-700 hover:bg-neutral-700 transition-colors text-blue-400 hover:text-blue-300"
                            >
                                View all results
                                <HiArrowRight className="w-4 h-4" />
                            </button>
                        </>
                    ) : query.length >= 2 ? (
                        <div className="p-4 text-center text-gray-400">
                            No results found
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}
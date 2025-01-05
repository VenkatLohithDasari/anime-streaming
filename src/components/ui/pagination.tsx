// components/ui/pagination.tsx
'use client';

import Link from 'next/link';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
    searchParams: Record<string, string | undefined>;
}

const Pagination = ({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) => {
    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams as Record<string, string>);
        params.set('page', page.toString());
        return `${baseUrl}?${params.toString()}`;
    };

    return (
        <div className="flex justify-center items-center space-x-2 mt-8">
            {currentPage > 1 && (
                <Link
                    href={createPageUrl(currentPage - 1)}
                    className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                >
                    <HiChevronLeft className="w-5 h-5" />
                </Link>
            )}

            {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                const isCurrentPage = page === currentPage;

                return (
                    <Link
                        key={page}
                        href={createPageUrl(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${isCurrentPage
                                ? 'bg-blue-600 text-white'
                                : 'bg-neutral-800 hover:bg-neutral-700'
                            }`}
                    >
                        {page}
                    </Link>
                );
            })}

            {currentPage < totalPages && (
                <Link
                    href={createPageUrl(currentPage + 1)}
                    className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
                >
                    <HiChevronRight className="w-5 h-5" />
                </Link>
            )}
        </div>
    );
};

export default Pagination;
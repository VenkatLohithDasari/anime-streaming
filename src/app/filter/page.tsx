// app/filter/page.tsx
import { getFilteredEpisodes, getGenres } from "@/lib/db-utils";
import FilterOptions from "@/components/filter/filter-options";
import MediaGrid from "@/components/ui/media-grid";
import Pagination from "@/components/ui/pagination";

interface FilterPageProps {
    searchParams: {
        q?: string;        // search query
        genres?: string;   // comma-separated genre ids
        sort?: string;     // e.g., 'latest', 'views', 'likes'
        page?: string;     // page number
    }
}

export default async function FilterPage({ searchParams }: FilterPageProps) {
    const page = Number(searchParams.page) || 1;
    const genres = searchParams.genres?.split(',').filter(Boolean) || [];
    const sort = searchParams.sort || 'latest';
    const search = searchParams.q || '';

    // Fetch and serialize genres
    const allGenres = await getGenres();
    const serializedGenres = allGenres.map(genre => ({
        _id: genre._id.toString(),
        name: genre.name
    }));

    // Fetch filtered episodes
    const { episodes, totalPages } = await getFilteredEpisodes({
        page,
        perPage: 18,
        search,
        genres,
        sort
    });

    // Serialize episodes data
    const serializedEpisodes = episodes.map(episode => ({
        id: episode.episodeId,
        title: episode.displayTitle,
        posterPath: episode.animeId?.poster || episode.thumbnail,
        mediaType: "anime" as const,
        views: episode.views
    }));

    return (
        <div className="container mx-auto py-8">
            {/* Filter Options */}
            <FilterOptions
                allGenres={serializedGenres}
                selectedGenres={genres}
                currentSort={sort}
                searchQuery={search}
            />

            {/* Results Count */}
            <div className="mt-6 mb-4">
                <h2 className="text-xl font-semibold">
                    {serializedEpisodes.length > 0
                        ? `Showing ${serializedEpisodes.length} results`
                        : 'No results found'
                    }
                </h2>
            </div>

            {/* Episodes Grid */}
            <MediaGrid
                items={serializedEpisodes}
            />

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    baseUrl="/filter"
                    searchParams={searchParams}
                />
            )}
        </div>
    );
}
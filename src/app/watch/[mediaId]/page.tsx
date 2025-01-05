// app/watch/[mediaId]/page.tsx
import { getEpisodeDetails, getRelatedEpisodes } from '@/lib/db-utils';
import VideoPlayer from "@/components/video/video-player";
import MediaInfo from "@/components/video/media-info";
import RelatedMedia from "@/components/video/related-media";
import ActionButtons from "@/components/video/action-buttons";
import EpisodeList from "@/components/video/episode-list";
import { notFound } from 'next/navigation';

export default async function WatchPage({ params }: { params: { mediaId: string } }) {
    const parms1 = await params;
    const episode = await getEpisodeDetails(parms1.mediaId);

    if (!episode || !episode.animeId) {
        notFound();
    }

    // Separate episode title and anime data
    const episodeTitle = `${episode.animeId.name} - Episode ${episode.episodeNumber}`;

    // Format the data for MediaInfo component (without episode number)
    const mediaData = {
        id: episode.episodeId,
        title: episode.animeId.name, // Just the anime name
        alternativeTitles: episode.animeId.alternativeTitles,
        synopsis: episode.animeId.description,
        posterPath: episode.animeId.poster,
        genres: episode.genres.map(genre => genre.name),
        creator: episode.animeId.studio,
        releaseDate: new Date(episode.releaseDate).toLocaleDateString(),
        uploadDate: new Date(episode.updateDate).toLocaleDateString(),
        censorship: episode.isCensored ? "Censored" : "Uncensored",
        videoUrl: episode.videoUrl
    };

    // Get related episodes
    const relatedEpisodes = await getRelatedEpisodes(
        episode.episodeId,
        episode.genres,
        episode.animeId._id
    );

    return (
        <div className="container mx-auto py-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="lg:flex-grow lg:w-[65%]">
                    {/* Title */}
                    <h1 className="text-2xl font-bold mb-4">{episodeTitle}</h1>

                    {/* Video Player */}
                    <div className="relative aspect-video bg-neutral-800 rounded-lg overflow-hidden">
                        <VideoPlayer
                            episodeId={episode.episodeId}
                            videoUrl={mediaData.videoUrl}
                        />
                    </div>

                    {/* Action Buttons */}
                    <ActionButtons
                        episodeId={episode.episodeId}
                        initialLikes={episode.likes}
                        initialDislikes={episode.dislikes}
                        views={episode.views}
                    />

                    {/* Episode List */}
                    <EpisodeList
                        episodes={episode.animeId.episodes}
                        currentEpisodeId={episode.episodeId}
                    />

                    {/* Media Information */}
                    <MediaInfo media={mediaData} />
                </div>

                {/* Related Content */}
                <div className="lg:w-[35%]">
                    <RelatedMedia
                        episodes={relatedEpisodes.map(episode => ({
                            episodeId: episode.episodeId,
                            displayTitle: episode.displayTitle,
                            thumbnail: episode.thumbnail,
                            views: episode.views,
                            duration: episode.duration
                        }))}
                    />
                </div>
            </div>
        </div>
    );
}
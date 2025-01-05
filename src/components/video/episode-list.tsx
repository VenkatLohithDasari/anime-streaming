// components/video/episode-list.tsx
import Image from "next/image";
import Link from "next/link";

interface Episode {
    episodeId: string;
    episodeNumber: number;
    thumbnail: string;
    name?: string;
    duration: string;
}

interface EpisodeListProps {
    episodes: Episode[];
    currentEpisodeId: string;
}

const formatDuration = (duration: string) => {
    // Split duration into hours, minutes, seconds
    const [hours, minutes, seconds] = duration.split(':').map(Number);

    // If hours is 0, return only minutes and seconds
    if (hours === 0) {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // If hours exist, return full duration
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const EpisodeList = ({ episodes, currentEpisodeId }: EpisodeListProps) => {
    return (
        <div className="mt-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Episodes</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {episodes.map((episode) => (
                    <Link
                        key={episode.episodeId}
                        href={`/watch/${episode.episodeId}`}
                        className={`group relative aspect-video rounded-lg overflow-hidden ${episode.episodeId === currentEpisodeId
                            ? "ring-2 ring-white"
                            : "hover:ring-2 hover:ring-gray-500"
                            }`}
                    >
                        <Image
                            src={episode.thumbnail}
                            alt={`Episode ${episode.episodeNumber}`}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white font-medium">
                                Episode {episode.episodeNumber}
                            </span>
                        </div>
                        {episode.duration && (
                            <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs text-white">
                                {formatDuration(episode.duration)}
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default EpisodeList;
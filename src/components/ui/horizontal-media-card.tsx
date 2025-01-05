// components/ui/horizontal-media-card.tsx
import Image from "next/image";
import Link from "next/link";
import { HiEye } from "react-icons/hi2";

interface HorizontalMediaCardProps {
    id: string;
    title: string;
    posterPath: string;
    views: number;
    duration?: string;
}

const HorizontalMediaCard = ({
    id,
    title,
    posterPath,
    views,
    duration
}: HorizontalMediaCardProps) => {
    // Format views (e.g., 1.5M, 300K, etc.)
    const formatViews = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

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

    return (
        <Link
            href={`/watch/${id}`}
            className="group flex gap-3 hover:bg-neutral-800/50 p-2 rounded-lg transition-colors duration-200"
        >
            {/* Poster/Thumbnail */}
            <div className="relative flex-shrink-0 w-32 aspect-video rounded-lg overflow-hidden">
                <Image
                    src={posterPath}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(max-width: 768px) 120px, 128px"
                />
                {duration && (
                    <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs">
                        {formatDuration(duration)}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow min-w-0 py-1">
                <h3 className="font-medium text-sm text-gray-100 line-clamp-2 leading-tight group-hover:text-white">
                    {title}
                </h3>
                <div className="flex items-center gap-1 mt-1.5 text-gray-400 text-xs">
                    <HiEye className="w-4 h-4" />
                    <span>{formatViews(views)} views</span>
                </div>
            </div>
        </Link>
    );
};

export default HorizontalMediaCard;
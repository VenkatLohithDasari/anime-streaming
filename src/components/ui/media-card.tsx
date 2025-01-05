import Image from 'next/image';
import Link from 'next/link';
import { HiPlay } from "react-icons/hi2";

interface MediaCardProps {
    id: string;
    title: string;
    posterPath: string;
    mediaType: "anime" | "3d";
}

const MediaCard = ({ id, title, posterPath, mediaType }: MediaCardProps) => {
    return (
        <Link
            href={`/watch/${id}`}
            className="group transition-transform duration-200 hover:-translate-y-1"
        >
            <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                <Image
                    src={posterPath}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <HiPlay className="w-12 h-12 text-white opacity-90" />
                    </div>
                </div>
            </div>
            <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-200 truncate">
                {title}
            </h3>
        </Link>
    )
}

export default MediaCard;

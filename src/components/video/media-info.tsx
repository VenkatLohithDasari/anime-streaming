// components/video/media-info.tsx
'use client';

import { useState } from "react";
import Image from "next/image";
import { HiCalendar, HiClock, HiChevronDown, HiChevronUp } from "react-icons/hi";

interface MediaInfoProps {
    media: {
        title: string;
        alternativeTitles?: string[];
        synopsis: string;
        posterPath: string;
        genres: string[];
        creator: string;
        releaseDate: string;
        uploadDate: string;
        censorship: "Censored" | "Uncensored";
    };
}

const MediaInfo = ({ media }: MediaInfoProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="py-8 border-t border-neutral-800">
            {/* Title Section */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">{media.title}</h2>
                {media.alternativeTitles && media.alternativeTitles.length > 0 && (
                    <p className="mt-1 text-sm text-gray-400">
                        {media.alternativeTitles.join(" • ")}
                    </p>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Poster */}
                <div className="flex-shrink-0 w-full hidden md:block md:w-[200px]">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                        <Image
                            src={media.posterPath}
                            alt={media.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 200px"
                            priority
                        />
                    </div>
                </div>

                {/* Information */}
                <div className="flex-grow space-y-5">
                    {/* Synopsis */}
                    <div>
                        <h3 className="text-gray-400 text-sm mb-1">Synopsis</h3>
                        <div className="relative">
                            <p className={`text-gray-200 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''
                                }`}>
                                {media.synopsis}
                            </p>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-sm text-gray-400 hover:text-white flex items-center gap-1 mt-1 transition-colors"
                            >
                                {isExpanded ? (
                                    <>
                                        Show Less <HiChevronUp className="w-4 h-4" />
                                    </>
                                ) : (
                                    <>
                                        Show More <HiChevronDown className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {/* Creator */}
                        <div className="flex items-center gap-2">
                            <div>
                                <h3 className="text-gray-400 text-sm">Creator</h3>
                                <p className="text-gray-200">{media.creator}</p>
                            </div>
                        </div>

                        {/* Release Date */}
                        <div className="flex items-center gap-2">
                            <HiCalendar className="w-5 h-5 text-gray-400" />
                            <div>
                                <h3 className="text-gray-400 text-sm">Release Date</h3>
                                <p className="text-gray-200">{media.releaseDate}</p>
                            </div>
                        </div>

                        {/* Upload Date */}
                        <div className="flex items-center gap-2">
                            <HiClock className="w-5 h-5 text-gray-400" />
                            <div>
                                <h3 className="text-gray-400 text-sm">Upload Date</h3>
                                <p className="text-gray-200">{media.uploadDate}</p>
                            </div>
                        </div>

                        {/* Censorship */}
                        <div className="flex items-center gap-2">
                            <div>
                                <h3 className="text-gray-400 text-sm">Censorship</h3>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm ${media.censorship === "Censored"
                                            ? "bg-red-500/20 text-red-400"
                                            : "bg-green-500/20 text-green-400"
                                        }`}
                                >
                                    {media.censorship}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Genres */}
                    <div>
                        <h3 className="text-gray-400 text-sm mb-2">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                            {media.genres.map((genre) => (
                                <span
                                    key={genre}
                                    className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 rounded-full text-sm transition-colors"
                                >
                                    {genre}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaInfo;
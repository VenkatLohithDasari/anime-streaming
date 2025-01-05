// components/video/video-player.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface VideoPlayerProps {
    videoUrl: string;
    episodeId: string;
}

const VideoPlayer = ({ videoUrl, episodeId }: VideoPlayerProps) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const viewCountedRef = useRef(false);
    const [hasWatchedEnough, setHasWatchedEnough] = useState(false);

    const canCountView = () => {
        const VIEW_STORAGE_KEY = `episode-${episodeId}-last-view`;
        const lastView = localStorage.getItem(VIEW_STORAGE_KEY);
        if (!lastView) return true;

        const lastViewDate = new Date(lastView);
        const now = new Date();
        const hoursSinceLastView = (now.getTime() - lastViewDate.getTime()) / (1000 * 60 * 60);

        return hoursSinceLastView >= 24;
    };

    useEffect(() => {
        const VIEW_THRESHOLD = 10000; // 10 seconds in milliseconds

        const timer = setTimeout(() => {
            setHasWatchedEnough(true);
        }, VIEW_THRESHOLD);

        return () => clearTimeout(timer);
    }, [episodeId]);

    useEffect(() => {
        const handleViewCount = async () => {
            const VIEW_STORAGE_KEY = `episode-${episodeId}-last-view`;

            if (hasWatchedEnough && !viewCountedRef.current && canCountView()) {
                viewCountedRef.current = true;

                try {
                    const response = await fetch(`/api/episodes/${episodeId}/views`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update views');
                    }

                    const result = await response.json();

                    if (result.success) {
                        localStorage.setItem(VIEW_STORAGE_KEY, new Date().toISOString());
                    }
                } catch (error) {
                    console.error('Error updating views:', error);
                    // Optionally reset viewCountedRef on error to allow retry
                    // viewCountedRef.current = false;
                }
            }
        };

        handleViewCount();
    }, [hasWatchedEnough, episodeId]);

    return (
        <div className="relative aspect-video bg-neutral-800 rounded-lg overflow-hidden">
            <iframe
                ref={iframeRef}
                src={videoUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy"
            />
        </div>
    );
};

export default VideoPlayer;
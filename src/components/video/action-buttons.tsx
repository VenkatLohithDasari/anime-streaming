// components/video/action-buttons.tsx
'use client';

import { useState, useEffect } from 'react';
import { HiShare, HiThumbUp, HiThumbDown, HiEye } from "react-icons/hi";

interface ActionButtonsProps {
    episodeId: string;
    initialLikes: number;
    initialDislikes: number;
    views: number;
}

type UserAction = 'like' | 'dislike' | null;

const ActionButtons = ({ episodeId, initialLikes, initialDislikes, views }: ActionButtonsProps) => {
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [isLoading, setIsLoading] = useState(false);
    const [userAction, setUserAction] = useState<UserAction>(null);

    // Load user's previous action from localStorage on mount
    useEffect(() => {
        const savedAction = localStorage.getItem(`episode-${episodeId}-action`);
        if (savedAction === 'like' || savedAction === 'dislike') {
            setUserAction(savedAction);
        }
    }, [episodeId]);

    // Helper function to update counts optimistically
    const updateCountsOptimistically = (
        action: 'like' | 'dislike' | 'remove-like' | 'remove-dislike'
    ) => {
        switch (action) {
            case 'like':
                setLikes(prev => prev + 1);
                break;
            case 'dislike':
                setDislikes(prev => prev + 1);
                break;
            case 'remove-like':
                setLikes(prev => prev - 1);
                break;
            case 'remove-dislike':
                setDislikes(prev => prev - 1);
                break;
        }
    };

    const handleAction = async (action: 'like' | 'dislike') => {
        if (isLoading) return;
        setIsLoading(true);

        // Store previous state for rollback
        const previousLikes = likes;
        const previousDislikes = dislikes;
        const previousUserAction = userAction;

        try {
            let serverAction;
            let newUserAction: UserAction;

            // If clicking the same button again, remove the action
            if (userAction === action) {
                serverAction = action === 'like' ? 'remove-like' : 'remove-dislike';
                newUserAction = null;

                // Optimistic update
                updateCountsOptimistically(serverAction);
                setUserAction(newUserAction);
            }
            // If clicking the other button, remove previous action and add new one
            else if (userAction) {
                // First action: remove previous
                const firstServerAction = userAction === 'like' ? 'remove-like' : 'remove-dislike';
                // Second action: add new
                serverAction = action;
                newUserAction = action;

                // Optimistic updates for both actions
                updateCountsOptimistically(firstServerAction);
                updateCountsOptimistically(serverAction);
                setUserAction(newUserAction);

                // First API call to remove previous action
                const firstResponse = await fetch(`/api/episodes/${episodeId}/likes`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: firstServerAction })
                });

                if (!firstResponse.ok) throw new Error('Failed to update');
            }
            // If no previous action, simply add the new action
            else {
                serverAction = action;
                newUserAction = action;

                // Optimistic update
                updateCountsOptimistically(serverAction);
                setUserAction(newUserAction);
            }

            // Main API call
            const response = await fetch(`/api/episodes/${episodeId}/likes`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: serverAction })
            });

            if (!response.ok) throw new Error('Failed to update');

            const result = await response.json();

            if (result.success) {
                // Update localStorage
                if (newUserAction) {
                    localStorage.setItem(`episode-${episodeId}-action`, newUserAction);
                } else {
                    localStorage.removeItem(`episode-${episodeId}-action`);
                }

                // Sync with server state
                setLikes(result.likes);
                setDislikes(result.dislikes);
            } else {
                throw new Error('Failed to update');
            }
        } catch (error) {
            console.error('Error updating likes/dislikes:', error);

            // Rollback to previous state on error
            setLikes(previousLikes);
            setDislikes(previousDislikes);
            setUserAction(previousUserAction);

            // Restore localStorage
            if (previousUserAction) {
                localStorage.setItem(`episode-${episodeId}-action`, previousUserAction);
            } else {
                localStorage.removeItem(`episode-${episodeId}-action`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Function to format views (e.g., 1.5K, 1.2M)
    const formatViews = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <div className="py-4 border-b border-neutral-800">
            <div className="flex items-center justify-between">
                {/* Views Counter */}
                <div className="flex items-center gap-2 text-gray-400">
                    <HiEye className="w-5 h-5" />
                    <span className="text-sm">{formatViews(views)} views</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleAction('like')}
                        disabled={isLoading}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-full transition disabled:opacity-50
                            ${userAction === 'like'
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-neutral-800 hover:bg-neutral-700'}`}
                    >
                        <HiThumbUp className="w-5 h-5" />
                        <span className="text-sm">{likes}</span>
                    </button>

                    <button
                        onClick={() => handleAction('dislike')}
                        disabled={isLoading}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-full transition disabled:opacity-50
                            ${userAction === 'dislike'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-neutral-800 hover:bg-neutral-700'}`}
                    >
                        <HiThumbDown className="w-5 h-5" />
                        <span className="text-sm">{dislikes}</span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition">
                        <HiShare className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ActionButtons;
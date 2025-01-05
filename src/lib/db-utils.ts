// lib/db-utils.ts
import { connectToDatabase } from './mongodb';
import { Anime, Episode, Genre } from '@/models';
import { cache } from 'react';
import mongoose, { Types } from 'mongoose';

export const getRecentEpisodes = cache(async (limit: number = 12) => {
    await connectToDatabase();
    return Episode.find()
        .sort({ releaseDate: -1 })
        .limit(limit)
        .populate('animeId', 'name poster')
        .populate('genres', 'name')
        .lean();
});

export const getPopularAnime = cache(async (limit: number = 12) => {
    await connectToDatabase();
    return Anime.find()
        .populate('genres', 'name')
        .limit(limit)
        .lean();
});

export const getAnimeDetails = cache(async (animeId: string) => {
    await connectToDatabase();
    return Anime.findById(animeId)
        .populate('genres', 'name')
        .populate({
            path: 'episodes',
            options: { sort: { episodeNumber: 1 } },
            select: 'episodeNumber name thumbnail duration views releaseDate'
        })
        .lean();
});

// lib/db-utils.ts
export const getEpisodeDetails = cache(async (episodeId: string) => {
    await connectToDatabase();
    return Episode.findOne({ episodeId })
        .populate('animeId', 'name alternativeTitles description studio poster')
        .populate({
            path: 'animeId',
            populate: {
                path: 'episodes',
                select: 'episodeId episodeNumber thumbnail name duration ',
                options: { sort: { episodeNumber: 1 } }
            }
        })
        .populate('genres', 'name')
        .lean();
});

export const getGenres = cache(async () => {
    await connectToDatabase();
    return Genre.find()
        .sort({ videos: -1 })
        .lean();
});

export const searchAnime = cache(async (query: string, limit: number = 12) => {
    await connectToDatabase();
    return Anime.find({
        $or: [
            { name: { $regex: query, $options: 'i' } },
            { alternativeTitles: { $regex: query, $options: 'i' } }
        ]
    })
        .limit(limit)
        .populate('genres', 'name')
        .lean();
});

// For updating views/likes/dislikes
export const updateEpisodeStats = async (
    episodeId: string,
    update: { views?: number; likes?: number; dislikes?: number }
) => {
    await connectToDatabase();
    return Episode.findOneAndUpdate(
        { episodeId },
        { $inc: update },
        { new: true }
    );
};

// lib/db-utils.ts
export const getRelatedEpisodes = cache(async (
    currentEpisodeId: string,
    currentGenres: Types.ObjectId[],
    currentAnimeId: Types.ObjectId | null,
    limit: number = 15
) => {
    await connectToDatabase();

    // Convert current genres to array of ObjectId values
    const currentGenreIds = currentGenres.map(g => g._id);

    // console.log('\n=== Finding Related Episodes ===');
    // console.log('Current Episode ID:', currentEpisodeId);
    // console.log('Current Genre IDs:', currentGenreIds);
    // console.log('Current Anime ID:', currentAnimeId);

    const potentialEpisodes = await Episode.aggregate([
        {
            $match: {
                episodeId: { $ne: currentEpisodeId },
                $or: [
                    { genres: { $in: currentGenreIds } }, // Match using genre _ids
                    ...(currentAnimeId ? [{ animeId: currentAnimeId }] : [])
                ]
            }
        },
        // Lookup anime details
        {
            $lookup: {
                from: 'animes',
                localField: 'animeId',
                foreignField: '_id',
                as: 'animeDetails'
            }
        },
        { $unwind: { path: '$animeDetails', preserveNullAndEmptyArrays: true } },
        // Calculate scores
        {
            $addFields: {
                matchingGenres: {
                    $size: {
                        $setIntersection: ['$genres', currentGenreIds]
                    }
                }
            }
        },
        {
            $addFields: {
                scores: {
                    // Genre Match Score (0-100)
                    genreScore: {
                        $cond: {
                            if: { $gt: ['$matchingGenres', 0] },
                            then: {
                                $add: [
                                    20, // Base score for first match
                                    {
                                        $multiply: [
                                            { $subtract: ['$matchingGenres', 1] },
                                            10
                                        ]
                                    }
                                ]
                            },
                            else: 0
                        }
                    },
                    // Same Anime Score (0 or 25)
                    animeScore: {
                        $cond: [
                            {
                                $and: [
                                    { $ne: ['$animeId', null] },
                                    { $eq: ['$animeId', currentAnimeId] }
                                ]
                            },
                            25,
                            0
                        ]
                    },
                    // Recency Score (0-15)
                    recencyScore: {
                        $let: {
                            vars: {
                                monthsAgo: {
                                    $divide: [
                                        { $subtract: [new Date(), '$updateDate'] }, // Changed from uploadDate
                                        1000 * 60 * 60 * 24 * 30
                                    ]
                                }
                            },
                            in: {
                                $switch: {
                                    branches: [
                                        { case: { $lte: ['$$monthsAgo', 1] }, then: 15 },
                                        { case: { $lte: ['$$monthsAgo', 3] }, then: 10 },
                                        { case: { $lte: ['$$monthsAgo', 6] }, then: 5 }
                                    ],
                                    default: 0
                                }
                            }
                        }
                    },
                    // Views Score (0-10)
                    viewsScore: {
                        $min: [
                            {
                                $multiply: [
                                    { $log10: { $add: ['$views', 1] } },
                                    2
                                ]
                            },
                            10
                        ]
                    }
                }
            }
        },
        // Calculate total score
        {
            $addFields: {
                totalScore: {
                    $add: [
                        '$scores.genreScore',
                        '$scores.animeScore',
                        '$scores.recencyScore',
                        '$scores.viewsScore'
                    ]
                }
            }
        },
        // Sort by total score
        { $sort: { totalScore: -1 } },
        // Limit results
        { $limit: limit }
    ]);

    // Debug logs
    // console.log('\n=== Related Episodes Found ===');
    // potentialEpisodes.forEach((episode, index) => {
    //     console.log(`\nEpisode ${index + 1}: ${episode.displayTitle}`);
    //     console.log('Matching Genres Count:', episode.matchingGenres);
    //     console.log('Scores:', {
    //         genre: `${episode.scores.genreScore}/100`,
    //         anime: `${episode.scores.animeScore}/25`,
    //         recency: `${episode.scores.recencyScore}/15`,
    //         views: `${episode.scores.viewsScore}/10`,
    //         total: `${episode.totalScore}/150`
    //     });
    //     console.log('From same anime:', episode.scores.animeScore > 0);
    //     console.log('Views:', episode.views);
    //     console.log('Update date:', episode.updateDate);
    // });

    return potentialEpisodes.map(episode => ({
        episodeId: episode.episodeId,
        displayTitle: episode.displayTitle,
        thumbnail: episode.thumbnail,
        views: episode.views,
        duration: episode.duration
    }));
});


// lib/db-utils.ts
export const getFilteredEpisodes = cache(async ({
    page = 1,
    perPage = 18,
    search = '',
    genres = [],
    sort = 'latest'
}: {
    page?: number;
    perPage?: number;
    search?: string;
    genres?: string[];
    sort?: string;
}) => {
    await connectToDatabase();

    const skip = (page - 1) * perPage;

    // Build query
    const query: any = {};

    // Search (now using only displayTitle)
    if (search) {
        query.displayTitle = { $regex: search, $options: 'i' };
    }

    // Genres
    if (genres.length > 0) {
        query.genres = { $in: genres.map(id => new Types.ObjectId(id)) };
    }

    // Sort configuration
    let sortConfig: any = {};
    switch (sort) {
        case 'views':
            sortConfig = { views: -1 };
            break;
        case 'likes':
            sortConfig = { likes: -1 };
            break;
        default: // 'latest'
            sortConfig = { updateDate: -1 };
    }

    const [episodes, totalCount] = await Promise.all([
        Episode.find(query)
            .sort(sortConfig)
            .skip(skip)
            .limit(perPage)
            .populate('animeId', 'name poster') // Still populate animeId for poster
            .populate('genres', 'name')
            .lean(),
        Episode.countDocuments(query)
    ]);

    return {
        episodes,
        totalPages: Math.ceil(totalCount / perPage)
    };
});
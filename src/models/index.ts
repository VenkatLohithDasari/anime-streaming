// models/index.ts
import mongoose from 'mongoose';
import { IAnime } from './types';
import { IEpisode } from './types';
import { IGenre } from './types';

// Anime Model
const AnimeSchema = new mongoose.Schema<IAnime>({
    name: String,
    alternativeTitles: [String],
    description: String,
    studio: String,
    poster: String,
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
    episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode' }],
    createdAt: Date,
    updatedAt: Date,
});

// Episode Model
const EpisodeSchema = new mongoose.Schema<IEpisode>({
    name: String,
    displayTitle: String,
    episodeNumber: Number,
    animeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Anime' },
    episodeId: String,
    videoUrl: String,
    thumbnail: String,
    duration: String,
    views: Number,
    releaseDate: Date,
    updateDate: Date,
    isCensored: Boolean,
    genres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }],
    likes: Number,
    dislikes: Number,
});

// Genre Model
const GenreSchema = new mongoose.Schema<IGenre>({
    name: String,
    description: String,
    image: String,
    videos: Number,
    createdAt: Date,
});

export const Anime = mongoose.models.Anime || mongoose.model('Anime', AnimeSchema);
export const Episode = mongoose.models.Episode || mongoose.model('Episode', EpisodeSchema);
export const Genre = mongoose.models.Genre || mongoose.model('Genre', GenreSchema);
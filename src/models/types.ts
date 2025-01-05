// models/types.ts
import { Document, Types } from 'mongoose';

export interface IAnime extends Document {
    name: string;
    alternativeTitles: string[];
    description: string;
    studio: string;
    poster: string;
    genres: Types.ObjectId[];
    episodes: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IEpisode extends Document {
    name?: string;
    displayTitle: string;
    episodeNumber: number;
    animeId: Types.ObjectId;
    episodeId: string;
    videoUrl: string;
    thumbnail: string;
    duration: string;
    views: number;
    releaseDate: Date;
    updateDate: Date;
    isCensored: boolean;
    genres: Types.ObjectId[];
    likes: number;
    dislikes: number;
}

export interface IGenre extends Document {
    name: string;
    description?: string;
    image: string;
    videos: number;
    createdAt: Date;
}
import mongoose from "mongoose";
import { Image, Video } from "src/@types";

export interface IEpisode {
    _id: mongoose.Types.ObjectId;
    tv_show_id: mongoose.Types.ObjectId;
    season_id: mongoose.Types.ObjectId;
    air_date: Date;
    episode_number: number;
    season_number: number;
    name: string;
    overview: string;
    runtime: number;
    still_path: string;
    directors: string[];
    videos: Video[];
    images: Image[];
    // 
    createdAt: Date;
    updatedAt: Date;
}

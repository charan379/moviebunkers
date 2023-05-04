import mongoose from "mongoose";
import { Image, Video } from "src/@types";


export interface ISeason {
    _id: mongoose.Types.ObjectId;
    tv_show_id: mongoose.Types.ObjectId;
    air_date: Date;
    season_number: number;
    episode_count: number;
    name: string;
    overview: string;
    poster_path: string;
    videos: Video[];
    images: Image[];
    // 
    createdAt: Date;
    updatedAt: Date;
}
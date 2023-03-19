import { ObjectId } from "mongoose";


interface SeasonDTO {
    air_date?: Date;
    season_number: number;
    episode_count: number;
    name: string;
    overview?: string;
    poster_path?: string; 
}

export default SeasonDTO;
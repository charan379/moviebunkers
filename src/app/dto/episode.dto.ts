

interface EpisodeDTO {
    air_date?: Date;
    episode_number: number;
    season_number: number;
    name: string;
    overview?: string;
    runtime?: number;
    still_path?: string;
    directors?: string[];
}

export default EpisodeDTO;
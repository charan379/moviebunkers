import ITitle from "@models/interfaces/title.interface";
import mongoose, { ProjectionFields } from "mongoose";
import TitleDTO from "@dto/title.dto";
import { FindAllQuery, Language, Page } from "src/@types";


interface ITitleRepository {
    create(title: Partial<ITitle>): Promise<ITitle | null>
    findById(id: mongoose.Types.ObjectId, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findByTmdbId(tmdbId: number, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findByImdbId(imdbId: string, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findAll({ query, sort, limit, page }: FindAllQuery<ITitle>, projection: ProjectionFields<ITitle>): Promise<Page<TitleDTO>>;
    findByIdWithUserData(titleId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findAllWithUserData({ query, sort, limit, page }: FindAllQuery<ITitle>, userId: mongoose.Types.ObjectId, projection: ProjectionFields<ITitle>): Promise<Page<TitleDTO>>;
    fetchAllAvailableGenres(): Promise<Array<string>>;
    fetchAllAvailableLanguages(): Promise<Language[]>;
    updateTitleById(titleId: mongoose.Types.ObjectId, update: Partial<ITitle>): Promise<ITitle | null>;
    deleteTitleById(titleId: mongoose.Types.ObjectId): Promise<void>;
}

export default ITitleRepository;
import LanguageDTO from "@dto/language.dto";
import PageDTO from "@dto/page.dto";
import ITitle from "@models/interfaces/title.interface";
import mongoose, { ObjectId, ProjectionFields } from "mongoose";
import { FindAllQuery } from "./custom.types.interfaces";


interface ITitleRepository {
    findById(id: string, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findByTmdbId(tmdbId: number, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findByImdbId(imdbId: string, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findAll({ query, sort, limit, page }: FindAllQuery, projection: ProjectionFields<ITitle>): Promise<PageDTO>;
    findByIdWithUserData(titleId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findAllWithUserData({ query, sort, limit, page }: FindAllQuery, userId: mongoose.Types.ObjectId, projection: ProjectionFields<ITitle>): Promise<PageDTO>;
    fetchAllAvailableGenres(): Promise<Array<string>>;
    fetchAllAvailableLanguages(): Promise<LanguageDTO[]>;
    deleteTitleById(titleId: mongoose.Types.ObjectId): Promise<void>;
}

export default ITitleRepository;
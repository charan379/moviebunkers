import LanguageDTO from "@dto/language.dto";
import PageDTO from "@dto/page.dto";
import ITitle from "@models/interfaces/title.interface";
import { ObjectId, ProjectionFields } from "mongoose";
import { FindAllQuery } from "./custom.types.interfaces";


interface ITitleRepository {
    findById(id: string, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findByTmdbId(tmdbId: number, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findByImdbId(imdbId: string, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findAll({ query, sort, limit, page }: FindAllQuery, projection: ProjectionFields<ITitle>): Promise<PageDTO>;
    findByIdWithUserData(titleId: string, userId: ObjectId, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findAllWithUserData({ query, sort, limit, page }: FindAllQuery, userId: ObjectId, projection: ProjectionFields<ITitle>): Promise<PageDTO>;
    fetchAllAvailableGenres(): Promise<Array<string>>;
    fetchAllAvailableLanguages(): Promise<LanguageDTO[]>;
    deleteTitleById(titleId: string): Promise<void>;
}

export default ITitleRepository;
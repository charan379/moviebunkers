import PageDTO from "@dto/page.dto";
import ITitle from "@models/interfaces/title.interface";
import { ProjectionFields } from "mongoose";
import { FindAllQuery } from "./custom.types.interfaces";


interface ITitleRepository {
    findById(id: string, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findByTmdbId(tmdbId: number, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findByImdbId(imdbId: string, projection: ProjectionFields<ITitle>): Promise<ITitle | null>;
    findAll({query, sort, limit, page}: FindAllQuery, projection: ProjectionFields<ITitle>): Promise<PageDTO>;
}

export default ITitleRepository;
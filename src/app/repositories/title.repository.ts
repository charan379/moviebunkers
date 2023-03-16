import PageDTO from "@dto/page.dto";
import TitleDTO from "@dto/title.dto";
import ITitle from "@models/interfaces/title.interface";
import TitleModel from "@models/title.model";
import { Model, ProjectionFields } from "mongoose";
import { Service } from "typedi";
import { FindAllQuery } from "./interfaces/custom.types.interfaces";
import ITitleRepository from "./interfaces/title.repository.interface";

@Service()
class TitleRepository implements ITitleRepository {

    private titleModel: Model<ITitle>;

    constructor() {
        this.titleModel = TitleModel;
    }

    findById(id: string, projection: ProjectionFields<ITitle> = { __v: 0 }): Promise<ITitle | null> {
        return this.titleModel.findById(id, projection)
            .populate([{
                path: 'added_by',
                model: 'user',
                localField: 'added_by',
                foreignField: '_id',
                select: "userName email status role createdAt",
                strictPopulate: false,
            },
            {
                path: 'last_modified_by',
                model: 'user',
                localField: 'added_by',
                foreignField: '_id',
                select: "userName email status role createdAt",
                strictPopulate: false,
            }])
            .lean()
            .exec();
    }

    findByTmdbId(tmdbId: number, projection: ProjectionFields<ITitle> = { __v: 0 }): Promise<ITitle | null> {
        return this.titleModel.findOne({ tmdb_id: tmdbId }, projection)
            .populate([{
                path: 'added_by',
                model: 'user',
                localField: 'added_by',
                foreignField: '_id',
                select: "userName email status role createdAt",
                strictPopulate: false,
            },
            {
                path: 'last_modified_by',
                model: 'user',
                localField: 'added_by',
                foreignField: '_id',
                select: "userName email status role createdAt",
                strictPopulate: false,
            }])
            .lean().exec();
    }

    findByImdbId(imdbId: string, projection: ProjectionFields<ITitle> = { __v: 0 }): Promise<ITitle | null> {
        return this.titleModel.findOne({ imdb_id: imdbId }, projection)
            .populate([{
                path: 'added_by',
                model: 'user',
                localField: 'added_by',
                foreignField: '_id',
                select: "userName email status role createdAt",
                strictPopulate: false,
            },
            {
                path: 'last_modified_by',
                model: 'user',
                localField: 'added_by',
                foreignField: '_id',
                select: "userName email status role createdAt",
                strictPopulate: false,
            }])
            .lean().exec();
    }

    /**
     * 
     * @param param0 FindAllQuery
     * @param projection ProjectionFields<ITitle>
     * @returns 
     */
    async findAll({ query, sort, limit, page }: FindAllQuery, projection: ProjectionFields<ITitle> = { __v: 0 }): Promise<PageDTO> {


        const total_results = await this.titleModel.find({ ...query }).countDocuments().lean().exec();

        const titlesList: ITitle[] = await this.titleModel.find({ ...query }, projection)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate([{
                path: 'added_by',
                model: 'user',
                localField: 'added_by',
                foreignField: '_id',
                select: "userName email status role createdAt",
                strictPopulate: false,
            },
            {
                path: 'last_modified_by',
                model: 'user',
                localField: 'added_by',
                foreignField: '_id',
                select: "userName email status role createdAt",
                strictPopulate: false,
            }])
            .sort({ ...sort })
            .lean()
            .exec();

        const titleDTOs: TitleDTO[] = titlesList.map(iTitle => {
            return iTitle as TitleDTO;
        })

        const result: PageDTO = {
            page: page,
            total_pages: Math.ceil(total_results / limit),
            total_results: total_results,
            sort_order: sort,
            list: titleDTOs,
        }

        return result;
    }

}

export default TitleRepository;
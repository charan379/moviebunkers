import LanguageDTO from "@dto/language.dto";
import PageDTO from "@dto/page.dto";
import TitleDTO from "@dto/title.dto";
import ITitle from "@models/interfaces/title.interface";
import TitleModel from "@models/title.model";
import mongoose, {
    Model,
    ObjectId,
    PipelineStage,
    ProjectionFields,
    Schema,
} from "mongoose";
import { Service } from "typedi";
import { FindAllQuery } from "./interfaces/custom.types.interfaces";
import ITitleRepository from "./interfaces/title.repository.interface";

@Service()
class TitleRepository implements ITitleRepository {
    private titleModel: Model<ITitle>;

    constructor() {
        this.titleModel = TitleModel;
    }

    /**
     * findById()
     * @param id
     * @param projection
     * @returns
     */
    findById(
        id: string,
        projection: ProjectionFields<ITitle> = { __v: 0 }
    ): Promise<ITitle | null> {
        return this.titleModel
            .findById(id, projection)
            .populate([
                {
                    path: "added_by",
                    model: "user",
                    localField: "added_by",
                    foreignField: "_id",
                    select: "userName email status role createdAt",
                    strictPopulate: false,
                },
                {
                    path: "last_modified_by",
                    model: "user",
                    localField: "added_by",
                    foreignField: "_id",
                    select: "userName email status role createdAt",
                    strictPopulate: false,
                },
            ])
            .lean()
            .exec();
    }

    /**
     * findByTmdbId()
     * @param tmdbId
     * @param projection
     * @returns
     */
    findByTmdbId(
        tmdbId: number,
        projection: ProjectionFields<ITitle> = { __v: 0 }
    ): Promise<ITitle | null> {
        return this.titleModel
            .findOne({ tmdb_id: tmdbId }, projection)
            .populate([
                {
                    path: "added_by",
                    model: "user",
                    localField: "added_by",
                    foreignField: "_id",
                    select: "userName email status role createdAt",
                    strictPopulate: false,
                },
                {
                    path: "last_modified_by",
                    model: "user",
                    localField: "added_by",
                    foreignField: "_id",
                    select: "userName email status role createdAt",
                    strictPopulate: false,
                },
            ])
            .lean()
            .exec();
    }

    /**
     * findByImdbId()
     * @param imdbId
     * @param projection
     * @returns
     */
    findByImdbId(
        imdbId: string,
        projection: ProjectionFields<ITitle> = { __v: 0 }
    ): Promise<ITitle | null> {
        return this.titleModel
            .findOne({ imdb_id: imdbId }, projection)
            .populate([
                {
                    path: "added_by",
                    model: "user",
                    localField: "added_by",
                    foreignField: "_id",
                    select: "userName email status role createdAt",
                    strictPopulate: false,
                },
                {
                    path: "last_modified_by",
                    model: "user",
                    localField: "added_by",
                    foreignField: "_id",
                    select: "userName email status role createdAt",
                    strictPopulate: false,
                },
            ])
            .lean()
            .exec();
    }

    /**
     * @deprecated use findAllWithUserData()
     * @param param0 FindAllQuery
     * @param projection ProjectionFields<ITitle>
     * @returns
     */
    async findAll(
        { query, sort, limit, page }: FindAllQuery,
        projection: ProjectionFields<ITitle> = { __v: 0 }
    ): Promise<PageDTO> {
        const total_results = await this.titleModel
            .find({ ...query })
            .countDocuments()
            .lean()
            .exec();

        const titlesList: ITitle[] = await this.titleModel
            .find({ ...query }, projection)
            .sort({ ...sort })
            .skip((page - 1) * limit)
            .limit(limit * 1)
            .lean()
            .exec();

        const titleDTOs: TitleDTO[] = titlesList.map((iTitle) => {
            return iTitle as TitleDTO;
        });

        const result: PageDTO = {
            page: page,
            total_pages: Math.ceil(total_results / limit),
            total_results: total_results,
            sort_order: sort,
            list: titleDTOs,
        };

        return result;
    }

    /**
     * findByIdWithUserData()
     * @param titleId
     * @param userId
     * @param projection
     * @returns
     */
    async findByIdWithUserData(
        titleId: string,
        userId: ObjectId,
        projection: ProjectionFields<ITitle> = { __v: 0, userData: 0 }
    ): Promise<ITitle | null> {
        const matchQuery: PipelineStage.Match = {
            $match: {
                _id: new mongoose.Types.ObjectId(titleId),
            },
        };

        const lookupUserData: PipelineStage.Lookup = {
            $lookup: {
                from: "userData",
                let: {
                    externalUserId: userId,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$userId", "$$externalUserId"],
                            },
                        },
                    },
                    {
                        $project: {
                            __v: 0,
                            createdAt: 0,
                            updatedAt: 0,
                        },
                    },
                ],
                as: "userData",
            },
        };

        const addUserDataDoc: PipelineStage.AddFields = {
            $addFields: {
                userData: {
                    $arrayElemAt: ["$userData", 0],
                },
            },
        };

        const addUserDataFields: PipelineStage.AddFields = {
            $addFields: {
                seenByUser: {
                    $cond: {
                        if: {
                            $in: ["$_id", "$userData.seenTitles"],
                        },
                        then: true,
                        else: false,
                    },
                },
                unseenByUser: {
                    $cond: {
                        if: {
                            $in: ["$_id", "$userData.unseenTitles"],
                        },
                        then: true,
                        else: false,
                    },
                },
                starredByUser: {
                    $cond: {
                        if: {
                            $in: ["$_id", "$userData.starredTitles"],
                        },
                        then: true,
                        else: false,
                    },
                },
                favouriteByUser: {
                    $cond: {
                        if: {
                            $in: ["$_id", "$userData.favouriteTitles"],
                        },
                        then: true,
                        else: false,
                    },
                },
            },
        };

        const lookUpAddedByUser: PipelineStage.Lookup = {
            $lookup: {
                from: "users",
                localField: "added_by",
                foreignField: "_id",
                as: "added_by",
            },
        };
        const lookUpLastModifiedByUser: PipelineStage.Lookup = {
            $lookup: {
                from: "users",
                localField: "last_modified_by",
                foreignField: "_id",
                as: "last_modified_by",
            },
        };

        const addAddedByAndLastModifiedByFields: PipelineStage.AddFields = {
            $addFields: {
                added_by: {
                    $arrayElemAt: ["$added_by", 0],
                },

                last_modified_by: {
                    $arrayElemAt: ["$last_modified_by", 0],
                },
            },
        };
        const projectionStage: PipelineStage.Project = {
            $project: {
                __v: 0,
                userData: 0,
                "added_by.password": 0,
                "added_by.email": 0,
                "added_by.last_modified_by": 0,
                "added_by.updatedAt": 0,
                "added_by.createdAt": 0,
                "added_by.__v": 0,
                "last_modified_by.password": 0,
                "last_modified_by.email": 0,
                "last_modified_by.last_modified_by": 0,
                "last_modified_by.updatedAt": 0,
                "last_modified_by.createdAt": 0,
                "last_modified_by.__v": 0,
            },
        };

        const title = await this.titleModel.aggregate([
            matchQuery,
            lookupUserData,
            addUserDataDoc,
            addUserDataFields,
            lookUpAddedByUser,
            lookUpLastModifiedByUser,
            addAddedByAndLastModifiedByFields,
            projectionStage,
        ]);

        return title[0];
    }

    /**
     * findAllWithUserData()
     * @param param0
     * @param userId
     * @param projection
     * @returns
     */
    async findAllWithUserData(
        { query, sort, limit, page }: FindAllQuery,
        userId: Schema.Types.ObjectId,
        projection: ProjectionFields<ITitle>
    ): Promise<PageDTO> {
        const lookupUserData: PipelineStage.Lookup = {
            $lookup: {
                from: "userData",
                let: {
                    externalUserId: userId,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$userId", "$$externalUserId"],
                            },
                        },
                    },
                    {
                        $project: {
                            __v: 0,
                            createdAt: 0,
                            updatedAt: 0,
                        },
                    },
                ],
                as: "userData",
            },
        };

        const addUserDataDoc: PipelineStage.AddFields = {
            $addFields: {
                userData: {
                    $arrayElemAt: ["$userData", 0],
                },
            },
        };

        const addUserDataFields: PipelineStage.AddFields = {
            $addFields: {
                seenByUser: {
                    $cond: {
                        if: {
                            $in: ["$_id", "$userData.seenTitles"],
                        },
                        then: true,
                        else: false,
                    },
                },
                unseenByUser: {
                    $cond: {
                        if: {
                            $in: ["$_id", "$userData.unseenTitles"],
                        },
                        then: true,
                        else: false,
                    },
                },
                starredByUser: {
                    $cond: {
                        if: {
                            $in: ["$_id", "$userData.starredTitles"],
                        },
                        then: true,
                        else: false,
                    },
                },
                favouriteByUser: {
                    $cond: {
                        if: {
                            $in: ["$_id", "$userData.favouriteTitles"],
                        },
                        then: true,
                        else: false,
                    },
                },
            },
        };

        const sortDocs: PipelineStage.Sort = {
            $sort: sort,
        };
        const matchQuery: PipelineStage.Match = {
            $match: query,
        };

        const countTotalResults: PipelineStage.Count = {
            $count: "total_results",
        };

        const skipDocs: PipelineStage.Skip = {
            $skip: (page - 1) * limit,
        };

        const limitDocs: PipelineStage.Limit = {
            $limit: limit === 0 ? await this.titleModel.find({}).count().lean().exec() : limit,
        };

        const projectionStage: PipelineStage.Project = {
            $project: projection,
        };
        const titlesCount = await this.titleModel.aggregate([
            matchQuery,
            lookupUserData,
            addUserDataDoc,
            addUserDataFields,
            countTotalResults,
        ]);

        const titlesList = await this.titleModel.aggregate([
            matchQuery,
            lookupUserData,
            addUserDataDoc,
            addUserDataFields,
            sortDocs,
            skipDocs,
            limitDocs,
            projectionStage,
        ]);

        const titleDTOs: TitleDTO[] = titlesList.map((iTitle) => {
            return iTitle as TitleDTO;
        });

        let result: PageDTO = {
            page: page,
            total_pages: Math.ceil((titlesCount[0]?.total_results ?? 0) / limit === 0 ? 1 : limit),
            total_results: titlesCount[0]?.total_results ?? 0,
            sort_order: sort,
            list: titleDTOs,
        };

        if (!result?.total_pages) {
            result = { ...result, total_pages: 1 }
        }

        return result;
    }

    /**
     * fetchAllAvailableGenres()
     */
    async fetchAllAvailableGenres(): Promise<string[]> {
        const matchStage: PipelineStage.Match = {
            $match: {
                genres: {
                    $exists: true,
                    $ne: { $in: [null, []] },
                },
            },
        };

        const projectStage1: PipelineStage.Project = {
            $project: {
                genres: 1,
            },
        };

        const unwindStage1: PipelineStage.Unwind = {
            $unwind: {
                path: "$genres",
                includeArrayIndex: "string",
                preserveNullAndEmptyArrays: false,
            },
        };

        const groupStage1: PipelineStage.Group = {
            $group: {
                _id: "$genres",
            },
        };

        const groupStage2: PipelineStage.Group = {
            $group: {
                _id: null,
                genres: {
                    $push: "$_id",
                },
            },
        };

        const unwindStage2: PipelineStage.Unwind = {
            $unwind: {
                path: "$genres",
                includeArrayIndex: "string",
                preserveNullAndEmptyArrays: false,
            },
        };

        const sortStage: PipelineStage.Sort = {
            $sort: {
                genres: 1,
            },
        };

        const groupStage3: PipelineStage.Group = {
            $group: {
                _id: null,
                genres: {
                    $push: "$genres",
                },
            },
        };

        const projectStage2: PipelineStage.Project = {
            $project: {
                _id: 0,
                genres: 1,
            },
        };

        const data = await this.titleModel
            .aggregate([
                matchStage,
                projectStage1,
                unwindStage1,
                groupStage1,
                groupStage2,
                unwindStage2,
                sortStage,
                groupStage3,
                projectStage2,
            ])
            .exec();

        return data[0]?.genres ?? [];
    }

    /**
     * fetchAllAvailableLanguages()
     */
    async fetchAllAvailableLanguages(): Promise<LanguageDTO[]> {
        const matchStage: PipelineStage.Match = {
            $match: {
                languages: {
                    $exists: true,
                    $ne: { $in: [null, []] },
                },
            },
        };

        const projectStage1: PipelineStage.Project = {
            $project: {
                languages: 1,
            },
        };

        const unwindStage: PipelineStage.Unwind = {
            $unwind: {
                path: "$languages",
                includeArrayIndex: "string",
                preserveNullAndEmptyArrays: false,
            },
        };

        const sortStage: PipelineStage.Sort = {
            $sort: {
                "languages.english_name": 1,
            },
        };

        const groupStage: PipelineStage.Group = {
            $group: {
                _id: null,
                languages: {
                    $addToSet: "$languages",
                },
            },
        };

        const projectStage2: PipelineStage.Project = {
            $project: {
                _id: 0,
                languages: 1,
            },
        };

        const data = await this.titleModel
            .aggregate([
                matchStage,
                projectStage1,
                unwindStage,
                sortStage,
                groupStage,
                projectStage2,
            ])
            .exec();

        return data[0]?.languages ?? [];
    }

    /**
     * deleteTitleById()
     * @param titleId
     */
    async deleteTitleById(titleId: string): Promise<void> {
        await this.titleModel.deleteOne({ _id: titleId }).lean().exec();
    }

}

export default TitleRepository;

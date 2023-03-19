import PageDTO from "@dto/page.dto";
import TitleDTO from "@dto/title.dto";
import ITitle from "@models/interfaces/title.interface";
import TitleModel from "@models/title.model";
import mongoose, { Model, ObjectId, PipelineStage, ProjectionFields, Schema } from "mongoose";
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
     * @param param0 FindAllQuery
     * @param projection ProjectionFields<ITitle>
     * @returns 
     */
    async findAll({ query, sort, limit, page }: FindAllQuery, projection: ProjectionFields<ITitle> = { __v: 0 }): Promise<PageDTO> {


        const total_results = await this.titleModel.find({ ...query }).countDocuments().lean().exec();

        const titlesList: ITitle[] = await this.titleModel.find({ ...query }, projection)
            .sort({ ...sort })
            .skip((page - 1) * limit)
            .limit(limit * 1)
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


    async findByIdWithUserData(titleId: string, userId: ObjectId, projection: ProjectionFields<ITitle> = { __v: 0, userData: 0 }): Promise<ITitle | null> {

        const matchQuery: PipelineStage.Match = {
            '$match': {
                '_id': new mongoose.Types.ObjectId(titleId)
            }
        }

        const lookupUserData: PipelineStage.Lookup = {
            '$lookup': {
                'from': 'userData',
                'let': {
                    'externalUserId': userId
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$eq': [
                                    '$userId', '$$externalUserId'
                                ]
                            }
                        }
                    }, {
                        '$project': {
                            '__v': 0,
                            'createdAt': 0,
                            'updatedAt': 0
                        }
                    }
                ],
                'as': 'userData'
            }
        }

        const addUserDataDoc: PipelineStage.AddFields = {
            '$addFields': {
                'userData': {
                    '$arrayElemAt': [
                        '$userData', 0
                    ]
                }
            }
        }

        const addUserDataFields: PipelineStage.AddFields = {
            '$addFields': {
                'seenByUser': {
                    '$cond': {
                        'if': {
                            '$in': [
                                '$_id', '$userData.seenTitles'
                            ]
                        },
                        'then': true,
                        'else': false
                    }
                },
                'unseenByUser': {
                    '$cond': {
                        'if': {
                            '$in': [
                                '$_id', '$userData.unseenTitles'
                            ]
                        },
                        'then': true,
                        'else': false
                    }
                },
                'starredByUser': {
                    '$cond': {
                        'if': {
                            '$in': [
                                '$_id', '$userData.starredTitles'
                            ]
                        },
                        'then': true,
                        'else': false
                    }
                },
                'favouriteByUser': {
                    '$cond': {
                        'if': {
                            '$in': [
                                '$_id', '$userData.favouriteTitles'
                            ]
                        },
                        'then': true,
                        'else': false
                    }
                }
            }
        }

        const lookUpAddedByUser: PipelineStage.Lookup = {
            $lookup: {
                from: 'users',
                localField: 'added_by',
                foreignField: '_id',
                as: 'added_by'
            }
        }
        const lookUpLastModifiedByUser: PipelineStage.Lookup = {
            $lookup: {
                from: 'users',
                localField: 'last_modified_by',
                foreignField: '_id',
                as: 'last_modified_by'
            }
        }

        const addAddedByAndLastModifiedByFields: PipelineStage.AddFields = {
            $addFields: {
                'added_by': {
                    $arrayElemAt: ['$added_by', 0]
                },

                'last_modified_by': {
                    $arrayElemAt: ['$last_modified_by', 0]
                }
            }
        }
        const projectionStage: PipelineStage.Project = {
            $project: {
                '__v': 0,
                'userData': 0,
                'added_by.password': 0,
                'added_by.email': 0,
                'added_by.last_modified_by': 0,
                'added_by.updatedAt': 0,
                'added_by.createdAt': 0,
                'added_by.__v': 0,
                'last_modified_by.password': 0,
                'last_modified_by.email': 0,
                'last_modified_by.last_modified_by': 0,
                'last_modified_by.updatedAt': 0,
                'last_modified_by.createdAt': 0,
                'last_modified_by.__v': 0,
            }
        }

        const title = await this.titleModel.aggregate([matchQuery, lookupUserData, addUserDataDoc, addUserDataFields, lookUpAddedByUser, lookUpLastModifiedByUser, addAddedByAndLastModifiedByFields, projectionStage])

        return title[0];
    }

    async findAllWithUserData({ query, sort, limit, page }: FindAllQuery, userId: Schema.Types.ObjectId, projection: ProjectionFields<ITitle>): Promise<PageDTO> {

        const lookupUserData: PipelineStage.Lookup = {
            '$lookup': {
                'from': 'userData',
                'let': {
                    'externalUserId': userId
                },
                'pipeline': [
                    {
                        '$match': {
                            '$expr': {
                                '$eq': [
                                    '$userId', '$$externalUserId'
                                ]
                            }
                        }
                    }, {
                        '$project': {
                            '__v': 0,
                            'createdAt': 0,
                            'updatedAt': 0
                        }
                    }
                ],
                'as': 'userData'
            }
        }

        const addUserDataDoc: PipelineStage.AddFields = {
            '$addFields': {
                'userData': {
                    '$arrayElemAt': [
                        '$userData', 0
                    ]
                }
            }
        }

        const addUserDataFields: PipelineStage.AddFields = {
            '$addFields': {
                'seenByUser': {
                    '$cond': {
                        'if': {
                            '$in': [
                                '$_id', '$userData.seenTitles'
                            ]
                        },
                        'then': true,
                        'else': false
                    }
                },
                'unseenByUser': {
                    '$cond': {
                        'if': {
                            '$in': [
                                '$_id', '$userData.unseenTitles'
                            ]
                        },
                        'then': true,
                        'else': false
                    }
                },
                'starredByUser': {
                    '$cond': {
                        'if': {
                            '$in': [
                                '$_id', '$userData.starredTitles'
                            ]
                        },
                        'then': true,
                        'else': false
                    }
                },
                'favouriteByUser': {
                    '$cond': {
                        'if': {
                            '$in': [
                                '$_id', '$userData.favouriteTitles'
                            ]
                        },
                        'then': true,
                        'else': false
                    }
                }
            }
        }

        const sortDocs: PipelineStage.Sort = {
            '$sort': sort
        }
        const matchQuery: PipelineStage.Match = {
            '$match': query
        }

        const countTotalResults: PipelineStage.Count = {
            '$count': 'total_results'
        }

        const skipDocs: PipelineStage.Skip = {
            '$skip': (page - 1) * limit
        }

        const limitDocs: PipelineStage.Limit = {
            '$limit': limit
        }

        const projectionStage: PipelineStage.Project = {
            $project: projection
        }
        const titlesCount = await this.titleModel.aggregate([matchQuery, lookupUserData, addUserDataDoc, addUserDataFields, countTotalResults]);

        const titlesList = await this.titleModel.aggregate([matchQuery, lookupUserData, addUserDataDoc, addUserDataFields, sortDocs, skipDocs, limitDocs, projectionStage]);

        const titleDTOs: TitleDTO[] = titlesList.map(iTitle => {
            return iTitle as TitleDTO;
        })

        const result: PageDTO = {
            page: page,
            total_pages: Math.ceil((titlesCount[0]?.total_results ?? 0) / limit),
            total_results: titlesCount[0]?.total_results ?? 0,
            sort_order: sort,
            list: titleDTOs,
        }

        return result;
    }
}

export default TitleRepository;
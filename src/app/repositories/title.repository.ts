import TitleDTO, { ititleToTitleDTOMapper } from "@dto/title.dto";
import ITitle from "@models/interfaces/title.interface";
import TitleModel from "@models/title.model";
import mongoose, {
    Model,
    PipelineStage,
    ProjectionFields,
} from "mongoose";
import { Service } from "typedi";
import ITitleRepository from "./interfaces/title.repository.interface";
import { FindAllQuery, Language, Page } from "src/@types";
import MoviebunkersException from "@exceptions/moviebunkers.exception";
import RepositoryException from "@exceptions/repository.exception";
import HttpCodes from "@constants/http.codes.enum";

/**
 * A repository class for managing titles data in the database
 * @class
 * @implements ITitleRepository
 */
@Service()
class TitleRepository implements ITitleRepository {

    // Title Documnet Model
    private titleModel: Model<ITitle>;

    /**
     * create a instance of TitleRepository
     * 
     * @constructor
     */
    constructor() {
        this.titleModel = TitleModel;
    }

    /**
     * Creates a new title in the database.
     * @param {Partial<ITitle>} title - The title object to create.
     * @returns {Promise<ITitle | null>} A promise that resolves with the created title or null if there was an error.
     * @throws {MoviebunkersException} If the error is a known exception.
     * @throws {RepositoryException} If there was an unknown error creating the title.
     */
    async create(title: Partial<ITitle>): Promise<ITitle | null> {
        try {
            // create new title documnet in db
            const newTitle: ITitle = await this.titleModel.create<Partial<ITitle>>(title);

            //  retruns new title documnet if created else returns  null
            return newTitle;
        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `TitleRepository.class: create.method()`
                );
            }
        }
    }


    /**
     * Finds a title document by its ID.
     * 
     * @param {mongoose.Types.ObjectId} id - The ID of the title document to find.
     * @param {ProjectionFields<ITitle>} projection - The projection object specifying which fields to include or exclude in the result. Default is to exclude the '__v' field.
     * @returns {Promise<ITitle | null>} A promise that resolves to the title document found, or null if no document is found with the given ID.
     * @throws {RepositoryException} If an error occurs while querying the database.
     */
    async findById(id: mongoose.Types.ObjectId, projection: ProjectionFields<ITitle> = { __v: 0 }): Promise<ITitle | null> {
        try {

            // Fetch the title document associated with the given ID, and populate the 'title_owner' and 'last_modified_user' fields with user data.
            const title: ITitle | null = await this.titleModel
                .findById(id, projection)
                .populate([
                    {
                        path: "title_owner",
                        model: "user",
                        localField: "added_by",
                        foreignField: "_id",
                        select: "userName email status role createdAt",
                        strictPopulate: false,
                    },
                    {
                        path: "last_modified_user",
                        model: "user",
                        localField: "added_by",
                        foreignField: "_id",
                        select: "userName email status role createdAt",
                        strictPopulate: false,
                    },
                ]).lean().exec();

            // Return the fetched title document.
            return title

        } catch (error: any) {
            // If the error is a known exception, re-throw it.
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it.
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `TitleRepository.class: findById.method()`
                );
            }
        }
    }

    /**
     * Finds a title document by its tmdb_id.
     * @param tmdbId - The tmdb_id of the title document to find.
     * @param projection - Optional projection to limit the fields returned in the title document.
     * @returns The fetched title document or null if not found.
     * @throws A RepositoryException if there's an error fetching the title document.
     */
    async findByTmdbId(tmdbId: number, projection: ProjectionFields<ITitle> = { __v: 0 }): Promise<ITitle | null> {
        try {
            // Fetch title document associated with given tmdb_id
            const titile: ITitle | null = await this.titleModel
                .findOne({ tmdb_id: tmdbId }, projection)
                .populate([
                    {
                        path: "title_owner",
                        model: "user",
                        localField: "added_by",
                        foreignField: "_id",
                        select: "userName email status role createdAt",
                        strictPopulate: false,
                    },
                    {
                        path: "last_modified_user",
                        model: "user",
                        localField: "added_by",
                        foreignField: "_id",
                        select: "userName email status role createdAt",
                        strictPopulate: false,
                    },
                ]).lean().exec();

            // Return fetched title document
            return titile;

        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `TitleRepository.class: findByTmdbId.method()`
                );
            }
        }
    }


    /**
     * Find a title by its IMDB ID
     * @param {string} imdbId - The IMDB ID of the title to find
     * @param {ProjectionFields<ITitle>} projection - Optional projection to apply to the fetched document
     * @returns {Promise<ITitle | null>} - The fetched title document, or null if not found
     * @throws {RepositoryException} - If an unexpected error occurs while fetching the document
     */
    async findByImdbId(imdbId: string, projection: ProjectionFields<ITitle> = { __v: 0 }): Promise<ITitle | null> {
        try {
            // Fetch title document associated with given imdb_id 
            const title: ITitle | null = await this.titleModel
                .findOne({ imdb_id: imdbId }, projection)
                .populate([
                    {
                        path: "title_owner",
                        model: "user",
                        localField: "added_by",
                        foreignField: "_id",
                        select: "userName email status role createdAt",
                        strictPopulate: false,
                    },
                    {
                        path: "last_modified_user",
                        model: "user",
                        localField: "added_by",
                        foreignField: "_id",
                        select: "userName email status role createdAt",
                        strictPopulate: false,
                    },
                ]).lean().exec();

            // Return fetched title document
            return title

        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `TitleRepository.class: findByImdbId.method()`
                );
            }
        }
    }

    /**
     * Finds all title documents that match the given query and returns a page of TitleDTO objects.
     * @param {FindAllQuery<ITitle>} param0 - An object containing the query, sort, limit, and page parameters.
     * @param {ProjectionFields<ITitle>} projection - The projection fields for the query. Defaults to { __v: 0 }.
     * @returns {Promise<Page<TitleDTO>>} A page of TitleDTO objects that match the given query.
     */
    async findAll({ query, sort, limit, page }: FindAllQuery<ITitle>, projection: ProjectionFields<ITitle> = { __v: 0 }): Promise<Page<TitleDTO>> {
        try {
            // get the count of total_documnets that match with given query
            const total_results: any = await this.titleModel
                .find({ ...query })
                .countDocuments()
                .lean()
                .exec();

            //  fetch an array of title documnets thta match given query
            const titlesList: ITitle[] = await this.titleModel
                .find({ ...query }, projection)
                .sort({ ...sort })
                .skip((page - 1) * limit)
                .limit(limit * 1)
                .lean()
                .exec();

            const titleDTOs: TitleDTO[] = titlesList.map((iTitle) => {
                return ititleToTitleDTOMapper(iTitle);
            });

            const result: Page<TitleDTO> = {
                page: page,
                total_pages: Math.ceil(total_results / limit),
                total_results: total_results,
                sort_order: sort,
                list: titleDTOs,
            };

            // return page with list of titles
            return result;

        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `TitleRepository.class: findAll.method()`
                );
            }
        }
    }

    /**
     * Find a title by ID and return it along with additional data related to the current user.
     * @param {mongoose.Types.ObjectId} titleId - The ID of the title to find.
     * @param {mongoose.Types.ObjectId} userId - The ID of the user requesting the data.
     * @param {ProjectionFields<ITitle>} projection - Optional projection fields to include or exclude from the results.
     * @returns {Promise<ITitle | null>} The title document with additional user data or null if no match is found.
     * @throws {RepositoryException} Throws an exception if the repository encounters an error.
     */
    async findByIdWithUserData(titleId: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId, projection: ProjectionFields<ITitle> = { __v: 0, userData: 0 }): Promise<ITitle | null> {
        try {
            // Pipeline stage to match the title ID.
            const matchQuery: PipelineStage.Match = {
                $match: {
                    _id: titleId,
                },
            };

            // Pipeline stage to lookup user data related to the current user.
            // The user data contains information on whether a title has been seen, unseen, starred, or marked as a favorite by the user.
            const lookupUserData: PipelineStage.Lookup = {
                $lookup: {
                    from: "userData", // collection to lookup from
                    let: {
                        externalUserId: userId, // define a variable for the user ID
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$userId", "$$externalUserId"], // match the user ID variable to the userId field in userData collection
                                },
                            },
                        },
                        {
                            $project: {
                                __v: 0, // exclude the version field
                                createdAt: 0, // exclude the createdAt field
                                updatedAt: 0, // exclude the updatedAt field
                            },
                        },
                    ],
                    as: "userData", // set the name of the new field that will contain the user data document
                },
            };


            // Pipeline Stage to add the user data contains information on whether a title has been seen, unseen, starred, or marked as a favorite by the user.
            const addUserDataDoc: PipelineStage.AddFields = {
                $addFields: {
                    userData: {
                        $arrayElemAt: ["$userData", 0], // get the first element of the userData array
                    },
                },
            };

            // Create pipeline stages to add additional fields based on the user's interaction with the title.
            // add fields containing information on whether a title has been seen, unseen, starred, or marked as a favorite by the user.
            const addUserDataFields: PipelineStage.AddFields = {
                $addFields: {
                    // Check if the title has been seen by the user.
                    seenByUser: {
                        $cond: {
                            if: {
                                $in: ["$_id", "$userData.seenTitles"], // Check if the title's ID is in the user's "seenTitles" array.
                            },
                            then: true, // If the title has been seen, set "seenByUser" to true.
                            else: false, // Otherwise, set it to false.
                        },
                    },
                    // Check if the title has not been seen by the user.
                    unseenByUser: {
                        $cond: {
                            if: {
                                $in: ["$_id", "$userData.unseenTitles"], // Check if the title's ID is in the user's "unseenTitles" array.
                            },
                            then: true, // If the title has not been seen, set "unseenByUser" to true.
                            else: false, // Otherwise, set it to false.
                        },
                    },
                    // Check if the title has been starred by the user.
                    starredByUser: {
                        $cond: {
                            if: {
                                $in: ["$_id", "$userData.starredTitles"], // Check if the title's ID is in the user's "starredTitles" array.
                            },
                            then: true, // If the title has been starred, set "starredByUser" to true.
                            else: false, // Otherwise, set it to false.
                        },
                    },
                    // Check if the title has been marked as a favorite by the user.
                    favouriteByUser: {
                        $cond: {
                            if: {
                                $in: ["$_id", "$userData.favouriteTitles"], // Check if the title's ID is in the user's "favouriteTitles" array.
                            },
                            then: true, // If the title has been marked as a favorite, set "favouriteByUser" to true.
                            else: false, // Otherwise, set it to false.
                        },
                    },
                },
            };

            // Create pipeline stage to lookup the user who added the title
            const lookUpAddedByUser: PipelineStage.Lookup = {
                $lookup: {
                    from: "users",                // Collection to perform the lookup on
                    localField: "added_by",       // Field from the current collection to match with
                    foreignField: "_id",          // Field from the foreign collection to match against
                    as: "title_owner",            // Name of the field to store the results in
                },
            };

            // Pipeline stage to lookup the user who last modified the title.
            const lookUpLastModifiedByUser: PipelineStage.Lookup = {
                $lookup: {
                    from: "users",
                    localField: "last_modified_by",
                    foreignField: "_id",
                    as: "last_modified_user",
                },
            };

            // Pipeline stage to add "added_by" and "last_modified_by" fields to the title document.
            const addAddedByAndLastModifiedByFields: PipelineStage.AddFields = {
                $addFields: {
                    // Add the "added_by" user details to the "title_owner" field.
                    title_owner: {
                        $arrayElemAt: ["$title_owner", 0],
                    },

                    // Add the "last_modified_by" user details to the "last_modified_user" field.
                    last_modified_user: {
                        $arrayElemAt: ["$last_modified_user", 0],
                    },
                },
            };

            // Pipeline stage to project only the necessary fields.
            const projectionStage: PipelineStage.Project = {
                $project: {
                    __v: 0, // exclude the __v field
                    userData: 0, // exclude the userData field
                    "title_owner.password": 0, // exclude the password field in title_owner
                    "title_owner.email": 0, // exclude the email field in title_owner
                    "title_owner.last_modified_by": 0, // exclude the last_modified_by field in title_owner
                    "title_owner.updatedAt": 0, // exclude the updatedAt field in title_owner
                    "title_owner.createdAt": 0, // exclude the createdAt field in title_owner
                    "title_owner.__v": 0, // exclude the __v field in title_owner
                    "last_modified_user.password": 0, // exclude the password field in last_modified_user
                    "last_modified_user.email": 0, // exclude the email field in last_modified_user
                    "last_modified_user.last_modified_by": 0, // exclude the last_modified_by field in last_modified_user
                    "last_modified_user.updatedAt": 0, // exclude the updatedAt field in last_modified_user
                    "last_modified_user.createdAt": 0, // exclude the createdAt field in last_modified_user
                    "last_modified_user.__v": 0, // exclude the __v field in last_modified_user
                },
            };

            // fetch title documents with agregation.
            const title = await this.titleModel.aggregate([
                // Pipeline stage to match the ID of the title.
                matchQuery,
                // Pipeline stage to lookup user data related to the current user.
                lookupUserData,
                // Pipeline stage to add the user data document to the main title document.
                addUserDataDoc,
                // Pipeline stages to add additional fields based on the user's interaction with the title.
                addUserDataFields,
                // Pipeline stage to lookup the user who added the title.
                lookUpAddedByUser,
                // Pipeline stage to lookup the user who last modified the title.
                lookUpLastModifiedByUser,
                // Pipeline stage to add additional fields related to the added_by and last_modified_by fields.
                addAddedByAndLastModifiedByFields,
                // Pipeline stage to remove unnecessary fields from the final document.
                projectionStage,
            ]);

            // Return the first document in the title array.
            return title[0];

        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `TitleRepository.class: findByIdWithUserData.method()`
                );
            }
        }
    }

    /**
     * Find all titles with user data and apply pagination, sorting, and projection.
     *
     * @param {FindAllQuery<ITitle>} query - Query criteria for filtering.
     * @param {mongoose.Types.ObjectId} userId - The user ID for which to add user data to the titles.
     * @param {ProjectionFields<ITitle>} projection - Projection criteria for filtering the fields to return.
     * @returns {Promise<Page<TitleDTO>>} A page of title DTOs.
     */
    async findAllWithUserData({ query, sort, limit, page }: FindAllQuery<ITitle>, userId: mongoose.Types.ObjectId, projection: ProjectionFields<ITitle>): Promise<Page<TitleDTO>> {
        try {
            // This pipeline stage is a MongoDB aggregation lookup stage.
            // It performs a left outer join between the "titles" and "userData" collections.
            // The result of this stage is a new array field named "userData" that contains user data for the given user ID.
            // The user data contains information on whether a title has been seen, unseen, starred, or marked as a favorite by the user.
            const lookupUserData: PipelineStage.Lookup = {
                $lookup: {
                    from: "userData", // The name of the collection to join with.
                    let: {
                        externalUserId: userId, // An external variable that holds the user ID.
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$userId", "$$externalUserId"], // A matching condition that compares the user ID in the userData collection with the external user ID.
                                },
                            },
                        },
                        {
                            $project: {
                                __v: 0, // Excludes the "__v" field from the result.
                                createdAt: 0, // Excludes the "createdAt" field from the result.
                                updatedAt: 0, // Excludes the "updatedAt" field from the result.
                            },
                        },
                    ],
                    as: "userData", // The name of the new array field that contains the user data.
                },
            };

            // This pipeline stage adds the user data document from the "userData" collection
            // to the main document being processed by the pipeline.
            const addUserDataDoc: PipelineStage.AddFields = {
                $addFields: {
                    // Add a new field called "userData" to each document
                    userData: {
                        // Get the first (and only) element of the "userData" array
                        // that was created by the previous $lookup stage
                        $arrayElemAt: ["$userData", 0],
                    },
                },
            };


            // Pipeline stage to add additional fields based on the user's interaction with the title.
            // add fields containing information on whether a title has been seen, unseen, starred, or marked as a favorite by the user.
            const addUserDataFields: PipelineStage.AddFields = {
                $addFields: {
                    // Add a new field "seenByUser" to each document
                    seenByUser: {
                        $cond: {
                            // Check if the document's _id exists in the "seenTitles" array of the user's data
                            if: {
                                $in: ["$_id", "$userData.seenTitles"],
                            },
                            // If it does exist, set "seenByUser" to true
                            then: true,
                            // Otherwise, set "seenByUser" to false
                            else: false,
                        },
                    },
                    // Add a new field "unseenByUser" to each document
                    unseenByUser: {
                        $cond: {
                            // Check if the document's _id exists in the "unseenTitles" array of the user's data
                            if: {
                                $in: ["$_id", "$userData.unseenTitles"],
                            },
                            // If it does exist, set "unseenByUser" to true
                            then: true,
                            // Otherwise, set "unseenByUser" to false
                            else: false,
                        },
                    },
                    // Add a new field "starredByUser" to each document
                    starredByUser: {
                        $cond: {
                            // Check if the document's _id exists in the "starredTitles" array of the user's data
                            if: {
                                $in: ["$_id", "$userData.starredTitles"],
                            },
                            // If it does exist, set "starredByUser" to true
                            then: true,
                            // Otherwise, set "starredByUser" to false
                            else: false,
                        },
                    },
                    // Add a new field "favouriteByUser" to each document
                    favouriteByUser: {
                        $cond: {
                            // Check if the document's _id exists in the "favouriteTitles" array of the user's data
                            if: {
                                $in: ["$_id", "$userData.favouriteTitles"],
                            },
                            // If it does exist, set "favouriteByUser" to true
                            then: true,
                            // Otherwise, set "favouriteByUser" to false
                            else: false,
                        },
                    },
                },
            };

            // This stage sorts the documents based on the given sort object
            const sortDocs: PipelineStage.Sort = {
                $sort: sort, // Sort the documents based on the `sort` object
            };

            // This stage filters the documents based on the given query object
            const matchQuery: PipelineStage.Match = {
                $match: query, // Filter the documents based on the `query` object
            };

            // This stage counts the total number of documents that match the given query
            const countTotalResults: PipelineStage.Count = {
                $count: "total_results", // Count the total number of documents after filtering
            };

            // This stage skips the specified number of documents
            const skipDocs: PipelineStage.Skip = {
                $skip: (page - 1) * limit, // Skip the appropriate number of documents based on the current `page` and `limit`
            };

            // This stage limits the number of documents to be returned
            const limitDocs: PipelineStage.Limit = {
                $limit: limit === 0 // Limit the number of documents to the current `limit`, unless it's set to 0 (in which case, return all documents)
                    ? await this.titleModel.find({}).countDocuments().lean().exec() as any // If `limit` is 0, count the total number of documents in the collection and return them all
                    : limit,
            };

            // This stage projects only the specified fields
            const projectionStage: PipelineStage.Project = {
                $project: projection, // Only include the fields specified in the `projection` object
            };


            /**
             * Count the total number of titles matching the given query, including additional fields indicating whether the titles have been seen, unseen, starred, or favorited by the user with the given ID.
             *
             * @typedef {Object} TitleCountResult
             * @property {number} total_results - The total number of titles matching the given query.
             *
             * @returns {Promise<TitleCountResult[]>} The count of titles matching the given query.
             */
            const titlesCount = await this.titleModel.aggregate([
                matchQuery,
                lookupUserData,
                // addUserDataDoc,
                // addUserDataFields,
                countTotalResults,
            ]);


            // Executes a list of pipeline stages to get an array of title documents
            const titlesList = await this.titleModel.aggregate([
                matchQuery,          // Filters the documents by the specified query criteria
                lookupUserData,      // Looks up and joins the user data document based on user ID
                addUserDataDoc,      // Restructures the user data document to match the expected schema
                addUserDataFields,   // Adds fields to the document based on user interactions with the title
                sortDocs,            // Sorts the documents based on the specified sorting criteria
                skipDocs,            // Skips over documents based on the pagination parameters
                limitDocs,           // Limits the number of documents returned based on the pagination parameters
                projectionStage,     // Projects only the specified fields of the documents
            ]);


            // Map title documents to title DTOs using a mapper function
            const titleDTOs: TitleDTO[] = titlesList.map((titleDoc) => {
                return ititleToTitleDTOMapper(titleDoc);
            });


            // Create a new `Page` object of type `TitleDTO`.
            let result: Page<TitleDTO> = {
                // Set the `page` property to the current page number.
                page: page,
                // Calculate the `total_pages` property by dividing the total number of results by the `limit` parameter and rounding up to the nearest integer.
                total_pages: Math.ceil((titlesCount[0]?.total_results ?? 0) / (limit === 0 ? 1 : limit)),
                // Set the `total_results` property to the total number of results found.
                total_results: titlesCount[0]?.total_results ?? 0,
                // Set the `sort_order` property to the sort order used to display the titles.
                sort_order: sort,
                // Set the `list` property to an array of `TitleDTO` objects.
                list: titleDTOs,
            };

            // If the `limit` parameter is falsy, set the `total_pages` property to `1` to avoid a divide-by-zero error.
            if (!limit) {
                result = { ...result, total_pages: 1 }
            }

            // Return the `result` object, which contains the calculated `page`, `total_pages`, `total_results`, `sort_order`, and `list` properties.
            return result;

        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `TitleRepository.class: findAllWithUserData.method()`
                );
            }
        }
    }


    /**
    * Retrieves all available genres from the database.
    * @returns {Promise<string[]>} An array of unique genre strings.
    * @throws {RepositoryException} If there is an error while executing the MongoDB aggregation pipeline.
    */
    async fetchAllAvailableGenres(): Promise<string[]> {
        try {

            // Match documents that have a non-empty `genres` array
            const matchStage: PipelineStage.Match = {
                $match: {
                    genres: {
                        // Ensure that `genres` field exists
                        $exists: true,
                        // Ensure that `genres` field is not null or empty array
                        $ne: { $in: [null, []] },
                    },
                },
            };

            // Project the `genres` field to the pipeline
            const projectStage1: PipelineStage.Project = {
                $project: {
                    genres: 1,
                },
            };

            // Unwind the `genres` array into individual documents
            const unwindStage1: PipelineStage.Unwind = {
                $unwind: {
                    path: "$genres", // the field to unwind
                    includeArrayIndex: "string", // the name of the index variable to use
                    preserveNullAndEmptyArrays: false, // whether to remove documents with empty arrays after unwinding
                },
            };

            // Group documents by `genres`
            const groupStage1: PipelineStage.Group = {
                $group: {
                    _id: "$genres", // the field to group by
                },
            };


            // Group the results into a single document with an array of genres
            const groupStage2: PipelineStage.Group = {
                $group: {
                    _id: null, // group all results into a single document
                    genres: { // create a new field called "genres"
                        $push: "$_id", // add each distinct "_id" (genre) to the "genres" array
                    },
                },
            };


            // Unwind the genres array again
            const unwindStage2: PipelineStage.Unwind = {
                $unwind: {
                    path: "$genres", // specify the array field to unwind
                    includeArrayIndex: "string", // specify a name for the index field
                    preserveNullAndEmptyArrays: false, // exclude documents with empty arrays or null values
                },
            };


            // Sort the genres in ascending order
            const sortStage: PipelineStage.Sort = {
                $sort: {
                    genres: 1, // Sort by the `genres` field in ascending order
                },
            };

            // Group the genres into a single document and project the result
            const groupStage3: PipelineStage.Group = {
                $group: {
                    _id: null, // Group by a null _id to get a single result
                    genres: { // Push all the genres into an array
                        $push: "$genres",
                    },
                },
            };


            // Project the genres array and exclude the `_id` field
            const projectStage2: PipelineStage.Project = {
                $project: {
                    _id: 0,         // Exclude the `_id` field from the output
                    genres: 1,      // Project the `genres` field to the output
                },
            };

            // Execute a MongoDB aggregation pipeline on the `titleModel` collection
            const data = await this.titleModel
                .aggregate([
                    // Match documents that have a non-empty `genres` array
                    matchStage,
                    // Project the `genres` field to the pipeline
                    projectStage1,
                    // Unwind the `genres` array into individual documents
                    unwindStage1,
                    // Group documents by `genres`
                    groupStage1,
                    // Group the results into a single document with an array of genres
                    groupStage2,
                    // Unwind the genres array again
                    unwindStage2,
                    // Sort the genres in ascending order
                    sortStage,
                    // Group the genres into a single document
                    groupStage3,
                    // Project the genres array and exclude the `_id` field
                    projectStage2,
                ])
                .exec();

            // Return the genres array from the first document in the result, or an empty array if there is no result
            return data[0]?.genres ?? [];

        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `TitleRepository.class: fetchAllAvailableGenres.method()`
                );
            }
        }
    }


    /**
     * Fetch all available languages
     * @returns {Promise<Language[]>} An array of available languages
     * @throws {RepositoryException} if there's an error while fetching data from the database
     */
    async fetchAllAvailableLanguages(): Promise<Language[]> {
        try {
            // Stage 1: Match documents where the `languages` field exists and is not null or empty
            const matchStage: PipelineStage.Match = {
                $match: {
                    languages: {
                        $exists: true,
                        $ne: { $in: [null, []] },
                    },
                },
            };

            // Stage 2: Project only the `languages` field
            const projectStage1: PipelineStage.Project = {
                $project: {
                    languages: 1,
                },
            };

            // Stage 3: Unwind the `languages` field, creating a new document for each element in the array
            const unwindStage: PipelineStage.Unwind = {
                $unwind: {
                    path: "$languages",
                    includeArrayIndex: "string",
                    preserveNullAndEmptyArrays: false,
                },
            };

            // Stage 4: Sort documents by the `english_name` field of the `languages` array in ascending order
            const sortStage: PipelineStage.Sort = {
                $sort: {
                    "languages.english_name": 1,
                },
            };

            // Stage 5: Group documents together, adding the `languages` array to a set
            const groupStage: PipelineStage.Group = {
                $group: {
                    _id: null,
                    languages: {
                        $addToSet: "$languages",
                    },
                },
            };

            // Stage 6: Project only the `languages` field, excluding the `_id` field
            const projectStage2: PipelineStage.Project = {
                $project: {
                    _id: 0,
                    languages: 1,
                },
            };

            // Execute the aggregation pipeline on the `titleModel` collection
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

            // Return the `languages` array from the first document in the result set, or an empty array if the result set is empty
            return data[0]?.languages ?? [];

        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `TitleRepository.class: findAllWithUserData.method()`
                );
            }
        }
    }


    /**
     * Deletes a title document from the database by its ID.
     * @param {mongoose.Types.ObjectId} titleId - The ID of the title document to delete.
     * @returns {Promise<void>} A Promise that resolves when the title document has been deleted.
     * @throws {MoviebunkersException} If the error is a known exception.
     * @throws {RepositoryException} If the error is not a known exception, it is wrapped in a repository exception and re-thrown.
     */
    async deleteTitleById(titleId: mongoose.Types.ObjectId): Promise<void> {
        try {
            // Delete title documnet associated with given _id
            await this.titleModel.deleteOne({ _id: titleId }).lean().exec();

        } catch (error: any) {
            // If the error is a known exception, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `TitleRepository.class: deleteTitleById.method()`
                );
            }
        }
    }


    /**
     * Updates a title document in the database based on its ID.
     *
     * @param {mongoose.Types.ObjectId} titleId The ID of the title document to update.
     * @param {Partial<ITitle>} update An object containing the fields to update and their new values.
     * @returns {Promise<ITitle | null>} The updated title document, or null if no document was found with the given ID.
     * @throws {RepositoryException} If an unexpected error occurs while accessing the database.
     */
    async updateTitleById(titleId: mongoose.Types.ObjectId, update: Partial<ITitle>): Promise<ITitle | null> {
        try {
            // Update the title document associated with the given ID.
            const title: ITitle | null = await this.titleModel.findByIdAndUpdate(titleId,
                {
                    $set: update
                },
                {
                    returnDocument: "after",
                    new: true,
                    runValidators: true,
                }
            ).lean().exec();

            // Return the updated title document.
            return title;
        } catch (error: any) {
            // If the error is a known exception, re-throw it.
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, wrap the error in a repository exception and re-throw it.
                throw new RepositoryException(
                    `${error?.message}`,
                    HttpCodes.CONFLICT,
                    `${error?.stack}`,
                    `TitleRepository.class: updateTitleById.method()`
                );
            }
        }
    }

}

export default TitleRepository;

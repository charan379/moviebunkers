import HttpCodes from "@constants/http.codes.enum";
import TitleType from "@constants/titile.types.enum";
import TitleSource from "@constants/title.souces.enum";
import TitleDTO, { FindAllTitlesQueryDTO, ititleToTitleDTOMapper } from "@dto/title.dto";
import { UserDTO } from "@dto/user.dto";
import UserDataDTO from "@dto/userdata.dto";
import TitleException from "@exceptions/title.exeception";
import ITitle from "@models/interfaces/title.interface";
import TitleRepository from "@repositories/title.repository";
import getCertificationsByAgeRange from "@utils/getCertificationsByAgeRange";
import MongoSortBuilder from "@utils/mongo.sort.builder";
import mongoose, { FilterQuery, ProjectionFields, Types } from "mongoose";
import { Inject, Service } from "typedi";
import ITitleService from "./interfaces/title.service.interface";
import MoviebunkersException from "@exceptions/moviebunkers.exception";
import { FindAllQuery, Language, Page } from "src/@types";


/**
 * The `TitleService` class is responsible for handling the business logic for
 * creating, retrieving, updating, and deleting title.
 * @class
 * @implements ITitleService
 */
@Service()
class TitleService implements ITitleService {

    // Instance of TitleRepository class
    private titleRepository: TitleRepository;

    /**
       * Constructor to initialize the UserService instance.
       * @constructor
       * @param titleRepository An instance of TitleRepository to be injected into the service.
       */
    constructor(
        @Inject()
        titleRepository: TitleRepository) {
        this.titleRepository = titleRepository;
    }

    /**
     * Create a new title.
     * 
     * @param {Partial<ITitle>} ititle - Partial data for the new title.
     * @param {UserDTO} userDTO - Data for the user creating the new title.
     * @returns {Promise<TitleDTO>} - The newly created title data.
     * @throws {TitleException} - If there's an error creating the new title.
     */
    async createTitle(ititle: Partial<ITitle>, userDTO: UserDTO): Promise<TitleDTO> {
        try {
            /**
             * Checks the source type and corresponding ID to validate that the provided data is complete.
             * @param {TitleDTO} ititle - The TitleDTO object to be validated.
             * @throws {TitleException} If the source type is not recognized or if the ID is missing for a recognized source type.
             */
            switch (ititle.source) {
                case TitleSource.IMDB:
                    if (!ititle.imdb_id) {
                        throw new TitleException("IMDB ID is mandatory for SourceType: IMDB", HttpCodes.BAD_REQUEST, "SourceType is IMDB but IMDB ID is not provided", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(ititle)}`);
                    }
                    break;
                case TitleSource.TMDB:
                    if (!ititle.tmdb_id) {
                        throw new TitleException("TMDB ID is mandatory for SourceType: TMDB", HttpCodes.BAD_REQUEST, "SourceType is TMDB but TMDB ID is not provided", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(ititle)}`);
                    }
                    break;
                case TitleSource.CUSTOM:
                    break;
                default:
                    throw new TitleException("SourceType: Is Unknown", HttpCodes.BAD_REQUEST, "Unknown SourceType received", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(ititle)}`);
            }

            if (ititle.imdb_id) {
                // Check if a title with the provided IMDB ID already exists in the database
                if (await this.titleRepository.findByImdbId(ititle.imdb_id)) {
                    throw new TitleException(`Title with IMDB ID: ${ititle.imdb_id} already exists`, HttpCodes.BAD_REQUEST, "Duplicate Title according to IMDB ID", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(ititle)}`);
                }
            }

            if (ititle.tmdb_id) {
                // Check if a title with the provided TMDB ID already exists in the database
                if (await this.titleRepository.findByTmdbId(ititle.tmdb_id)) {
                    throw new TitleException(`Title with TMDB ID: ${ititle.tmdb_id} already exists`, HttpCodes.BAD_REQUEST, "Duplicate Title according to TMDB ID", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(ititle)}`);
                }
            }

            switch (ititle.title_type) { // switch statement based on the type of title
                case TitleType.MOVIE: // if it's a movie title
                    // create a new movie title in the database and assign the user's ID as the "added_by" field
                    const newMovie: ITitle | null = await this.titleRepository.create({
                        ...ititle, // spread operator to include all fields from input DTO
                        added_by: new Types.ObjectId(userDTO?._id) // assign user ID
                    });

                    if (!newMovie) { // if new movie title creation fails
                        throw new TitleException(
                            "Failed to create new title",
                            HttpCodes.CONFLICT,
                            "recieved null from repository",
                            `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(ititle)}`);
                    } else { // if new movie title creation is successful

                        return ititleToTitleDTOMapper(newMovie); // return the new movie title object in DTO format
                    }
                case TitleType.TV: // if it's a TV title
                    // create a new TV title in the database and assign the user's ID as the "added_by" field
                    const newTv: ITitle | null = await this.titleRepository.create({
                        ...ititle, // spread operator to include all fields from input DTO
                        added_by: new Types.ObjectId(userDTO?._id) // assign user ID
                    });

                    if (!newTv) { // if new TV title creation fails
                        throw new TitleException(
                            "Failed to create new title",
                            HttpCodes.CONFLICT,
                            "recieved null from repository",
                            `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(ititle)}`);
                    } else { // if new TV title creation is successful

                        return ititleToTitleDTOMapper(newTv); // return the new TV title object in DTO format
                    }
                default: // if the title type is unknown
                    throw new TitleException(
                        "TitleType: Is Unknown",
                        HttpCodes.BAD_REQUEST,
                        "Unknown TitleType received",
                        `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(ititle)}`);
            }

        } catch (error: any) {
            // If the error is already an instance of MoviebunkersException, simply rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else { // Otherwise, wrap the error in a TitleException and rethrow it
                throw new TitleException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error)}`,
                    `@TitleService.class: @createTitle.method()`
                );
            }
        }
    }

    /**
     * Retrieves a title by ID and returns it as a TitleDTO object.
     *
     * @async
     * @param {string} id - The ID of the title to retrieve.
     * @returns {Promise<TitleDTO>} A Promise that resolves to a TitleDTO object representing the retrieved title.
     * @throws {TitleException} If a title with the given ID is not found or an error occurs while retrieving the title.
     */
    async getTitleById(id: string): Promise<TitleDTO> {
        try {
            const title = await this.titleRepository.findById(new Types.ObjectId(id));

            // If the title is not found, throw a TitleException
            if (!title) throw new TitleException(
                "Title Not Found !",
                HttpCodes.BAD_REQUEST,
                `Title not found for given Id: ${id}`,
                `@TitleService.class: @getTitleById.method() requested title Id: ${id}`);

            // Map the retrieved title to a TitleDTO object and return it
            const titleDTO: TitleDTO = ititleToTitleDTOMapper(title);
            return titleDTO;
        } catch (error: any) {
            // If the error is a MoviebunkersException, rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, throw a new TitleException with details about the error
                throw new TitleException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error)}`,
                    `@TitleService.class: @getTitleById.method()`);
            }
        }
    }


    /**
     * Finds all titles based on the given query parameters
     * @param queryDTO - The DTO containing the query parameters
     * @returns A Promise that resolves to a Page of TitleDTOs
     * @throws TitleException if there was an error while retrieving the titles
     */
    async getAllTitles(queryDTO: FindAllTitlesQueryDTO): Promise<Page<TitleDTO>> {
        try {
            // Construct an array of title types based on the 'movie' and 'tv' query parameters
            const title_types = [{ type: "movie", include: queryDTO?.movie ?? 0 }, { type: "tv", include: queryDTO?.tv ?? 0 }];

            // Get the age ratings filter based on the 'age.gte', 'age.lte', and 'country' query parameters
            const age_filter = await getCertificationsByAgeRange(queryDTO?.["age.gte"] ?? 0, queryDTO?.["age.lte"] ?? 26, queryDTO?.country ?? 'IN')

            // Construct the MongoDB query based on the query parameters
            const query: FilterQuery<ITitle> = {
                $and: [
                    {
                        // Search by title name (case-insensitive)
                        title: { $regex: new RegExp(`${queryDTO.search ?? ""}`, "i") },
                        // Filter by title type
                        title_type: { $in: title_types.map(title_type => { if (title_type.include === 1) return title_type.type }).filter(Boolean) },
                        // Filter by original language code (case-insensitive)
                        "original_language.ISO_639_1_code": { $regex: new RegExp(`^${queryDTO.language ?? ""}`, "i") },
                        // Filter by genre (case-insensitive)
                        genres: { $regex: new RegExp(`${queryDTO.genre ?? ""}`, "i") },
                        // Filter by age ratings country and rating
                        'age_rattings.country': { $in: ((queryDTO?.["age.lte"] ?? 26) >= 26) ? [/.*?/i] : [queryDTO.country, 'default'] },
                        'age_rattings.ratting': { $in: ((queryDTO?.["age.lte"] ?? 26) >= 26) ? [/.*?/i] : age_filter },
                    }
                ]
            }

            // Define the fields to project in the MongoDB query (either minimal or normal)
            const minimalProjection: ProjectionFields<ITitle> = {
                _id: 1,
                title_type: 1,
                title: 1,
                ratting: 1,
                year: 1,
                poster_path: 1,
                genres: 1,
            }
            const normalProjection: ProjectionFields<ITitle> = {
                __v: 0,
            }

            // Construct the FindAllQuery object
            const sort = MongoSortBuilder(queryDTO?.sort_by as string);
            const q: FindAllQuery<ITitle> = {
                query,
                sort: sort,
                limit: queryDTO?.limit ?? 5,
                page: queryDTO?.pageNo ?? 1,
            }

            // Retrieve the titles from the repository and return a Page of TitleDTOs
            const page: Page<TitleDTO> = await this.titleRepository.findAll(q, queryDTO.minimal ? minimalProjection : normalProjection);
            return page;

        } catch (error: any) {
            // If the error is a MoviebunkersException, rethrow it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // Otherwise, throw a new TitleException with details about the error
                throw new TitleException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error)}`,
                    `@TitleService.class: @getAllTitles.method()`);
            }
        }
    }

    /**
     * Service method to get a title by its ID with user data
     * @param {string} titleId - The ID of the title to get
     * @param {string} userId - The ID of the user
     * @returns {Promise<TitleDTO>} - A Promise that resolves to a TitleDTO object
     */
    async getTitleByIdWithUserData(titleId: string, userId: string): Promise<TitleDTO> {

        try {
            // Get the title from the repository with user data
            const title = await this.titleRepository.findByIdWithUserData(new mongoose.Types.ObjectId(titleId), new mongoose.Types.ObjectId(userId));

            // If the title is not found, throw an exception
            if (!title) throw new TitleException(
                "Title Not Found !",
                HttpCodes.BAD_REQUEST,
                `Title not found for given Id: ${titleId}`,
                `@TitleService.class: @getTitleByIdWithUserData.method() requested title Id: ${titleId}`);

            // Convert the title to a TitleDTO object
            const titleDTO: TitleDTO = ititleToTitleDTOMapper(title);

            // Return the TitleDTO object
            return titleDTO;
        } catch (error: any) {
            // If the error is a MoviebunkersException, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // If the error is not a MoviebunkersException, create a new TitleException and throw it
                throw new TitleException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error)}`,
                    `@TitleService.class: @getTitleByIdWithUserData.method()`);
            }
        }
    }

    /**
     * Returns a page of TitleDTO containing all titles with user data based on the given query parameters.
     *
     * @param {FindAllTitlesQueryDTO} queryDTO - The query parameters used to filter and sort the titles.
     * @param {string} userId - The ID of the user who is viewing the titles.
     * @param {UserDataDTO} userData - The user data, including the titles the user has seen, starred, and favorited.
     * @returns {Promise<Page<TitleDTO>>} A page of TitleDTO objects containing all titles with user data based on the given query parameters.
     * @throws {TitleException} If an error occurs while retrieving the titles.
     */
    async getAllTitlesWithUserData(queryDTO: FindAllTitlesQueryDTO, userId: string, userData: UserDataDTO): Promise<Page<TitleDTO>> {
        try {

            // An array of title types to be queried for.
            const title_types = [
                { type: "movie", include: queryDTO?.movie ?? 0 },
                { type: "tv", include: queryDTO?.tv ?? 0 }];

            // Get age certifications for the provided age range and country.
            const age_filter = await getCertificationsByAgeRange(queryDTO?.["age.gte"] ?? 0, queryDTO?.["age.lte"] ?? 26, queryDTO?.country ?? 'IN')


            // An array to hold IDs based on the seen, unseen, starred and favourite filters.
            let arraysOfIds = [];

            // If seen filter is set to 1, add the user's seen titles to the array of IDs.
            if (queryDTO.seen === 1) {
                arraysOfIds.push(userData.seenTitles);
                // If seen filter is set to -1, add the user's unseen titles to the array of IDs.
            } else if (queryDTO.seen === -1) {
                arraysOfIds.push(userData.unseenTitles);
            }

            // If starred filter is set to 1, add the user's starred titles to the array of IDs.
            if (queryDTO.starred === 1) {
                arraysOfIds.push(userData.starredTitles)
            }

            // If favourite filter is set to 1, add the user's favourite titles to the array of IDs.
            if (queryDTO.favourite === 1) {
                arraysOfIds.push(userData.favouriteTitles);
            }

            // Combine all the IDs in the arraysOfIds array into a single array.
            const idsToFilter = arraysOfIds.length ? arraysOfIds.reduce((accumulator, currentArray) =>
                accumulator.filter(value => currentArray.includes(value))
            ) : [];

            // A filter object to filter by the IDs obtained from the previous step.
            let idFilter = {};

            // If there are any IDs to filter by, add them to the ID filter object.
            if (arraysOfIds.length > 0) {
                idFilter = { ...idFilter, _id: { $in: idsToFilter.map(id => new mongoose.Types.ObjectId(id)) } }
            }

            // A filter object to filter by title.
            let titleFilter = {};

            // If there is a search query, add it to the title filter object.
            if (queryDTO.search) {
                titleFilter = { ...titleFilter, title: { $regex: new RegExp(`${queryDTO.search}`, "i") } }
            }

            // A filter object to filter by language.
            let languageFilter = {};

            // If there is a language query, add it to the language filter object
            if (queryDTO.language) {
                languageFilter = { ...languageFilter, "languages.ISO_639_1_code": { $regex: new RegExp(`^${queryDTO.language}`, "i") }, }
            }

            // Declare an empty object to store genre filters
            let genresFilter = {};

            // Check if queryDTO has a genre property
            if (queryDTO.genre) {
                // Add a regex filter to genresFilter object
                genresFilter = {
                    ...genresFilter,
                    genres: { $regex: new RegExp(`${queryDTO.genre}`, "i") },
                }
            }

            // Declare an empty object to store age filters
            let ageFilter = {}

            // Check if queryDTO has age.lte or age.gte properties and assign filters accordingly
            if ((queryDTO["age.lte"] !== 26) || (queryDTO["age.gte"] !== 0)) {
                ageFilter = {
                    ...ageFilter,
                    'age_rattings.country': { $in: (queryDTO["age.lte"] > 21) ? [queryDTO.country, 'default'] : [queryDTO.country] },
                    'age_rattings.ratting': { $in: age_filter },
                }
            }

            // Create a query object to pass to the database
            const query: FilterQuery<ITitle> = {
                // Use $and operator to combine filters
                $and: [
                    // Spread in any other filters as needed
                    {
                        ...idFilter,
                        title_type: { $in: title_types.map(title_type => { if (title_type.include === 1) return title_type.type }).filter(Boolean) },
                        ...languageFilter,
                        ...genresFilter,
                        ...titleFilter,
                        ...ageFilter,
                    }
                ]
            }

            // Define which fields to return in the database query
            const minimalProjection: ProjectionFields<ITitle> = {
                _id: 1,
                title_type: 1,
                tmdb_id: 1,
                imdb_id: 1,
                title: 1,
                ratting: 1,
                year: 1,
                poster_path: 1,
                genres: 1,
                seenByUser: 1,
                unseenByUser: 1,
                starredByUser: 1,
                favouriteByUser: 1,
            }

            const normalProjection: ProjectionFields<ITitle> = {
                __v: 0,
                userData: 0
            }

            // Build the sorting criteria for the query
            const sort = MongoSortBuilder(queryDTO?.sort_by as string);

            // Define the database query options
            const q: FindAllQuery<ITitle> = {
                query,
                sort: sort,
                limit: queryDTO?.limit ?? 0,
                page: queryDTO?.pageNo ?? 1,
            }

            // Run the query with the given options and projection fields
            const page: Page<TitleDTO> = await this.titleRepository.findAllWithUserData(q, new mongoose.Types.ObjectId(userId), queryDTO.minimal ? minimalProjection : normalProjection);

            // Return the results
            return page;

        } catch (error: any) {
            // If the error is a MoviebunkersException, re-throw it
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // If the error is not a MoviebunkersException, create a new TitleException and throw it
                throw new TitleException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error)}`,
                    `@TitleService.class: @getAllTitlesWithUserData.method()`);
            }
        }
    }

    /**
     * Fetches all available languages from the titleRepository.
     * @returns {Promise<Language[]>} A promise that resolves to an array of Language objects.
     * @throws {TitleException} If an error occurs while fetching the languages.
     */
    async getAllAvailableLanguages(): Promise<Language[]> {

        try {
            // Fetch all available languages from the titleRepository.
            return await this.titleRepository.fetchAllAvailableLanguages();
        } catch (error: any) {
            if (error instanceof MoviebunkersException) {
                // If the error is already a MoviebunkersException, re-throw it.
                throw error;
            } else {
                // Otherwise, throw a new TitleException with the details of the error.
                throw new TitleException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error)}`,
                    `@TitleService.class: @getAllAvailableLanguages.method()`);
            }
        }
    }


    /**
     * Retrieves all available genres from the title repository.
     * @returns A promise that resolves to an array of strings representing the available genres.
     * @throws Throws a TitleException if an error occurs during the retrieval process.
     */
    async getAllAvailableGenres(): Promise<string[]> {
        try {
            // Call the fetchAllAvailableGenres method of the title repository to retrieve all available genres.
            return await this.titleRepository.fetchAllAvailableGenres();
        } catch (error: any) {
            // If an error occurs during the retrieval process, check if it's an instance of MoviebunkersException.
            if (error instanceof MoviebunkersException) {
                // If it is, re-throw the error.
                throw error;
            } else {
                // Otherwise, create a new TitleException with the error message, HTTP status code, error details, and method details.
                throw new TitleException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error)}`,
                    `@TitleService.class: @getAllAvailableGenres.method()`);
            }
        }
    }


    /**
     * Delete a title by its ID.
     * @param {string} titleId - The ID of the title to delete.
     * @throws {TitleException} Throws a TitleException if there is an error while deleting the title.
     */
    async deleteTitleById(titleId: string): Promise<void> {
        try {
            // Get the title to delete by its ID.
            await this.getTitleById(titleId);

            // Delete the title from the repository by its ID.
            await this.titleRepository.deleteTitleById(new mongoose.Types.ObjectId(titleId));

        } catch (error: any) {
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                // If there is an error while deleting the title, throw a TitleException.
                throw new TitleException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error)}`,
                    `@TitleService.class: @deleteTitleById.method() titleId: ${titleId}`);
            }
        }
    }


    /**
     * Updates the title with the given ID with the specified changes
     * @param {string} titleId - The ID of the title to update
     * @param {Partial<ITitle>} title - The updates to apply to the title
     * @returns {Promise<TitleDTO>} - A DTO representing the updated title
     * @throws {TitleException} - If there was an error updating the title
     */
    async updateTitleById(titleId: string, title: Partial<ITitle>): Promise<TitleDTO> {

        try {
            // Ensure the title exists before attempting to update it
            await this.getTitleById(titleId);

            // Update the title with the given changes
            const updatedTitle: ITitle | null = await this.titleRepository.updateTitleById(new Types.ObjectId(titleId), title);

            if (!updatedTitle) {
                // If the repository returns null, throw an exception
                throw new TitleException(
                    "Failed to update title",
                    HttpCodes.CONFLICT,
                    "Received null from update repository",
                    `@TitleService.class: @updateTitleById.method() update: ${JSON.stringify(title)}`);
            } else {
                // Map the updated title to a DTO and return it
                return ititleToTitleDTOMapper(updatedTitle)
            }
        } catch (error: any) {
            // If an exception was thrown, handle it appropriately
            if (error instanceof MoviebunkersException) {
                throw error;
            } else {
                throw new TitleException(
                    `${error?.message}`,
                    HttpCodes.INTERNAL_SERVER_ERROR,
                    `${JSON.stringify(error)}`,
                    `@TitleService.class: @updateTitleById.method() update: ${JSON.stringify(title)}`);
            }
        }
    }

}




export default TitleService;
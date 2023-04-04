import HttpCodes from "@constants/http.codes.enum";
import TitleType from "@constants/titile.types.enum";
import TitleSource from "@constants/title.souces.enum";
import LanguageDTO from "@dto/language.dto";
import MovieDTO from "@dto/movie.dto";
import PageDTO from "@dto/page.dto";
import TitleDTO, { FindAllTitlesQueryDTO } from "@dto/title.dto";
import TvDTO from "@dto/Tv.dto";
import { UserDTO } from "@dto/user.dto";
import UserDataDTO from "@dto/userdata.dto";
import TitleException from "@exceptions/title.exeception";
import ITitle from "@models/interfaces/title.interface";
import { FindAllQuery } from "@repositories/interfaces/custom.types.interfaces";
import TitleRepository from "@repositories/title.repository";
import getCertificationsByAgeRange from "@utils/getCertificationsByAgeRange";
import MongoSortBuilder from "@utils/mongo.sort.builder";
import { FilterQuery, ObjectId, ProjectionFields } from "mongoose";
import { Inject, Service } from "typedi";
import ITitleService from "./interfaces/title.service.interface";
import MovieService from "./movie.service";
import TvService from "./tv.service";

@Service()
class TitleService implements ITitleService {

    private movieService: MovieService;
    private tvService: TvService;

    private titleRepository: TitleRepository;

    constructor(
        @Inject()
        movieService: MovieService,
        tvService: TvService,
        titleRepository: TitleRepository) {
        this.movieService = movieService;
        this.tvService = tvService;
        this.titleRepository = titleRepository;
    }

    /**
     * createTitle
     * @param titleDTO 
     */
    async createTitle(titleDTO: Partial<TitleDTO>, userDTO: UserDTO): Promise<TitleDTO> {


        switch (titleDTO.source) {
            case TitleSource.IMDB:
                if (!titleDTO.imdb_id) throw new TitleException("IMDB ID is mandatory for SourceType: IMDB", HttpCodes.BAD_REQUEST, "SourceType is IMDB but IMDB ID is not provided", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titleDTO)}`);
                break;
            case TitleSource.TMDB:
                if (!titleDTO.tmdb_id) throw new TitleException("TMDB ID is mandatory for SourceType: TMDB", HttpCodes.BAD_REQUEST, "SourceType is TMDB but TMDB ID is not provided", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titleDTO)}`);
                break;
            case TitleSource.CUSTOM:
                break;
            default:
                throw new TitleException("SourceType: Is Unknown", HttpCodes.BAD_REQUEST, "Unknown SourceType received", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titleDTO)}`);
        }


        if (titleDTO.imdb_id) {
            if (await this.titleRepository.findByImdbId(titleDTO.imdb_id)) throw new TitleException(`Title with IMDB ID: ${titleDTO.imdb_id} already exists`, HttpCodes.BAD_REQUEST, "Duplicate Title according to IMDB ID", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titleDTO)}`);
        }

        if (titleDTO.tmdb_id) {
            if (await this.titleRepository.findByTmdbId(titleDTO.tmdb_id)) throw new TitleException(`Title with TMDB ID: ${titleDTO.tmdb_id} already exists`, HttpCodes.BAD_REQUEST, "Duplicate Title according to TMDB ID", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titleDTO)}`);
        }

        switch (titleDTO.title_type) {
            case TitleType.MOVIE:
                const movieDTO: NonNullable<Partial<MovieDTO>> = titleDTO as Partial<MovieDTO>;
                return await this.movieService.createMovie(movieDTO, userDTO) as TitleDTO;
            case TitleType.TV:
                const tvDTO: NonNullable<Partial<TvDTO>> = titleDTO as Partial<TvDTO>;
                return await this.tvService.createTv(tvDTO, userDTO) as TitleDTO;
            default:
                throw new TitleException("TitleType: Is Unknown", HttpCodes.BAD_REQUEST, "Unknown TitleType received", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titleDTO)}`);
        }
    }

    /**
     * getTitleById()
     * @param id 
     */
    async getTitleById(id: string): Promise<TitleDTO> {
        const title = await this.titleRepository.findById(id);

        if (!title) throw new TitleException("Title Not Found !", HttpCodes.NOT_FOUND, `Title not found for given Id: ${id}`, `@TitleService.class: @getTitleById.method() requested title Id: ${id}`);

        const titleDTO: TitleDTO = title as TitleDTO;

        return titleDTO;
    }


    /**
     * @deprecated use findAllWithUserData()
     * @param queryDTO 
     * @returns Promise<PageDTO>
     */
    async getAllTitles(queryDTO: FindAllTitlesQueryDTO): Promise<PageDTO> {

        const title_types = [{ type: "movie", include: queryDTO?.movie ?? 0 }, { type: "tv", include: queryDTO?.tv ?? 0 }];

        const age_filter = await getCertificationsByAgeRange(queryDTO?.["age.gte"] ?? 0, queryDTO?.["age.lte"] ?? 26, queryDTO?.country ?? 'IN')

        const query: FilterQuery<ITitle> = {
            $and: [
                {
                    title: { $regex: new RegExp(`${queryDTO.search ?? ""}`, "i") },
                    title_type: { $in: title_types.map(title_type => { if (title_type.include === 1) return title_type.type }).filter(Boolean) },
                    "original_language.ISO_639_1_code": { $regex: new RegExp(`^${queryDTO.language ?? ""}`, "i") },
                    genres: { $regex: new RegExp(`${queryDTO.genre ?? ""}`, "i") },
                    'age_rattings.country': { $in: ((queryDTO?.["age.lte"] ?? 26) >= 26) ? [/.*?/i] : [queryDTO.country, 'default'] },
                    'age_rattings.ratting': { $in: ((queryDTO?.["age.lte"] ?? 26) >= 26) ? [/.*?/i] : age_filter },
                }
            ]
        }
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

        const sort = MongoSortBuilder(queryDTO?.sort_by as string);

        const q: FindAllQuery = {
            query,
            sort: sort,
            limit: queryDTO?.limit ?? 5,
            page: queryDTO?.pageNo ?? 1,
        }

        const page: PageDTO = await this.titleRepository.findAll(q, queryDTO.minimal ? minimalProjection : normalProjection);

        return page;
    }

    /**
     * getTitleByIdWithUserData()
     * @param titleId 
     * @param userId 
     */
    async getTitleByIdWithUserData(titleId: string, userId: ObjectId): Promise<TitleDTO> {

        const title = await this.titleRepository.findByIdWithUserData(titleId, userId);

        if (!title) throw new TitleException("Title Not Found !", HttpCodes.NOT_FOUND, `Title not found for given Id: ${titleId}`, `@TitleService.class: @getTitleByIdWithUserData.method() requested title Id: ${titleId}`);

        const titleDTO: TitleDTO = title as TitleDTO;


        return titleDTO;
    }

    /**
      * getAllTitlesWithUserData()
      * @param queryDTO 
      * @param userId
      * @returns Promise<PageDTO>
      */
    async getAllTitlesWithUserData(queryDTO: FindAllTitlesQueryDTO, userId: ObjectId, userData: UserDataDTO): Promise<PageDTO> {

        const title_types = [{ type: "movie", include: queryDTO?.movie ?? 0 }, { type: "tv", include: queryDTO?.tv ?? 0 }];

        const age_filter = await getCertificationsByAgeRange(queryDTO?.["age.gte"] ?? 0, queryDTO?.["age.lte"] ?? 26, queryDTO?.country ?? 'IN')


        let arraysOfIds = [];

        if (queryDTO.seen === 1) {
            arraysOfIds.push(userData.seenTitles);
        } else if (queryDTO.seen === -1) {
            arraysOfIds.push(userData.unseenTitles);
        }

        if (queryDTO.starred === 1) {
            arraysOfIds.push(userData.starredTitles)
        }

        if (queryDTO.favourite === 1) {
            arraysOfIds.push(userData.favouriteTitles);
        }

        const idsToFilter = arraysOfIds.length ? arraysOfIds.reduce((accumulator, currentArray) =>
            accumulator.filter(value => currentArray.includes(value))
        ) : [];

        let idFilter = {};

        if (arraysOfIds.length > 0) {
            idFilter = { ...idFilter, _id: { $in: idsToFilter } }
        }

        let titleFilter = {};

        if (queryDTO.search) {
            titleFilter = { ...titleFilter, title: { $regex: new RegExp(`${queryDTO.search}`, "i") } }
        }

        let languageFilter = {};

        if (queryDTO.language) {
            languageFilter = { ...languageFilter, "languages.ISO_639_1_code": { $regex: new RegExp(`^${queryDTO.language}`, "i") }, }
        }

        let genresFilter = {};

        if (queryDTO.genre) {
            genresFilter = { ...genresFilter, genres: { $regex: new RegExp(`${queryDTO.genre}`, "i") }, }
        }

        let ageFilter = {}

        if ((queryDTO["age.lte"] !== 26) || (queryDTO["age.gte"] !== 0)) {
            ageFilter = {
                ...ageFilter,
                'age_rattings.country': { $in: (queryDTO["age.lte"] > 21) ? [queryDTO.country, 'default'] : [queryDTO.country] },
                'age_rattings.ratting': { $in: age_filter },
            }
        }
        const query: FilterQuery<ITitle> = {
            $and: [
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

        const sort = MongoSortBuilder(queryDTO?.sort_by as string);

        const q: FindAllQuery = {
            query,
            sort: sort,
            limit: queryDTO?.limit ?? 0,
            page: queryDTO?.pageNo ?? 1,
        }

        const page: PageDTO = await this.titleRepository.findAllWithUserData(q, userId, queryDTO.minimal ? minimalProjection : normalProjection);

        return page;
    }


    /**
     * getAllAvailableLanguages()
     */
    async getAllAvailableLanguages(): Promise<LanguageDTO[]> {

        return await this.titleRepository.fetchAllAvailableLanguages();
    }

    /**
     * getAllAvailableGenres()
     */
    async getAllAvailableGenres(): Promise<string[]> {

        return await this.titleRepository.fetchAllAvailableGenres();
    }

    /**
     * deleteTitleById()
     * @param titleId 
     */
    async deleteTitleById(titleId: string): Promise<void> {

        await this.getTitleById(titleId);

        await this.titleRepository.deleteTitleById(titleId);
    }

    /**
     * updateTitleById()
     * @param titleId 
     * @param title 
     */
    async updateTitleById(titleId: string, title: Partial<TitleDTO>): Promise<TitleDTO> {

        await this.getTitleById(titleId);

        switch (title?.title_type) {
            case TitleType.MOVIE:
                return this.movieService.updateMovieById(titleId, title);
            case TitleType.TV:
                return this.tvService.updateTvById(titleId, title)
            default:
                throw new TitleException("Invalid Title Type", HttpCodes.BAD_REQUEST, `Title type not provided`, `@TitleService.class: @updateTitleById.method() requested , titleId: ${titleId}, titleDTO: ${title}`);

        }
    }
}




export default TitleService;
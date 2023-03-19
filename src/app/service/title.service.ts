import HttpCodes from "@constants/http.codes.enum";
import TitleType from "@constants/titile.types.enum";
import TitleSource from "@constants/title.souces.enum";
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
import mongoose, { FilterQuery, ObjectId, ProjectionFields } from "mongoose";
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
     * @param titileDTO 
     */
    async createTitle(titileDTO: Partial<TitleDTO>, userDTO: UserDTO): Promise<TitleDTO> {


        switch (titileDTO.source) {
            case TitleSource.IMDB:
                if (!titileDTO.imdb_id) throw new TitleException("IMDB ID is mandatory for SourceType: IMDB", HttpCodes.BAD_REQUEST, "SourceType is IMDB but IMDB ID is not provided", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titileDTO)}`);
                break;
            case TitleSource.TMDB:
                if (!titileDTO.tmdb_id) throw new TitleException("TMDB ID is mandatory for SourceType: TMDB", HttpCodes.BAD_REQUEST, "SourceType is TMDB but TMDB ID is not provided", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titileDTO)}`);
                break;
            case TitleSource.CUSTOM:
                break;
            default:
                throw new TitleException("SourceType: Is Unknown", HttpCodes.BAD_REQUEST, "Unknown SourceType received", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titileDTO)}`);
        }


        if (titileDTO.imdb_id) {
            if (await this.titleRepository.findByImdbId(titileDTO.imdb_id)) throw new TitleException(`Title with IMDB ID: ${titileDTO.imdb_id} already exists`, HttpCodes.BAD_REQUEST, "Duplicate Title according to IMDB ID", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titileDTO)}`);
        }

        if (titileDTO.tmdb_id) {
            if (await this.titleRepository.findByTmdbId(titileDTO.tmdb_id)) throw new TitleException(`Title with TMDB ID: ${titileDTO.tmdb_id} already exists`, HttpCodes.BAD_REQUEST, "Duplicate Title according to TMDB ID", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titileDTO)}`);
        }

        switch (titileDTO.title_type) {
            case TitleType.MOVIE:
                const movieDTO: NonNullable<Partial<MovieDTO>> = titileDTO as Partial<MovieDTO>;
                return await this.movieService.createMovie(movieDTO, userDTO) as TitleDTO;
            case TitleType.TV:
                const tvDTO: NonNullable<Partial<TvDTO>> = titileDTO as Partial<TvDTO>;
                return await this.tvService.createTv(tvDTO, userDTO) as TitleDTO;
            default:
                throw new TitleException("TitleType: Is Unknown", HttpCodes.BAD_REQUEST, "Unknown TitleType received", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titileDTO)}`);
        }
    }

    /**
     * @deprecated user getTitleByIdWithUserData
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

        const sort = queryDTO.sort_by ? await MongoSortBuilder(queryDTO.sort_by) : { createdAt: 'desc' };

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


        let titleIdsSet = new Set<string>();

        if (queryDTO.seen === 1) {
            for (const id of userData.seenTitles) {
                titleIdsSet.add(id.toString())
            }
        } else if (queryDTO.seen === -1) {
            for (const id of userData.unseenTitles) {
                titleIdsSet.add(id.toString())
            }
        }

        if (queryDTO.starred === 1) {
            for (const id of userData.starredTitles) {
                titleIdsSet.add(id.toString())
            }
        }


        if (queryDTO.favourite === 1) {
            for (const id of userData.favouriteTitles) {
                titleIdsSet.add(id.toString())
            }
        }

        let titileObjectIdsSet = new Set<mongoose.Types.ObjectId>();

        for (const id of titleIdsSet) {
            titileObjectIdsSet.add(new mongoose.Types.ObjectId(id))
        }

        let idFilter = {};
        if (titileObjectIdsSet.size > 0) {
            idFilter = { ...idFilter, _id: { $in: Array.from(titileObjectIdsSet) } }
        }


        // let userDataFilters = {};

        // if (queryDTO.seen === 1) {
        //     userDataFilters = { ...userDataFilters, seenByUser: true }
        // } else if (queryDTO.seen === -1) {
        //     userDataFilters = { ...userDataFilters, unseenByUser: true }
        // }

        // if (queryDTO.starred === 1) {
        //     userDataFilters = { ...userDataFilters, starredByUser: true }
        // }

        // if (queryDTO.favourite === 1) {
        //     userDataFilters = { ...userDataFilters, favouriteByUser: true }
        // }

        let titleFilter = {};
        if (queryDTO.search) {
            titleFilter = { ...titleFilter, title: { $regex: new RegExp(`${queryDTO.search}`, "i") } }
        }

        let originalLangFilter = {};
        if (queryDTO.language) {
            originalLangFilter = { ...originalLangFilter, "original_language.ISO_639_1_code": { $regex: new RegExp(`^${queryDTO.language}`, "i") }, }
        }

        let genresFilter = {};
        if (queryDTO.genre) {
            genresFilter = { ...genresFilter, genres: { $regex: new RegExp(`${queryDTO.genre}`, "i") }, }
        }

        let ageFilter = {}
        if ((queryDTO["age.lte"] !== 26) || (queryDTO["age.gte"] !== 0)) {
            ageFilter = {
                ...ageFilter,
                // 'age_rattings.country': { $in: ((queryDTO?.["age.lte"] ?? 26) >= 26) ? [/.*?/i] : [queryDTO.country, 'default'] },
                // 'age_rattings.ratting': { $in: ((queryDTO?.["age.lte"] ?? 26) >= 26) ? [/.*?/i] : age_filter },
                'age_rattings.country': { $in: (queryDTO["age.lte"] > 21) ? [queryDTO.country, 'default'] : [queryDTO.country] },
                'age_rattings.ratting': { $in: age_filter },
            }
        }
        const query: FilterQuery<ITitle> = {
            $and: [
                {
                    ...idFilter,
                    title_type: { $in: title_types.map(title_type => { if (title_type.include === 1) return title_type.type }).filter(Boolean) },
                    ...originalLangFilter,
                    ...genresFilter,
                    ...titleFilter,
                    ...ageFilter,
                    // ...userDataFilters
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
            seenByUser: 1,
            unseenByUser: 1,
            starredByUser: 1,
            favouriteByUser: 1,
        }

        const normalProjection: ProjectionFields<ITitle> = {
            __v: 0,
            userData: 0
        }

        const sort = queryDTO.sort_by ? await MongoSortBuilder(queryDTO.sort_by) : { createdAt: 'desc' };

        const q: FindAllQuery = {
            query,
            sort: sort,
            limit: queryDTO?.limit ?? 5,
            page: queryDTO?.pageNo ?? 1,
        }

        const page: PageDTO = await this.titleRepository.findAllWithUserData(q, userId, queryDTO.minimal ? minimalProjection : normalProjection);

        return page;
    }

}




export default TitleService;
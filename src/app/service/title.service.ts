import HttpCodes from "@constants/http.codes.enum";
import TitleType from "@constants/titile.types.enum";
import TitleSource from "@constants/title.souces.enum";
import MovieDTO from "@dto/movie.dto";
import PageDTO from "@dto/page.dto";
import TitleDTO, { FindAllTitlesQueryDTO } from "@dto/title.dto";
import TvDTO from "@dto/Tv.dto";
import TitleException from "@exceptions/title.exeception";
import ITitle from "@models/interfaces/title.interface";
import { FindAllQuery } from "@repositories/interfaces/custom.types.interfaces";
import TitleRepository from "@repositories/title.repository";
import MongoSortBuilder from "@utils/mongo.sort.builder";
import { FilterQuery, ProjectionFields } from "mongoose";
import { Inject, Service } from "typedi";
import ITitleService from "./interfaces/title.service.interface";
import MovieService from "./movie.service";
import TvService from "./tv.service";


@Service()
class TitleService implements ITitleService {

    private movieService: MovieService;
    private tvService: TvService;

    private titleRepository: TitleRepository;

    constructor(@Inject() movieService: MovieService, @Inject() tvService: TvService, @Inject() titleRepository: TitleRepository) {
        this.movieService = movieService;
        this.tvService = tvService;
        this.titleRepository = titleRepository;
    }
    /**
     * createTitle
     * @param titileDTO 
     */
    async createTitle(titileDTO: Partial<TitleDTO>): Promise<TitleDTO> {


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
            if (await this.titleRepository.findByImdbId(titileDTO.imdb_id)) new TitleException(`Title with IMDB ID: ${titileDTO.imdb_id} already exists`, HttpCodes.BAD_REQUEST, "Duplicate Title according to IMDB ID", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titileDTO)}`);
        }

        if (titileDTO.tmdb_id) {
            if (await this.titleRepository.findByTmdbId(titileDTO.tmdb_id)) new TitleException(`Title with TMDB ID: ${titileDTO.tmdb_id} already exists`, HttpCodes.BAD_REQUEST, "Duplicate Title according to TMDB ID", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titileDTO)}`);
        }


        switch (titileDTO.title_type) {
            case TitleType.MOVIE:
                const movieDTO: NonNullable<Partial<MovieDTO>> = titileDTO as Partial<MovieDTO>;
                return await this.movieService.createMovie(movieDTO) as TitleDTO;
            case TitleType.TV:
                const tvDTO: NonNullable<Partial<TvDTO>> = titileDTO as Partial<TvDTO>;
                return await this.tvService.createTv(tvDTO) as TitleDTO;
            default:
                throw new TitleException("TitleType: Is Unknown", HttpCodes.BAD_REQUEST, "Unknown TitleType received", `@TitleService.class: @createTitle.method() TitleDTO: ${JSON.stringify(titileDTO)}`);
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
     * 
     * @param queryDTO 
     * @returns Promise<PageDTO>
     */
    async getAllTitles(queryDTO: FindAllTitlesQueryDTO): Promise<PageDTO> {

        const query: FilterQuery<ITitle> = {
            $and: [
                {
                    title: { $regex: new RegExp(`^${queryDTO.search ?? ""}`, "i")},
                    title_type: { $regex: new RegExp(`^${queryDTO.title_type ?? ""}`, "i")},
                    "original_language.ISO_639_1_code": { $regex: new RegExp(`^${queryDTO.language ?? ""}`, "i")},
                    genres: { $regex: new RegExp(`${queryDTO.genre ?? ""}`, "i")}
                }
            ]
        }

        const minimalProjection : ProjectionFields<ITitle> = {
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
          page: queryDTO?.page ?? 1,
        }
        
        const page: PageDTO = await this.titleRepository.findAll(q, queryDTO.minimal ? minimalProjection : normalProjection );

        return page;
    }
}

export default TitleService;
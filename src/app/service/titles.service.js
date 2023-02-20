const {
  InvalidTitleType,
  TitleAlreadyExists,
  InvalidNewTitle,
} = require("../errors/TitleErrros");
const { TitleException } = require("../utils/Exceptions");
const movieService = require("./movies.service");
const tvService = require("./tv.service");
const titlesRepository = require("../repository/titles.repository");
const { buildSortObj } = require("../utils/build.sort.object");
const { validateTitleObject } = require("../validators/title.validator");
const { TitleSources } = require("../constants/TitleSources");

/**
 * new title
 * @param {Object} requestBody
 * @returns
 */
exports.newTitle = async (requestBody) => {
  /**
   * validate requestBody
   * and
   * store requestBody in titleDTO
   * errors in error
   */
  const { value: titleDTO, error: error } = await validateTitleObject(
    requestBody
  );

  /**
   * if any errors
   */
  if (error) {
    throw new TitleException(InvalidNewTitle(error.message));
  }

  /**
   * get some required data from titleDTO
   */
  const { title_type, tmdb_id, imdb_id, source } = titleDTO;

  /**
   * if tmdb_id is provided
   */
  if (tmdb_id) {
    /**
     * check if title with same tmdb_id persist
     * if persist then throw error
     */
    if (await titlesRepository.findByTmdbId(tmdb_id)) {
      throw new TitleException(TitleAlreadyExists(`tmdb_id : ${tmdb_id}`));
    }
  }

  /**
   * if imdb_id is provided
   */
  if (imdb_id) {
    /**
     * check if title with same imdb_id persist
     * if persist then throw error
     */
    if (await titlesRepository.findByImdbId(imdb_id)) {
      throw new TitleException(TitleAlreadyExists(`imdb_id : ${imdb_id}`));
    }
  }

  /**
   * if source === imdb
   */
  if (source === TitleSources.IMDB) {
    /**
     * if imdb_id not provided then throw exception
     */
    if (!imdb_id) {
      throw new TitleException(
        InvalidNewTitle("imdb_id is mandatory for source : " + source)
      );
    }
  }

  /**
   * if source === tmdb
   */
  if (source === TitleSources.TMDB) {
    /**
     * if tmdb_id not provided then throw exception
     */
    if (!tmdb_id) {
      throw new TitleException(
        InvalidNewTitle("tmdb_id is mandatory for source : " + source)
      );
    }
  }

  /**
   * if title_type === movie
   * then add new movie and return it
   */
  if (title_type === "movie") {
    return await movieService.newMovie(requestBody);
  }

  /**
   * if title_type === tv
   * then add new tv and return it
   */
  if (title_type === "tv") {
    return await tvService.newTv(requestBody);
  }
};

/**
 * findAll titles
 * @param {Object} requestQuery
 * @returns
 */
exports.findAll = async (requestQuery) => {
  /**
   * default values
   */
  let query = {}; // query object {}
  let sort = { createdAt: "desc" }; // sort object {}
  let page = 1; // page number to to retrived
  let limit = 20; // number of results to retirved per page
  let minimal = "false"; // projection type to be retrived

  /**
   * non query fields ( non keys ) of user document which will come with request query
   */
  const nonQueryFields = ["sort_by", "page", "limit", "minimal"];

  /**
   * copy requestQuery to query
   */
  query = { ...requestQuery };

  /**
   * remove all non query fields (non-keys) form query object {}
   */
  nonQueryFields.forEach((element) => {
    //delete key
    delete query[element];
  });

  /**
   * if page value provided in requestQuery
   */
  if (requestQuery.page) {
    page = requestQuery.page; // change default page number
  }

  /**
   * if limit value provided in requestQuery
   */
  if (requestQuery.limit) {
    limit = requestQuery.limit; // change default limit value
  }

  /**
   * if sort options are provided in requestQuery
   */
  if (requestQuery.sort_by) {
    /**
     * retrive sort option as an object
     * and
     * change the sort value with retived sort object
     */
    sort = await buildSortObj(requestQuery.sort_by);
  }

  /**
   * if minimal projection is true
   */
  if (requestQuery.minimal) {
    minimal = requestQuery.minimal; // change default minimal value
  }

   /**
   * finally find all title with query, sort options , page, limit , minimal  and retrun
   * Array<Titles>
   */
  return await titlesRepository.findAllTitles({
    query,
    minimal,
    sort,
    page,
    limit,
  });
};

const { JoiInvalidTv } = require("../errors/TvErrors");
const { TvException } = require("../utils/Exceptions");
const { validateTvObject } = require("../validators/tv.validator");
const tvRepository = require("../repository/tv.repository");

/**
 * newTv
 * @param {Object} requestBody
 * @returns
 */
exports.newTv = async (requestBody) => {
  /**
   * validate requestBody
   * and
   * store cleaned body in tvDTO
   * store errors in error
   */
  const { value: tvDTO, error: error } = await validateTvObject(requestBody);

  /**
   * if errors persist throw exception
   */
  if (error) {
    throw new TvException(JoiInvalidTv(error.message));
  }

  /**
   * create new tv
   * and
   * return it
   */
  return await tvRepository.createTv({ ...tvDTO });
};

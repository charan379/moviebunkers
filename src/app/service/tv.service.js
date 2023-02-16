const { JoiInvalidTv } = require("../errors/TvErrors");
const { TvException } = require("../utils/Exceptions");
const { validateTvObject } = require("../validators/tv.validator");
const tvRepository = require("../repository/tv.repository");

exports.addNewTv = async (requestBody) => {
  const { value: tvDTO, error: error } = await validateTvObject(requestBody);

  if (error) {
    throw new TvException(JoiInvalidTv(error.message));
  }

  return (newTv = await tvRepository.newTv({ ...tvDTO }));
};

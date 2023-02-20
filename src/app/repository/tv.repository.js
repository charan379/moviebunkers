const TvModel = require("../models/tv.model");

/**
 * 
 * @param {Object} tvObj 
 * @returns 
 */
exports.createTv = async (tvObj) => {
  /**
   * create new tv document and return it
   */
  return TvModel.create(tvObj);
};

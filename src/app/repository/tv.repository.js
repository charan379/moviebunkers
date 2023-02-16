const TvModel = require("../models/tv.model");

//  add new tv
exports.newTv = async (tvObj) => {
  return TvModel.create(tvObj);
};

const mongoose = require("mongoose");

// dummy schema and model to retirve movies and tv shows in titles collection

// tvSchema
const titlesSchema = new mongoose.Schema(
  {},
  {
    collection: "titles",
  }
);

// TvModel
const TitlesModel = mongoose.model("titles", titlesSchema);

module.exports = TitlesModel;

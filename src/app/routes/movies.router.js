const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movie.controllers");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "movies" });
});

router.post("/newMovie", movieController.newMovie);

router.get("/movie/:id", movieController.findById);

router.get('/allMovies', movieController.findAll);


module.exports = router;

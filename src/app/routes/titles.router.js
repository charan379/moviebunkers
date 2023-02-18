const express = require("express");
const { authorize } = require("../middlewares/authorize.middleware");
const router = express.Router();
const titlesController = require("../controllers/titles.controller");
const { Roles } = require("../constants/UserRoles");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "movies" });
});

/**
 * @swagger
 * /titles/newTitle:
 *  post:
 *   tags:
 *     - Titles
 *   summary: API to create new title
 *   description: create a title for valid title object
 *   requestBody:
 *      content:
 *        application/json:
 *          description: movie
 *          schema:
 *              #$ref: '#/components/schemas/movieSchema'
 *              #$ref: '#/components/schemas/tvSchema'
 *              oneOf:
 *                  - $ref: '#/components/schemas/movieSchema'
 *                  - $ref: '#/components/schemas/tvSchema'
 *          examples:
 *             newMovie:
 *                $ref: '#/components/examples/newMovieExample'
 *             newTv:
 *                $ref: '#/components/examples/newTvExample'
 *                
 *   responses:
 *       200:
 *          description: Success
 *       404:
 *          description: Invalid new title

 *      
 */
router.post(
  "/newTitle",
  authorize(Roles.MODERATOR),
  titlesController.addNewMovie
);

router.get("/getAllTitles", titlesController.getAllTitles);
module.exports = router;

const express = require("express");
const { authorize } = require("../middlewares/authorize.middleware");
const router = express.Router();
const titlesController = require("../controllers/titles.controller");
const { Roles } = require("../constants/UserRoles");

// /* GET home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "movies" });
// });

/**
 * @swagger
 * /titles/new-title:
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
  "/new-title",
  authorize(Roles.MODERATOR),
  titlesController.newTitle
);


/**
 * @swagger
 * /titles/get-all-titles:
 *  get:
 *   tags:
 *     - Titles
 *   summary: API to to get all titles
 *   description: return list of titles for given query
 *   parameters:
 *      - in: query
 *        name: search
 *        schema:
 *          type: string
 *      - in: query
 *        name: minimal
 *        schema:
 *          type: boolean
 *      - in: query
 *        name: year
 *        schema:
 *          type: number
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *      - in: query
 *        name: limit
 *        schema:
 *          type: integer
 *      - in: query
 *        name: sort_by
 *        schema:
 *          type: string
 *
 *   responses:
 *       200:
 *          description: Success
 *       404:
 *          description: Invalid new user
 */
router.get("/get-all-titles",authorize(Roles.USER), titlesController.getAllTitles);
module.exports = router;

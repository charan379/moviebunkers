const express = require("express");
const router = express.Router();

const usersRouter = require("./users.router");
const titlesRouter = require("./titles.router");
const ErrorResponse = require("../utils/ErrorResponse");
const { NotFound404 } = require("../errors/CommonErrors");

router.use("/users", usersRouter);
router.use("/titles", titlesRouter);

/**
 * unknown route
 */
router.use("/*", function (req, res, next) {
  res.status(404).json(ErrorResponse(NotFound404(`${req.baseUrl + req.url}`)));
});

module.exports = router;

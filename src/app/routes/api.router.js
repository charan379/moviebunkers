const express = require("express");
const router = express.Router();

const usersRouter = require("./users.router");
const titlesRouter = require("./titles.router");

router.use("/users", usersRouter);
router.use("/titles", titlesRouter);

module.exports = router;

const express = require("express");
const { authorize } = require("../middlewares/authorize.middleware");
const router = express.Router();
const titlesController = require("../controllers/titles.controller");
const { Roles } = require("../constants/UserRoles");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "movies" });
});

router.post("/newTitle", authorize(Roles.MODERATOR), titlesController.addNewMovie);


module.exports = router;

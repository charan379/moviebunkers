const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.controllers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("working");
});

router.post("/newUser", userControllers.newUserController);

router.get("/login", userControllers.userLoginController);
module.exports = router;

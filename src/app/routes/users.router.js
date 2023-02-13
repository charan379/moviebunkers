const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send('working')
});

router.post("/newUser", userController.newUser);

module.exports = router;

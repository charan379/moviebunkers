const express = require("express");
const { Roles } = require("../constants/UserRoles");
const router = express.Router();
const userControllers = require("../controllers/user.controllers");
const { authorize } = require("../middlewares/authorize.middleware");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("working");
});

router.post("/newUser", userControllers.newUserController);

router.get("/login", userControllers.userLoginController);

router.get(
  "/test",
  authorize(Roles.ADMIN),
  userControllers.testToken
);
module.exports = router;

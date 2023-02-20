const express = require("express");
const { Roles } = require("../constants/UserRoles");
const router = express.Router();
const userControllers = require("../controllers/user.controllers");
const { authorize } = require("../middlewares/authorize.middleware");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("working");
});

/**
 * @swagger
 * /users/new-user:
 *  post:
 *   tags:
 *     - Users
 *   summary: API to create new user
 *   description: create a user for valid user object
 *   requestBody:
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/newUser'
 *   responses:
 *       200:
 *          description: Success
 *       404:
 *          description: Invalid new user

 *      
 */
router.post("/new-user", userControllers.newUser);

// get all users
router.get(
  "/get-all-users",
  authorize(Roles.SUPERADMIN),
  userControllers.getAllUsers
);

router.put(
  "/update-user/:userName",
  authorize(Roles.ADMIN),
  userControllers.updateUser
);

/**
 * @swagger
 * /users/login:
 *  post:
 *   tags:
 *     - Users
 *   summary: API to create new user
 *   description: returns a token for valid user
 *   requestBody:
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/login'
 *   responses:
 *       200:
 *          description: Success
 *       404:
 *          description: Invalid new user
 *
 *
 */
router.post("/login", userControllers.userLogin);

router.get("/test", authorize(Roles.ADMIN), userControllers.testToken);
module.exports = router;

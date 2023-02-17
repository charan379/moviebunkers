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
 * /users/newUser:
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
router.post("/newUser", userControllers.newUserController);


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
router.post("/login", userControllers.userLoginController);

router.get("/test", authorize(Roles.ADMIN), userControllers.testToken);
module.exports = router;

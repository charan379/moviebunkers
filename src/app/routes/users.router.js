const express = require("express");
const { Roles } = require("../constants/UserRoles");
const router = express.Router();
const userControllers = require("../controllers/user.controllers");
const { authorize } = require("../middlewares/authorize.middleware");

// /* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("working");
// });

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
 *   security: []
 *   responses:
 *       200:
 *          description: Success
 *       404:
 *          description: Invalid new user
 */
router.post("/new-user", userControllers.newUser);

/**
 * @swagger
 * /users/get-all-users:
 *  get:
 *   tags:
 *     - Users
 *   summary: API to to get all users
 *   description: return users for given query
 *   parameters:
 *      - in: query
 *        name: role
 *        schema:
 *          type: string
 *          enum: ['Admin','User','Moderator']
 *      - in: query
 *        name: status
 *        schema:
 *          type: string
 *          enum: ['Active', 'Inactive']
 *      - in: query
 *        name: email
 *        schema:
 *          type: email
 *      - in: query
 *        name: userName
 *        schema:
 *         type: string
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
 *   
 */
router.get(
  "/get-all-users",
  authorize(Roles.SUPERADMIN),
  userControllers.getAllUsers
);

/**
 * @swagger
 * /users/update-user/{userName}:
 *  put:
 *   tags:
 *     - Users
 *   summary: API to update user role, status
 *   description: can update user status and role
 *   parameters:
 *     - in: path
 *       name: userName
 *       schema:
 *          type: string
 *   requestBody:
 *      content:
 *        application/json:
 *          schema:
 *              $ref: '#/components/schemas/userUpdateSchema'
 *   responses:
 *       200:
 *          description: Success
 *       404:
 *          description: Invalid new user
 */
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
 *   security: []
 */
router.post("/login", userControllers.userLogin);

/**
 * @swagger
 * /users/who-am-i:
 *  get:
 *   tags:
 *     - Users
 *   summary: API to to get user details with token
 *   description: return use info based on token
 *   responses:
 *       200:
 *          description: Success
 *       404:
 *          description: Invalid new user
 */
router.get("/who-am-i", authorize(Roles.USER), userControllers.getWhoAmI);

module.exports = router;

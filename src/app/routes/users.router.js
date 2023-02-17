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
 *     - users
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
 *          content:
 *            application/json:
 *              schema:
 *                 $ref: '#/components/schemas/userCreatedRespnse'
 *       404:
 *          description: Invalid new user
 * components:
 *    schemas:
 *      newUser:
 *        type: object
 *        properties:
 *          userName:
 *             type: string
 *             example: user0001
 *          email:
 *             type: string
 *             example: user0001@gmail.com
 *          password:
 *             type: string
 *             example: 5tr0ng@Pa55w0rd
 *        required:
 *          - userName
 *          - email
 *          - password
 *      userCreatedRespnse:
 *        type: object
 *        properties:
 *          success:
 *             type: boolean
 *             default: true
 *          httpCode:
 *              type: int
 *              default: 200
 *          result: 
 *             $ref: '#/components/schemas/user'
 *      user:
 *        type: object
 *        properties:
 *           _id: 
 *              type: string
 *              default: 63ef41d27e54784675fd3f82
 *           userName:
 *               type: string
 *               default: user0001
 *           email: 
 *                type: string
 *                default: user0004@gmail.com
 *           role: 
 *                type: string
 *                default: User
 */
router.post("/newUser", userControllers.newUserController);


/**
 * @swagger
 * /users/login:
 *  post:
 *   tags:
 *     - users
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
 *          content:
 *              application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/loggedInResponse'
 *       404:
 *          description: Invalid new user
 * components:
 *    schemas:
 *      login:
 *        type: object
 *        properties:
 *          userName:
 *             type: string
 *             example: user0001
 *          password:
 *             type: string
 *             example: 5tr0ng@Pa55w0rd
 *        required:
 *          - userName
 *          - password
 *      loggedInResponse: 
 *              type: object
 *              properties:
 *                  success:
 *                    type: boolean
 *                    default: true
 *                  httpCode:
 *                    type: int
 *                    default: 200
 *                  result:
 *                      type: object
 *                      properties:
 *                        token:
 *                          type: string
 *                          default: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.*.*
 *                        UserDetails:
 *                          $ref: '#/components/schemas/user' 
 *                  
 *      
 */
router.post("/login", userControllers.userLoginController);

router.get("/test", authorize(Roles.ADMIN), userControllers.testToken);
module.exports = router;

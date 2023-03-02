import AuthController from "@controllers/api/auth.controller";
import { UserController } from "@controllers/api/users.controller";
import { Router } from "express";
import Container from "typedi";

const router = Router();


const userController = Container.get(UserController);

router.use("/users", userController.router);


const authController = Container.get(AuthController);

router.use("/auth", authController.router);


export default router;
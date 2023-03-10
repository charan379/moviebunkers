import AuthController from "@controllers/api/auth.controller";
import TitleController from "@controllers/api/titles.controller";
import UserController from "@controllers/api/users.controller";
import { Router } from "express";
import Container from "typedi";

const router = Router();


const userController = Container.get(UserController);
router.use("/users", userController.router);


const authController = Container.get(AuthController);
router.use("/auth", authController.router);


const titleController = Container.get(TitleController);
router.use("/titles", titleController.router);

export default router;
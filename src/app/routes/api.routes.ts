import { UserController } from "@src/app/controllers/api/users.controller";
import { Router } from "express";
import Container from "typedi";

const router = Router();


const userController = Container.get(UserController);

router.use("/users", userController.router);

export default router;
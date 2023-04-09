import AuthController from "@controllers/api/auth.controller";
import LinksController from "@controllers/api/links.controller";
import TitleController from "@controllers/api/titles.controller";
import UserDataController from "@controllers/api/userdata.controller";
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

const userDataController = Container.get(UserDataController);
router.use("/userdata", userDataController.router);

const linksController = Container.get(LinksController);
router.use("/links", linksController.router)
router.use("/health-check", (req, res, next) => {
    try {
        const data = {
            uptime: process.uptime(),
            message: 'running',
            date: new Date()
        }
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
})
export default router;
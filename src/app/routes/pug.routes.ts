


import express from "express";
import Container from "typedi";
import WebController from "../controllers/pug/web.controller";


const router = express.Router();

const webController = Container.get(WebController);


router.use('/', webController.router)

export default router;
import { NextFunction, Request, Response, Router } from "express";
import debug from "debug";
import { Service } from "typedi";


@Service()
export default class WebController {
  private _debugger: debug.Debugger;

  public router = Router();
  constructor() {
    this._debugger = debug("moviebunkers:[WebIndexController.class]");

    this.router.get("/", this.getIndex.bind(this));
  }

  private getIndex(req: Request, res: Response, next: NextFunction) {
    res.render('index', { title: "MovieBunkers - API" });
  }
}

import { before, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import BaseController from "./base.controller";
import verifyAuthorization from "../middlewares/verifyAuthorization";
import VerifyTokenMiddleware from "../middlewares/verifyToken";

@route("/api/dashboard")
export default class DashboardController extends BaseController {
  dashboardService: any;
  appException: any;

  constructor(dashboardService, appException) {
    super();
    this.dashboardService = dashboardService;
    this.appException = appException;
  }

  @route("/getBoxStats")
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @GET()
  async getBoxStats(req: Request, res: Response): Promise<any> {
    try {
      return this.dashboardService
        .getBoxStats()
        .then((resp) => {
          return res.status(200).json(resp);
        })
        .catch((err) => this.appException.handleException(err, res));
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }
}

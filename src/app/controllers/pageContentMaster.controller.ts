import { before, controller, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import BaseController from "./base.controller";
import verifyAuthorization from "../middlewares/verifyAuthorization";
import VerifyTokenMiddleware from "../middlewares/verifyToken";
import axios from "axios";
import { createLogger, transports, format, child } from "winston";
import JWTHelper from "../helpers/jwt.helper";
import { ApiResponse } from "../interface/apiResponse";

@route("/api/pagecontent")
export default class PageContentMasterController extends BaseController {
  pageContentMasterService: any;
  appException: any;
  response: any;
  JWTHelper: any;
  appConfig: any;
  verifyToken: any;

  constructor(pageContentMasterService, appConfig, appException) {
    super();

    this.pageContentMasterService = pageContentMasterService;
    this.appException = appException;
    this.JWTHelper = new JWTHelper();
    this.appConfig = appConfig;
  }
  logger = createLogger({
    transports: [
      new transports.File({
        filename: "log.txt",
        level: "info",
        format: format.combine(format.timestamp(), format.json()),
      }),
    ],
  });
  @route("/list")
  /**
   * @swagger
   * /api/pagecontent/list:
   *   get:
   *      description: Used to get all Page Content data
   *      tags:
   *          - Get all Pages Content List
   *      responses:
   *          '200':
   *              description: Resource Fetch successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @GET()
  async getAllAsync(req: Request, res: Response): Promise<any> {
    try {
      var pagecontent = this.pageContentMasterService.getAllAsync();
      return pagecontent
        .then((response) => {
          this.logger.log({
            level: "info",
            message: response.Message,
            apiURL: this.appConfig.host + req.originalUrl,
          });
          response.Result = this.convertProperResponse(response.Result);
          return res.status(200).json(response);
        })
        .catch((error) => {
          this.appException.handleException(error, res);
        });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  @route("/:id")
  /**
   * @swagger
   * /api/pagecontent/{id}:
   *   get:
   *      description: Used to get all details of individual Page Content
   *      tags:
   *          - Get single Page Content
   *      parameters:
   *          - in: path
   *            name: id
   *            description: Page Content data
   *            schema:
   *              type: object
   *              required:
   *                - id
   *              properties:
   *                  id:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 1000
   *                      example: 0x056DBCD84CB369FCD99A8336C3A5A171C134AF834592A0C161FECA96C0051D6E
   *      responses:
   *          '200':
   *              description: Resource Fetch successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @GET()
  async getSingle(req: Request, res: Response): Promise<any> {
    try {
      this.pageContentMasterService
        .getSingleAsync(req.params.id)
        .then((response: ApiResponse) => {
          this.logger.log({
            level: "info",
            message: response.Message,
            apiURL: this.appConfig.host + req.originalUrl,
          });
          response.Result = this.convertProperResponse(response.Result);
          return res.status(200).json(response);
        })
        .catch((error) => {
          this.appException.handleException(error, res);
        });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }
}

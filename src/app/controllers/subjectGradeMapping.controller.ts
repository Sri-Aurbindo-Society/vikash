import { before, controller, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import BaseController from "./base.controller";
import verifyAuthorization from "../middlewares/verifyAuthorization";
import VerifyTokenMiddleware from "../middlewares/verifyToken";
import axios from "axios";
import { createLogger, transports, format, child } from "winston";
import JWTHelper from "../helpers/jwt.helper";
import { Admin } from "../interface/admin";
import { ApiResponse } from "../interface/apiResponse";

@route("/api/subjectGradeMapping")
export default class SubjectGradeMappingController extends BaseController {
  subjectGradeMappingService: any;
  appException: any;
  response: any;
  JWTHelper: any;
  appConfig: any;
  verifyToken: any;

  constructor(subjectGradeMappingService, appConfig, appException) {
    super();

    this.subjectGradeMappingService = subjectGradeMappingService;
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
   * /api/subjectGradeMapping/list:
   *   get:
   *      description: Used to get all subjectGradeMapping data
   *      tags:
   *          - Get all subjectGradeMapping List
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
      var subjectGradeMapping = this.subjectGradeMappingService.getAllAsync();
      return subjectGradeMapping
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
   * /api/subjectGradeMapping/{id}:
   *   get:
   *      description: Used to get all details of individual mapping
   *      tags:
   *          - Get single subjectGradeMapping
   *      parameters:
   *          - in: path
   *            name: id
   *            description: subjectGradeMapping data
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
      this.subjectGradeMappingService
        .getSingleAsync(req.params.id)
        .then((response: ApiResponse) => {
          // var host = req.headers.host;
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
  @route("/subjectByGradeID")
  /**
   * @swagger
   * /api/subjectGradeMapping/subjectByGradeID:
   *   post:
   *      description:  Get Subject list by grade id
   *      tags:
   *          - Get Subject list by grade id
   *      parameters:
   *          - in: body
   *            name: Get Subject list by grade id
   *            description: Subject List
   *            schema:
   *              type: object
   *              required:
   *                 - gradeID
   *              properties:
   *                  gradeID:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 1000
   *                      example: "0x1D017E032E200492DF77C6AD8D5001E37BAC3D3BB46EF98D06EAB2B34CD201D4"
   *      responses:
   *          '200':
   *              description: Reuested data has been fetched successfully...
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: No subject found ...
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async subjectByGradeID(req: Request, res: Response): Promise<any> {
    try {
      this.subjectGradeMappingService
        .subjectByGradeID(req.body.gradeID)
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

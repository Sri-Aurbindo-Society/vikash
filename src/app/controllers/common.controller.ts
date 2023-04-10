import { before, controller, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import BaseController from "./base.controller";
import verifyAuthorization from "../middlewares/verifyAuthorization";
import VerifyTokenMiddleware from "../middlewares/verifyToken";

import { ApiResponse } from "../interface/apiResponse";

@route("/api/common")
export default class UsersController extends BaseController {
  usersService: any;
  commonservice: any;
  appException: any;
  response: any;
  JWTHelper: any;
  appConfig: any;
  //verifyToken: any;

  constructor(usersService, commonService, appConfig, appException) {
    super();

    this.commonservice = commonService;
    this.usersService = usersService;
    this.appException = appException;
    this.appConfig = appConfig;
  }

  @route("/schools")
  /**
   * @swagger
   * /api/common/schools:
   *   get:
   *      description: Used to get all schools
   *      tags:
   *          - Get all schools
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
  async getAllSchools(req: Request, res: Response): Promise<any> {
    try {
      return this.commonservice
        .getAllSchools()
        .then((response) => {
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

  @route("/schools")
  /**
   * @swagger
   * /api/common/schools:
   *   post:
   *      description: fetch schools by keyword
   *      tags:
   *          - search schools by keyword
   *      parameters:
   *          - in: body
   *            name: search schools by keyword
   *            description: search schools by keyword
   *            schema:
   *              type: object
   *              required:
   *                 - keyword
   *              properties:
   *                  keyword:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 50
   *                      example: abc
   *      responses:
   *          '200':
   *              description: Logged IN successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async getSchools(req: Request, res: Response): Promise<any> {
    try {
      return this.commonservice
        .getSchools(req.body.keyword)
        .then((response) => {
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

  @route("/states")
  /**
   * @swagger
   * /api/common/states:
   *   get:
   *      description: Used to get all states
   *      tags:
   *          - Get all states
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
  async getAllStates(req: Request, res: Response): Promise<any> {
    try {
      return this.commonservice
        .getAllStates()
        .then((response) => {
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

  @route("/districts")
  /**
   * @swagger
   * /api/common/districts:
   *   get:
   *      description: Used to get all districts
   *      tags:
   *          - Get all districts
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
  async getAllDistricts(req: Request, res: Response): Promise<any> {
    try {
      return this.commonservice
        .getAllDistricts()
        .then((response) => {
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

  @route("/blocks")
  /**
   * @swagger
   * /api/common/blocks:
   *   get:
   *      description: Used to get all blocks
   *      tags:
   *          - Get all blocks
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
  async getAllBlocks(req: Request, res: Response): Promise<any> {
    try {
      return this.commonservice
        .getAllBlocks()
        .then((response) => {
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

  @route("/clusters")
  /**
   * @swagger
   * /api/common/clusters:
   *   get:
   *      description: Used to get all clusters
   *      tags:
   *          - Get all clusters
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
  async getAllClusters(req: Request, res: Response): Promise<any> {
    try {
      return this.commonservice
        .getAllClusters()
        .then((response) => {
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

  @route("/boards")
  /**
   * @swagger
   * /api/common/boards:
   *   get:
   *      description: Used to get all boards
   *      tags:
   *          - Get all boards
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
  async getAllBoards(req: Request, res: Response): Promise<any> {
    try {
      return this.commonservice
        .getAllBoards()
        .then((response) => {
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

  @route("/grades")
  /**
   * @swagger
   * /api/common/grades:
   *   get:
   *      description: Used to get all grades
   *      tags:
   *          - Get all grades
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
  async getAllGrades(req: Request, res: Response): Promise<any> {
    try {
      return this.commonservice
        .getAllGrades()
        .then((response) => {
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

  @route("/subjects")
  /**
   * @swagger
   * /api/common/subjects:
   *   get:
   *      description: Used to get all subjects
   *      tags:
   *          - Get all subjects
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
  async getAllSubjects(req: Request, res: Response): Promise<any> {
    try {
      return this.commonservice
        .getAllSubjects()
        .then((response) => {
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

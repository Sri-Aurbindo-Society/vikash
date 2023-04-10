import { before, controller, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import { ApiResponse } from "../interface/apiResponse";
import BaseController from "./base.controller";
import { createLogger, transports, format, child } from "winston";
import { Page } from "../interface/page";

@route("/api/page")
export default class PageController extends BaseController {
  pageService: any;
  appException: any;
  response: any;
  appConfig: any;

  constructor(pageService, appConfig, appException) {
    super();

    this.pageService = pageService;
    this.appException = appException;
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
   * /api/page/list:
   *   get:
   *      description: Used to get all Pages data
   *      tags:
   *          - Get all Pages List
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
      var page = this.pageService.getAllAsync();
      return page
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

  /*
    function :id
    Update By: Ajay 03, September 2022.
  */
  @route("/getTIAImages")
  /**
   * @swagger
   * /api/page/getTIAImages:
   *   get:
   *      description: Used to get all students data
   *      tags:
   *          - Get Teacher Innovation Award Images
   *      responses:
   *          '200':
   *              description: Resource Fetch successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  @GET()
  async getTIAImages(req: Request, res: Response): Promise<any> {
    try {
      this.pageService
        .getTIAImages()
        .then((response: ApiResponse) => {
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
   * /api/page/{id}:
   *   get:
   *      description: Used to get all details of individual Page
   *      tags:
   *          - Get single Page
   *      parameters:
   *          - in: path
   *            name: id
   *            description: Page data
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
      this.pageService
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

  // Create the page with all the required field's.
  @route("/create")
  /**
   * @swagger
   * /api/page/create:
   *   post:
   *      description: Create Page
   *      tags:
   *          - Create Page in Page Master Table
   *      parameters:
   *          - in: body
   *            name: Admin LogIn
   *            description: LogIn Data
   *            schema:
   *              type: object
   *              required:
   *                 - pageName
   *                 - pageType
   *                 - description
   *                 - createBy
   *              properties:
   *                  pageName:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: max
   *                      example: Tia Images
   *                  pageType:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 100
   *                      example: Android
   *                  description:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: max
   *                      example: Description
   *                  createBy:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 255
   *                      example: "0x4E3094C7FF08532F42819D563A09740B1F518F56025ABE51890CE3AE55F16E91"
   *      responses:
   *          '200':
   *              description: Create Successfully
   *          '404' :
   *              description: User not Found
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async pageCreate(req: Request, res: Response): Promise<any> {
    let pageData: Page = {
      PageName: req.body.pageName,
      PageType: req.body.pageType,
      Description: req.body.description,
      CreateBy: req.body.createBy,
    };

    try {
      this.pageService.validatePageCreate(pageData).then((data) => {
        this.logger.log({
          level: "info",
          message: data.Message,
          apiURL: this.appConfig.host + req.originalUrl,
        });
        return res.status(200).send(data);
      });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  // Update the page details by PageID.
  @route("/update")
  /**
   * @swagger
   * /api/page/update:
   *   post:
   *      description: Update Page
   *      tags:
   *          - Update Page By ID
   *      parameters:
   *          - in: body
   *            name: Admin LogIn
   *            description: LogIn Data
   *            schema:
   *              type: object
   *              required:
   *                 - pageID
   *                 - pageName
   *                 - pageType
   *                 - description
   *                 - createBy
   *              properties:
   *                  pageID:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 255
   *                      example: "0x4E3094C7FF08532F42819D563A09740B1F518F56025ABE51890CE3AE55F16E91"
   *                  pageName:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: max
   *                      example: Tia Images
   *                  pageType:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 100
   *                      example: Android
   *                  description:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: max
   *                      example: Description
   *                  createBy:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 255
   *                      example: "0x4E3094C7FF08532F42819D563A09740B1F518F56025ABE51890CE3AE55F16E91"
   *      responses:
   *          '200':
   *              description: Create Successfully
   *          '404' :
   *              description: User not Found
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async pageUpdate(req: Request, res: Response): Promise<any> {
    let pageData: Page = {
      ID: req.body.pageID,
      PageName: req.body.pageName,
      PageType: req.body.pageType,
      Description: req.body.description,
      CreateBy: req.body.createBy,
    };
    try {
      this.pageService.validatePageUpdate(pageData).then((data) => {
        this.logger.log({
          level: "info",
          message: data.Message,
          apiURL: this.appConfig.host + req.originalUrl,
        });
        return res.status(200).send(data);
      });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  @route("/delete")
  /**
   * @swagger
   * /api/page/delete:
   *   post:
   *      description: delete page by id
   *      tags:
   *          - delete page by id
   *      parameters:
   *          - in: body
   *            name: delete page by id
   *            description: delete page by id
   *            schema:
   *              type: object
   *              required:
   *                 - id
   *              properties:
   *                  id:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 64
   *                      example: abc
   *      responses:
   *          '200':
   *              description: Record has been deleted successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async delete(req: Request, res: Response): Promise<any> {
    try {
      this.pageService
        .delete(req.body.id)
        .then((response) => {
          this.logger.log({
            level: "info",
            message: response.Message,
            apiURL: this.appConfig.host + req.originalUrl,
          });
          return res.status(200).send(response);
        })
        .catch((error) => {
          this.appException.handleException(error, res);
        });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  @route("/activate")
  /**
   * @swagger
   * /api/page/activate:
   *   post:
   *      description: activate page by id
   *      tags:
   *          - activate page by id
   *      parameters:
   *          - in: body
   *            name: activate page by id
   *            description: activate page by id
   *            schema:
   *              type: object
   *              required:
   *                 - id
   *              properties:
   *                  id:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 64
   *                      example: abc
   *      responses:
   *          '200':
   *              description:  Record has been activated successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async activate(req: Request, res: Response): Promise<any> {
    try {
      this.pageService
        .activate(req.body.id)
        .then((response) => {
          this.logger.log({
            level: "info",
            message: response.Message,
            apiURL: this.appConfig.host + req.originalUrl,
          });
          return res.status(200).send(response);
        })
        .catch((error) => {
          this.appException.handleException(error, res);
        });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  @route("/deactivate")
  /**
   * @swagger
   * /api/page/deactivate:
   *   post:
   *      description: deactivate page by id
   *      tags:
   *          - deactivate page by id
   *      parameters:
   *          - in: body
   *            name: deactivate page by id
   *            description: deactivate page by id
   *            schema:
   *              type: object
   *              required:
   *                 - id
   *              properties:
   *                  id:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 64
   *                      example: abc
   *      responses:
   *          '200':
   *              description:  Record has been deactivated successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async deactivate(req: Request, res: Response): Promise<any> {
    try {
      this.pageService
        .deactivate(req.body.id)
        .then((response) => {
          this.logger.log({
            level: "info",
            message: response.Message,
            apiURL: this.appConfig.host + req.originalUrl,
          });
          return res.status(200).send(response);
        })
        .catch((error) => {
          this.appException.handleException(error, res);
        });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }
}

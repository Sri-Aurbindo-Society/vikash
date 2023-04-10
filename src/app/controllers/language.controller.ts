import { before, controller, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import { ApiResponse } from "../interface/apiResponse";
import BaseController from "./base.controller";

@route("/api/languages")
export default class LanguagesController extends BaseController {
  languagesService: any;
  appException: any;
  response: any;
  appConfig: any;

  constructor(languagesService, appConfig, appException) {
    super();

    this.languagesService = languagesService;
    this.appException = appException;
    this.appConfig = appConfig;
  }

  @route("/list")
  /**
   * @swagger
   * /api/languages/list:
   *   get:
   *      description: Used to get all students data
   *      tags:
   *          - Get all languages
   *      responses:
   *          '200':
   *              description: Resource Fetch successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  @GET()
  async getAllAsync(req: Request, res: Response): Promise<any> {
    try {
      var languages = this.languagesService.getAllAsync();
      return languages
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

  /*
    function :id
    Update By: Ajay 03, September 2022.
  */
  @route("/:id")
  /**
   * @swagger
   * /api/languages/{id}:
   *   get:
   *      description: Used to get all students data
   *      tags:
   *          - Get single languages
   *      parameters:
   *          - in: path
   *            name: id
   *            description: language data
   *            schema:
   *              type: object
   *              required:
   *                - id
   *              properties:
   *                  id:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 1000
   *                      example: 12
   *      responses:
   *          '200':
   *              description: Resource Fetch successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  @GET()
  async getSingle(req: Request, res: Response): Promise<any> {
    try {
      this.languagesService
        .getSingleAsync(req.params.id)
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
}

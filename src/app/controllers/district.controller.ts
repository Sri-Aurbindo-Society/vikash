import { before, controller, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import { ApiResponse } from "../interface/apiResponse";
import BaseController from "./base.controller";

@route("/api/district")
export default class DistrictController extends BaseController {
  districtService: any;
  appException: any;
  response: any;
  appConfig: any;

  constructor(districtService, appConfig, appException) {
    super();

    this.districtService = districtService;
    this.appException = appException;
    this.appConfig = appConfig;
  }

  @route("/list")
  /**
   * @swagger
   * /api/district/list:
   *   get:
   *      description: Used to get all students data
   *      tags:
   *          - Get all district
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
      var district = this.districtService.getAllAsync();
      return district
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
   * /api/district/{id}:
   *   get:
   *      description: Used to get all students data
   *      tags:
   *          - Get single district
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
      this.districtService
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

  /*
    function : filterByStateID
    Update By: Ajay 31, March 2023.
  */
  @route("/filterByStateID")
  /**
   * @swagger
   * /api/district/filterByStateID:
   *   post:
   *      description: filter by State ID
   *      tags:
   *          - Filter by State ID
   *      parameters:
   *          - in: body
   *            name: Filter by State ID
   *            description: Filter by State ID
   *            schema:
   *              type: object
   *              required:
   *                 - StateID
   *              properties:
   *                  StateID:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 50
   *                      example: 09140800406

   *      responses:
   *          '200':
   *              description: Resource Fetch successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  @POST()
  async filterByStateID(req: Request, res: Response): Promise<any> {
    try {
      this.districtService
        .filterByStateID(req.body)
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

import { before, controller, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import { ApiResponse } from "../interface/apiResponse";
import BaseController from "./base.controller";

@route("/api/school")
export default class SchoolController extends BaseController {
  schoolService: any;
  appException: any;
  response: any;
  appConfig: any;

  constructor(schoolService, appConfig, appException) {
    super();

    this.schoolService = schoolService;
    this.appException = appException;
    this.appConfig = appConfig;
  }

  @route("/list")
  /**
   * @swagger
   * /api/school/list:
   *   get:
   *      description: Used to get all students data
   *      tags:
   *          - Get all school
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
      var school = this.schoolService.getAllAsync();
      return school
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
   * /api/school/{id}:
   *   get:
   *      description: Used to get all students data
   *      tags:
   *          - Get single school
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
      this.schoolService
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
    function : filterByUdiseCode
    Update By: Ajay 31, March 2023.
  */
  @route("/filterByUdiseCode")
  /**
   * @swagger
   * /api/school/filterByUdiseCode:
   *   post:
   *      description: filter by UdiseCode
   *      tags:
   *          - Filter by UdiseCode
   *      parameters:
   *          - in: body
   *            name: Filter by UdiseCode
   *            description: Filter by UdiseCode
   *            schema:
   *              type: object
   *              required:
   *                 - UDiseCode
   *              properties:
   *                  UDiseCode:
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
  async filterByUdiseCode(req: Request, res: Response): Promise<any> {
    try {
      this.schoolService
        .filterByUdiseCode(req.body)
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
    function : filterByStateDistrict
    Update By: Ajay 31, March 2023.
  */
  @route("/filterByStateDistrict")
  /**
   * @swagger
   * /api/school/filterByStateDistrict:
   *   post:
   *      description: filter by State ID and District ID
   *      tags:
   *          - Filter by State ID and District ID
   *      parameters:
   *          - in: body
   *            name: Filter by State ID and District ID
   *            description: Filter by State ID and District ID
   *            schema:
   *              type: object
   *              required:
   *                 - StateID
   *                 - DistrictID
   *              properties:
   *                  StateID:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 50
   *                      example: 09140800406
   *                  DistrictID:
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
  async filterByStateDistrict(req: Request, res: Response): Promise<any> {
    try {
      this.schoolService
        .filterByStateDistrict(req.body)
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

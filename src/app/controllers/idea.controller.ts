import { before, controller, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import { ApiResponse } from "../interface/apiResponse";
import { Idea } from "../interface/idea";
import BaseController from "./base.controller";

@route("/api/idea")
export default class IdeaController extends BaseController {
  ideaService: any;
  appException: any;
  response: any;
  appConfig: any;

  constructor(ideaService, appConfig, appException) {
    super();

    this.ideaService = ideaService;
    this.appException = appException;
    this.appConfig = appConfig;
  }

  @route("/list")
  /**
   * @swagger
   * /api/idea/list:
   *   get:
   *      description: Used to get all idea
   *      tags:
   *          - Get all idea
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
      var idea = this.ideaService.getIdeaList();
      return idea
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
   * /api/idea/{id}:
   *   get:
   *      description: Used to get all students data
   *      tags:
   *          - Get single idea
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
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @GET()
  async getSingle(req: Request, res: Response): Promise<any> {
    try {
      this.ideaService
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

  // Login with contact
  // In response api will provide "OTP"
  @route("/submitIdea")
  /**
   * @swagger
   * /api/idea/submitIdea:
   *   post:
   *      description: submit new idea
   *      tags:
   *          - submit new idea
   *      parameters:
   *          - in: body
   *            name: submit new idea
   *            description: submit new idea
   *            schema:
   *              type: object
   *              required:
   *                 - title
   *                 - description
   *                 - link
   *                 - file
   *              properties:
   *                  title:
   *                      type: string
   *                  description:
   *                      type: string
   *                  link:
   *                      type: string
   *                  file:
   *                      type: string
   *
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
  async submitNewIdea(req: Request, res: Response): Promise<any> {
    try {
      let postData: Idea = {
        Title: req.body.title,
        Description: req.body.description,
        Link: req.body.link,
        File: req.body.file,
      };

      this.ideaService.addNew(postData).then((data) => {
        res.status(200).send(data);
      });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  @route("/delete")
  /**
   * @swagger
   * /api/idea/delete:
   *   post:
   *      description: delete idea by id
   *      tags:
   *          - delete idea by id
   *      parameters:
   *          - in: body
   *            name: delete idea by id
   *            description: delete idea by id
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
   *              description: Logged IN successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async deleteIdea(req: Request, res: Response): Promise<any> {
    try {
      this.ideaService
        .delete(req.body)
        .then((response) => {
          return res
            .status(200)
            .json({ message: "Idea is deleted successfully." });
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
   * /api/idea/activate:
   *   post:
   *      description: activate idea by id
   *      tags:
   *          - activate idea by id
   *      parameters:
   *          - in: body
   *            name: activate idea by id
   *            description: activate idea by id
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
   *              description: Logged IN successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async activate(req: Request, res: Response): Promise<any> {
    try {
      this.ideaService
        .activate(req.body)
        .then((response) => {
          return res
            .status(200)
            .json({ message: "Idea is activated successfully." });
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
   * /api/idea/deactivate:
   *   post:
   *      description: deactivate idea by id
   *      tags:
   *          - deactivate idea by id
   *      parameters:
   *          - in: body
   *            name: deactivate idea by id
   *            description: deactivate idea by id
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
   *              description: Logged IN successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async deactivate(req: Request, res: Response): Promise<any> {
    try {
      this.ideaService
        .deactivate(req.body)
        .then((response) => {
          return res
            .status(200)
            .json({ message: "Idea is deactivated successfully." });
        })
        .catch((error) => {
          this.appException.handleException(error, res);
        });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }
}

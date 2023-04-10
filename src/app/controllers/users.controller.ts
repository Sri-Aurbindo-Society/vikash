import { before, controller, GET, POST, route } from "awilix-express";
import { Request, Response } from "express";
import BaseController from "./base.controller";
import verifyAuthorization from "../middlewares/verifyAuthorization";
import VerifyTokenMiddleware from "../middlewares/verifyToken";
import axios from "axios";
import urlencode from "rawurlencode";

import JWTHelper from "../helpers/jwt.helper";
import { User } from "../interface/user";
import { ApiResponse } from "../interface/apiResponse";

@route("/api/users")
export default class UsersController extends BaseController {
  usersService: any;
  appException: any;
  response: any;
  JWTHelper: any;
  appConfig: any;
  //verifyToken: any;

  constructor(usersService, appConfig, appException) {
    super();

    this.usersService = usersService;
    this.appException = appException;
    this.JWTHelper = new JWTHelper();
    this.appConfig = appConfig;
  }

  @route("/list")
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @GET()
  async getAllAsync(req: Request, res: Response): Promise<any> {
    try {
      var users = this.usersService.getAllAsync();
      return users
        .then((response) => {
          response = this.convertProperResponse(response);
          return res.status(200).json(response);
        })
        .catch((error) => {
          this.appException.handleException(error, res);
        });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  @route("/getRoleList")
  /**
   * @swagger
   * /api/users/getRoleList:
   *   get:
   *      description: Used to get all user roles
   *      tags:
   *          - Get all roles
   *      responses:
   *          '200':
   *              description: Resource Fetch successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  @GET()
  async getRoleList(req: Request, res: Response): Promise<any> {
    try {
      var languages = this.usersService.getRoleList();
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
  @GET()
  async getSingle(req: Request, res: Response): Promise<any> {
    try {
      this.usersService
        .getSingleAsync(req.params.id)
        .then((response) => {
          response[0].Password = this.__convert_hash(response[0].Password);
          if (Boolean(response)) {
            response = this.convertProperResponse(response);
            return res.status(200).json(response);
          } else {
            return res.status(400).json({
              message: "Error!...",
            });
          }
        })
        .catch((error) => {
          this.appException.handleException(error, res);
        });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  // New User Registration
  @route("/register")
  @POST()
  async register(req: Request, res: Response): Promise<any> {
    try {
      let userData: User = {
        Username: req.body.username,
        Name: req.body.name,
        SchoolID: req.body.schoolID,
        StateID: req.body.stateID,
        BoardID: req.body.boardID,
        GradeID: req.body.gradeID,
        SubjectID: req.body.subjectID,
        RoleID: req.body.roleID,
        UdiseCode: req.body.udiseCode,
        Profile: req.body.profilePic,
      };

      this.usersService.validateUserData(userData).then((data) => {
        data.Result = this.convertProperResponse(data.Result);
        res.status(200).send(data);
      });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  // Login with contact
  // In response api will provide "OTP"
  @route("/loginWithOtp")
  @POST()
  async loginWithOtp(req: Request, res: Response): Promise<any> {
    try {
      let userData: User = {
        Name: req.body.username,
        Username: req.body.username,
        Contact: req.body.username,
      };

      this.usersService.validateLoginWithOtp(userData).then((data) => {
        //res.status(200).send(data);

        const sms_user = this.appConfig.sms_user;
        const sms_pass = this.appConfig.sms_pass;
        const sms_senderid = this.appConfig.sms_senderid;
        const sms_templateid = this.appConfig.sms_templateid;
        const otp = data.Result;

        const sms_text = urlencode(
          `Dear User, Your Auro scholar OTP is ${otp}. Use this to verify your mobile number. AURO-SCHOLAR.2hf23mGvrVO`
        );

        const url = `http://www.smsjust.com/blank/sms/user/urlsms.php?username=${sms_user}&pass=${sms_pass}&senderid=${sms_senderid}&dest_mobileno=${userData.Contact}&message=${sms_text}&response=Y&dlttempid=${sms_templateid}`;

        axios.get(url).then((resp) => {
          res.status(200).send(data);
        });
      });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  // Verify OTP
  // In response api will provide OTP is verified or not
  @route("/verifyOTP")
  /**
   * @swagger
   * /api/users/verifyOTP:
   *   post:
   *      description: verify otp
   *      tags:
   *          - Verify otp
   *      parameters:
   *          - in: body
   *            name: Verify OTP
   *            description: Login credentials
   *            schema:
   *              type: object
   *              required:
   *                 - username
   *                 - otp
   *              properties:
   *                  username:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 50
   *                      example: 9897567615
   *                  otp:
   *                      type: integer
   *                      minLength: 6
   *                      maxLength: 6
   *                      example: 767687
   *      responses:
   *          '200':
   *              description: Logged IN successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  @POST()
  async verifyOTP(req: Request, res: Response): Promise<any> {
    try {
      this.usersService.verifyOTP(req.body).then((data) => {
        data.Result = this.convertProperResponse(data.Result);
        res.status(200).send(data);
      });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  @route("/admin_login")
  @POST()
  async admin_login(req: Request, res: Response): Promise<any> {
    let userData: {
      userName: string;
      password: string;
      languageId: string;
    } = {
      userName: req.body.userName,
      password: req.body.password,
      languageId: req.body.languageId,
    };

    try {
      this.usersService.validateAdminLogin(userData).then((data) => {
        data.result = this.convertProperResponse(data.result);
        res.status(200).send(data);
      });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  @route("/delete")
  @POST()
  async deleteUser(req: Request, res: Response): Promise<any> {
    try {
      return this.usersService
        ._deleteUser(req.body)
        .then((response) => {
          return res.status(200).json({
            message: "User is deleted successfully.",
          });
        })
        .catch((error) => {
          this.appException.handleException(error, res);
        });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  @route("/activate")
  @POST()
  async activateUser(req: Request, res: Response): Promise<any> {
    try {
      return this.usersService
        ._activateUser(req.body)
        .then((response) => {
          return res.status(200).json({
            message: "User is activated successfully.",
          });
        })
        .catch((error) => {
          this.appException.handleException(error, res);
        });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  @route("/deactivate")
  @POST()
  async deactivateUser(req: Request, res: Response): Promise<any> {
    try {
      return this.usersService
        ._deactivateUser(req.body)
        .then((response) => {
          return res.status(200).json({
            message: "User is deactivated successfully.",
          });
        })
        .catch((error) => {
          this.appException.handleException(error, res);
        });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  @route("/getPageWiseRecords")
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async getPageWiseRecords(req: Request, res: Response): Promise<any> {
    try {
      var admins = this.usersService.getPagedAsync(req.body);
      return admins
        .then((response) => {
          response.result = this.convertProperResponse(response.result);
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

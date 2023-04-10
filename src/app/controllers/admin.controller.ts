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

@route("/api/admin")
export default class AdminController extends BaseController {
  adminService: any;
  appException: any;
  response: any;
  JWTHelper: any;
  appConfig: any;
  verifyToken: any;

  constructor(adminService, appConfig, appException) {
    super();

    this.adminService = adminService;
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
   * /api/admin/list:
   *   get:
   *      description: Used to get all admin data
   *      tags:
   *          - Get all Admin List
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
      var admin = this.adminService.getAllAsync();
      return admin
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

  @route("/verify/:id/:token")
  //@before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @GET()
  async verifyMail(req: Request, res: Response): Promise<any> {
    try {
      this.adminService.changeStatus(req.params.id).then((resp) => {
        return res.status(200).json(resp);
      });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }
  @route("/forgotPassword/:id")
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @GET()
  async forgotPasswordForm(req: Request, res: Response): Promise<any> {
    try {
      console.log(req.params.id);
      const htmlText = `<!DOCTYPE html>
<html>
<head>
<style>
body {
  margin: 0;
  padding: 0;
  background-color: #17a2b8;
  height: 100vh;
}
#login .container #login-row #login-column #login-box {
  margin-top: 120px;
  max-width: 600px;
  height: 320px;
  border: 1px solid #9C9C9C;
  background-color: #EAEAEA;
}
#login .container #login-row #login-column #login-box #login-form {
  padding: 20px;
}
#login .container #login-row #login-column #login-box #login-form #register-link {
  margin-top: -85px;
}
</style>
</head>
<link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">
<script src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<!------ Include the above in your HEAD tag ---------->

<body>
   <script type="text/javascript">
      function myFunction() {
        //alert(document.getElementById("newpassword").value);
        alert("hsjhjh");
        //document.getElementById("demo").innerHTML = "Hello World";

        var apiUrl = "http://192.168.0.173:3005/api/admin/resetPassword";
        fetch(apiUrl, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            adminID:
             "${req.body.id}",
            password: document.getElementById("newpassword").value,
          }),
        })
          .then((response) =>response.json())
          .then((response) => console.log(JSON.stringify(response)));
      
      }
    </script>
    <div id="reset">
        <h3 class="text-center text-white pt-5">Reset Password</h3>
        <div class="container">
            <div id="login-row" class="row justify-content-center align-items-center">
                <div id="login-column" class="col-md-6">
                    <div id="login-box" class="col-md-12">
                        <form id="login-form" class="form" action="" method="post">
                            <h3 class="text-center text-info">Reset Password</h3>
                            <div class="form-group">
                                <label for="newpassword" class="text-info">New Password:</label><br>
                                <input type="text" name="newpassword" id="newpassword" class="form-control">
                            </div>
                        
                            </div>
                            <div class="form-group">
                                <button onclick="myFunction()">Reset Password</button>
                            </div>
                          
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`;
      this.logger.log({
        level: "info",
        message: "click successfully",
        apiURL: this.appConfig.host + req.originalUrl,
      });
      return res.status(200).send(htmlText);
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  @route("/:id")
  /**
   * @swagger
   * /api/admin/{id}:
   *   get:
   *      description: Used to get all details of individual User
   *      tags:
   *          - Get single admin
   *      parameters:
   *          - in: path
   *            name: id
   *            description: admin data
   *            schema:
   *              type: object
   *              required:
   *                - id
   *              properties:
   *                  id:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 1000
   *                      example: 0x26D6A8AD97C75FFC548F6873E5E93CE475479E3E1A1097381E54221FB53EC1D2
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
      this.adminService
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

  // New Admin Registration
  // In response api will provide response like Already Exists user or register successfully
  @route("/register")
  /**
   * @swagger
   * /api/admin/register:
   *   post:
   *      description: Admin Registration
   *      tags:
   *          - Admin Registration
   *      parameters:
   *          - in: body
   *            name: Admin Registration
   *            description: Registration Data
   *            schema:
   *              type: object
   *              required:
   *                 - userName
   *                 - name
   *                 - email
   *                 - password
   *                 - createBy
   *              properties:
   *                  userName:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 20
   *                      example: ajay_1
   *                  name:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 50
   *                      example: ajay
   *                  email:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 100
   *                      example: ajay@gmail.com
   *                  password:
   *                      type: string
   *                      minLength: 6
   *                      maxLength: 20
   *                      example: 453563
   *                  createBy:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 1000
   *                      example: "0xC0BE1C3A6C350C3E99EDA16B314B888D52D6560543C9268FE26F2D711865BC93"
   *      responses:
   *          '200':
   *              description: Register Successfully
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async register(req: Request, res: Response): Promise<any> {
    try {
      let adminData: Admin = {
        UserName: req.body.userName,
        Name: req.body.name,
        Email: req.body.email,
        Password: req.body.password,
        AdminRoleID: req.body.adminRoleID,
        Mobile: req.body.gradeID,
        ProfilePic: req.body.profilePic,
        CreateBy: req.body.createBy,
      };
      this.adminService.validateAdminData(adminData).then(async (data) => {
        this.logger.log({
          level: "info",
          message: data.Message,
          apiURL: this.appConfig.host + req.originalUrl,
        });
        //  console.log(data);
        const { accessToken, refreshToken } =
          await this.JWTHelper.generateToken({
            data: {
              username: data.userName,
              email: data.email,
              name: data.name,
            },
          });
        if (data.ErrorCode == 200) {
          let htmlText = `<!DOCTYPE html>
<html>
<head>
<style>
body {
  background: #1488EA;
}

#card {
  position: relative;
  top: 110px;
  width: 320px;
  display: block;
  margin: auto;
  text-align: center;
  font-family: 'Source Sans Pro', sans-serif;
}

#upper-side {
  padding: 2em;
  background-color: #8BC34A;
  display: block;
  color: #fff;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
}

#checkmark {
  font-weight: lighter;
  fill: #fff;
  margin: -3.5em auto auto 20px;
}

#status {
  font-weight: lighter;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1em;
  margin-top: -.2em;
  margin-bottom: 0;
}

#lower-side {
  padding: 2em 2em 5em 2em;
  background: #fff;
  display: block;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
}

#message {
  margin-top: -.5em;
  color: #757575;
  letter-spacing: 1px;
}

#contBtn {
  position: relative;
  top: 1.5em;
  text-decoration: none;
  background: #8bc34a;
  color: #fff;
  margin: auto;
  padding: .8em 3em;
  -webkit-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.21);
  -moz-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.21);
  box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.21);
  border-radius: 25px;
  -webkit-transition: all .4s ease;
		-moz-transition: all .4s ease;
		-o-transition: all .4s ease;
		transition: all .4s ease;
}

#contBtn:hover {
  -webkit-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.41);
  -moz-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.41);
  box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.41);
  -webkit-transition: all .4s ease;
		-moz-transition: all .4s ease;
		-o-transition: all .4s ease;
		transition: all .4s ease;
}
</style>
</head>
<body>
<div id='card' class="animated fadeIn">
  <div id='upper-side'>
    <?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg version="1.1" id="checkmark" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" xml:space="preserve">
        <path d="M131.583,92.152l-0.026-0.041c-0.713-1.118-2.197-1.447-3.316-0.734l-31.782,20.257l-4.74-12.65
	c-0.483-1.29-1.882-1.958-3.124-1.493l-0.045,0.017c-1.242,0.465-1.857,1.888-1.374,3.178l5.763,15.382
	c0.131,0.351,0.334,0.65,0.579,0.898c0.028,0.029,0.06,0.052,0.089,0.08c0.08,0.073,0.159,0.147,0.246,0.209
	c0.071,0.051,0.147,0.091,0.222,0.133c0.058,0.033,0.115,0.069,0.175,0.097c0.081,0.037,0.165,0.063,0.249,0.091
	c0.065,0.022,0.128,0.047,0.195,0.063c0.079,0.019,0.159,0.026,0.239,0.037c0.074,0.01,0.147,0.024,0.221,0.027
	c0.097,0.004,0.194-0.006,0.292-0.014c0.055-0.005,0.109-0.003,0.163-0.012c0.323-0.048,0.641-0.16,0.933-0.346l34.305-21.865
	C131.967,94.755,132.296,93.271,131.583,92.152z" />
        <circle fill="none" stroke="#ffffff" stroke-width="5" stroke-miterlimit="10" cx="109.486" cy="104.353" r="32.53" />
      </svg>
      <h3 id='status'>
      Success
    </h3>
  </div>
  <div id='lower-side'>
    <p id='message'>
      Congratulations, your account has been successfully created.
    </p>
    <a href="http://localhost:3005/api/admin/verify/${data.Result}/${accessToken}" id="contBtn">Verify Mail</a>
  </div>
</div>
</body>
</html>

`;
          req.body.subject = "Register Successfully";
          this.sendVerificationMail(req.body, htmlText);
        }
        res.status(200).send(data);
      });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }
  async sendVerificationMail(data, htmlText): Promise<any> {
    try {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "vikasrawat530@gmail.com",
          pass: "gnvqvpsbbhndaqwf",
        },
      });

      const mailConfigurations = {
        // It should be a string of sender/server email
        from: "vikasrawat530@gmail.com",
        to: data.email,

        // Subject of Email
        subject: data.subject,

        // This would be the text of email body
        html: htmlText,
        //html: { path: "app/public/pages/emailWithPDF.html" },
      };

      transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);
        console.log(info);
      });
    } catch (error) {
      this.appException.handleException(error);
    }
  }

  //  Admin Login
  // In response api will provide , Either user credentials valid than return Loggin successfully with user details and accesstoken
  // or User Not Found message will return
  @route("/login")
  /**
   * @swagger
   * /api/admin/login:
   *   post:
   *      description: Admin LogIn
   *      tags:
   *          - Admin LogIn
   *      parameters:
   *          - in: body
   *            name: Admin LogIn
   *            description: LogIn Data
   *            schema:
   *              type: object
   *              required:
   *                 - userName
   *                 - password
   *              properties:
   *                  userName:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 20
   *                      example: ajay_1
   *                  password:
   *                      type: string
   *                      minLength: 6
   *                      maxLength: 20
   *                      example: 453563
   *      responses:
   *          '200':
   *              description: LogIn Successfully
   *          '404' :
   *              description: User not Found
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async login(req: Request, res: Response): Promise<any> {
    let adminData: {
      userName: string;
      password: string;
    } = {
      userName: req.body.userName,
      password: req.body.password,
    };

    try {
      this.adminService.validateAdminLogin(adminData).then((data) => {
        this.logger.log({
          level: "info",
          message: data.message,
          apiURL: this.appConfig.host + req.originalUrl,
        });
        return res.status(200).send(data);
      });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }

  //  Admin Forgot Password
  // In response api will provide a link in mail if email is verified for reset password .
  @route("/forgotPassword")
  /**
   * @swagger
   * /api/admin/forgotPassword:
   *   post:
   *      description: Admin Forgot Password
   *      tags:
   *          - Admin Forgot Password
   *      parameters:
   *          - in: body
   *            name: Admin Forgot Password
   *            description: Forgot Password by Email
   *            schema:
   *              type: object
   *              required:
   *                 - email
   *              properties:
   *                  email:
   *                      type: string
   *                      minLength: 1
   *                      maxLength: 100
   *                      example: vikaskumar@aurosociety.org
   *      responses:
   *          '200':
   *              description: Link send Successfully
   *          '404' :
   *              description: Email not Found or Email not Verified
   *          '500':
   *              description: Internal server error
   *          '400':
   *              description: Bad request
   */
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async forgotPassword(req: Request, res: Response): Promise<any> {
    let forgotPasswordData: {
      Email: string;
    } = {
      Email: req.body.email,
    };
    try {
      this.adminService
        .validateAdminForgotPassword(forgotPasswordData)
        .then((response) => {
          if (response.errors == undefined) {
            if (response.error == true) {
              this.logger.log({
                level: "info",
                message: response.message,
                apiURL: this.appConfig.host + req.originalUrl,
              });
              return res.status(response.errorCode).send(response);
            } else {
              response.result = this.convertProperResponse(response.result);
              req.body.adminID = response.result.adminid;
              req.body.subject = "Forgot Password";
              let htmlText = `<!DOCTYPE html>
<html>
<head>
<style>
body {
  background: #1488EA;
}

#card {
  position: relative;
  top: 110px;
  width: 320px;
  display: block;
  margin: auto;
  text-align: center;
  font-family: 'Source Sans Pro', sans-serif;
}

#upper-side {
  padding: 2em;
  background-color: #8BC34A;
  display: block;
  color: #fff;
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
}

#checkmark {
  font-weight: lighter;
  fill: #fff;
  margin: -3.5em auto auto 20px;
}

#status {
  font-weight: lighter;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1em;
  margin-top: -.2em;
  margin-bottom: 0;
}

#lower-side {
  padding: 2em 2em 5em 2em;
  background: #fff;
  display: block;
  border-bottom-right-radius: 8px;
  border-bottom-left-radius: 8px;
}

#message {
  margin-top: -.5em;
  color: #757575;
  letter-spacing: 1px;
}

#contBtn {
  position: relative;
  top: 1.5em;
  text-decoration: none;
  background: #8bc34a;
  color: #fff;
  margin: auto;
  padding: .8em 3em;
  -webkit-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.21);
  -moz-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.21);
  box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.21);
  border-radius: 25px;
  -webkit-transition: all .4s ease;
		-moz-transition: all .4s ease;
		-o-transition: all .4s ease;
		transition: all .4s ease;
}

#contBtn:hover {
  -webkit-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.41);
  -moz-box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.41);
  box-shadow: 0px 15px 30px rgba(50, 50, 50, 0.41);
  -webkit-transition: all .4s ease;
		-moz-transition: all .4s ease;
		-o-transition: all .4s ease;
		transition: all .4s ease;
}
</style>
</head>
<body>
<div id='card' class="animated fadeIn">
  <div id='upper-side'>
    <?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 17.1.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg version="1.1" id="checkmark" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" xml:space="preserve">
        <path d="M131.583,92.152l-0.026-0.041c-0.713-1.118-2.197-1.447-3.316-0.734l-31.782,20.257l-4.74-12.65
	c-0.483-1.29-1.882-1.958-3.124-1.493l-0.045,0.017c-1.242,0.465-1.857,1.888-1.374,3.178l5.763,15.382
	c0.131,0.351,0.334,0.65,0.579,0.898c0.028,0.029,0.06,0.052,0.089,0.08c0.08,0.073,0.159,0.147,0.246,0.209
	c0.071,0.051,0.147,0.091,0.222,0.133c0.058,0.033,0.115,0.069,0.175,0.097c0.081,0.037,0.165,0.063,0.249,0.091
	c0.065,0.022,0.128,0.047,0.195,0.063c0.079,0.019,0.159,0.026,0.239,0.037c0.074,0.01,0.147,0.024,0.221,0.027
	c0.097,0.004,0.194-0.006,0.292-0.014c0.055-0.005,0.109-0.003,0.163-0.012c0.323-0.048,0.641-0.16,0.933-0.346l34.305-21.865
	C131.967,94.755,132.296,93.271,131.583,92.152z" />
        <circle fill="none" stroke="#ffffff" stroke-width="5" stroke-miterlimit="10" cx="109.486" cy="104.353" r="32.53" />
      </svg>
      <h3 id='status'>
      Reset Password
    </h3>
  </div>
  <div id='lower-side'>
    <p id='message'>
      Click reset password link for reset the password.
    </p>
    <a href="http://localhost:3005/api/admin/forgotPassword/${req.body.adminID}" id="contBtn">Reset Password</a>
  </div>
</div>
</body>
</html>
`;
              this.logger.log({
                level: "info",
                message: response.message,
                apiURL: this.appConfig.host + req.originalUrl,
              });
              this.sendVerificationMail(req.body, htmlText);
              return res.status(200).send(response);
            }
          } else {
            return res.status(200).send(response);
          }
        });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }
  @route("/resetPassword")
  // @before([verifyAuthorization, new VerifyTokenMiddleware().verifyToken])
  @POST()
  async resetPassword(req: Request, res: Response): Promise<any> {
    let resetPasswordData: {
      password: string;
      adminID: string;
    } = {
      password: req.body.password,
      adminID: req.body.adminID,
    };
    try {
      this.adminService.resetPassword(resetPasswordData).then((response) => {
        this.logger.log({
          level: "info",
          message: response.message,
          apiURL: this.appConfig.host + req.originalUrl,
        });
        return res.status(response.errorCode).send(response);
      });
    } catch (error) {
      this.appException.handleException(error, res);
    }
  }
}

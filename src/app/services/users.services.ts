import BaseService from "./base.service";
import Validator from "validatorjs";
import bcryptjs from "bcryptjs";
import loginRule from "../validations/login.rule";
import registerRule from "../validations/registration.rule";
import JWTHelper from "../helpers/jwt.helper";
import emailvalidator from "email-validator";
import { User } from "../interface/user";
import axios from "axios";
import verifyOtpRule from "../validations/verifyOtp.rule";

export default class UsersService extends BaseService {
  response: any;
  usersRepository: any;
  usersModel: any;
  JWTHelper: any;

  constructor(usersRepository, usersModel) {
    super();
    this.usersRepository = usersRepository;
    this.usersModel = usersModel;
    this.JWTHelper = new JWTHelper();

    this.usersRepository.tableName = "UserMaster";
    this.usersRepository.procedureName = "spUserMaster";
    this.usersRepository.primaryKey = "UserID";
    this.usersRepository.ACTION = "INSERT";
  }

  async getAllAsync() {
    return await this.usersRepository.getAllRecords();
  }

  async getAllAdmins() {
    return await this.usersRepository.getAllAdmins();
  }

  async getSingleAsync(id: string) {
    return await this.usersRepository.getRecordById(id);
  }

  async getSingleAsyncUserName(userName: string) {
    return await this.usersRepository.getRecordByUserName(userName);
  }

  async getSingleAsyncUserID(userID: string) {
    return await this.usersRepository.getRecordByuserid(userID);
  }

  async getTableRecords(tableName: string) {
    return await this.usersRepository.getRecordByTable(tableName);
  }

  async getRecordSingleUser(userID) {
    return await this.usersRepository.getuserTypeID(userID);
  }

  // Validate Mobile
  async validateMobile(userData: { userName: string }): Promise<any> {
    var filter =
      /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;

    if (filter.test(userData.userName)) {
      if (userData.userName.length == 10) {
        var validate = true;
      } else {
        var validate = false;
      }
    } else {
      var validate = false;
    }

    return {
      success: validate,
    };
  }

  // Validate login data and make login
  async validateAndLogin(loginData: {
    username: string;
    password: string;
  }): Promise<any> {
    let validation = new Validator(loginData, loginRule);

    if (validation.passes()) {
      return this.usersRepository
        .isUserExists(loginData.username)
        .then(async (result) => {
          if (result.data.length <= 0) return "Email is not found";

          let user = result.data[0];
          const validPassword = await bcryptjs.compare(
            loginData.password,
            user.password
          );
          if (!validPassword) return "Invalid Password";

          const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
          };

          const { accessToken, refreshToken } =
            await this.JWTHelper.generateToken(userData);

          return {
            status: "Logged in successfully.",
            accessToken: accessToken,
            refreshToken: refreshToken,
            success: true,
          };
        });
    } else {
      return validation.errors;
    }
  }

  // Validate all login data and make login
  async validateAdminLogin(loginData: {
    userName: string;
    password: string;
    languageId: string;
  }): Promise<any> {
    let validation = new Validator(loginData, loginRule);

    if (validation.passes()) {
      return this.usersRepository
        .checkAdminExists(loginData)
        .then(async (result) => {
          if (result.data.length <= 0) {
            this.response = {
              status: "error",
              message: "Error! User not found",
              error: true,
              errorcode: "0000",
              result: {},
            };

            return this.response;
          }
          let user = result.data[0];
          const userData = {
            id: user.UserID,
            name: loginData.userName,
            email: user.EmailID,
          };

          const { accessToken, refreshToken } =
            await this.JWTHelper.generateToken(userData);

          this.response = {
            status: "success",
            error: false,
            errorcode: "0000",
            message: "Logged in successfully.",
            accessToken: accessToken,
            refreshToken: refreshToken,
            result: {
              userId: this.__convert_hash(user.UserID),
              name: loginData.userName,
              email: user.EmailID,
            },
          };

          return this.response;
        });
    } else {
      return validation.errors;
    }
  }

  // Validate register data and if find 'OK' then
  // Register as a new user
  async validateUserData(data: User): Promise<any> {
    let validation = new Validator(data, registerRule);

    if (validation.passes()) {
      this.usersModel.username = data.Username;
      this.usersModel.name = data.Name;
      this.usersModel.schoolID = data.SchoolID;
      this.usersModel.stateID = data.StateID;
      this.usersModel.boardID = data.BoardID;
      this.usersModel.gradeID = data.GradeID;
      this.usersModel.subjectID = data.SubjectID;
      this.usersModel.udiseCode = data.UdiseCode;
      this.usersModel.createBy =
        "0x6730ADA6BEA6FA8C20764A11FD19E6C3A576C635BD4D3AC2D1009C621FDC1B65";

      return this.usersRepository
        .checkAndRegisterUser(this.usersModel, data)
        .then(async (result) => {
          return result;
        });
    } else {
      return validation.errors;
    }
  }

  // Validate user while login with OTP
  // Login user
  async validateLoginWithOtp(data: User): Promise<any> {
    let validation = new Validator(data, loginRule);

    if (validation.passes()) {
      this.usersModel.username = data.Username;
      this.usersModel.contact = data.Contact;
      this.usersModel.name = data.Name;
      this.usersModel.createBy =
        "0x6730ADA6BEA6FA8C20764A11FD19E6C3A576C635BD4D3AC2D1009C621FDC1B65";

      return this.usersRepository
        .checkAndLoginUser(this.usersModel, data)
        .then(async (result) => {
          return result;
        });
    } else {
      return validation.errors;
    }
  }

  // Verify OTP
  async verifyOTP(data: any): Promise<any> {
    let validation = new Validator(data, verifyOtpRule);

    if (validation.passes()) {
      return this.usersRepository.verifyOTP(data).then(async (result) => {
        return result;
      });
    } else {
      return validation.errors;
    }
  }

  // Verify OTP
  async getRoleList(): Promise<any> {
    return this.usersRepository.getRoleList().then(async (result) => {
      return result;
    });
  }

  // image Upload
  /*
   Module: User
   Function Name:imageUpload
   Description:  send data to user repository 
   Create Date: 26 August 2022
   Create By:  Vikas
   OutPut: 
  */
  async imageUpload(data) {
    return await this.usersRepository.imageUpload(data);
  }

  // Validate refresh token and if found true then generate new pair of access token and refresh token
  async refreshAccessToken(refreshToken): Promise<any> {
    try {
      return this.JWTHelper.verifyRefreshToken(refreshToken).then(
        async (data) => {
          if (data.error) return data;

          if (!data.error) {
            const user: {
              id: number;
              name: string;
              email: string;
            } = {
              id: data.userData.id,
              name: data.userData.name,
              email: data.userData.email,
            };

            const { accessToken } = await this.JWTHelper.generateAccessToken(
              user
            );

            return {
              status: "Access token are refreshed successfully.",
              accessToken: accessToken,
              success: true,
            };
          }
        }
      );
    } catch (error) {
      return error;
    }
  }

  async sendSMS(url): Promise<any> {
    axios.get(url).then((resp) => {
      return resp;
    });
  }
}

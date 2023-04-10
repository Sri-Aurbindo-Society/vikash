import BaseService from "./base.service";
import Validator from "validatorjs";
import bcryptjs from "bcryptjs";
import JWTHelper from "../helpers/jwt.helper";
import emailvalidator from "email-validator";
import { Admin } from "../interface/admin";
import adminRegistrationRule from "../validations/adminRegistration.rule";
import adminLogInRule from "../validations/adminLogIn.rule";
import axios from "axios";
import adminForgotPasswordRule from "../validations/adminForgotPassword.rule";

export default class AdminService extends BaseService {
  response: any;
  adminRepository: any;
  adminModel: any;
  JWTHelper: any;

  constructor(adminRepository, adminModel) {
    super();
    this.adminRepository = adminRepository;
    this.adminModel = adminModel;
    this.JWTHelper = new JWTHelper();

    this.adminRepository.tableName = "AdminMaster";
    this.adminRepository.procedureName = "spAdminMaster";
    this.adminRepository.primaryKey = "AdminID";
    this.adminRepository.ACTION = "INSERT";
  }

  async getAllAsync() {
    return await this.adminRepository.getAllRecords();
  }
  async getSingleAsync(id: string) {
    return await this.adminRepository.getRecordById(id);
  }
  // Validate register data and if find 'OK' then
  // Register as a new admin
  async validateAdminData(data: Admin): Promise<any> {
    let validation = new Validator(data, adminRegistrationRule);
    if (validation.passes()) {
      this.adminModel.username = data.UserName;
      this.adminModel.name = data.Name;
      this.adminModel.email = data.Email;
      this.adminModel.password = data.Password;
      this.adminModel.createBy = data.CreateBy;
      return this.adminRepository
        .checkAndRegisterAdmin(this.adminModel, data)
        .then(async (result) => {
          return result;
        });
    } else {
      return validation.errors;
    }
  }
  // Update the status after verify the email in admin master
  async changeStatus(data: any): Promise<any> {
    return this.adminRepository
      .changeStatus_VerifyMail(data)
      .then(async (result) => {
        return result;
      });
  }
  // Validate all login data and make login
  async validateAdminLogin(loginData: {
    userName: string;
    password: string;
  }): Promise<any> {
    let validation = new Validator(loginData, adminLogInRule);

    if (validation.passes()) {
      return this.adminRepository
        .checkAdminExists(loginData)
        .then(async (result) => {
          console.log(result.ErrorID);
          if (result.ErrorID == 404) {
            this.response = {
              status: "error",
              message: result.Message,
              error: true,
              errorcode: result.ErrorID,
              result: {},
            };
            return this.response;
          }
          const adminData = {
            adminID: this.__convert_hash(result.AdminID),
            name: loginData.userName,
            email: result.Email,
          };
          console.log(adminData);
          const { accessToken, refreshToken } =
            await this.JWTHelper.generateToken(adminData);

          this.response = {
            status: "success",
            error: false,
            errorcode: result.ErrorID,
            message: result.Message,
            result: {
              AdminID: adminData.adminID,
              RoleName: result.RoleName,
              UserName: loginData.userName,
              name: result.Name,
              email: result.Email,
              Mobile: result.Mobile,
              ProfilePic: result.ProfilePic,
              CStatus: result.CStatus,
            },
            accessToken: accessToken,
            refreshToken: refreshToken,
          };

          return this.response;
        });
    } else {
      return validation.errors;
    }
  }
  // Validate email and send link for forgot Password
  async validateAdminForgotPassword(forgotPasswordData: {
    Email: string;
  }): Promise<any> {
    let validation = new Validator(forgotPasswordData, adminForgotPasswordRule);

    if (validation.passes()) {
      return this.adminRepository
        .checkEmailVerified_Exists(forgotPasswordData)
        .then(async (result) => {
          return result;
        });
    } else {
      return validation.errors;
    }
  }

  // reset password after click on get link on email
  async resetPassword(resetPasswordData: {
    password: string;
    adminID: string;
  }): Promise<any> {
    return this.adminRepository
      .resetPassword(resetPasswordData)
      .then(async (result) => {
        return result;
      });
  }
}

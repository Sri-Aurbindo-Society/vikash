import CommonRepository from "./common.repository";
import sql from "mssql";
import AdminModel from "../models/admin.model";
import { Admin } from "../interface/admin";
import { ApiResponse } from "../interface/apiResponse";

export default class AdminRepository extends CommonRepository<AdminModel> {
  public db: any;

  constructor(database) {
    super(database);
    this.db = database;
  }
  public get tableName() {
    return this._TableName;
  }

  public set tableName(__TableName) {
    this._TableName = __TableName;
  }

  public get primaryKey() {
    return this._PrimaryKey;
  }

  public set primaryKey(__PrimaryKey) {
    this._PrimaryKey = __PrimaryKey;
  }

  // check user by userid
  async getRecordByuserid(userID): Promise<[]> {
    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection
          .request()
          .query(
            `select u.UserID, u.UserName, u.Password from UserMaster as u where UserID = ${userID}`
          );

        return result.recordset;
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllAdmins(): Promise<[]> {
    try {
      return this.db.connect().then(async (connection) => {
        const data = await connection.request()
          .query(`select UserID,Name,MobileNo,EmailID,dbo.fnGetStatus(status) as Status from UserMaster where
           UserTypeID = 0x577EF645DAEF3F15621C8BB625BCBE1E6DB46C4E8E2D901A4066EBE7691B088C`);

        return data.recordset;
      });
    } catch (error) {
      throw error;
    }
  }

  //imageUpload

  async imageUpload(data): Promise<any> {
    try {
      return this.db.connect().then(async (connection) => {
        const userID = await connection.request().query(
          `UPDATE UserMaster
           SET ProfilePicUrl = '${data.imagename}'
           where userID= ${data.userID}`
          //  where username= '${data.userName}'+'_p' or username = '${data.userName}'+'_s';`
        );
        return userID.rowsAffected[0];
      });
    } catch (error) {
      throw error;
    }
  }

  //changePassword

  async changePassword(data): Promise<any> {
    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection.request().query(
          `UPDATE UserMaster
           SET Password =  dbo.fnEncrypt('${data.password}'),
           UpdateDate=GETDATE(),
           updateby = ${data.userID}
           where userID= ${data.userID}`
        );
        //return false;
        return result.rowsAffected[0];
      });
    } catch (error) {
      throw error;
    }
  }

  isUserExists = async (userCheckData) => {
    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection
          .request()
          //.input("user_name", sql.NVarChar, userCheckData.userName)
          .query(
            `select UserID, UserName, EmailID, MobileNo, UserPin, userTypeID from UserMaster where (EmailID = '${userCheckData.userName}' or MobileNo = ${userCheckData.userName} or UserName like '${userCheckData.userName}%') and userTypeID  = ${userCheckData.userType}`
          );

        const len = {
          data: result.recordset,
          type: "registered_user",
        };

        if (result.length == 0) {
          const result = await connection
            .request()
            .input("user_name", sql.NVarChar, userCheckData.userName)
            .query(
              "select UnID, EmailID, MobileNo from PreRegistrationMaster where EmailID = @user_name or MobileNo = @user_name or UnID = @user_name"
            );

          const len = {
            data: result.recordset,
            type: "pre_registered_user",
          };
        }

        return len;
      });
    } catch (err) {
      return err;
    }
  };

  //just to verify in admin master table
  checkAdminExists = async (adminCheckData) => {
    try {
      return this.db.connect().then(async (connection) => {
        const query = ` spAdminLogin @Action = N'Login',@Password = N'${adminCheckData.password}',
                         @userName = N'${adminCheckData.userName}'`;
        const result = await connection.request().query(query);
        return result.recordset[0];
      });
    } catch (err) {
      return err;
    }
  };
  //just to change the status after verify the email in admin master table
  changeStatus_VerifyMail = async (adminID) => {
    try {
      return this.db.connect().then(async (connection) => {
        const query = ` update adminmaster set status = dbo.fnEncrypt('1')
                        where adminID = ${adminID}`;
        const result = await connection.request().query(query);
        if (result.rowsAffected > 0) {
          const response = {
            message:
              result.rowsAffected > 0
                ? "Email verified successfully"
                : "Email verification failed, possibly the link is invalid or expired",
            status: result.rowsAffected > 0 ? "Success" : "Failed",
            error: result.rowsAffected > 0 ? false : true,
            errorCode: result.rowsAffected > 0 ? 200 : 400,
          };
          return response;
        }
      });
    } catch (err) {
      return err;
    }
  };
  //just to verify email that exists and verified or not in admin master table
  checkEmailVerified_Exists = async (forgotPasswordData) => {
    try {
      return this.db.connect().then(async (connection) => {
        const query = `  select adminid,email,dbo.fnGetStatus(Status) as CStatus from adminMaster where Email = '${forgotPasswordData.Email}'`;
        const result = await connection.request().query(query);
        if (result.recordset.length == 0) {
          const response = {
            message: "Email is not registred with us",
            status: "Failed",
            error: true,
            errorCode: 404,
          };
          return response;
        }
        if (
          result.recordset.length > 0 &&
          result.recordset[0].CStatus == "Deactive"
        ) {
          const response = {
            message:
              "Your Email is not verified. Please contact with our administration.",
            status: "Failed",
            error: true,
            errorCode: 404,
          };
          return response;
        } else {
          const response = {
            message:
              "An email link has been sent. Please click the link when you get it.",
            status: "Success",
            error: false,
            errorCode: 200,
            result: result.recordset[0],
          };
          return response;
        }
      });
    } catch (err) {
      return err;
    }
  };
  //reset password after click on get link on email in admin master table
  resetPassword = async (data) => {
    try {
      return this.db.connect().then(async (connection) => {
        const query = ` update adminmaster set password = dbo.fnEncrypt('${data.password}')
                        where adminID = ${data.adminID}`;
        console.log(query);

        const result = await connection.request().query(query);
        const response = {
          message:
            result.rowsAffected > 0
              ? "Password reset successfully"
              : "Password reset failed",
          status: result.rowsAffected > 0 ? "Success" : "Failed",
          error: result.rowsAffected > 0 ? false : true,
          errorCode: result.rowsAffected > 0 ? 200 : 400,
        };
        return response;
      });
    } catch (err) {
      return err;
    }
  };
  getRecordsCount = async () => {
    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection
          .request()
          .query(
            `select count(*) as total_rows from ${this._TableName} where UserTypeID = 0x577EF645DAEF3F15621C8BB625BCBE1E6DB46C4E8E2D901A4066EBE7691B088C`
          );

        return result.recordset[0];
      });
    } catch (err) {
      return err;
    }
  };

  //Admin Registration Function => If userName already present in database
  //                 return error message -> UserName already exists otherwise insert the data .
  checkAndRegisterAdmin = async (adminModel: any, data: Admin) => {
    try {
      return this.db.connect().then(async (connection) => {
        let apiResponse: ApiResponse;
        const query = `select count(*) as total_rows, AdminID from ${this._TableName} where Username = '${data.UserName}' group by AdminID`;
        const result = await connection.request().query(query);
        if (result.recordset.length > 0) {
          apiResponse = {
            Status: "Error",
            Error: true,
            ErrorCode: "403",
            Message: "User is already exists...",
            Result: this.__convert_hash(result.recordset[0].AdminID),
          };
        } else {
          const result = await this.createRecord(adminModel);
          apiResponse = {
            Status: "Success",
            Error: false,
            ErrorCode: "200",
            Message: "Admin has been registered successfully.",
            Result: result.Result,
          };
        }
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };

  // checkAndLoginUser = async (usersModel: any, data: User) => {
  //   try {
  //     return this.db.connect().then(async (connection) => {
  //       let apiResponse: ApiResponse;

  //       const sqlQuery = `select count(*) as total_rows from ${this._TableName} where Username = '${data.Username}'`;

  //       const result = await connection.request().query(sqlQuery);

  //       const otp = Math.floor(100000 + Math.random() * 900000);
  //       usersModel.otp = otp;

  //       if (result.recordset[0].total_rows > 0) {
  //         const Query = `update ${this._TableName} set otp=${otp} where Username='${data.Username}'`;
  //         const results = await connection.request().query(Query);

  //         apiResponse = {
  //           Status: "Success",
  //           Error: false,
  //           ErrorCode: "0000",
  //           Message: "OTP has been send successfully.",
  //           Result: otp,
  //         };
  //       } else {
  //         const result = await this.createRecord(usersModel);
  //         apiResponse = {
  //           Status: "Success",
  //           Error: false,
  //           ErrorCode: "0000",
  //           Message: "OTP has been send successfully.",
  //           Result: otp,
  //         };
  //       }
  //       return apiResponse;
  //     });
  //   } catch (err) {
  //     return err;
  //   }
  // };
}

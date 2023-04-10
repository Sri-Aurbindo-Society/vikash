import CommonRepository from "./common.repository";
import sql from "mssql";
import UsersModel from "../models/users.model";
import { User } from "../interface/user";
import { ApiResponse } from "../interface/apiResponse";

export default class UsersRepository extends CommonRepository<UsersModel> {
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
  // Create Date: 23 August 2022
  //  Create By: Vikas
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
  // Create Date: 27 August 2022
  //  Create By: Vikas
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

  //just to verify in user master table
  checkAdminExists = async (userCheckData) => {
    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection
          .request()
          .input("user_name", sql.NVarChar, userCheckData.userName)
          .query(
            `select * from UserMaster as u 
            inner join UserTypeMaster as ut on (u.UserTypeID=ut.UserTypeID) 
            where u.UserName=@user_name and u.Password = dbo.fnEncrypt('${userCheckData.password}') 
            and ut.UserTypeName = 'ADMIN'`
          );

        const len = {
          data: result.recordset,
        };

        return len;
      });
    } catch (err) {
      return err;
    }
  };

  async getPageWiseRecords(offset = 0, records = 10, userTypeID): Promise<[]> {
    try {
      return this.db.connect().then(async (connection) => {
        const data = await connection.request()
          .query(`Select m.UserID, m.Name, m.MobileNo, m.EmailID, dbo.fnGetStatus(m.status) as CStatus from UserMaster as m
          where UserTypeID = ${userTypeID}
          order by m.CreateDate desc offset ${offset} rows fetch first ${records} rows only`);

        return data.recordset;
      });
    } catch (error) {
      throw error;
    }
  }

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

  checkAndRegisterUser = async (usersModel: any, data: User) => {
    try {
      return this.db.connect().then(async (connection) => {
        let apiResponse: ApiResponse;

        const result = await connection
          .request()
          .query(
            `select count(*) as total_rows, UserID from ${this._TableName} where Username = '${data.Username}' group by UserID`
          );

        if (result.recordset.length > 0 && result.recordset[0].total_rows > 0) {
          const UserID = this.__convert_hash(result.recordset[0].UserID);

          const sqlQuery = `update UserMaster set Name='${data.Name}', SchoolID=${data.SchoolID}, StateID=${data.StateID}, BoardID=${data.BoardID}, GradeID=${data.GradeID}, SubjectID=${data.SubjectID}, UdiseCode='${data.UdiseCode}', ProfilePic='${data.Profile}' where UserID=${UserID}`;
          //console.log(sqlQuery);

          const updated = await connection.request().query(sqlQuery);

          const results = await connection
            .request()
            .query(
              `select * from ${this._TableName} where Username='${data.Username}'`
            );

          apiResponse = {
            Status: "Error",
            Error: true,
            ErrorCode: "1001",
            Message: "User is already exists...",
            Result: results.recordset,
          };
        } else {
          const result = await this.createRecord(usersModel);
          apiResponse = {
            Status: "Success",
            Error: false,
            ErrorCode: "0000",
            Message: "User has been registered successfully.",
            Result: result,
          };
        }
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };

  checkAndLoginUser = async (usersModel: any, data: User) => {
    try {
      return this.db.connect().then(async (connection) => {
        let apiResponse: ApiResponse;

        const sqlQuery = `select count(*) as total_rows from ${this._TableName} where Username = '${data.Username}'`;

        const result = await connection.request().query(sqlQuery);

        const otp = Math.floor(100000 + Math.random() * 900000);
        usersModel.otp = otp;

        if (result.recordset[0].total_rows > 0) {
          const Query = `update ${this._TableName} set otp=${otp} where Username='${data.Username}'`;
          const results = await connection.request().query(Query);

          apiResponse = {
            Status: "Success",
            Error: false,
            ErrorCode: "0000",
            Message: "OTP has been send successfully.",
            Result: otp,
          };
        } else {
          const result = await this.createRecord(usersModel);
          apiResponse = {
            Status: "Success",
            Error: false,
            ErrorCode: "0000",
            Message: "OTP has been send successfully.",
            Result: otp,
          };
        }
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };

  verifyOTP = async (data: any) => {
    try {
      return this.db.connect().then(async (connection) => {
        let apiResponse: ApiResponse;

        const result = await connection
          .request()
          .query(
            `select count(*) as total_rows from ${this._TableName} where Username = '${data.username}' and otp=${data.otp}`
          );

        if (result.recordset[0].total_rows > 0) {
          const results = await connection
            .request()
            .query(
              `select * from ${this._TableName} where Username = '${data.username}' and otp=${data.otp}`
            );

          apiResponse = {
            Status: "Success",
            Error: false,
            ErrorCode: "0000",
            Message: "OTP has been verified successfully.",
            Result: results.recordset,
          };
        } else {
          apiResponse = {
            Status: "Error",
            Error: true,
            ErrorCode: "1000",
            Message: "OTP has not been verified.",
            Result: null,
          };
        }
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };

  getRoleList = async () => {
    try {
      return this.db.connect().then(async (connection) => {
        let apiResponse: ApiResponse;

        const result = await connection
          .request()
          .query(
            `select RoleID, RoleName, Image from RoleMaster where dbo.fnGetStatus(Status) = 'Active'`
          );

        apiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: "All user roles has been fetched successfully.",
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };
}

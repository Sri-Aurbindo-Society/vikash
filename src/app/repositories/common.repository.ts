import BaseRepository from "./base.repository";
import sql from "mssql";
import ApplicationException from "../Exceptions/application.exception";
import { ApiResponse } from "../interface/apiResponse";

export default class CommonRepository<T> implements BaseRepository<T> {
  public _TableName: string;
  public _ViewName: string;
  public _ProcedureName: string;
  public _PrimaryKey: string;
  public db: any;
  public appException: any;

  constructor(database) {
    this.db = database;
    this.appException = new ApplicationException();
  }

  //#region GETTER | SETTER
  public get tableName() {
    return this._TableName;
  }

  public set tableName(__TableName) {
    this._TableName = __TableName;
  }

  public get viewName() {
    return this._ViewName;
  }

  public set viewName(__ViewName) {
    this._ViewName = __ViewName;
  }

  public get primaryKey() {
    return this._PrimaryKey;
  }

  public set primaryKey(__PrimaryKey) {
    this._PrimaryKey = __PrimaryKey;
  }

  public get procedureName() {
    return this._ProcedureName;
  }

  public set procedureName(__ProcedureName) {
    this._ProcedureName = __ProcedureName;
  }

  //#endregion

  async getAllRecords(model: T): Promise<T[]> {
    try {
      return this.db.connect().then(async (connection) => {
        const sqlQuery = `select *,dbo.fnGetStatus(Status)CStatus from ${this._TableName} where dbo.fnGetStatus(Status) = 'Active' order by CreateDate desc`;
        console.log(sqlQuery);

        return connection
          .request()
          .query(sqlQuery)
          .then((data) => {
            let apiResponse: ApiResponse;
            return (apiResponse = {
              Status: "Success",
              Error: false,
              ErrorCode: "",
              Message: "All records has been fetched successfully...",
              Result: data.recordset,
            });
          });
      });
    } catch (error) {
      throw error;
    }
  }

  async getRecordById(id: string): Promise<T> {
    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection
          .request()
          .query(
            `select *,dbo.fnGetStatus(Status)CStatus from ${this._TableName} where ${this._PrimaryKey} = ${id}`
          );

        let apiResponse: ApiResponse;
        return (apiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "",
          Message: "Reuested data has been fetched successfully...",
          Result: result.recordset,
        });
      });
    } catch (error) {
      throw error;
    }
  }

  //#region CREATE | UPDATE | DELETE | DEACTIVE | ACTIVE
  async createRecord(record: T): Promise<any> {
    const recordKeyArray = Object.keys(record);
    const recordDataArray = Object.values(record);
    const recordDataJSON = JSON.stringify(record);

    var query: string = "";
    recordKeyArray.forEach((value, index) => {
      query +=
        value.replace("_", "@") +
        "=" +
        (recordDataArray[index] ? "N'" + recordDataArray[index] + "'" : null) +
        ",";
    });

    query = query.substring(0, query.length - 1);
    var sqlQuery: string = `${this._ProcedureName} @ACTION='INSERT', ${query}`;

    console.log(sqlQuery);

    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection.request().query(sqlQuery);
        // db output handling
        return this.appException.handleResultOutput(result, "inserted");
      });
    } catch (error) {
      throw error;
    }
  }

  async updateRecord(id: string, record: T): Promise<boolean> {
    const recordKeyArray = Object.keys(record);
    const recordDataArray = Object.values(record);

    var query: string = "";

    recordKeyArray.forEach((value, index) => {
      query +=
        value.replace("_", "@") +
        "=" +
        (recordDataArray[index] ? "N'" + recordDataArray[index] + "'" : null) +
        ",";
    });

    query = query.substring(0, query.length - 1);
    var sqlQuery: string = `${this._ProcedureName} @ACTION='UPDATE', ${query}`;
    //console.log(sqlQuery);

    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection.request().query(sqlQuery);

        // return result.recordsets.length > 0 ? result.recordset[0].LastID : true;

        // db output handling
        return this.appException.handleResultOutput(result, "updated");
      });
    } catch (error) {
      throw error;
    }

    //return true;
  }

  async activate(id: string): Promise<boolean> {
    let query = `spChangeStatus @TableName='${this._TableName}', @PrimaryColumnName='${this._PrimaryKey}', @PrimaryColumnID='${id}', @Status='ACTIVE'`;

    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection.request().query(query);

        // db output handling
        return this.appException.handleResultOutput(result, "activated");
      });
    } catch (error) {
      throw error;
    }
  }

  async deactivate(id: string): Promise<boolean> {
    let query = `spChangeStatus @TableName='${this._TableName}', @PrimaryColumnName='${this._PrimaryKey}', @PrimaryColumnID='${id}', @Status='DEACTIVE'`;
    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection.request().query(query);

        // return true;

        // db output handling
        return this.appException.handleResultOutput(result, "deactivated");
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    let query = `spChangeStatus @TableName='${this._TableName}', @PrimaryColumnName='${this._PrimaryKey}', @PrimaryColumnID='${id}', @Status='DELETE'`;

    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection.request().query(query);

        //return true;

        // db output handling
        return this.appException.handleResultOutput(result, "deleted");
      });
    } catch (error) {
      throw error;
    }
  }

  async getRecordByTable(tableName: string): Promise<T> {
    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection
          .request()
          .query(`select * from ${tableName}`);

        return result.recordset;
      });
    } catch (error) {
      throw error;
    }
  }

  async getTotalRecordsCount(): Promise<T> {
    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection
          .request()
          .query(`select count(*) as total_rows from ${this._TableName}`);

        return result.recordset[0];
      });
    } catch (error) {
      throw error;
    }
  }

  getAllSchools = async (keyword: any = null) => {
    let sqlQuery, apimessage;
    let apiResponse: ApiResponse;

    try {
      return this.db.connect().then(async (connection) => {
        if (keyword)
          sqlQuery = `select SchoolID, SchoolName, UDiseCode, Address, PinCode  from SchoolMaster where SchoolName like '%${keyword}%' and dbo.fnGetStatus(Status) = 'Active' order by SchoolName asc`;
        else
          sqlQuery = `select SchoolID, SchoolName, UDiseCode, Address, PinCode  from SchoolMaster where dbo.fnGetStatus(Status) = 'Active' order by SchoolName asc`;

        //console.log(sqlQuery);
        const result = await connection.request().query(sqlQuery);

        apimessage =
          result.recordset.length > 0
            ? "All schools has been fetched successfully."
            : "No schools has been found in your search criteria.";

        apiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: apimessage,
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };

  getAllStates = async (CountryId: any = null) => {
    let sqlQuery, apimessage;
    let apiResponse: ApiResponse;

    try {
      return this.db.connect().then(async (connection) => {
        if (CountryId)
          sqlQuery = `select StateID, StateName, StateCode from StateMaster where CountryID = ${CountryId} and dbo.fnGetStatus(Status) = 'Active' order by StateName asc`;
        else
          sqlQuery = `select StateID, StateName, StateCode from StateMaster where dbo.fnGetStatus(Status) = 'Active' order by StateName asc`;

        //console.log(sqlQuery);
        const result = await connection.request().query(sqlQuery);

        apimessage =
          result.recordset.length > 0
            ? "All states has been fetched successfully."
            : "No states has been found in your search criteria.";

        apiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: apimessage,
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };

  getAllDistricts = async (StateId: any = null) => {
    let sqlQuery, apimessage;
    let apiResponse: ApiResponse;

    try {
      return this.db.connect().then(async (connection) => {
        if (StateId)
          sqlQuery = `select DistrictID, DistrictName, DistrictCode from DistrictMaster where StateID = ${StateId} and dbo.fnGetStatus(Status) = 'Active' order by DistrictName asc`;
        else
          sqlQuery = `select DistrictID, DistrictName, DistrictCode from DistrictMaster where dbo.fnGetStatus(Status) = 'Active' order by DistrictName asc`;

        //console.log(sqlQuery);
        const result = await connection.request().query(sqlQuery);

        apimessage =
          result.recordset.length > 0
            ? "All districts has been fetched successfully."
            : "No districts has been found in your search criteria.";

        apiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: apimessage,
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };

  getAllBlocks = async (DistrictId: any = null) => {
    let sqlQuery, apimessage;
    let apiResponse: ApiResponse;

    try {
      return this.db.connect().then(async (connection) => {
        if (DistrictId)
          sqlQuery = `select BlockID, BlockCode, BlockName from BlockMaster where DistrictID = ${DistrictId} and dbo.fnGetStatus(Status) = 'Active' order by BlockName asc`;
        else
          sqlQuery = `select BlockID, BlockCode, BlockName from BlockMaster where dbo.fnGetStatus(Status) = 'Active' order by BlockName asc`;

        //console.log(sqlQuery);
        const result = await connection.request().query(sqlQuery);

        apimessage =
          result.recordset.length > 0
            ? "All blocks has been fetched successfully."
            : "No blocks has been found in your search criteria.";

        apiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: apimessage,
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };

  getAllClusters = async (BlockId: any = null) => {
    let sqlQuery, apimessage;
    let apiResponse: ApiResponse;

    try {
      return this.db.connect().then(async (connection) => {
        if (BlockId)
          sqlQuery = `select ClusterID,ClusterCode,ClusterName from ClusterMaster where BlockID = ${BlockId} and dbo.fnGetStatus(Status) = 'Active' order by ClusterName asc`;
        else
          sqlQuery = `select ClusterID,ClusterCode,ClusterName from ClusterMaster where dbo.fnGetStatus(Status) = 'Active' order by ClusterName asc`;

        //console.log(sqlQuery);
        const result = await connection.request().query(sqlQuery);

        apimessage =
          result.recordset.length > 0
            ? "All clusters has been fetched successfully."
            : "No clusters has been found in your search criteria.";

        apiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: apimessage,
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };

  getAllBoards = async () => {
    let sqlQuery, apimessage;
    let apiResponse: ApiResponse;

    try {
      return this.db.connect().then(async (connection) => {
        sqlQuery = `select BoardID, BoardName,BoardDescription from BoardMaster where dbo.fnGetStatus(Status) = 'Active'`;

        //console.log(sqlQuery);
        const result = await connection.request().query(sqlQuery);

        apimessage =
          result.recordset.length > 0
            ? "All boards has been fetched successfully."
            : "No boards has been found in your search criteria.";

        apiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: apimessage,
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };

  getAllGrades = async () => {
    let sqlQuery, apimessage;
    let apiResponse: ApiResponse;

    try {
      return this.db.connect().then(async (connection) => {
        sqlQuery = `select GradeID, GradeName from GradeMaster where dbo.fnGetStatus(Status) = 'Active' order by CAST(GradeName as INT) asc`;

        //console.log(sqlQuery);
        const result = await connection.request().query(sqlQuery);

        apimessage =
          result.recordset.length > 0
            ? "All grades has been fetched successfully."
            : "No grades has been found in your search criteria.";

        apiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: apimessage,
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };

  getAllSubjects = async () => {
    let sqlQuery, apimessage;
    let apiResponse: ApiResponse;

    try {
      return this.db.connect().then(async (connection) => {
        sqlQuery = `select SubjectID, SubjectName, SubjectCode from SubjectMaster where dbo.fnGetStatus(Status) = 'Active' order by SubjectName asc`;

        //console.log(sqlQuery);
        const result = await connection.request().query(sqlQuery);

        apimessage =
          result.recordset.length > 0
            ? "All subjects has been fetched successfully."
            : "No subjects has been found in your search criteria.";

        apiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: apimessage,
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (err) {
      return err;
    }
  };

  __convert_hash(key): string {
    let hashKey: any;
    if (key != null) {
      hashKey = "0x" + Buffer.from(key).toString("hex").toUpperCase();
    } else {
      hashKey = null;
    }
    return hashKey;
  }
}

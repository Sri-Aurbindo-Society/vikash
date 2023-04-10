import CommonRepository from "./common.repository";
import sql from "mssql";
import { ApiResponse } from "../interface/apiResponse";
import SchoolModel from "../models/school.model";

export default class SchoolRepository extends CommonRepository<SchoolModel> {
  public db: any;

  constructor(database) {
    super(database);
    this.db = database;
  }

  async filterByUdiseCode(param: any): Promise<boolean> {
    let query = `select s.SchoolID,s.SchoolName, sm.StateID, sm.StateName,dm.DistrictID,dm.DistrictName,dm.DistrictCode from SchoolMaster as s inner join StateMaster as sm on (s.StateID=sm.StateID) inner join DistrictMaster as dm on (s.DistrictID=dm.DistrictID) where s.UDiseCode='${param.UDiseCode}'`;

    // console.log(query);

    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection.request().query(query);

        const apiResponse: ApiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: "All schools have been fetched successfully.",
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (error) {
      throw error;
    }
  }

  async filterByStateDistrict(param: any): Promise<boolean> {
    let query = `select s.SchoolID,s.SchoolName, sm.StateID, sm.StateName,dm.DistrictID,dm.DistrictName,dm.DistrictCode from SchoolMaster as s inner join StateMaster as sm on (s.StateID=sm.StateID) inner join DistrictMaster as dm on (s.DistrictID=dm.DistrictID) where s.StateID=${param.StateID} and s.DistrictID=${param.DistrictID}`;

    // console.log(query);

    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection.request().query(query);

        const apiResponse: ApiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: "All schools have been fetched successfully.",
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (error) {
      throw error;
    }
  }
}

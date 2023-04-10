import CommonRepository from "./common.repository";
import sql from "mssql";
import { ApiResponse } from "../interface/apiResponse";
import DistrictModel from "../models/school.model";

export default class DistrictRepository extends CommonRepository<DistrictModel> {
  public db: any;

  constructor(database) {
    super(database);
    this.db = database;
  }

  async filterByStateID(param: any): Promise<boolean> {
    let query = `select DistrictID,DistrictName,DistrictCode from DistrictMaster where StateID=${param.StateID}`;
    // console.log(query);

    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection.request().query(query);

        const apiResponse: ApiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: "All districts have been fetched successfully.",
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (error) {
      throw error;
    }
  }
}

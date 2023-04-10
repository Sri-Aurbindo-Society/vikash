import CommonRepository from "./common.repository";
import sql from "mssql";
import { ApiResponse } from "../interface/apiResponse";
import PageModel from "../models/page.model";

export default class PageRepository extends CommonRepository<PageModel> {
  public db: any;

  constructor(database) {
    super(database);
    this.db = database;
  }

  async getTIAImages(): Promise<boolean> {
    let query = `select pi.PageImgTitle,pi.PageImgAltTitle,pi.PageImageSource from PageMaster p inner join PageImageMaster pi on(p.PageID=pi.PageID) where p.PageID=0xE1EE2CBB50A3D0C6A1AE6987C1EB0F36E50CFAC8F0E58FC61279DB6C6D227AAE and p.PageType='Android App';`;

    // console.log(query);

    try {
      return this.db.connect().then(async (connection) => {
        const result = await connection.request().query(query);

        const apiResponse: ApiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "0000",
          Message: "All TIA images has been fetched successfully.",
          Result: result.recordset,
        };
        return apiResponse;
      });
    } catch (error) {
      throw error;
    }
  }
}

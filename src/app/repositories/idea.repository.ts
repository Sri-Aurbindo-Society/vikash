import CommonRepository from "./common.repository";
import sql from "mssql";
import { ApiResponse } from "../interface/apiResponse";
import IdeaModel from "../models/idea.model";

export default class IdeaRepository extends CommonRepository<IdeaModel> {
  public db: any;

  constructor(database) {
    super(database);
    this.db = database;
  }

  getIdeaList = () => {
    try {
      const sqlQuery =
        "select IdeaID,Title, Description, dbo.fnGetReviewStatus(ReviewStatus) as ReviewStatus, dbo.fnGetStatus(Status) as Status from IdeaMaster where dbo.fnGetStatus(Status) = 'Active' order by Title asc";

      return this.db.connect().then(async (connection) => {
        const data = await connection.request().query(sqlQuery);

        let apiResponse: ApiResponse;
        return (apiResponse = {
          Status: "Success",
          Error: false,
          ErrorCode: "",
          Message: "All ideas list have been fetched successfully...",
          Result: data.recordset,
        });
      });
    } catch (error) {
      throw error;
    }
  };
}

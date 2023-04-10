import CommonRepository from "./common.repository";
import sql from "mssql";
import PageContentMasterModel from "../models/pageContentMaster.model";
import { ApiResponse } from "../interface/apiResponse";

export default class PageContentMasterRepository extends CommonRepository<PageContentMasterModel> {
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

  // get subject list by grade ID
  async subjectByGradeID(gradeID): Promise<[]> {
    try {
      return this.db.connect().then(async (connection) => {
        const query = `  select sm.SubjectID,sm.SubjectName from subjectgrademapping as sgm
             inner join subjectMaster as sm on sm.SubjectID= sgm.subjectID
             where sgm.gradeID = ${gradeID}`;
        const result = await connection.request().query(query);
        const response = {
          message:
            result.recordset.length > 0
              ? "Reuested data has been fetched successfully..."
              : "No subject found ...",
          status: result.recordset.length > 0 ? "Success" : "Failed",
          error: result.recordset.length > 0 ? false : true,
          errorCode: result.recordset.length > 0 ? 200 : 400,
          Result: result.recordset,
        };
        return response;
      });
    } catch (error) {
      throw error;
    }
  }
}

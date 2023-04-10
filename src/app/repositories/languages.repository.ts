import CommonRepository from "./common.repository";
import sql from "mssql";
import { ApiResponse } from "../interface/apiResponse";
import LanguagesModel from "../models/languages.model";

export default class LanguagesRepository extends CommonRepository<LanguagesModel> {
  public db: any;

  constructor(database) {
    super(database);
    this.db = database;
  }
}

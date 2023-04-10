import sql from "mssql";

export default class DashboardRepository {
  public db: any;

  constructor(database) {
    this.db = database;
  }
}

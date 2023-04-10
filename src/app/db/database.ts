import sql from "mssql";

export default class Database {
  pool: any;
  dbConfig: any;

  constructor(dbConfig) {
    this.dbConfig = dbConfig;
  }

  connect = async (): Promise<any> => {
    try {
      this.pool = await sql.connect(this.dbConfig.config);
      return this.pool;
    } catch (error) {
      throw error;
    }
  };

  close = async function (): Promise<any> {
    await this.pool.close();
  };
}

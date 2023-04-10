export default class DBConfig {
  config: any;
  constructor() {
    // this.config = {
    //   user: "ajay",
    //   password: "ay!111",
    //   database: "auroscholar_dev",
    //   server: "192.168.0.70",
    //   port: 6883,
    //   options: {
    //     encrypt: false,
    //     trustServerCertificate: false,
    //     trustedConnection: true,
    //     enableArithAbort: true,
    //   }
    // };

    try {
      this.config = {
        user: "as",
        password: "123",
        database: "ZIIEI",
        //database: "AuroscholarDevpdbelopment",
        server: "216.48.184.29",
        port: 1232,
        pool: {
          max: 50,
          min: 0,
          idleTimeoutMillis: 30000,
        },
        options: {
          encrypt: false,
          trustServerCertificate: false,
          trustedConnection: true,
          enableArithAbort: true,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }
}

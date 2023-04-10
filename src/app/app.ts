require("dotenv").config();
import bodyParser from "body-parser";
import compression from "compression";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import xss from "xss-clean";
// import multer from "multer";
import fileUpload from "express-fileupload";
import { loadControllers, scopePerRequest } from "awilix-express";
import path from "path";

export default class App {
  appConfig: any;
  constructor(appConfig) {
    this.appConfig = appConfig;
  }

  swaggerOption = {
    swaggerDefinition: (swaggerJsdoc.Options = {
      info: {
        version: "3.0.0",
        title: "ZIIEI",
        description: "API documentation",
        contact: {
          name: "Ajay Kumar Thakur",
        },
        servers: ["http://localhost:3000/"],
      },
    }),
    // apis: ["index.js", "./routes/*.js"],
    apis: [`${__dirname}/controllers/*.controller.ts`],
  };

  swaggerDocs = swaggerJsdoc(this.swaggerOption);

  start(container, callback) {
    const app = this._create(container);
    const port = this.appConfig.port;

    app.listen(port, callback(port));
  }

  _create(container) {
    const app = express();

    app.use(express.json({ limit: "50mb" }));
    app.use("/uploads", express.static("uploads"));
    app.use(fileUpload());
    app.use(compression());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(
      cors({
        origin: "*",
        optionsSuccessStatus: 200,
      })
    );
    app.use(helmet());
    //app.use(xss());
    app.use("/rest-api", swaggerUi.serve, swaggerUi.setup(this.swaggerDocs));

    app.use(scopePerRequest(container));
    app.use(loadControllers("controllers/*.controller.ts", { cwd: __dirname }));

    return app;
  }
}

import { Request, Response } from "express";
import { route, GET } from "awilix-express";

export default abstract class BaseController {
  constructor() {}

  hasWhiteSpace(s) {
    return /\s/g.test(s);
  }

  __convert_hash(key): string {
    let hashKey: any;
    if (key != null) {
      hashKey = "0x" + Buffer.from(key).toString("hex").toUpperCase();
    } else {
      hashKey = null;
    }
    return hashKey;
  }

  convertProperResponse = (responseJSON) => {
    if (responseJSON) {
      if (Array.isArray(responseJSON)) {
        return responseJSON.map((item) => {
          if (typeof item == "object" && item !== null) {
            for (const [key, value] of Object.entries(item)) {
              if (
                typeof value == "object" &&
                //key.toString().toLocaleLowerCase().search("date") < 0
                Object.prototype.toString.call(value) !== "[object Date]"
              ) {
                item[key] = this.__convert_hash(value);
              } else {
                item[key] = value;
              }
            }
          }

          return item;
        });
      } else if (typeof responseJSON == "object" && responseJSON !== null) {
        for (const [key, value] of Object.entries(responseJSON)) {
          if (
            typeof value == "object" &&
            //key.toString().toLocaleLowerCase().search("date") < 0
            Object.prototype.toString.call(value) !== "[object Date]"
          ) {
            responseJSON[key] = this.__convert_hash(value);
          } else {
            responseJSON[key] = value;
          }
        }

        return responseJSON;
      } else {
        return responseJSON;
      }
    }
  };

  @route("/")
  @GET()
  async index(req: Request, res: Response) {
    res.send("Running");
  }
}

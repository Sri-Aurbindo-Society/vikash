import { Request, Response } from "express";

export default (req: any, res: Response, next) => {
  const bearerToken = req.header("authorization");

  if (typeof bearerToken !== "undefined") {
    const token_array = bearerToken.split(" ");
    const token: any = token_array[1];
    req.token = token;
    next();
  } else {
    res.sendStatus(403);
  }
};

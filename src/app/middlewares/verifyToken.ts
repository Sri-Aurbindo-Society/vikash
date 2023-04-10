import JWTHelper from "../helpers/jwt.helper";

export default class VerifyTokenMiddleware {
  JWTHelper: any;

  constructor() {
    this.JWTHelper = new JWTHelper();
  }

  verifyToken = (req, res, next) => {
    const token = req.token;

    if (!token) return res.sendStatus(403);

    try {
      return this.JWTHelper.verifyAccessToken(token).then((data) => {
        if (data.error) return res.sendStatus(403);

        if (!data.error) {
          const user: {
            id: number;
            name: string;
            email: string;
          } = {
            id: data.userData.id,
            name: data.userData.name,
            email: data.userData.email,
          };

          req.user = user;
          return next();
        }
      });
    } catch (err) {
      return res.status(403).send("Invalid Token");
    }
  };
}

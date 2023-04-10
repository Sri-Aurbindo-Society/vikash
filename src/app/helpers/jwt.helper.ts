import jwt from "jsonwebtoken";

export default class JWTHelper {
  constructor() {}

  generateToken = async (userdata) => {
    // Create a user token
    const accessToken = jwt.sign(
      userdata,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      }
    );

    const refreshToken = jwt.sign(
      userdata,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      {
        expiresIn: process.env.REFRESH_TOKEN_TTL,
      }
    );

    return Promise.resolve({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  };

  generateAccessToken = async (userdata) => {
    // Create a user token
    const accessToken = jwt.sign(
      userdata,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      }
    );

    return Promise.resolve({
      accessToken: accessToken,
    });
  };

  verifyAccessToken = async (accessToken) => {
    return await jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      (err, userData) => {
        if (err) return { error: true, message: "Invalid access token" };

        return {
          userData,
          error: false,
          message: "Valid access token",
        };
      }
    );
  };

  verifyRefreshToken = async (refreshToken) => {
    return await jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      (err, userData) => {
        if (err) return { error: true, message: "Invalid refresh token" };

        return {
          userData,
          error: false,
          message: "Valid refresh token",
        };
      }
    );
  };
}

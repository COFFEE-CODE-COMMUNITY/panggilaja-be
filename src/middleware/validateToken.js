import jwt from "jsonwebtoken";
import UnauthorizedError from "../exceptions/UnauthorizedError.js";

const validateToken = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];

      if (!token) {
        const error = new UnauthorizedError(
          "User is not authorized or token is missing"
        );
        return next(error);
      }

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        let error;
        if (err) {
          if (err.message === "jwt expired") {
            error = new UnauthorizedError("Token already expired");
          } else if (err) {
            error = new UnauthorizedError("User is not authorized");
          }
          return next(error);
        }

        req.user = decoded.user;
        return next();
      });

      return;
    }

    const error = new UnauthorizedError(
      "Authorization header missing or malformed"
    );
    return next(error);
  } catch (error) {
    return next(error);
  }
};

export default validateToken;

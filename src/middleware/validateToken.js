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

      console.log("Masuk sini")
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          if (err.message === "jwt expired") {
            throw new UnauthorizedError("Token already expired");
          } else if (err) {
            throw new UnauthorizedError("User is not authorized");
          }
        }

        req.user = decoded.user;
        return next();
      });

      console.log("Apakah masuk sini")
      return;
    }

    throw new UnauthorizedError("Authorization header missing or malformed");
  } catch (error) {
    return next(error);
  }
};

export default validateToken;

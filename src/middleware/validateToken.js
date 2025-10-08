import jwt from "jsonwebtoken";

const validateToken = async (req, res, next) => {
  try {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];

      if (!token) {
        res.status(401);
        const error = new Error("User is not authorized or token is missing");
        return next(error);
      }

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          res.status(401);
          const error = new Error("User is not authorized");
          return next(error);
        }
        req.user = decoded.user;
        return next();
      });

      return;
    }

    res.status(401);
    const error = new Error("Authorization header missing or malformed");
    return next(error);
  } catch (error) {
    return next(error);
  }
};

export default validateToken;

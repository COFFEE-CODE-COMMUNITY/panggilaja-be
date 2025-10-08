import authService from "../services/authService.js";
import BadRequestError from "../exceptions/BadRequestError.js";

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      const error = new BadRequestError("All fields are mandatory");
      return next(error);
    }

    const newUser = await authService.registerUser(req.body);

    if (newUser) {
      res.status(201).json({
        _id: newUser.id,
        email: newUser.email,
      });
    } else {
      const error = new BadRequestError("User data is not valid");
      return next(error);
    }
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      const error = new Error("All fields are mandatory");
      return next(error);
    }

    const accessToken = await authService.loginUser(req.body);
    
    res.status(200).json({ accessToken });
  } catch (error) {
    return next(error);
  }
};

export default { registerUser, loginUser };

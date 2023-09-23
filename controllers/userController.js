import user from "../model/user.model.js";
import session from "../model/session.model.js";
import responseFormat from "../utils/responseWrapper.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

const Register = async (req, res, next) => {
  try {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const alreadyUser = await user.findOne({ email: email });
    if (alreadyUser) {
      return res
        .status(400)
        .json(responseFormat(true, "User with given email already exists."));
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    const newUser = new user({
      email: email,
      name: name,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    if (savedUser) {
      const uniqueSessionToken = crypto.randomBytes(16).toString("base64");
      const newSession = new session({
        userId: savedUser._id,
        token: uniqueSessionToken,
      });
      const savedSession = await newSession.save();
    }
    return res
      .status(200)
      .json(responseFormat(true, "User successfully created."));
  } catch (err) {
    next(err);
  }
};

const Login = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const existingUser = await user.findOne({ email: email });
    if (!existingUser) {
      return res
        .status(404)
        .json(responseFormat(false, "User not found. Please register."));
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(404).json(responseFormat(false, "Incorrect password"));
    }
    const uniqueSessionToken = crypto.randomBytes(16).toString("base64");
    const newSession = new session({
      userId: existingUser._id,
      token: uniqueSessionToken,
    });
    const savedSession = await newSession.save();
    return res
      .status(200)
      .json(responseFormat(true, "Login successful.", uniqueSessionToken));
  } catch (err) {
    next(err);
  }
};

const Logout = async (req, res, next) => {
  const token = req.header("Authorization");

  try {
    const existingSession = await session.findOne({ token: token });

    if (!existingSession) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    await session.deleteOne({ _id: existingSession._id });

    res.status(200).json(responseFormat(true, "Logout successful."));
  } catch (err) {
    next(err);
  }
};

const TestRoute = (req, res, next) => {
  return res.status(200).json(responseFormat(true, "Test successful"));
};

const RefreshAuthToken = async (req, res, next) => {
  const token = req.header("Authorization");
  try {
    const existingSession = await session.findOne({ token: token });

    if (!existingSession) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    const newToken = crypto.randomBytes(16).toString("base64");

    existingSession.token = newToken;
    existingSession.createdAt = new Date();

    await existingSession.save();

    res
      .status(200)
      .json(responseFormat(true, "Session token refreshed.", newToken));
  } catch (err) {
    next(err);
  }
};

export { Register, Login, Logout, TestRoute, RefreshAuthToken };

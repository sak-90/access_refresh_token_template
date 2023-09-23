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
    const newUser = new user({
      email: email,
      name: name,
      password: password,
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

export { Register };

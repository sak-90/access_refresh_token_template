import session from "../model/session.model.js";
import responseFormat from "../utils/responseWrapper.js";

const authenticateMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json(responseFormat(false, "Authentication token is missing."));
  }

  try {
    const existingSession = await session.findOne({ token: token });

    if (!existingSession) {
      return res
        .status(401)
        .json(responseFormat(false, "Invalid authentication token."));
    }

    req.userId = existingSession.userId;
    next();
  } catch (err) {
    next(err);
  }
};

export default authenticateMiddleware;

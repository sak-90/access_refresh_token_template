import express from "express";
import {
  Register,
  Login,
  Logout,
  TestRoute,
  RefreshAuthToken,
} from "../controllers/userController.js";
import authenticateMiddleware from "../middleware/authenticationMiddleware.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", authenticateMiddleware, Logout);
router.get("/auth-sample-test", authenticateMiddleware, TestRoute);
router.post("/refresh-auth-token", authenticateMiddleware, RefreshAuthToken);

export default router;

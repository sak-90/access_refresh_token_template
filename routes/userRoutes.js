import express from "express";
import { Register, Login, Logout } from "../controllers/userController.js";
import authenticateMiddleware from "../middleware/authenticationMiddleware.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", authenticateMiddleware, Logout);

export default router;

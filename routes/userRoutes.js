import express from "express";
import { Register } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", Register);
router.post("/login");

export default router;

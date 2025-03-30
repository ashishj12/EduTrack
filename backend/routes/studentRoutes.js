import express from "express";
import { loginUser, getCurrentUser } from "../controllers/student.login.js";
import { authenticateToken } from "../middleware/authMiddlware.js";

const router = express.Router();

//student routes
router.post("/login", loginUser);
router.get("/me", authenticateToken, getCurrentUser);

export default router;
import express from "express";
import { loginUser, getCurrentUser,getAllStudents, makeCorrection } from "../controllers/student.login.js";
import { authenticateToken } from "../middleware/authMiddlware.js";

const router = express.Router();

//student routes
router.post("/login", loginUser);
router.post("/correction",authenticateToken,makeCorrection);
router.get("/all-students",authenticateToken, getAllStudents)
router.get("/me", authenticateToken, getCurrentUser);

export default router;
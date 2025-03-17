import express from "express";
import { loginUser, getCurrentUser } from "../controllers/student.login.js";
import { authenticateToken } from "../middleware/authMiddlware.js";
import { getCurrentFaculty, loginFaculty } from "../controllers/faculty.login.js";

const router = express.Router();

//student routes
router.post("/login", loginUser);
router.get("/me", authenticateToken, getCurrentUser);

//faculty routes
router.post("/login-faculty", loginFaculty);
router.get("/faculty", authenticateToken, getCurrentFaculty);

export default router;
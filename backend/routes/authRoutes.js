import express from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/student.login.js";
import { authenticateToken } from "../middleware/authMiddlware.js";
import { getCurrentFaculty, loginFaculty, registerFaculty } from "../controllers/faculty.login.js";

const router = express.Router();

//student routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me",authenticateToken,getCurrentUser)

//faculty routes

router.post("/register-faculty", registerFaculty);
router.post("/login-faculty", loginFaculty);  
router.get("/faculty", authenticateToken, getCurrentFaculty);

export default router;
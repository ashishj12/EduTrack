import express from "express";
import { authenticateToken } from "../middleware/authMiddlware.js";
import { getCurrentFaculty, loginFaculty, getAssignedSubjects } from "../controllers/faculty.login.js";

const router = express.Router();

//faculty routes
router.post("/login-faculty", loginFaculty);
router.get("/get-faculty", authenticateToken, getCurrentFaculty);
router.get("/faculty/assigned-subjects", authenticateToken, getAssignedSubjects);

export default router;
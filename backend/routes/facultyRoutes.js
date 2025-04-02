import express from "express";
import { authenticateToken } from "../middleware/authMiddlware.js";
import { getCurrentFaculty, loginFaculty, getAssignedSubjects, getAllFaculties } from "../controllers/faculty.login.js";

const router = express.Router();

//faculty routes
router.post("/login-faculty", loginFaculty);
router.get("/get-faculty", authenticateToken, getCurrentFaculty);
router.get("/faculty/assigned-subjects", authenticateToken, getAssignedSubjects);
router.get("/all-faculties", authenticateToken, getAllFaculties);

export default router;
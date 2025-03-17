import express from "express";
import { loginAdmin, registerAdmin, registerStudent, registerFaculty } from "../controllers/adminController.js";
import { verifyAdminToken } from "../middleware/authMiddlware.js";

const router = express.Router();

// Admin Login and Register Routes
router.post("/admin-register", registerAdmin);
router.post("/admin-login", loginAdmin);

// Admin routes to register students and faculty
router.post("/register-student", verifyAdminToken, registerStudent);
router.post("/register-faculty", verifyAdminToken, registerFaculty);

export default router;

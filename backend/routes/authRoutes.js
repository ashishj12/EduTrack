import express from "express";
import { registerUser, loginUser, getCurrentUser } from "../controllers/student.login.js";
import { authenticateToken } from "../middleware/authMiddlware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me",authenticateToken,getCurrentUser)
export default router;
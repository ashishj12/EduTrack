import express from "express";
import { loginAdmin, registerAdmin } from "../controllers/adminController.js";
const router = express.Router();

// Admin Login and Register Routes
router.post("/admin-register", registerAdmin);
router.post("/admin-login", loginAdmin);

export default router;

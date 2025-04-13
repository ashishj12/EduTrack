import express from "express";
import { loginAdmin, registerAdmin, registerStudent, registerFaculty, assignSubjectToFaculty, getAssignedSubjectsByFaculty, getAllCorrections } from "../controllers/adminController.js";
import { verifyAdminToken } from "../middleware/authMiddlware.js";
import { validateAssignSubject, validateGetAssignedSubjects } from "../utils/validation.js";

const router = express.Router();

// Admin Login and Register Routes
router.post("/admin-register", registerAdmin);
router.post("/admin-login", loginAdmin);

// Admin routes to register students and faculty
router.post("/register-student", verifyAdminToken, registerStudent);
router.post("/register-faculty", verifyAdminToken, registerFaculty);

router.post("/assign-subject", verifyAdminToken, (req, res, next) => {
  const { error } = validateAssignSubject(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}, assignSubjectToFaculty);

router.get("/assigned-subjects", verifyAdminToken, (req, res, next) => {
  const { error } = validateGetAssignedSubjects(req.query);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
}, getAssignedSubjectsByFaculty);

router.get("/corrections",verifyAdminToken,getAllCorrections)

export default router;
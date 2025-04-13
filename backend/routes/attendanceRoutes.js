import express from 'express';
import { markAttendance, getAllAttendance, getAttendanceById, getStudentAttendance, updateAttendance, deleteAttendance } from '../controllers/attendanceController.js';
import { authenticateToken } from "../middleware/authMiddlware.js";
import { uploadAndProcess } from "../utils/cloudinary.js"
const router = express.Router();

// Mark attendance route
router.post('/mark-attendance', authenticateToken, uploadAndProcess('attendanceImage'), markAttendance);

// Get all attendance records 
router.get('/all-attendance', authenticateToken, getAllAttendance);

// Get attendance by ID
router.get('/:id', authenticateToken, getAttendanceById);

// Get student attendance records
router.get('/get-student/records', authenticateToken, getStudentAttendance);

// Update attendance record
router.put('/:id', authenticateToken, updateAttendance);

// Delete attendance record
router.delete('/:id', authenticateToken, deleteAttendance);

export default router;

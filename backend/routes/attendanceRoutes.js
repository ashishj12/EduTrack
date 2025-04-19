import express from 'express';
import { 
  markAttendance, 
  getAllAttendance, 
  getAttendanceById, 
  getStudentAttendance, 
  updateAttendance, 
  deleteAttendance,
  getSubjectAttendanceSheet,
  getStudentPersonalSheet,
  syncAllAttendanceToSheets
} from '../controllers/attendanceController.js';
import { authenticateToken } from "../middleware/authMiddlware.js";
import { uploadAndProcess } from "../utils/cloudinary.js"
const router = express.Router();

// Mark attendance route
router.post('/mark-attendance', authenticateToken, uploadAndProcess('attendanceImage'), markAttendance);

// Get all attendance records 
router.get('/all-attendance', authenticateToken, getAllAttendance);

// Get student attendance records
router.get('/get-student/records', authenticateToken, getStudentAttendance);

// Get student personal attendance sheet
router.get('/student-sheet', authenticateToken, getStudentPersonalSheet);

// Get Google Sheet link for a subject attendance - specific route comes before generic routes
router.get('/subject-sheet/:subjectId/:batch/:semester', authenticateToken, getSubjectAttendanceSheet);

// Sync all attendance data to Google Sheets (admin only)
router.post('/sync-sheets', authenticateToken, syncAllAttendanceToSheets);

// Get attendance by ID
router.get('/:id', authenticateToken, getAttendanceById);

// Update attendance record
router.put('/:id', authenticateToken, updateAttendance);

// Delete attendance record
router.delete('/:id', authenticateToken, deleteAttendance);

export default router;
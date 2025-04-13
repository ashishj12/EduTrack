import Attendance from "../models/attendance.model.js";
import Student from '../models/student.model.js';
import Subject from '../models/subject.model.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs/promises';  // Using promises API for better async handling
import { existsSync } from 'fs';
// import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();


export const markAttendance = async (req, res) => {
  try {
    // 1. Check authentication and authorization
    const { userId, role } = req.user;
    if (!req.user || role !== "Faculty") {
      return res.status(403).json({ message: "Only faculty can mark attendance" });
    }

    // 2. Validate required fields
    const { subjectId, date, batch, semester } = req.body;
    if (!subjectId || !batch || !semester) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("Request body:", req.body);
    console.log("File:", req.file);
    console.log("Uploaded file URL:", req.uploadedFileUrl);

    // 3. Check if the subject exists and faculty is authorized
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const facultyId = userId?.toString();
    const subjectTaughtBy = subject.taughtBy?.toString();

    if (!subjectTaughtBy || facultyId !== subjectTaughtBy) {
      return res.status(403).json({ message: "Unauthorized for this subject" });
    }

    // 4. Validate image is provided
    const imageUrl = req.uploadedFileUrl || (req.file ? req.file.path : null);
    if (!imageUrl) {
      return res.status(400).json({ message: "No attendance image provided" });
    }

    // 5. Prepare image for ML model with better error handling
    let recognizedRollNumbers = [];
    try {
      const formData = new FormData();
      
      // Handle file upload based on source (local file or URL)
      if (req.file?.path && existsSync(req.file.path)) {
        try {
          const fileBuffer = await fs.readFile(req.file.path);
          formData.append("file", fileBuffer, req.file.originalname || "attendance.jpg");
        } catch (fileReadErr) {
          console.error("Error reading uploaded file:", fileReadErr);
          throw new Error("Failed to process uploaded image file");
        }
      } else if (req.uploadedFileUrl) {
        try {
          const response = await axios.get(req.uploadedFileUrl, { 
            responseType: "arraybuffer",
            timeout: 10000 // 10 seconds timeout
          });
          formData.append("file", Buffer.from(response.data), "attendance.jpg");
        } catch (downloadErr) {
          console.error("Error downloading image from URL:", downloadErr);
          throw new Error("Failed to download image from URL");
        }
      } else {
        throw new Error("No valid image source found");
      }

      // Call ML API with timeout and error handling
      const mlApiUrl = process.env.FACE_RECOGNITION_API_URL || "http://localhost:5000";
      console.log("Calling ML API at:", mlApiUrl);
      
      try {
        const headers = formData.getHeaders ? formData.getHeaders() : {};
        const mlResponse = await axios.post(`${mlApiUrl}/predict/`, formData, { 
          headers,
          timeout: 30000 // 30 seconds timeout for ML processing
        });
        
        console.log("ML API response:", mlResponse.data);
        recognizedRollNumbers = (mlResponse.data?.result || []).map(r => r.toLowerCase());
      } catch (mlApiErr) {
        console.error("Error calling ML API:", mlApiErr);
        
        // If ML API fails, we'll proceed with an empty recognition list
        // This allows attendance to still be recorded (all marked absent)
        // but logs the error and informs the user
        recognizedRollNumbers = [];
      }
    } catch (imageProcessingErr) {
      console.error("Error processing image:", imageProcessingErr);
      return res.status(422).json({ 
        message: "Failed to process attendance image", 
        error: imageProcessingErr.message 
      });
    }

    // 6. Fetch students and mark attendance
    try {
      // Fetch all students for the batch and semester
      const students = await Student.find({ semester, batch }).select("_id username");
      
      if (students.length === 0) {
        return res.status(404).json({ 
          message: "No students found for the specified batch and semester" 
        });
      }

      console.log("ML Recognized:", recognizedRollNumbers);
      console.log("DB Students:", students.map(s => s.username));

      // Mark attendance: present if recognized, else absent
      const attendanceData = students.map((student) => ({
        studentId: student._id,
        present: recognizedRollNumbers.includes(student.username.toLowerCase()),
      }));

      // 7. Create and save attendance record
      const attendanceRecord = new Attendance({
        subject: subjectId,
        date: date ? new Date(date) : new Date(),
        batch,
        semester,
        faculty: userId,
        imageUrl,
        students: attendanceData,
        totalStudents: students.length,
        presentCount: attendanceData.filter(s => s.present).length,
      });

      await attendanceRecord.save();

      // 8. Increment class count for the subject
      await Subject.findByIdAndUpdate(subjectId, { $inc: { totalClasses: 1 } });

      // 9. Clean up uploaded file if exists locally
      if (req.file?.path && existsSync(req.file.path)) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkErr) {
          console.warn("Failed to delete temporary file:", unlinkErr.message);
          // Non-critical error, continue processing
        }
      }

      // 10. Return success response with summary
      return res.status(201).json({
        message: "Attendance marked successfully",
        attendanceRecords: {
          total: students.length,
          present: attendanceData.filter(s => s.present).length,
          absent: attendanceData.filter(s => !s.present).length,
          attendanceId: attendanceRecord._id,
          imageUrl,
        }
      });
    } catch (dbError) {
      console.error("Database error in attendance marking:", dbError);
      return res.status(500).json({ 
        message: "Failed to record attendance in database", 
        error: dbError.message 
      });
    }
  } catch (error) {
    console.error("Error marking attendance:", error);
    return res.status(500).json({ 
      message: "Something went wrong processing attendance", 
      error: error.message 
    });
  }
};

// Get all attendance records
export const getAllAttendance = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (role !== 'Admin' && role !== 'Faculty') {
      return res.status(403).json({ message: "Unauthorized access to attendance records" });
    }

    // Extract filters from query
    const { subject, faculty, batch, semester, startDate, endDate } = req.query;
    const query = {};

    // Faculty users can only view their own records unless they have special permissions
    if (role === 'Faculty' && !faculty) {
      query.faculty = userId;
    } else if (faculty) {
      query.faculty = faculty;
    }

    // Apply filters if provided
    if (subject) query.subject = subject;
    if (batch) query.batch = batch;
    if (semester) query.semester = semester;
    
    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Fetch records with relevant populations
    const attendanceRecords = await Attendance.find(query)
      .populate('subject', 'subjectId name semester')
      .populate('faculty', 'name username')
      .populate({
        path: 'students.studentId',
        select: 'name username'
      })
      .sort({ date: -1 });

    // Calculate summary statistics
    const summary = {
      total: attendanceRecords.length,
      presentCount: attendanceRecords.reduce((acc, record) => 
        acc + record.students.filter(s => s.present).length, 0),
      absentCount: attendanceRecords.reduce((acc, record) => 
        acc + record.students.filter(s => !s.present).length, 0)
    };

    return res.status(200).json({
      message: "Attendance records retrieved successfully",
      data: {
        records: attendanceRecords,
        summary,
        count: attendanceRecords.length
      }
    });

  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Get all attendance records by id
export const getAttendanceById = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!req.params.id) {
      return res.status(400).json({ message: "Attendance ID is required" });
    }

    const attendance = await Attendance.findById(req.params.id)
      .populate('subject', 'subjectName subjectSem')
      .populate('faculty', 'name username')
      .populate('students.studentId', 'name username');

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Authorization check
    if (role === 'Student') {
      // Students can only view attendance records that include them
      const studentRecord = attendance.students.find(s => {
        if (!s.studentId) return false;
        
        const studentIdStr = typeof s.studentId === 'string' 
          ? s.studentId 
          : (s.studentId._id ? s.studentId._id.toString() : null);
              
        return studentIdStr === userId;
      });
      
      if (!studentRecord) {
        return res.status(403).json({ message: "You are not part of this attendance record" });
      }
    } else if (role === 'Faculty') {
      // Faculty can only view their own attendance records
      const attendanceFacultyId = attendance.faculty 
        ? (typeof attendance.faculty === 'string' 
            ? attendance.faculty 
            : attendance.faculty._id.toString())
        : null;
                
      if (attendanceFacultyId && attendanceFacultyId !== userId) {
        return res.status(403).json({ message: "You are not authorized to view this attendance record" });
      }
    }

    return res.status(200).json({
      message: "Attendance record retrieved successfully",
      data: attendance
    });

  } catch (error) {
    console.error("Error fetching attendance record:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Get student attendance record
export const getStudentAttendance = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    // Check if the requesting user is the same student or has appropriate role
    const requestedStudentId = req.query.studentId || userId;
    
    if (!requestedStudentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }
    
    if (role === 'Student' && userId !== requestedStudentId) {
      return res.status(403).json({ message: "You can only access your own attendance records" });
    }
    
    // Get the student to ensure they exist
    const student = await Student.findById(requestedStudentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Build query based on parameters
    const { subject, semester, startDate, endDate } = req.query;
    const query = { 'students.studentId': requestedStudentId };

    if (subject) query.subject = subject;
    if (semester) query.semester = semester;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.date.$lte = endDateTime;
      }
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find(query)
      .populate('subject', 'subjectName subjectSem totalClasses')
      .populate('faculty', 'name username')
      .sort({ date: -1 });

    // Process attendance data
    const attendanceData = attendanceRecords.map(record => {
      const studentRecord = record.students.find(s => {
        const sId = typeof s.studentId === 'string' 
          ? s.studentId 
          : s.studentId.toString();
          
        return sId === requestedStudentId;
      });
      
      return {
        _id: record._id,
        date: record.date,
        subject: record.subject,
        faculty: record.faculty,
        semester: record.semester,
        batch: record.batch,
        present: studentRecord ? studentRecord.present : false
      };
    });

    // Calculate subject-wise statistics
    const subjectStats = {};
    attendanceData.forEach(record => {
      if (!record.subject || !record.subject._id) return;
      
      const subjectId = record.subject._id.toString();
        
      if (!subjectStats[subjectId]) {
        subjectStats[subjectId] = {
          subject: record.subject,
          totalClasses: 0,
          attendedClasses: 0,
          percentage: 0
        };
      }

      subjectStats[subjectId].totalClasses++;
      if (record.present) {
        subjectStats[subjectId].attendedClasses++;
      }
    });

    // Calculate percentages
    Object.keys(subjectStats).forEach(key => {
      const stats = subjectStats[key];
      stats.percentage = stats.totalClasses > 0
        ? parseFloat((stats.attendedClasses / stats.totalClasses * 100).toFixed(2))
        : 0;
    });

    // Calculate overall statistics
    const totalClasses = attendanceData.length;
    const attendedClasses = attendanceData.filter(record => record.present).length;
    const attendancePercentage = totalClasses > 0 
      ? parseFloat((attendedClasses / totalClasses * 100).toFixed(2))
      : 0;

    return res.status(200).json({
      message: "Student attendance records retrieved successfully",
      data: {
        studentInfo: {
          id: student._id,
          name: student.name,
          batch: student.batch,
          semester: student.semester,
          branch: student.branch
        },
        statistics: {
          overall: {
            totalClasses,
            attendedClasses,
            attendancePercentage
          },
          subjectWise: Object.values(subjectStats)
        },
        attendanceRecords: attendanceData
      }
    });

  } catch (error) {
    console.error("Error fetching student attendance:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

//update attendance
export const updateAttendance = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    const { students } = req.body;
    const attendanceId = req.params.id;

    if (!attendanceId) {
      return res.status(400).json({ message: "Attendance ID is required" });
    }

    // Validate students array
    if (!students || !Array.isArray(students)) {
      return res.status(400).json({ message: "Invalid students data - array expected" });
    }

    // Find the attendance record
    const attendance = await Attendance.findById(attendanceId);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Check for missing faculty reference
    if (!attendance.faculty) {
      return res.status(400).json({ message: "Attendance record has no faculty assigned" });
    }

    // Authorization check
    const attendanceFacultyId = typeof attendance.faculty === 'string'
      ? attendance.faculty
      : attendance.faculty.toString();
    
    if (attendanceFacultyId !== userId && role !== 'Admin') {
      return res.status(403).json({ message: "You are not authorized to update this attendance record" });
    }

    // Update student attendance statuses
    for (const update of students) {
      if (!update.studentId) continue;
      
      // Convert student ID to string for comparison
      const updateStudentId = typeof update.studentId === 'string'
        ? update.studentId
        : update.studentId.toString();
      
      const studentIndex = attendance.students.findIndex(s => {
        if (!s.studentId) return false;
        
        const sId = typeof s.studentId === 'string'
          ? s.studentId
          : s.studentId.toString();
          
        return sId === updateStudentId;
      });

      if (studentIndex !== -1) {
        attendance.students[studentIndex].present = !!update.present; // Convert to boolean
      } else {
        // Add student if not found
        attendance.students.push({
          studentId: update.studentId,
          present: !!update.present
        });
      }
    }

    // Save the updated attendance
    await attendance.save();
    
    // Calculate counts for response
    const totalPresent = attendance.students.filter(s => s.present).length;
    const totalAbsent = attendance.students.filter(s => !s.present).length;

    return res.status(200).json({
      message: "Attendance updated successfully",
      data: {
        attendanceId: attendance._id,
        totalPresent,
        totalAbsent,
        totalStudents: attendance.students.length
      }
    });

  } catch (error) {
    console.error("Error updating attendance:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


//delete attendance
export const deleteAttendance = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!req.params.id) {
      return res.status(400).json({ message: "Attendance ID is required" });
    }
    
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Check for missing faculty reference
    if (!attendance.faculty) {
      return res.status(400).json({ message: "Attendance record has no faculty assigned" });
    }

    // Authorization check
    const attendanceFacultyId = typeof attendance.faculty === 'string'
      ? attendance.faculty
      : attendance.faculty.toString();
    
    if (role !== 'Admin' && attendanceFacultyId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this attendance record" });
    }

    // Store subject ID before deletion for decrementing class count
    const subjectId = attendance.subject;

    // Delete the attendance record
    await Attendance.findByIdAndDelete(req.params.id);
    
    // Update the Subject model to decrement totalClasses (with null check)
    if (subjectId) {
      await Subject.findByIdAndUpdate(subjectId, { $inc: { totalClasses: -1 } });
    }

    return res.status(200).json({
      message: "Attendance record deleted successfully",
      data: {
        deletedId: req.params.id,
        subjectUpdated: !!subjectId
      }
    });

  } catch (error) {
    console.error("Error deleting attendance record:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
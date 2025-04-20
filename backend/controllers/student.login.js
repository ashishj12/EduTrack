import { Student } from "../models/student.model.js";
import { generateTokens } from "../utils/generateToken.js";
import { validateStudentLogin ,validateCorrection } from "../utils/validation.js";
import logger from "../utils/logger.js";
import Correction from "../models/Correction.js";

// Login student
export const loginUser = async (req, res, next) => {
  try {
    // Validate request data
    const { error, value } = validateStudentLogin(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = value;

    // Find student by username
    const student = await Student.findOne({ username });
    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const tokens = await generateTokens(student);
    logger.info(`Student logged in successfully: ${username}`);

    // Return success response
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: student._id,
        username: student.username,
        role: student.role,
        name: student.name,
        branch: student.branch,
        batch: student.batch,
        semester: student.semester,
      },
      ...tokens,
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    next(error);
  }
};

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await Student.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        branch: user.branch,
        batch: user.batch,
        semester: user.semester,
      },
    });
  } catch (error) {
    logger.error(`Get current user error: ${error.message}`);
    next(error);
  }
};

//get all students
export const getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find({}).select("-password");
    res.status(200).json({ students }); 
  } catch (error) {
    logger.error(`Get all students error: ${error.message}`);
    next(error);
  }
};

//correction form
export const makeCorrection = async (req, res, next) => {
  try {
   const { error, value } = validateCorrection(req.body);
   if (error) {
     return res.status(400).json({ message: error.details[0].message });
   }
   let { subjectId,date,reason,details}= value;
   const correction= new Correction({
     subjectId,
     date,
     reason,
     details,
   });
   await correction.save();
   logger.info(`Correction Request made successfully: ${correction}`);
   return res.status(201).json({
     message: "Correction correction made successfully",
     correction: {
       id: correction._id,
       subject: correction.subject,
       date: correction.date,
       reason: correction.reason,
       details: correction.details,
     },
   });
  } catch (error) {
     logger.error(`Make correction error: ${error.message}`);
     next(error);
   
  } 
 }
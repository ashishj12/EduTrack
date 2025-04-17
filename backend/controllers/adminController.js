import { Admin } from "../models/admin.model.js";
import { Student } from "../models/student.model.js";
import { Faculty } from "../models/faculty.model.js";
import { validateAdminLogin, validateAdminRegister, validateStudentRegistration, validateFacultyRegister} from "../utils/validation.js";
import { generateTokens } from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import { generateRandomSecretKey } from "../middleware/generateSecretKey.js"; // Importing the function
import Subject from "../models/subject.model.js";
import Correction from "../models/Correction.js";

export const registerAdmin = async (req, res) => {
  try {

    // Validate request data
    const { error, value } = validateAdminRegister(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let { username, password } = value;

    // Convert username to lowercase
    username = username.toLowerCase();
    // Check if username already exists
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Generate a 6-digit secret key using the imported function
    const secretKey = generateRandomSecretKey();
    // Create new admin data
    const admin = new Admin({
      username,
      password,
      role: "Admin",
      secretKey,
    });

    // Save admin to database
    await admin.save();
    logger.info(`New admin registered: ${username}`);

    // Generate tokens
    const tokens = await generateTokens(admin);
    // Return success response
    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: admin._id,
        username: admin.username,
        secretKey: admin.secretKey,
      },
      ...tokens,
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
};

//login admin
export const loginAdmin = async (req, res) => {
  try {
    
    // Validate request data
    const { error, value } = validateAdminLogin(req.body);  // This should validate `username`, `password`, and `secretKey`
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password, secretKey } = value;
    // Find admin by username and secretKey
    const admin = await Admin.findOne({ username, secretKey });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials or secret key" });
    }

    // Compare password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const tokens = await generateTokens(admin);
    // Return success response
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
      ...tokens,
    });
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// Register a new student by admin
export const registerStudent = async (req, res) => {
  try {
    // Validate request data
    const { error, value } = validateStudentRegistration(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    let { username, password, name, branch, batch, semester } = value;

    // Convert username to lowercase
    username = username.toLowerCase();

    // Check if username already exists
    const existingUser = await Student.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create new student
    const student = new Student({
      username,
      password,
      name,
      branch,
      batch,
      semester,
    });

    // Save student to database
    await student.save();
    logger.info(`New student registered: ${username}`);

    // Generate tokens
    const tokens = await generateTokens(student);

    // Return success response
    return res.status(201).json({
      message: "Registration successful",
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
    logger.error(`Registration error: ${error.message}`);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

// Register a new faculty by admin
export const registerFaculty = async (req, res) => {
  try {
    // Validate request data
    const { error, value } = validateFacultyRegister(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password ,name,department,subjects} = value;

    // Check if username already exists
    const existingFaculty = await Faculty.findOne({ username });
    if (existingFaculty) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create new faculty
    const faculty = new Faculty({
      username,
      password,
      name,
      department,
      role: "Faculty",
    });

    // Save faculty to database
    await faculty.save();
    logger.info(`New Faculty registered: ${username}`);

    // Generate tokens
    const tokens = await generateTokens(faculty);

    // Return success response
    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: faculty._id,
        username: faculty.username,
        role: faculty.role,
        name: faculty.name,
        department: faculty.department,
      },
      ...tokens,
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

export const assignSubjectToFaculty = async (req, res) => {
  try {
    const { subjectName, subjectSem, facultyId } = req.body;

    // Validate input
    if (!subjectName || !subjectSem || !facultyId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if faculty exists
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Create or find the subject
    let subject = await Subject.findOne({ subjectName, subjectSem });
    if (!subject) {
      subject = new Subject({ subjectName, subjectSem, taughtBy: facultyId });
      await subject.save();
    } else {
      // Update the subject's faculty reference
      subject.taughtBy = facultyId;
      await subject.save();
    }

    // Add the subject to the faculty's subjects array if not already present
    if (!faculty.subjects.includes(subject._id)) {
      faculty.subjects.push(subject._id);
      await faculty.save();
    }

    res.status(200).json({
      message: "Subject assigned successfully",
      faculty: {
        id: faculty._id,
        username: faculty.username,
        subjects: faculty.subjects,
      },
    });
  } catch (error) {
    logger.error(`Error assigning subject: ${error.message}`);
    res.status(500).json({ message: "Server error during subject assignment" });
  }
};

export const getAssignedSubjectsByFaculty = async (req, res) => {
  try {
    const { facultyId, subjectId } = req.query;

    // Validate faculty existence
    const faculty = await Faculty.findById(facultyId).populate("subjects");
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    // Filter subjects if subjectId is provided
    const subjects = subjectId
      ? faculty.subjects.filter((subject) => subject._id.toString() === subjectId)
      : faculty.subjects;

    res.status(200).json({
      message: "Assigned subjects retrieved successfully",
      subjects,
    });
  } catch (error) {
    logger.error(`Error fetching assigned subjects: ${error.message}`);
    res.status(500).json({ message: "Server error during fetching assigned subjects" });
  }
};
// Get all corrections
 export async function getAllCorrections(req, res) {
  try {
    const corrections = await Correction.find().populate("subjectId");
    res.status(200).json(corrections);
  } catch (error) {
    logger.error(`Error fetching corrections: ${error.message}`);
    res.status(500).json({ message: "Server error during fetching corrections" });
  }
}
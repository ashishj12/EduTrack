import { Admin } from "../models/admin.model.js";
import { Student } from "../models/student.model.js";
import { Faculty } from "../models/faculty.model.js";
import { validateAdminLogin, validateAdminRegister, validateRegistration, validateFacultyLogin } from "../utils/validation.js";
import { generateTokens } from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import { generateRandomSecretKey } from "../middleware/generateSecretKey.js"; // Importing the function

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
    const { error, value } = validateRegistration(req.body);
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
    const { error, value } = validateFacultyLogin(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = value;

    // Check if username already exists
    const existingFaculty = await Faculty.findOne({ username });
    if (existingFaculty) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create new faculty
    const faculty = new Faculty({
      username,
      password,
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
      },
      ...tokens,
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    return res.status(500).json({ message: "Server error during registration" });
  }
};

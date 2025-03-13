import { Student } from "../models/student.model.js";
import { generateTokens } from "../utils/generateToken.js";
import { validateRegistration, validateLogin } from "../utils/validation.js";
import logger from "../utils/logger.js";

// Register a new student
export const registerUser = async (req, res, next) => {
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
    next(error);
  }
};


// Login student
export const loginUser = async (req, res, next) => {
  try {
    // Validate request data
    const { error, value } = validateLogin(req.body);
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
      },
    });
  } catch (error) {
    logger.error(`Get current user error: ${error.message}`);
    next(error);
  }
};
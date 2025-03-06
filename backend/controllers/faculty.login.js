import { generateTokens } from "../utils/generateToken.js";
import logger from "../utils/logger.js";
import { Faculty } from "../models/faculty.model.js";
import { validateFacultyLogin } from "../utils/validation.js";

// Register a new faculty
export const registerFaculty = async (req, res, next) => {
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
    next(error);
  }
};

// Login faculty
export const loginFaculty = async (req, res, next) => {
  try {
    // Validate request data
    const { error, value } = validateFacultyLogin(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, password } = value;

    // Find faculty by username
    const faculty = await Faculty.findOne({ username });
    if (!faculty) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isPasswordValid = await faculty.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens
    const tokens = await generateTokens(faculty);
    logger.info(`Faculty logged in successfully: ${username}`);

    // Return success response
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: faculty._id,
        username: faculty.username,
        role: faculty.role,
      },
      ...tokens,
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    next(error);
  }
};

// Get current faculty
export const getCurrentFaculty = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await Faculty.findById(userId).select("-password");
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
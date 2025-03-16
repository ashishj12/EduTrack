import { Admin } from "../models/admin.model.js";
import { validateAdminLogin, validateAdminRegister } from "../utils/validation.js";
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

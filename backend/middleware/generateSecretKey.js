import { Admin } from "../models/admin.model.js";
import logger from "../utils/logger.js";

export const verifySecretKey = async (req, res, next) => {
  try {

    const { secretKey } = req.body;
    if (!secretKey) {
      return res.status(401).json({ message: "Secret key is required" });
    }

    const admin = await Admin.findOne({ secretKey });
    
    // console.log(secretKey)
    if (!admin) {
      return res.status(401).json({ message: "Invalid secret key" });
    }
    req.admin = admin;
    next();
    
  } catch (error) {
    logger.error(`Secret key verification error: ${error.message}`);
    return res
      .status(500)
      .json({ message: "Server error during verification" });
  }
};

// Add a utility function to generate a random secret key
export const generateRandomSecretKey = () => {
  // Generate a random 6-digit number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

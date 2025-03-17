import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";

// Authenticate token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN format

  if (!token) {
    logger.warn("Authentication failed: No token provided");
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Authentication failed: ${error.message}`);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Verify admin token
export const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN format

  if (!token) {
    logger.warn("Admin authentication failed: No token provided");
    return res.status(401).json({ message: "Admin authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "Admin") {
      logger.warn("Admin authentication failed: Not an admin");
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn(`Admin authentication failed: ${error.message}`);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

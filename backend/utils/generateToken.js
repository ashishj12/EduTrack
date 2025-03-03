import jwt from "jsonwebtoken";
import crypto from "crypto";
import { RefreshToken } from "../models/RefreshToken.model.js";
import logger from "./logger.js";

// Generate Access and Refresh Tokens
export const generateTokens = async (user) => {
  try {
    // Generate JWT Access Token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    // Generate Refresh Token
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save the refresh token to the database
    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt,
    });

    logger.info(`Tokens generated for user: ${user._id}`);
    return { accessToken, refreshToken };
  } catch (error) {
    logger.error(`Error generating tokens: ${error.message}`);
    throw error;
  }
};

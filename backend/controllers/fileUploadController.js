import logger from "../utils/logger.js";

export const uploadFile = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    logger.info(`File uploaded successfully: ${req.file.filename}`);
    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
    });
  } catch (error) {
    logger.error(`File upload error: ${error.message}`);
    next(error);
  }
};

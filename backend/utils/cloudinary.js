import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger.js';

dotenv.config();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  logger.info('Created uploads directory');
}

// Log Cloudinary configuration status (without exposing secrets)
logger.info(`Configuring Cloudinary with cloud name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  logger.error('Missing Cloudinary credentials in environment variables');
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verify Cloudinary configuration
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    logger.info('Cloudinary connection successful');
    return true;
  } catch (error) {
    logger.error('Cloudinary connection failed:', error.message);
    return false;
  }
};

// Initialize connection test
testCloudinaryConnection();

// Local storage configuration
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create a safer filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `attendance-${uniqueSuffix}${fileExtension}`);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Cloudinary storage configuration
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'attendance_images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1000, crop: "limit" }]
  }
});

// Create multer instances with size limits
const uploadLocal = multer({ 
  storage: localStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

const uploadCloudinary = multer({ 
  storage: cloudinaryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Middleware to handle local upload and then upload to Cloudinary manually
const uploadAndProcess = (fieldName) => {
  return async (req, res, next) => {
    uploadLocal.single(fieldName)(req, res, async function (err) {
      if (err) {
        logger.error('Multer upload error:', err);
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed',
          error: err.code || 'UPLOAD_ERROR'
        });
      }

      if (!req.file) {
        logger.error('No file uploaded');
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }

      try {
        // Log file details
        logger.info(`Processing uploaded file: ${req.file.path}, size: ${req.file.size}, type: ${req.file.mimetype}`);
        
        // Confirm file exists before upload
        if (!fs.existsSync(req.file.path)) {
          throw new Error('Temporary file not accessible');
        }
        
        // Upload file to Cloudinary with timeout
        const uploadPromise = cloudinary.uploader.upload(req.file.path, {
          folder: 'attendance_images',
          resource_type: 'auto',
          timeout: 60000 // 60 second timeout
        });
        
        // Add timeout handling
        const result = await Promise.race([
          uploadPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Cloudinary upload timeout')), 60000)
          )
        ]);

        // Store the Cloudinary URL in the request
        req.uploadedFileUrl = result.secure_url;
        req.cloudinaryPublicId = result.public_id;
        
        logger.info(`Successfully uploaded to Cloudinary: ${result.secure_url}`);

        // Clean up the local file
        try {
          fs.unlinkSync(req.file.path);
          logger.info(`Deleted temporary file: ${req.file.path}`);
        } catch (unlinkError) {
          logger.warn(`Failed to delete temporary file: ${req.file.path}`, unlinkError);
          // Continue despite cleanup failure
        }

        // Continue to the next middleware
        next();
      } catch (error) {
        logger.error('Cloudinary upload error:', error);
        
        // Try to clean up the temporary file even if upload failed
        try {
          if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (cleanupError) {
          logger.warn('Failed to clean up temporary file after error', cleanupError);
        }
        
        // Send a more detailed error response
        return res.status(500).json({
          success: false,
          message: 'Failed to upload file to Cloudinary',
          error: error.message || 'Unknown upload error',
          details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
        });
      }
    });
  };
};

// Fallback direct upload option
const uploadDirectToCloudinary = (fieldName) => {
  return (req, res, next) => {
    uploadCloudinary.single(fieldName)(req, res, function(err) {
      if (err) {
        logger.error('Direct Cloudinary upload error:', err);
        return res.status(400).json({
          success: false,
          message: 'Direct Cloudinary upload failed',
          error: err.message
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
      }
      
      // Set URL from the Cloudinary response
      req.uploadedFileUrl = req.file.path; // For multer-storage-cloudinary, the path contains the URL
      
      next();
    });
  };
};

export {
  uploadLocal,
  uploadCloudinary,
  uploadAndProcess,
  uploadDirectToCloudinary
};
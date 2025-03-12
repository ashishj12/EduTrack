import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/fileUploadController.js";
import { authenticateToken } from "../middleware/authMiddlware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/faculty", authenticateToken, upload.single("facultyFile"), uploadFile);

export default router;

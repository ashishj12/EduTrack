import Attendance from "../models/attendance.model.js";
import Student from '../models/student.model.js';
import Subject from '../models/subject.model.js';
import Faculty from "../models/faculty.model.js";
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import FormData from 'form-data';

import { fileURLToPath } from 'url';
import { readFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import { google } from 'googleapis';

// Setup file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keys = JSON.parse(await readFile(path.join(__dirname, '../credentials.json'), 'utf8'));

dotenv.config();

// Google Sheets and Drive setup
const setupGoogleSheets = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: keys,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive', // Added Drive API scope
      ],
    });
    const client = await auth.getClient();
    return {
      sheets: google.sheets({ version: 'v4', auth: client }),
      drive: google.drive({ version: 'v3', auth: client }), // Initialize Drive API
    };
  } catch (error) {
    console.error("Error setting up Google APIs:", error);
    throw new Error("Failed to initialize Google APIs");
  }
};

// Set sheet permissions to read-only for everyone except owner
const setSheetPermissions = async (driveApi, spreadsheetId) => {
  try {
    // Get current permissions to preserve owner access
    const currentPermissions = await driveApi.permissions.list({
      fileId: spreadsheetId,
      fields: 'permissions(id, emailAddress, role, type)',
    });

    // Remove all existing permissions except the owner's
    const ownerEmail = keys.client_email; // From credentials.json
    for (const permission of currentPermissions.data.permissions) {
      if (permission.emailAddress !== ownerEmail && permission.type !== 'user') {
        await driveApi.permissions.delete({
          fileId: spreadsheetId,
          permissionId: permission.id,
        });
      }
    }

    // Set "anyone with the link" to read-only
    await driveApi.permissions.create({
      fileId: spreadsheetId,
      sendNotificationEmail: false,
      requestBody: {
        role: 'reader', // Read-only access
        type: 'anyone', // Anyone with the link
      },
    });

    console.log(`Permissions set to read-only for spreadsheet ${spreadsheetId}`);
  } catch (error) {
    console.error("Error setting sheet permissions:", error);
    throw new Error("Failed to set sheet permissions");
  }
};

// Create or update a sheet for a subject
const createOrUpdateSubjectSheet = async (sheetsApi, driveApi, subjectDetails, attendanceData) => {
  try {
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheetTitle = `${subjectDetails.subjectName}-${subjectDetails.batch}-${subjectDetails.semester}`;

    const spreadsheet = await sheetsApi.spreadsheets.get({ spreadsheetId });
    const existingSheet = spreadsheet.data.sheets.find(sheet => sheet.properties.title === sheetTitle);

    if (!existingSheet) {
      await sheetsApi.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [{
            addSheet: {
              properties: { title: sheetTitle }
            }
          }]
        }
      });
    }

    await sheetsApi.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetTitle}!A1:E1`,
      valueInputOption: 'RAW',
      resource: { values: [["Roll Number", "Name", "Date", "Present/Absent", "Faculty"]] }
    });

    const formattedDate = new Date(attendanceData.date).toLocaleDateString();
    const values = attendanceData.students.map(student => [
      student.studentId.username,
      student.studentId.name,
      formattedDate,
      student.present ? "Present" : "Absent",
      attendanceData.faculty.name
    ]);

    await sheetsApi.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetTitle}!A2:E`,
      valueInputOption: 'RAW',
      resource: { values }
    });

    // Set permissions to read-only
    await setSheetPermissions(driveApi, spreadsheetId);
    
    return { spreadsheetId, sheetTitle };
  } catch (error) {
    console.error("Error with Google Sheets operation:", error);
    throw new Error("Failed to create or update Google Sheets");
  }
};

// Generate a shareable link for a Google Sheet
const getSheetShareableLink = (spreadsheetId, sheetTitle) => {
  if (!spreadsheetId || !sheetTitle) {
    throw new Error("Invalid Spreadsheet ID or Sheet Title");
  }
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0&range=${encodeURIComponent(sheetTitle)}`;
};

// Helper to safely get string ID from MongoDB object or string
const getStringId = (objectOrString) => {
  if (!objectOrString) return null;
  return typeof objectOrString === 'string'
    ? objectOrString
    : (objectOrString._id ? objectOrString._id.toString() : objectOrString.toString());
};

// Helper to update personal student sheets after attendance changes
const updatePersonalStudentSheets = async (sheetsApi, driveApi, spreadsheetId, changes, attendance) => {
  try {
    const sanitizeTitle = (title) => title.replace(/[\\\/:*?"<>|]/g, '-');
    for (const change of changes) {
      const studentInfo = attendance.students.find(s => 
        getStringId(s.studentId) === getStringId(change.studentId)
      );
      if (!studentInfo || !studentInfo.studentId) continue;

      const personalSheetTitle = sanitizeTitle(`${studentInfo.studentId.username}-${studentInfo.studentId.name}`);
      
      // Get all attendance records for this student
      const studentAttendance = await Attendance.find({ 'students.studentId': studentInfo.studentId })
        .populate('subject', 'subjectName subjectSem')
        .populate('faculty', 'name username')
        .sort({ date: 1 });

      const values = studentAttendance.map(record => {
        const studentRecord = record.students.find(s => 
          getStringId(s.studentId) === getStringId(studentInfo.studentId)
        );
        return [
          record.subject?.subjectName || "Unknown Subject",
          new Date(record.date).toLocaleDateString(),
          studentRecord?.present ? "Present" : "Absent",
          record.faculty?.name || "Unknown Faculty",
          record.batch || "N/A",
          record.semester || "N/A"
        ];
      });

      // Check if sheet exists
      const spreadsheet = await sheetsApi.spreadsheets.get({ spreadsheetId });
      let existingSheet = spreadsheet.data.sheets.find(
        sheet => sheet.properties.title === personalSheetTitle
      );

      if (!existingSheet) {
        await sheetsApi.spreadsheets.batchUpdate({
          spreadsheetId,
          resource: {
            requests: [{
              addSheet: {
                properties: { title: personalSheetTitle }
              }
            }]
          }
        });
      }

      // Update headers
      await sheetsApi.spreadsheets.values.update({
        spreadsheetId,
        range: `${personalSheetTitle}!A1:F1`,
        valueInputOption: 'RAW',
        resource: {
          values: [["Subject", "Date", "Present/Absent", "Faculty", "Batch", "Semester"]]
        }
      });

      // Clear existing data
      const response = await sheetsApi.spreadsheets.values.get({
        spreadsheetId,
        range: `${personalSheetTitle}!A:F`,
      });

      const rowCount = response.data.values ? response.data.values.length : 1;
      if (rowCount > 1) {
        await sheetsApi.spreadsheets.batchUpdate({
          spreadsheetId,
          resource: {
            requests: [{
              deleteDimension: {
                range: {
                  sheetId: existingSheet?.properties.sheetId,
                  dimension: "ROWS",
                  startIndex: 1,
                  endIndex: rowCount
                }
              }
            }]
          }
        });
      }

      // Append new data
      if (values.length > 0) {
        await sheetsApi.spreadsheets.values.append({
          spreadsheetId,
          range: `${personalSheetTitle}!A2:F`,
          valueInputOption: 'RAW',
          resource: { values }
        });
      }

      // Set permissions to read-only
      await setSheetPermissions(driveApi, spreadsheetId);
    }
  } catch (error) {
    console.error("Error updating personal student sheets:", error);
    // Continue without failing the main operation
  }
};

// Helper to mark attendance as deleted in Google Sheets
const markAttendanceAsDeleted = async (attendance, attendanceDate, subjectName) => {
  try {
    const { sheets: sheetsApi, drive: driveApi } = await setupGoogleSheets();
    const spreadsheetId = process.env.SPREADSHEET_ID;
    const sheetTitle = `${subjectName}-${attendance.batch}-${attendance.semester}`;

    const spreadsheet = await sheetsApi.spreadsheets.get({ spreadsheetId });
    const existingSheet = spreadsheet.data.sheets.find(
      sheet => sheet.properties.title === sheetTitle
    );

    if (existingSheet) {
      const response = await sheetsApi.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetTitle}!A:E`,
      });

      const sheetData = response.data.values || [];
      for (let i = 1; i < sheetData.length; i++) {
        const row = sheetData[i];
        if (row[2] === attendanceDate) {
          await sheetsApi.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetTitle}!D${i + 1}`,
            valueInputOption: 'RAW',
            resource: { values: [["Deleted"]] }
          });
        }
      }

      // Update personal sheets
      for (const student of attendance.students) {
        const personalSheetTitle = `${student.studentId.username}-${student.studentId.name}`;
        const personalResponse = await sheetsApi.spreadsheets.values.get({
          spreadsheetId,
          range: `${personalSheetTitle}!A:F`,
        });

        const personalSheetData = personalResponse.data.values || [];
        for (let i = 1; i < personalSheetData.length; i++) {
          const row = personalSheetData[i];
          if (row[1] === attendanceDate && row[0] === subjectName) {
            await sheetsApi.spreadsheets.values.update({
              spreadsheetId,
              range: `${personalSheetTitle}!C${i + 1}`,
              valueInputOption: 'RAW',
              resource: { values: [["Deleted"]] }
            });
          }
        }
      }

      // Set permissions to read-only
      await setSheetPermissions(driveApi, spreadsheetId);
    }
  } catch (error) {
    console.error("Error marking attendance as deleted in Google Sheets:", error);
    // Continue without failing
  }
};

// Helper to sync a subject's attendance data to Google Sheets
const syncSubjectSheet = async (sheetsApi, driveApi, spreadsheetId, subjectId, subjectName, batch, semester) => {
  try {
    const sheetTitle = `${subjectName}-${batch}-${semester}`;
    
    // Get all attendance records for this subject, batch, and semester
    const attendanceRecords = await Attendance.find({
      subject: subjectId,
      batch,
      semester
    })
      .populate('subject', 'subjectName subjectSem')
      .populate('faculty', 'name username')
      .populate('students.studentId', 'name username')
      .sort({ date: 1 });

    // Check if sheet exists
    const spreadsheet = await sheetsApi.spreadsheets.get({ spreadsheetId });
    let existingSheet = spreadsheet.data.sheets.find(
      sheet => sheet.properties.title === sheetTitle
    );

    if (!existingSheet) {
      await sheetsApi.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [{
            addSheet: {
              properties: { title: sheetTitle }
            }
          }]
        }
      });
    }

    // Update headers
    await sheetsApi.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetTitle}!A1:E1`,
      valueInputOption: 'RAW',
      resource: {
        values: [["Roll Number", "Name", "Date", "Present/Absent", "Faculty"]]
      }
    });

    // Clear existing data
    const response = await sheetsApi.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTitle}!A:E`,
    });

    const rowCount = response.data.values ? response.data.values.length : 1;
    if (rowCount > 1) {
      await sheetsApi.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: existingSheet?.properties.sheetId,
                dimension: "ROWS",
                startIndex: 1,
                endIndex: rowCount
              }
            }
          }]
        }
      });
    }

    // Prepare data
    const values = [];
    for (const record of attendanceRecords) {
      const formattedDate = new Date(record.date).toLocaleDateString();
      for (const student of record.students) {
        values.push([
          student.studentId.username,
          student.studentId.name,
          formattedDate,
          student.present ? "Present" : "Absent",
          record.faculty.name
        ]);
      }
    }

    // Append data
    if (values.length > 0) {
      await sheetsApi.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetTitle}!A2:E`,
        valueInputOption: 'RAW',
        resource: { values }
      });
    }

    // Set permissions to read-only
    await setSheetPermissions(driveApi, spreadsheetId);
  } catch (error) {
    console.error(`Error syncing sheet ${subjectName}-${batch}-${semester}:`, error);
    throw error;
  }
};

// Helper to sync a student's personal attendance sheet
const syncStudentPersonalSheet = async (sheetsApi, driveApi, spreadsheetId, student) => {
  try {
    const sanitizeTitle = (title) => title.replace(/[\\\/:*?"<>|]/g, '-');
    const personalSheetTitle = sanitizeTitle(`${student.username}-${student.name}`);

    // Get all attendance records for this student
    const attendanceRecords = await Attendance.find({ 'students.studentId': student._id })
      .populate('subject', 'subjectName subjectSem')
      .populate('faculty', 'name username')
      .sort({ date: 1 });

    const values = attendanceRecords.map(record => {
      const studentRecord = record.students.find(s => 
        getStringId(s.studentId) === student._id.toString()
      );
      return [
        record.subject?.subjectName || "Unknown Subject",
        new Date(record.date).toLocaleDateString(),
        studentRecord?.present ? "Present" : "Absent",
        record.faculty?.name || "Unknown Faculty",
        record.batch || "N/A",
        record.semester || "N/A"
      ];
    });

    // Check if sheet exists
    const spreadsheet = await sheetsApi.spreadsheets.get({ spreadsheetId });
    let existingSheet = spreadsheet.data.sheets.find(
      sheet => sheet.properties.title === personalSheetTitle
    );

    if (!existingSheet) {
      await sheetsApi.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [{
            addSheet: {
              properties: { title: personalSheetTitle }
            }
          }]
        }
      });
    }

    // Update headers
    await sheetsApi.spreadsheets.values.update({
      spreadsheetId,
      range: `${personalSheetTitle}!A1:F1`,
      valueInputOption: 'RAW',
      resource: {
        values: [["Subject", "Date", "Present/Absent", "Faculty", "Batch", "Semester"]]
      }
    });

    // Clear existing data
    const response = await sheetsApi.spreadsheets.values.get({
      spreadsheetId,
      range: `${personalSheetTitle}!A:F`,
    });

    const rowCount = response.data.values ? response.data.values.length : 1;
    if (rowCount > 1) {
      await sheetsApi.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: existingSheet?.properties.sheetId,
                dimension: "ROWS",
                startIndex: 1,
                endIndex: rowCount
              }
            }
          }]
        }
      });
    }

    // Append data
    if (values.length > 0) {
      await sheetsApi.spreadsheets.values.append({
        spreadsheetId,
        range: `${personalSheetTitle}!A2:F`,
        valueInputOption: 'RAW',
        resource: { values }
      });
    }

    // Set permissions to read-only
    await setSheetPermissions(driveApi, spreadsheetId);
  } catch (error) {
    console.error(`Error syncing personal sheet for ${student.username}:`, error);
    throw error;
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!req.user || role !== "Faculty") {
      return res.status(403).json({ message: "Only faculty can mark attendance" });
    }

    const { subjectId, date, batch, semester } = req.body;
    if (!subjectId || !batch || !semester) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the subject exists and faculty is authorized
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const facultyId = getStringId(userId);
    const subjectTaughtBy = getStringId(subject.taughtBy);

    if (!subjectTaughtBy || facultyId !== subjectTaughtBy) {
      return res.status(403).json({ message: "Unauthorized for this subject" });
    }

    // Validate image is provided
    const imageUrl = req.uploadedFileUrl || (req.file ? req.file.path : null);
    if (!imageUrl) {
      return res.status(400).json({ message: "No attendance image provided" });
    }

    // Prepare image for ML model with better error handling
    let recognizedRollNumbers = [];
    try {
      const formData = new FormData();

      // Handle file upload based on source 
      if (req.file?.path && existsSync(req.file.path)) {
        try {
          const fileBuffer = await readFile(req.file.path);
          formData.append("file", fileBuffer, req.file.originalname || "attendance.jpg");
        } catch (fileReadErr) {
          console.error("Error reading uploaded file:", fileReadErr);
          throw new Error("Failed to process uploaded image file");
        }
      } else if (req.uploadedFileUrl) {
        try {
          const response = await axios.get(req.uploadedFileUrl, {
            responseType: "arraybuffer",
            timeout: 10000
          });
          formData.append("file", Buffer.from(response.data), "attendance.jpg");
        } catch (downloadErr) {
          console.error("Error downloading image from URL:", downloadErr);
          throw new Error("Failed to download image from URL");
        }
      } else {
        throw new Error("No valid image source found");
      }

      // Call ML API with timeout and error handling
      const mlApiUrl = process.env.FACE_RECOGNITION_API_URL || "http://localhost:5000";
      console.log("Calling ML API at:", mlApiUrl);
      try {
        const headers = formData.getHeaders ? formData.getHeaders() : {};
        const mlResponse = await axios.post(`${mlApiUrl}/predict/`, formData, {
          headers,
          timeout: 30000
        });

        console.log("ML API response:", mlResponse.data);
        recognizedRollNumbers = (mlResponse.data?.result || []).map(r => r.toLowerCase());
      } catch (mlApiErr) {
        console.error("Error calling ML API:", mlApiErr);
        recognizedRollNumbers = [];
      }
    } catch (imageProcessingErr) {
      console.error("Error processing image:", imageProcessingErr);
      return res.status(422).json({
        message: "Failed to process attendance image",
        error: imageProcessingErr.message
      });
    }

    // Fetch students and mark attendance
    try {
      // Fetch all students for the batch and semester
      const students = await Student.find({ semester, batch }).select("_id username name");
      if (students.length === 0) {
        return res.status(404).json({
          message: "No students found for the specified batch and semester"
        });
      }

      console.log("ML Recognized:", recognizedRollNumbers);
      console.log("DB Students:", students.map(s => s.username));

      // Mark attendance: present if recognized, else absent
      const attendanceData = students.map((student) => ({
        studentId: student._id,
        present: recognizedRollNumbers.includes(student.username.toLowerCase()),
      }));

      // Fetch faculty info for Google Sheets
      const faculty = await Faculty.findById(userId).select("name username");

      // Create and save attendance record
      const attendanceRecord = new Attendance({
        subject: subjectId,
        date: (date && !isNaN(new Date(date).getTime())) ? new Date(date) : new Date(),
        batch,
        semester,
        faculty: userId,
        imageUrl,
        students: attendanceData,
        totalStudents: students.length,
        presentCount: attendanceData.filter(s => s.present).length,
      });

      await attendanceRecord.save();

      // Increment class count for the subject
      await Subject.findByIdAndUpdate(subjectId, { $inc: { totalClasses: 1 } });

      // Clean up uploaded file if exists locally
      if (req.file?.path && existsSync(req.file.path)) {
        try {
          await unlink(req.file.path);
        } catch (unlinkErr) {
          console.warn("Failed to delete temporary file:", unlinkErr.message);
          // Non-critical error, continue processing
        }
      }

      // Prepare Google Sheets integration
      try {
        const { sheets: sheetsApi, drive: driveApi } = await setupGoogleSheets();

        // Format data for Google Sheets
        const populatedAttendance = await Attendance.findById(attendanceRecord._id)
          .populate('subject', 'subjectName subjectSem')
          .populate('faculty', 'name username')
          .populate('students.studentId', 'name username');

        // Update Google Sheets with attendance data
        const subjectDetails = {
          subjectName: subject.subjectName,
          batch,
          semester
        };

        const sheetInfo = await createOrUpdateSubjectSheet(sheetsApi, driveApi, subjectDetails, populatedAttendance);
        const sheetLink = getSheetShareableLink(sheetInfo.spreadsheetId, sheetInfo.sheetTitle);

        // Update attendance record with sheet link
        attendanceRecord.sheetUrl = sheetLink;
        await attendanceRecord.save();

        // Update personal sheets for all students
        const studentSheetUpdates = [];
        const spreadsheetId = process.env.SPREADSHEET_ID;

        // Process each student's personal sheet
        for (const student of students) {
          try {
            const studentId = student._id.toString();
            const sanitizeTitle = (title) => title.replace(/[\\\/:*?"<>|]/g, '-');
            const personalSheetTitle = sanitizeTitle(`${student.username}-${student.name}`);

            // Check if sheet exists
            const spreadsheet = await sheetsApi.spreadsheets.get({ spreadsheetId });
            let existingSheet = spreadsheet.data.sheets.find(
              sheet => sheet.properties.title === personalSheetTitle
            );

            // Get all attendance records for this student
            const attendanceRecords = await Attendance.find({ 'students.studentId': studentId })
              .populate('subject', 'subjectName subjectSem')
              .populate('faculty', 'name username')
              .sort({ date: 1 });

            const values = attendanceRecords.map(record => {
              const studentRecord = record.students.find(s => {
                const sId = typeof s.studentId === 'object' ? s.studentId.toString() : s.studentId;
                return sId === studentId;
              });

              return [
                record.subject?.subjectName || "Unknown Subject",
                new Date(record.date).toLocaleDateString(),
                studentRecord?.present ? "Present" : "Absent",
                record.faculty?.name || "Unknown Faculty",
                record.batch || "N/A",
                record.semester || "N/A"
              ];
            });

            // Create or update sheet
            if (!existingSheet) {
              // Create new sheet
              await sheetsApi.spreadsheets.batchUpdate({
                spreadsheetId,
                resource: {
                  requests: [{
                    addSheet: {
                      properties: {
                        title: personalSheetTitle,
                      }
                    }
                  }]
                }
              });

              // Add headers
              await sheetsApi.spreadsheets.values.update({
                spreadsheetId,
                range: `${personalSheetTitle}!A1:F1`,
                valueInputOption: 'RAW',
                resource: {
                  values: [["Subject", "Date", "Present/Absent", "Faculty", "Batch", "Semester"]]
                }
              });

              // Insert data
              if (values.length > 0) {
                await sheetsApi.spreadsheets.values.append({
                  spreadsheetId,
                  range: `${personalSheetTitle}!A2:F`,
                  valueInputOption: 'RAW',
                  resource: { values }
                });
              }
            } else {
              // Update existing sheet
              const sheetId = existingSheet.properties.sheetId;

              const response = await sheetsApi.spreadsheets.values.get({
                spreadsheetId,
                range: `${personalSheetTitle}!A:F`,
              });

              const rowCount = response.data.values ? response.data.values.length : 1;

              if (rowCount > 1) {
                await sheetsApi.spreadsheets.batchUpdate({
                  spreadsheetId,
                  resource: {
                    requests: [{
                      deleteDimension: {
                        range: {
                          sheetId,
                          dimension: "ROWS",
                          startIndex: 1,
                          endIndex: rowCount
                        }
                      }
                    }]
                  }
                });
              }

              if (values.length > 0) {
                await sheetsApi.spreadsheets.values.append({
                  spreadsheetId,
                  range: `${personalSheetTitle}!A2:F`,
                  valueInputOption: 'RAW',
                  resource: { values }
                });
              }
            }

            // Set permissions to read-only
            await setSheetPermissions(driveApi, spreadsheetId);

            const sheetLink = getSheetShareableLink(spreadsheetId, personalSheetTitle);
            studentSheetUpdates.push({
              studentId: studentId,
              rollNumber: student.username,
              name: student.name,
              sheetUrl: sheetLink
            });
          } catch (studentSheetError) {
            console.error(`Error updating sheet for student ${student.username}:`, studentSheetError);
            // Continue with other students even if one fails
          }
        }

        // Return success response with summary
        return res.status(201).json({
          message: "Attendance marked successfully",
          attendanceRecords: {
            total: students.length,
            present: attendanceData.filter(s => s.present).length,
            absent: attendanceData.filter(s => !s.present).length,
            attendanceId: attendanceRecord._id,
            imageUrl,
            sheetUrl: sheetLink
          },
          studentSheetsUpdated: studentSheetUpdates.length,
          studentSheets: studentSheetUpdates
        });
      } catch (sheetError) {
        console.error("Google Sheets error:", sheetError);
        // Continue with response, but inform of Sheet error
        return res.status(201).json({
          message: "Attendance marked successfully (Google Sheets update failed)",
          attendanceRecords: {
            total: students.length,
            present: attendanceData.filter(s => s.present).length,
            absent: attendanceData.filter(s => !s.present).length,
            attendanceId: attendanceRecord._id,
            imageUrl,
            sheetError: sheetError.message
          }
        });
      }
    } catch (dbError) {
      console.error("Database error in attendance marking:", dbError);
      return res.status(500).json({
        message: "Failed to record attendance in database",
        error: dbError.message
      });
    }
  } catch (error) {
    console.error("Error marking attendance:", error);
    return res.status(500).json({
      message: "Something went wrong processing attendance",
      error: error.message
    });
  }
};

// Get Google Sheet link for a subject
export const getSubjectAttendanceSheet = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Only faculty, admin and students can access subject sheets
    if (role !== 'Faculty' && role !== 'Admin' && role !== 'Student') {
      return res.status(403).json({ message: "Unauthorized to view attendance sheets" });
    }

    const { subjectId, batch, semester } = req.params;

    if (!subjectId || !batch || !semester) {
      return res.status(400).json({ message: "Subject ID, batch, and semester are required" });
    }

    // Check if subject exists
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Faculty can only view their subjects
    if (role === 'Faculty') {
      const facultyId = getStringId(userId);
      const subjectTaughtBy = getStringId(subject.taughtBy);

      if (facultyId !== subjectTaughtBy) {
        return res.status(403).json({ message: "You are not authorized to view this subject's attendance" });
      }
    }

    // Students can only view subjects in their batch and semester
    if (role === 'Student') {
      const student = await Student.findById(userId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      if (student.batch !== batch || student.semester !== semester) {
        return res.status(403).json({
          message: "You can only view attendance for your batch and semester"
        });
      }
    }

    // Setup Google Sheets
    const { sheets: sheetsApi, drive: driveApi } = await setupGoogleSheets();
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Format sheet title
    const sheetTitle = `${subject.subjectName}-${batch}-${semester}`;

    // Check if sheet exists
    const spreadsheet = await sheetsApi.spreadsheets.get({
      spreadsheetId,
    });

    const existingSheet = spreadsheet.data.sheets.find(
      sheet => sheet.properties.title === sheetTitle
    );

    if (!existingSheet) {
      return res.status(404).json({
        message: "No attendance sheet found for this subject"
      });
    }

    // Ensure permissions are read-only
    await setSheetPermissions(driveApi, spreadsheetId);

    // Generate shareable link
    const sheetLink = getSheetShareableLink(spreadsheetId, sheetTitle);

    return res.status(200).json({
      message: "Attendance sheet found",
      data: {
        subject: subject.subjectName,
        batch,
        semester,
        sheetUrl: sheetLink
      }
    });

  } catch (error) {
    console.error("Error retrieving subject attendance sheet:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Get personal attendance sheet for a student
export const getStudentPersonalSheet = async (req, res) => {
  try {
    // 1. Check authentication
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { userId, role } = req.user;
    const requestedStudentId = req.query.userId;

    if (!requestedStudentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    // 2. Role-based access
    if (role === 'Student' && userId !== requestedStudentId) {
      return res.status(403).json({ message: "You can only access your own attendance records" });
    }

    // 3. Fetch student
    const student = await Student.findById(requestedStudentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // 4. Set up Sheets API
    const { sheets: sheetsApi, drive: driveApi } = await setupGoogleSheets();
    const kritikaspreadsheetId = process.env.SPREADSHEET_ID;

    const sanitizeTitle = (title) => title.replace(/[\\\/:*?"<>|]/g, '-');
    const personalSheetTitle = sanitizeTitle(`${student.username}-${student.name}`);

    // 5. Check if sheet exists
    const spreadsheet = await sheetsApi.spreadsheets.get({ spreadsheetId });

    let existingSheet = spreadsheet.data.sheets.find(
      sheet => sheet.properties.title === personalSheetTitle
    );

    // 6. Fetch attendance records
    const attendanceRecords = await Attendance.find({ 'students.studentId': requestedStudentId })
      .populate('subject', 'subjectName subjectSem')
      .populate('faculty', 'name username')
      .sort({ date: 1 });

    const values = attendanceRecords.map(record => {
      const studentRecord = record.students.find(s => {
        const sId = typeof s.studentId === 'object' ? s.studentId.toString() : s.studentId;
        return sId === requestedStudentId;
      });

      return [
        record.subject?.subjectName || "Unknown Subject",
        new Date(record.date).toLocaleDateString(),
        studentRecord?.present ? "Present" : "Absent",
        record.faculty?.name || "Unknown Faculty",
        record.batch || "N/A",
        record.semester || "N/A"
      ];
    });

    // 7. Sheet does not exist - create and insert data
    if (!existingSheet) {
      await sheetsApi.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [{
            addSheet: {
              properties: {
                title: personalSheetTitle,
              }
            }
          }]
        }
      });

      // Add headers
      await sheetsApi.spreadsheets.values.update({
        spreadsheetId,
        range: `${personalSheetTitle}!A1:F1`,
        valueInputOption: 'RAW',
        resource: {
          values: [["Subject", "Date", "Present/Absent", "Faculty", "Batch", "Semester"]]
        }
      });

      // Insert data if any
      if (values.length > 0) {
        await sheetsApi.spreadsheets.values.append({
          spreadsheetId,
          range: `${personalSheetTitle}!A2:F`,
          valueInputOption: 'RAW',
          resource: { values }
        });
      }
    } else {
      // 8. Sheet exists - update it
      const sheetId = existingSheet.properties.sheetId;

      const response = await sheetsApi.spreadsheets.values.get({
        spreadsheetId,
        range: `${personalSheetTitle}!A:F`,
      });

      const rowCount = response.data.values ? response.data.values.length : 1;

      if (rowCount > 1) {
        await sheetsApi.spreadsheets.batchUpdate({
          spreadsheetId,
          resource: {
            requests: [{
              deleteDimension: {
                range: {
                  sheetId,
                  dimension: "ROWS",
                  startIndex: 1,
                  endIndex: rowCount
                }
              }
            }]
          }
        });
      }

      if (values.length > 0) {
        await sheetsApi.spreadsheets.values.append({
          spreadsheetId,
          range: `${personalSheetTitle}!A2:F`,
          valueInputOption: 'RAW',
          resource: { values }
        });
      }
    }

    // 9. Set permissions to read-only
    await setSheetPermissions(driveApi, spreadsheetId);

    // 10. Get shareable link
    const sheetLink = getSheetShareableLink(spreadsheetId, personalSheetTitle);

    return res.status(200).json({
      message: "Student attendance sheet generated successfully",
      data: {
        studentName: student.name,
        rollNumber: student.username,
        batch: student.batch,
        semester: student.semester,
        sheetUrl: sheetLink
      }
    });

  } catch (error) {
    console.error("Error generating student personal sheet:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Get all attendance records
export const getAllAttendance = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (role !== 'Admin' && role !== 'Faculty') {
      return res.status(403).json({ message: "Unauthorized access to attendance records" });
    }

    // Extract filters from query
    const { subject, faculty, batch, semester, startDate, endDate } = req.query;
    const query = {};

    // Faculty users can only view their own records unless they have special permissions
    if (role === 'Faculty') {
      query.faculty = userId;
    } else if (faculty) {
      query.faculty = faculty;
    }

    // Apply filters if provided
    if (subject) query.subject = subject;
    if (batch) query.batch = batch;
    if (semester) query.semester = semester;

    // Date range filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Fetch records with relevant populations
    const attendanceRecords = await Attendance.find(query)
      .populate('subject', 'subjectId subjectName subjectSem')
      .populate('faculty', 'name username')
      .populate({
        path: 'students.studentId',
        select: 'name username'
      })
      .sort({ date: -1 });

    // Calculate summary statistics
    const summary = {
      total: attendanceRecords.length,
      presentCount: attendanceRecords.reduce((acc, record) =>
        acc + record.students.filter(s => s.present).length, 0),
      absentCount: attendanceRecords.reduce((acc, record) =>
        acc + record.students.filter(s => !s.present).length, 0)
    };

    return res.status(200).json({
      message: "Attendance records retrieved successfully",
      data: {
        records: attendanceRecords,
        summary,
        count: attendanceRecords.length
      }
    });

  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Get attendance record by ID
export const getAttendanceById = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!req.params.id) {
      return res.status(400).json({ message: "Attendance ID is required" });
    }

    const attendance = await Attendance.findById(req.params.id)
      .populate('subject', 'subjectName subjectSem')
      .populate('faculty', 'name username')
      .populate('students.studentId', 'name username');

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Authorization check
    if (role === 'Student') {
      // Students can only view attendance records that include them
      const studentRecord = attendance.students.find(s => 
        getStringId(s.studentId) === userId
      );

      if (!studentRecord) {
        return res.status(403).json({ message: "You are not part of this attendance record" });
      }
    } else if (role === 'Faculty') {
      // Faculty can only view their own attendance records
      const attendanceFacultyId = getStringId(attendance.faculty);

      if (attendanceFacultyId && attendanceFacultyId !== userId) {
        return res.status(403).json({ message: "You are not authorized to view this attendance record" });
      }
    }

    return res.status(200).json({
      message: "Attendance record retrieved successfully",
      data: attendance
    });

  } catch (error) {
    console.error("Error fetching attendance record:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Get student attendance record
export const getStudentAttendance = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if the requesting user is the same student or has appropriate role
    const requestedStudentId = req.query.studentId || userId;

    if (!requestedStudentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    if (role === 'Student' && userId !== requestedStudentId) {
      return res.status(403).json({ message: "You can only access your own attendance records" });
    }

    // Get the student to ensure they exist
    const student = await Student.findById(requestedStudentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Generate Google Sheet for student attendance
    let sheetUrl = null;
    try {
      // Setup Google Sheets
      const { sheets: sheetsApi, drive: driveApi } = await setupGoogleSheets();
      const spreadsheetId = process.env.SPREADSHEET_ID;

      // Format sheet title for personal sheet
      const sanitizeTitle = (title) => title.replace(/[\\\/:*?"<>|]/g, '-');
      const personalSheetTitle = sanitizeTitle(`${student.username}-${student.name}`);

      // Ensure permissions are read-only
      await setSheetPermissions(driveApi, spreadsheetId);

      // Generate shareable link
      sheetUrl = getSheetShareableLink(spreadsheetId, personalSheetTitle);
    } catch (sheetError) {
      console.error("Error generating Google Sheet link:", sheetError);
      // Continue without the sheet URL
    }

    // Build query based on parameters
    const { subject, semester, startDate, endDate } = req.query;
    const query = { 'students.studentId': requestedStudentId };

    if (subject) query.subject = subject;
    if (semester) query.semester = semester;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.date.$lte = endDateTime;
      }
    }

    // Get attendance records
    const attendanceRecords = await Attendance.find(query)
      .populate('subject', 'subjectName subjectSem totalClasses')
      .populate('faculty', 'name username')
      .sort({ date: -1 });

    // Process attendance data
    const attendanceData = attendanceRecords.map(record => {
      const studentRecord = record.students.find(s => 
        getStringId(s.studentId) === requestedStudentId
      );

      return {
        _id: record._id,
        date: record.date,
        subject: record.subject,
        faculty: record.faculty,
        semester: record.semester,
        batch: record.batch,
        present: studentRecord ? studentRecord.present : false
      };
    });

    // Calculate subject-wise statistics
    const subjectStats = {};
    attendanceData.forEach(record => {
      if (!record.subject || !record.subject._id) return;

      const subjectId = record.subject._id.toString();

      if (!subjectStats[subjectId]) {
        subjectStats[subjectId] = {
          subject: record.subject,
          totalClasses: 0,
          attendedClasses: 0,
          percentage: 0
        };
      }

      subjectStats[subjectId].totalClasses++;
      if (record.present) {
        subjectStats[subjectId].attendedClasses++;
      }
    });

    // Calculate percentages
    Object.keys(subjectStats).forEach(key => {
      const stats = subjectStats[key];
      stats.percentage = stats.totalClasses > 0
        ? parseFloat((stats.attendedClasses / stats.totalClasses * 100).toFixed(2))
        : 0;
    });

    // Calculate overall statistics
    const totalClasses = attendanceData.length;
    const attendedClasses = attendanceData.filter(record => record.present).length;
    const attendancePercentage = totalClasses > 0
      ? parseFloat((attendedClasses / totalClasses * 100).toFixed(2))
      : 0;

    return res.status(200).json({
      message: "Student attendance records retrieved successfully",
      data: {
        studentInfo: {
          id: student._id,
          name: student.name,
          batch: student.batch,
          semester: student.semester,
          branch: student.branch
        },
        statistics: {
          overall: {
            totalClasses,
            attendedClasses,
            attendancePercentage
          },
          subjectWise: Object.values(subjectStats)
        },
        attendanceRecords: attendanceData,
        sheetUrl: sheetUrl
      }
    });

  } catch (error) {
    console.error("Error fetching student attendance:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Update attendance
export const updateAttendance = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { students } = req.body;
    const attendanceId = req.params.id;

    if (!attendanceId) {
      return res.status(400).json({ message: "Attendance ID is required" });
    }

    // Validate students array
    if (!students || !Array.isArray(students)) {
      return res.status(400).json({ message: "Invalid students data - array expected" });
    }

    // Find the attendance record
    const attendance = await Attendance.findById(attendanceId)
      .populate('subject', 'subjectName')
      .populate('faculty', 'name username')
      .populate('students.studentId', 'name username');

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Check for missing faculty reference
    if (!attendance.faculty) {
      return res.status(400).json({ message: "Attendance record has no faculty assigned" });
    }

    // Authorization check
    const attendanceFacultyId = getStringId(attendance.faculty);

    if (attendanceFacultyId !== userId && role !== 'Admin') {
      return res.status(403).json({ message: "You are not authorized to update this attendance record" });
    }

    // Track changes for Google Sheets update
    const changes = [];

    for (const update of students) {
      if (!update.studentId) continue;

      // Convert student ID to string for comparison
      const updateStudentId = getStringId(update.studentId);

      const studentIndex = attendance.students.findIndex(s => 
        getStringId(s.studentId) === updateStudentId
      );

      if (studentIndex !== -1) {
        const newPresent = !!update.present;
        const oldPresent = attendance.students[studentIndex].present;

        if (newPresent !== oldPresent) {
          // Status changed, track for Google Sheets update
          changes.push({
            studentId: update.studentId,
            oldStatus: oldPresent ? "Present" : "Absent",
            newStatus: newPresent ? "Present" : "Absent"
          });
        }

        // Update status
        attendance.students[studentIndex].present = newPresent;
      } else {
        // Add student if not found
        attendance.students.push({
          studentId: update.studentId,
          present: !!update.present
        });

        // Track new addition
        changes.push({
          studentId: update.studentId,
          oldStatus: "N/A",
          newStatus: update.present ? "Present" : "Absent"
        });
      }
    }

    // Save the updated attendance
    await attendance.save();

    // Calculate counts for response
    const totalPresent = attendance.students.filter(s => s.present).length;
    const totalAbsent = attendance.students.filter(s => !s.present).length;

    // Update Google Sheets if there are changes
    if (changes.length > 0) {
      try {
        const { sheets: sheetsApi, drive: driveApi } = await setupGoogleSheets();
        const spreadsheetId = process.env.SPREADSHEET_ID;

        // Format sheet title
        const sheetTitle = `${attendance.subject.subjectName}-${attendance.batch}-${attendance.semester}`;

        // Check if sheet exists
        const spreadsheet = await sheetsApi.spreadsheets.get({
          spreadsheetId,
        });

        const existingSheet = spreadsheet.data.sheets.find(
          sheet => sheet.properties.title === sheetTitle
        );

        if (existingSheet) {
          // Get current sheet data
          const response = await sheetsApi.spreadsheets.values.get({
            spreadsheetId,
            range: `${sheetTitle}!A:E`,
          });

          const sheetData = response.data.values || [];

          // Format date for comparison
          const formattedDate = new Date(attendance.date).toLocaleDateString();

          // Look for rows with matching date and update them
          for (const change of changes) {
            const studentInfo = attendance.students.find(s => 
              getStringId(s.studentId) === getStringId(change.studentId)
            );

            if (!studentInfo || !studentInfo.studentId) continue;

            const studentUsername = typeof studentInfo.studentId === 'string'
              ? studentInfo.studentId
              : studentInfo.studentId.username;

            // Find rows that match this student and date
            for (let i = 1; i < sheetData.length; i++) {
              const row = sheetData[i];
              if (row[0] === studentUsername && row[2] === formattedDate) {
                // Update this row's present/absent status
                await sheetsApi.spreadsheets.values.update({
                  spreadsheetId,
                  range: `${sheetTitle}!D${i + 1}`,
                  valueInputOption: 'RAW',
                  resource: {
                    values: [[studentInfo.present ? "Present" : "Absent"]]
                  }
                });
                break;
              }
            }
          }

          // Also update personal student sheets
          await updatePersonalStudentSheets(sheetsApi, driveApi, spreadsheetId, changes, attendance);

          // Ensure permissions are read-only
          await setSheetPermissions(driveApi, spreadsheetId);
        }
      } catch (sheetsError) {
        console.error("Error updating Google Sheets:", sheetsError);
        // Continue without failing the API response
      }
    }

    return res.status(200).json({
      message: "Attendance updated successfully",
      data: {
        attendanceId: attendance._id,
        totalPresent,
        totalAbsent,
        totalStudents: attendance.students.length,
        changes: changes.length
      }
    });

  } catch (error) {
    console.error("Error updating attendance:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Delete attendance
export const deleteAttendance = async (req, res) => {
  try {
    const { userId, role } = req.user;
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!req.params.id) {
      return res.status(400).json({ message: "Attendance ID is required" });
    }

    const attendance = await Attendance.findById(req.params.id)
      .populate('subject', 'subjectName');

    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Check for missing faculty reference
    if (!attendance.faculty) {
      return res.status(400).json({ message: "Attendance record has no faculty assigned" });
    }

    // Authorization check
    const attendanceFacultyId = getStringId(attendance.faculty);

    if (role !== 'Admin' && attendanceFacultyId !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this attendance record" });
    }

    // Store subject ID before deletion for decrementing class count
    const subjectId = attendance.subject;
    const subjectName = attendance.subject.subjectName;
    const batch = attendance.batch;
    const semester = attendance.semester;
    const attendanceDate = new Date(attendance.date).toLocaleDateString();

    // Try to update Google Sheets to mark this attendance as deleted
    try {
      await markAttendanceAsDeleted(attendance, attendanceDate, subjectName);
    } catch (sheetsError) {
      console.error("Error updating Google Sheets for deletion:", sheetsError);
      // Continue without failing the API response
    }

    // Delete the attendance record
    await Attendance.findByIdAndDelete(req.params.id);

    // Update the Subject model to decrement totalClasses (with null check)
    if (subjectId) {
      await Subject.findByIdAndUpdate(subjectId, { $inc: { totalClasses: -1 } });
    }

    return res.status(200).json({
      message: "Attendance record deleted successfully",
      data: {
        deletedId: req.params.id,
        subjectUpdated: !!subjectId
      }
    });

  } catch (error) {
    console.error("Error deleting attendance record:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

// Helper function to sync MongoDB attendance data with Google Sheets
export const syncAllAttendanceToSheets = async (req, res) => {
  try {
    const { role } = req.user;
    if (!req.user || role !== 'Admin') {
      return res.status(403).json({ message: "Only administrators can perform full synchronization" });
    }

    // Setup Google Sheets
    const { sheets: sheetsApi, drive: driveApi } = await setupGoogleSheets();
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Get all subjects with attendance records
    const subjects = await Subject.find().select('subjectName');

    // Get unique batches and semesters with attendance records
    const attendanceAggregation = await Attendance.aggregate([
      { $group: { _id: { batch: "$batch", semester: "$semester", subjectId: "$subject" } } }
    ]);

    // Create mapping of subject ID to name
    const subjectMap = {};
    subjects.forEach(subject => {
      subjectMap[subject._id.toString()] = subject.subjectName;
    });

    // Process each unique combination
    let processedCount = 0;
    let errorCount = 0;

    for (const item of attendanceAggregation) {
      const { batch, semester, subjectId } = item._id;
      const subjectName = subjectMap[subjectId.toString()];

      if (!subjectName || !batch || !semester) continue;

      try {
        await syncSubjectSheet(sheetsApi, driveApi, spreadsheetId, subjectId, subjectName, batch, semester);
        processedCount++;
      } catch (error) {
        console.error(`Error syncing ${subjectMap[subjectId]}-${batch}-${semester}:`, error);
        errorCount++;
      }
    }

    // Also sync student personal sheets
    const students = await Student.find().select('_id username name batch semester');
    let studentProcessed = 0;

    for (const student of students) {
      try {
        await syncStudentPersonalSheet(sheetsApi, driveApi, spreadsheetId, student);
        studentProcessed++;
      } catch (error) {
        console.error(`Error creating personal sheet for ${student.username}:`, error);
        errorCount++;
      }
    }

    return res.status(200).json({
      message: "Synchronization completed",
      data: {
        subjects: {
          processed: processedCount,
          errors: errorCount
        },
        students: {
          processed: studentProcessed,
          errors: students.length - studentProcessed
        }
      }
    });

  } catch (error) {
    console.error("Error in synchronization process:", error);
    return res.status(500).json({ message: "Synchronization failed", error: error.message });
  }
};
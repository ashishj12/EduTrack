# EduTrack API Documentation

## Overview
EduTrack provides a comprehensive API for managing students, faculty, and subjects in an educational institution. This documentation outlines the available routes, their usage, and expected responses.

---

## Authentication Routes

### Student Routes

#### Register Student
- **URL:** `/api/admin/register-student`
- **Method:** `POST`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer admin_access_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "username": "student_username",
    "password": "student_password",
    "name": "student_name",
    "branch": "student_branch",
    "batch": "student_batch",
    "semester": student_semester
  }
  ```
- **Response:**
  ```json
  {
    "message": "Registration successful",
    "user": {
      "id": "student_id",
      "username": "student_username",
      "role": "Student",
      "name": "student_name",
      "branch": "student_branch",
      "batch": "student_batch",
      "semester": student_semester
    },
    "accessToken": "access_token",
    "refreshToken": "refresh_token"
  }
  ```

#### Login Student
- **URL:** `/api/student/login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "student_username",
    "password": "student_password"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "student_id",
      "username": "student_username",
      "role": "Student"
    },
    "accessToken": "access_token",
    "refreshToken": "refresh_token"
  }
  ```

#### Get Current Student
- **URL:** `/api/student/me`
- **Method:** `GET`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer access_token"
  }
  ```
- **Response:**
  ```json
  {
    "user": {
      "id": "student_id",
      "username": "student_username",
      "role": "Student"
    }
  }
  ```

---

### Faculty Routes

#### Register Faculty
- **URL:** `/api/admin/register-faculty`
- **Method:** `POST`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer admin_access_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "username": "faculty_username",
    "password": "faculty_password",
    "name": "faculty_name",
    "department": "faculty_department"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Registration successful",
    "user": {
      "id": "faculty_id",
      "username": "faculty_username",
      "role": "Faculty",
      "name": "faculty_name",
      "department": "faculty_department"
    },
    "accessToken": "access_token",
    "refreshToken": "refresh_token"
  }
  ```

#### Login Faculty
- **URL:** `/api/faculty/login-faculty`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "faculty_username",
    "password": "faculty_password"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "faculty_id",
      "username": "faculty_username",
      "role": "Faculty"
    },
    "accessToken": "access_token",
    "refreshToken": "refresh_token"
  }
  ```

#### Get Current Faculty
- **URL:** `/api/faculty/get-faculty`
- **Method:** `GET`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer access_token"
  }
  ```
- **Response:**
  ```json
  {
    "user": {
      "id": "faculty_id",
      "username": "faculty_username",
      "role": "Faculty"
    }
  }
  ```

#### Upload File for Faculty
- **URL:** `/api/upload/faculty`
- **Method:** `POST`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer access_token"
  }
  ```
- **Request Body:**
  - Form-data with a single file field named `facultyFile`
- **Response:**
  ```json
  {
    "message": "File uploaded successfully",
    "file": {
      "fieldname": "facultyFile",
      "originalname": "original_filename",
      "encoding": "7bit",
      "mimetype": "file_mimetype",
      "destination": "uploads/",
      "filename": "uploaded_filename",
      "path": "uploads/uploaded_filename",
      "size": file_size
    }
  }
  ```

---

### Subject Routes

#### Assign Subject to Faculty
- **URL:** `/api/admin/assign-subject`
- **Method:** `POST`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer admin_access_token"
  }
  ```
- **Request Body:**
  ```json
  {
    "facultyId": "faculty_id",
    "sunjectName": "subjectName",
    "SubjectSem": "SubjectSem"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Subject assigned successfully",
    "faculty": {
      "id": "faculty_id",
      "username": "faculty_username",
      "subjects": ["subject_id"]
    }
  }
  ```

#### Get Assigned Subjects for Faculty
- **URL:** `/api/faculty/assigned-subjects`
- **Method:** `GET`
- **Headers:**
  ```json
  {
    "Authorization": "Bearer faculty_access_token"
  }
  ```
- **Response:**
  ```json
  {
    "subjects": [
      {
        "id": "subject_id",
        "subjectName": "subject_name",
        "subjectSem": subject_semester,
        "totalClasses": total_classes
      }
    ]
  }
  ```

---

### Admin Routes

#### Register Admin
- **URL:** `/api/admin/admin-register`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "admin_username",
    "password": "admin_password"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Registration successful",
    "user": {
      "id": "admin_id",
      "username": "admin_username",
      "secretKey": "secretKey"
    },
    "accessToken": "access_token",
    "refreshToken": "refresh_token"
  }
  ```

#### Login Admin
- **URL:** `/api/admin/admin-login`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "username": "admin_username",
    "password": "admin_password",
    "secretKey": "secretKey"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Login successful",
    "user": {
      "id": "admin_id",
      "username": "admin_username"
    },
    "accessToken": "access_token",
    "refreshToken": "refresh_token"
  }
  ```

### Attendance Routes

The following routes are used to manage attendance records in the system. All routes are protected and require authentication via a valid token.

#### 1. Mark Attendance
- **Endpoint:** `POST /mark-attendance`
- **Middleware:**
  - `authenticateToken`: Validates the faculty's token.
  - `uploadAndProcess('attendanceImage')`: Handles image upload and processing.
- **Controller:** `markAttendance`
- **Description:** Marks attendance for a student using the provided data.

#### 2. Get All Attendance Records
- **Endpoint:** `GET /all-attendance`
- **Middleware:**
  - `authenticateToken`: Validates the faculty's token.
- **Controller:** `getAllAttendance`
- **Description:** Retrieves all attendance records.

#### 3. Get Student Attendance Records
- **Endpoint:** `GET /get-student/records`
- **Middleware:**
  - `authenticateToken`: Validates the faculty's token.
- **Controller:** `getStudentAttendance`
- **Description:** Retrieves attendance records for a specific student.

#### 4. Get Student Personal Attendance Sheet
- **Endpoint:** `GET /student-sheet`
- **Middleware:**
  - `authenticateToken`: Validates the faculty's token.
- **Controller:** `getStudentPersonalSheet`
- **Description:** Retrieves the personal attendance sheet for a student.

#### 5. Get Subject Attendance Sheet
- **Endpoint:** `GET /subject-sheet/:subjectId/:batch/:semester`
- **Middleware:**
  - `authenticateToken`: Validates the faculty's token.
- **Controller:** `getSubjectAttendanceSheet`
- **Description:** Retrieves the Google Sheet link for a specific subject's attendance.

#### 6. Sync All Attendance Data to Google Sheets
- **Endpoint:** `POST /sync-sheets`
- **Middleware:**
  - `authenticateToken`: Validates the faculty's token.
- **Controller:** `syncAllAttendanceToSheets`
- **Description:** Syncs all attendance data to Google Sheets. This route is typically restricted to admin users.

#### 7. Get Attendance by ID
- **Endpoint:** `GET /:id`
- **Middleware:**
  - `authenticateToken`: Validates the faculty's token.
- **Controller:** `getAttendanceById`
- **Description:** Retrieves a specific attendance record by its ID.

#### 8. Update Attendance Record
- **Endpoint:** `PUT /:id`
- **Middleware:**
  - `authenticateToken`: Validates the faculty's token.
- **Controller:** `updateAttendance`
- **Description:** Updates an existing attendance record by its ID.

#### 9. Delete Attendance Record
- **Endpoint:** `DELETE /:id`
- **Middleware:**
  - `authenticateToken`: Validates the faculty's token.
- **Controller:** `deleteAttendance`
- **Description:** Deletes an attendance record by its ID.
---  
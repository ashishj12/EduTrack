# EduTrack API Documentation

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
    "sunjectName":"subjectName",
    "SubjectSem":"SubjectSem"
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

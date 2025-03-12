# EduTrack API Documentation

## Authentication Routes

### Student Routes

#### Register Student
- **URL:** `/api/auth/register`
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
    "message": "Registration successful",
    "user": {
      "id": "student_id",
      "username": "student_username",
      "role": "Student"
    },
    "accessToken": "access_token",
    "refreshToken": "refresh_token"
  }
  ```

#### Login Student
- **URL:** `/api/auth/login`
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
- **URL:** `/api/auth/me`
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
- **URL:** `/api/auth/register-faculty`
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
    "message": "Registration successful",
    "user": {
      "id": "faculty_id",
      "username": "faculty_username",
      "role": "Faculty"
    },
    "accessToken": "access_token",
    "refreshToken": "refresh_token"
  }
  ```

#### Login Faculty
- **URL:** `/api/auth/login-faculty`
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
- **URL:** `/api/auth/faculty`
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


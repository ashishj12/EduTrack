# EduTrack - AI-Powered Attendance Management System

## 📌 Project Overview

EduTrack is an innovative attendance management system that leverages AI-based facial recognition technology to automate and streamline attendance tracking in educational institutions. The system is designed with role-based access controls for students, faculty, and administrators, providing customized experiences through dedicated dashboards.

The application eliminates manual attendance processes, reduces administrative overhead, and ensures accurate attendance records through its advanced facial recognition capabilities.

## 🚀 Key Features

- **AI-Powered Face Recognition**: Automated attendance tracking using facial recognition technology.
- **Role-Based Access Control**: Separate interfaces for administrators, faculty, and students.
- **Secure Authentication**: Hardcoded credentials in MongoDB Atlas without registration route.
- **Cloud-Based Storage**: Data persistence using MongoDB & MongoDB Atlas.
- **Interactive Dashboards**:
  - Admin Dashboard for system management.
  - Faculty Dashboard for managing attendance records.
  - Student Dashboard for viewing attendance history and schedules.
- **Containerized Deployment**: Dockerized setup for easy installation and scalability.

## 🖥️ Technology Stack

- **Frontend**: React.js with Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **AI Components**: TensorFlow.js for facial recognition
- **Containerization**: Docker & Docker Compose
- **Authentication**: JWT (JSON Web Tokens)

## 🏗️ Project Structure

### Frontend (frontend/)
```bash
frontend/
│── public/
│── src/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── lib/
│   ├── pages/
│   │   ├── AdminDashboard/
│   │   ├── FacultyDashboard/
│   │   ├── HomePage/
│   │   ├── StudentDashboard/
│   ├── services/
│   ├── utils/
│── App.css
│── App.jsx
│── index.css
│── main.jsx
│── index.html
│── package.json
│── vite.config.js


### Backend (backend/)

backend/
│── controllers/
│── middleware/
│── models/
│── routes/
│── utils/
│── .env.sample
│── .gitignore
│── server.js
│── package.json
```
## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
### Manual Setup

### Backend Setup
- Navigate to the backend directory: `cd backend`

- Create a .env file based on .env.sample: 
    ``PORT=5000
    MONGO_URI=your_mongodb_atlas_connection_string
    JWT_SECRET=your_jwt_secret
    NODE_ENV=development``
-  Start the Backend Server:
    npm start

### Frontend Setup

-  Navigate to the frontend directory: `cd frontend`
-  Install dependencies : npm install
-  Start the development server
    npm run dev
-  Access the application at http://localhost:5147

### 👤 Role-Based Access Control (RBAC)
EduTrack implements a secure role-based access control system with the following user roles:

### 🔑 Admin

- Full access to all system features
- User management capabilities
- Analytics and reporting

### 👨‍🏫 Faculty

- Manage course attendance
- View student attendance records
- Generate attendance reports
- Mark attendance manually if needed

### 🧑‍🎓 Student

- View personal attendance records
- Check schedules and timetables
- Receive notifications for attendance status

Note: User credentials are pre-defined in MongoDB Atlas. There is no registration route as per institutional security requirements.

### 👥 Contributors

**Ashish Kumar** - Web App Developer & Maintainer
**Tanisk Saini** - App Developer & Maintainer
**Lokendra Singh** - ML Developer
**Uttam Kumar** - Data Analytics
**Utkarsh Verma** - UI/UX Designer

### 📄 License
This project is licensed under the MIT License.
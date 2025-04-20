# EduTrack Frontend

EduTrack is a web-based application designed to help educators and students manage their attendance efficiently. This repository contains the frontend code for the EduTrack project.

## Features

- User-friendly interface for managing courses and assignments.
- Real-time updates and notifications.
- Integration with backend APIs for seamless data management.
- Responsive design for desktop and mobile devices.

## Technologies Used

- **Framework**: React.js
- **Styling**: Tailwind CSS
- **API Communication**: Axios
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ashishj12/EduTrack.git
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

3. Create a `.env` file in the root directory and add the required environment variables:
    ```
    VITE_API_BASE_URL=<your-backend-api-url>
    ```
    
     ```
    VITE_SPREADSHEET_ID=<your-google-sheet-id>
    ```
    
4. Start the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5. Open your browser and navigate to `http://localhost:5173`.

## Folder Structure

```
/src
  /components    # Reusable UI components
  /context       # Context APIs
  /pages         # Application pages
  /services      # API calls
  /utils         # Utility functions
  /styles        # Global and component-specific styles
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m "Add feature-name"`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

## Contact

For any questions or feedback, please contact [edutrack086@gmail.com].
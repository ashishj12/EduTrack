## Face Recognition Model Setup

### Prerequisites

- Python 3.8+
- Virtual Environment (optional but recommended)
- Required Python libraries: `tensorflow`, `keras`, `mtcnn`, `numpy`, `opencv-python`

### Setup Instructions

1. **Navigate to the Face Recognition Directory**:

        cd face

2. **Create a Virtual Environment** (optional but recommended):

        python -m venv venv

3. **Activate the Virtual Environment**:

   - On Windows:

            venv\Scripts\activate

   - On macOS/Linux:

            source venv/bin/activate

4. **Install Required Dependencies**:

        pip install -r requirements.txt

5. **Run the Face Recognition API**:

        uvicorn main:app --host 0.0.0.0 --port 8000

6. **Verify the API**:

   Access the API at `http://0.0.0.0:8000` to ensure it is running correctly.

### Notes

- Ensure the `FACE_RECOGNITION_API_URL` in your `.env` file matches the API URL (`http://0.0.0.0:8000`).
- The `requirements.txt` file should include all necessary dependencies for the face recognition model.


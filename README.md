# Deepfake Detector Backend

This directory contains the FastAPI backend for the Deepfake Detector application.

## Deployment on Hugging Face Spaces

This backend is designed to be deployed as a Hugging Face Space.

### Prerequisites

1.  **Google Cloud Project:** Create a project, enable "Google Drive API" and "Google Docs API".
2.  **Service Account:** Create a Service Account, download its JSON key file. Note the service account's email address.
3.  **Google Doc:** Create a Google Doc for storing contact messages. Get its ID from the URL.
4.  **Share Google Doc:** Share the Google Doc with the Service Account's email address, granting "Editor" permissions.
5.  **Hugging Face Account:** You need an account on [huggingface.co](https://huggingface.co/).

### Setup Instructions

1.  **Create a Hugging Face Space:**
    *   Go to "New" -> "Space".
    *   Give it a name.
    *   Select "Docker" or "Gradio/Streamlit/Static" (choose Docker if you prefer, but Python SDK works too). If choosing non-Docker, ensure Python 3.11 (or as specified in `runtime.txt`) is available.
    *   Choose "Public" or "Private".
    *   Click "Create Space".
2.  **Upload Files:**
    *   Upload the contents of this `backend/` directory (main.py, requirements.txt, runtime.txt, yes_final_model.h5) to your Space's repository using Git or the web UI.
3.  **Configure Secrets:**
    *   Go to your Space's "Settings" tab, then "Secrets".
    *   Add the following secrets:
        *   `SIGHTENGINE_API_USER`: Your Sightengine API User ID.
        *   `SIGHTENGINE_API_SECRET`: Your Sightengine API Secret.
        *   `GOOGLE_DOC_ID`: The ID of the Google Doc you created/shared.
        *   `GOOGLE_SERVICE_ACCOUNT_JSON`: **Paste the entire content** of the JSON key file you downloaded for your service account here.
        *   `FRONTEND_URL`: The URL of your deployed Netlify frontend (e.g., `https://your-app.netlify.app`).
4.  **Configure App File/Port (if needed):**
    *   If using the Python SDK template (not Docker), ensure the Space knows your app runs from `main.py` (or `app.py` if you rename it). Spaces usually default to port 7860, but FastAPI runs on 8000 by default locally. Check if you need to specify the port or if Spaces handles the proxying. Often, running on the default `uvicorn main:app --host 0.0.0.0 --port 7860` might be needed if Spaces expects that port. Test with the default Uvicorn command first.
5.  **Restart/Check Logs:** The Space should build/restart. Check the "Logs" tab for errors during startup (model loading, missing secrets, etc.).

### Local Development

1.  Create a `.env` file in the `backend/` directory (add to `.gitignore`).
2.  Add your secrets to the `.env` file:
    ```dotenv
    SIGHTENGINE_API_USER=your_user_id
    SIGHTENGINE_API_SECRET=your_secret
    GOOGLE_DOC_ID=your_doc_id
    GOOGLE_SERVICE_ACCOUNT_JSON='{"type": "service_account", ...}' # Paste JSON content as a single string
    FRONTEND_URL=http://localhost:5173
    ```
3.  Install requirements: `pip install -r requirements.txt`
4.  Run locally: `python main.py` (will likely use port 8000)

---
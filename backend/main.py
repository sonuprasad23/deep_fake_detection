# backend/main.py
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime
from PIL import Image
import numpy as np
import requests
import json
import io
import os
import sys

# --- Google API Imports ---
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import google.auth

# --- Configuration & Secret Loading ---
# Model Path (relative to this file inside the Docker container's /code directory)
MODEL_PATH = 'yes_final_model.h5'

# Load Environment Variables / Secrets provided by Hugging Face Spaces
API_USER = os.getenv("SIGHTENGINE_API_USER")
API_SECRET = os.getenv("SIGHTENGINE_API_SECRET")
GOOGLE_SERVICE_ACCOUNT_JSON_STR = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
GOOGLE_DOC_ID = os.getenv("GOOGLE_DOC_ID")
# Default to localhost for dev, expect FRONTEND_URL secret in production
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# --- Sanity Checks for Secrets (log warnings on startup) ---
if not API_USER or not API_SECRET:
    print("⚠️ STARTUP WARNING: Sightengine API secrets not fully configured (SIGHTENGINE_API_USER, SIGHTENGINE_API_SECRET). Advanced detection may fail.")
if not GOOGLE_SERVICE_ACCOUNT_JSON_STR:
    print("⚠️ STARTUP WARNING: Google Service Account JSON not configured (GOOGLE_SERVICE_ACCOUNT_JSON secret). Contact form saving will fail.")
if not GOOGLE_DOC_ID:
    print("⚠️ STARTUP WARNING: Google Document ID not configured (GOOGLE_DOC_ID secret). Contact form saving will fail.")
if FRONTEND_URL == "http://localhost:5173":
     print("ℹ️ STARTUP INFO: Using default localhost FRONTEND_URL for CORS. Ensure FRONTEND_URL secret is set for deployed frontend.")
# --- End Secret Loading ---


# --- Attempt to load Keras model ---
MODEL_LOADED = False
model = None
try:
    # Ensure tensorflow is importable
    import tensorflow as tf # Check if TF is installed and importable
    print(f"TensorFlow version: {tf.__version__}")

    if os.path.exists(MODEL_PATH):
        print(f"Attempting to load Keras model from: {os.path.abspath(MODEL_PATH)}")
        # Load model using tf.keras for consistency
        model = tf.keras.models.load_model(MODEL_PATH)
        MODEL_LOADED = True
        print("✅ Local Keras model loaded successfully.")
    else:
        print(f"⚠️ STARTUP WARNING: Keras model file not found at '{MODEL_PATH}'. Basic detection disabled.")
except ImportError:
    print("⚠️ STARTUP WARNING: TensorFlow not installed or import failed. Basic model detection disabled.")
except Exception as e:
    print(f"❌ STARTUP ERROR: Error loading Keras model from '{MODEL_PATH}': {e}. Basic model detection disabled.")
# --- End Keras Model Section ---


app = FastAPI(title="Deepfake Detector Backend")

# --- CORS Configuration ---
origins = [
    "http://localhost:3000", # Common React dev port
    "http://localhost:5173", # Common Vite dev port
    FRONTEND_URL,            # The URL from the environment variable/secret
]
origins = [origin for origin in origins if origin and origin.startswith("http")] # Filter out invalid/empty URLs

print(f"ℹ️ Configuring CORS for origins: {origins}")
if not origins:
    print("⚠️ WARNING: No valid FRONTEND_URL found for CORS. Allowing all origins ('*'). THIS IS INSECURE FOR PRODUCTION.")
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"], # Be specific about allowed methods
    allow_headers=["*"], # Allow common headers, or specify list e.g., ["Content-Type"]
)
# --- End CORS Configuration ---

# --- Pydantic Model for Contact Form Data ---
class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str | None = None
    message: str

# --- Google API Configuration & Helper Functions ---
SCOPES = ['https://www.googleapis.com/auth/documents'] # Only Docs scope needed to append

def get_google_credentials():
    """Loads Google Service Account credentials from environment variable."""
    if not GOOGLE_SERVICE_ACCOUNT_JSON_STR:
        print("❌ Cannot get Google credentials: GOOGLE_SERVICE_ACCOUNT_JSON secret is not set.")
        return None
    try:
        creds_json = json.loads(GOOGLE_SERVICE_ACCOUNT_JSON_STR)
        creds = service_account.Credentials.from_service_account_info(creds_json, scopes=SCOPES)
        return creds
    except json.JSONDecodeError as e:
        print(f"❌ Error decoding GOOGLE_SERVICE_ACCOUNT_JSON secret: {e}. Ensure it's valid JSON string.")
        return None
    except Exception as e:
        print(f"❌ Unexpected error loading Google credentials: {e}")
        return None

def save_message_to_google_doc(entry: dict):
    """Appends a formatted message entry to the configured Google Doc."""
    if not GOOGLE_DOC_ID:
        print("❌ Cannot save to Google Doc: GOOGLE_DOC_ID secret is not set.")
        raise ValueError("Google Doc ID is not configured on the server.")

    credentials = get_google_credentials()
    if not credentials:
        raise ValueError("Google API authentication failed. Check server configuration/secrets.")

    try:
        docs_service = build('docs', 'v1', credentials=credentials)
        formatted_message = (
            f"--- New Message: {entry['timestamp']} ---\n"
            f"Name: {entry['name']}\n"
            f"Email: {entry['email']}\n"
            f"Subject: {entry.get('subject', '(No Subject)')}\n"
            f"Message:\n{entry['message']}\n"
            f"-----------------------------------------\n\n"
        )

        # Find the end index of the document body to append
        document = docs_service.documents().get(documentId=GOOGLE_DOC_ID, fields='body(content(endIndex))').execute()
        # Use .get with default to handle potentially empty documents safely
        end_index = document.get('body', {}).get('content', [{}])[-1].get('endIndex', 1)


        requests_body = [{
            'insertText': {
                'location': {'index': end_index},
                'text': formatted_message
            }
        }]

        print(f"ℹ️ Appending message to Google Doc ID: {GOOGLE_DOC_ID}")
        docs_service.documents().batchUpdate(
            documentId=GOOGLE_DOC_ID,
            body={'requests': requests_body}
        ).execute()
        print("✅ Message successfully appended to Google Doc.")
        return True

    except HttpError as error:
        print(f"❌ Google API Error saving to Doc ID {GOOGLE_DOC_ID}: {error}")
        error_details = f"Google API Error ({error.resp.status}): {error._get_reason()}"
        if error.resp.status == 403:
             raise PermissionError(f"Permission denied writing to Google Doc. Ensure Service Account has Editor access to Doc ID {GOOGLE_DOC_ID}.")
        elif error.resp.status == 404:
             raise FileNotFoundError(f"Google Doc ID {GOOGLE_DOC_ID} not found.")
        else:
             raise Exception(error_details) # General Google API error
    except Exception as e:
        print(f"❌ Unexpected error saving to Google Doc: {e}")
        raise Exception(f"Failed to save message to Google Doc: {str(e)}")

# --- Helper Function to Process Image ---
def process_image(file_content: bytes) -> Image.Image:
    """Opens image from bytes and converts to RGB if necessary."""
    try:
        image = Image.open(io.BytesIO(file_content))
        # Convert to RGB if not already (required by many models)
        if image.mode != 'RGB':
            print(f"ℹ️ Converting image from {image.mode} to RGB.")
            image = image.convert('RGB')
        return image
    except Exception as e:
        print(f"❌ Error processing image with Pillow: {e}")
        raise HTTPException(status_code=400, detail="Invalid or unsupported image file format.")

# --- Detection Functions ---
def detect_with_basic_model(image: Image.Image):
    """Detects using the local Keras model."""
    if not MODEL_LOADED or model is None:
        print("❌ Basic model requested but not loaded/available.")
        raise HTTPException(status_code=503, detail="Basic detection model is currently unavailable.")

    try:
        # Resize with high-quality filter
        img_resized = image.resize((256, 256), Image.Resampling.LANCZOS)
        img_array = np.array(img_resized) / 255.0
        img_array = np.expand_dims(img_array, axis=0) # Add batch dimension

        # Make prediction (assumes model outputs probability of being REAL)
        prediction_real = model.predict(img_array)[0][0]
        probability_real_percent = prediction_real * 100
        probability_ai_percent = (1 - prediction_real) * 100

        # Determine result and confidence for the detected class
        if probability_real_percent >= probability_ai_percent:
            is_ai = False # Detected as Real
            confidence = probability_real_percent
        else:
            is_ai = True  # Detected as AI Generated
            confidence = probability_ai_percent

        print(f"🧠 Basic Model Result: isAi={is_ai}, confidence={round(confidence)}%")
        return {
            "isAi": is_ai,
            "confidence": round(confidence),
            "source": "basic_model"
        }
    except Exception as e:
        print(f"❌ Error during basic model prediction: {e}")
        # Don't leak detailed exceptions in production
        raise HTTPException(status_code=500, detail="An internal error occurred during basic model analysis.")

def detect_with_advanced_model(file_content: bytes):
    """Detects using the Sightengine API."""
    if not API_USER or not API_SECRET:
         print("❌ Advanced model requested but API credentials missing.")
         raise HTTPException(status_code=503, detail="Advanced detection service configuration error.")

    try:
        params = {'models': 'deepfake', 'api_user': API_USER, 'api_secret': API_SECRET}
        files = {'media': io.BytesIO(file_content)}
        print("ℹ️ Sending request to Sightengine API...")
        response = requests.post('https://api.sightengine.com/1.0/check.json', files=files, data=params, timeout=30)
        response.raise_for_status() # Raise HTTPError for bad responses
        output = response.json()

        if output.get('status') == 'success':
            deepfake_score = output.get('type', {}).get('deepfake', 0.0) # Default to 0.0 if missing
            threshold = 0.5 # Classification threshold
            is_ai = deepfake_score >= threshold

            # Confidence represents the likelihood of the determined class
            confidence = (deepfake_score * 100) if is_ai else ((1 - deepfake_score) * 100)

            print(f"☁️ Advanced Model Result: isAi={is_ai}, confidence={round(confidence)}% (raw_score={deepfake_score:.3f})")
            return {
                "isAi": is_ai,
                "confidence": round(confidence),
                "source": "advanced_model"
            }
        else:
             # Handle API errors reported by Sightengine
             error_message = output.get('error', {}).get('message', 'Unknown API error')
             print(f"❌ Sightengine API returned an error: {error_message}")
             raise HTTPException(status_code=502, detail=f"Advanced detection service error: {error_message}") # 502 Bad Gateway

    except requests.exceptions.Timeout:
        print("❌ Error: Sightengine API request timed out.")
        raise HTTPException(status_code=504, detail="Advanced detection service timed out.") # 504 Gateway Timeout
    except requests.exceptions.RequestException as e:
         print(f"❌ Error connecting to Sightengine API: {e}")
         raise HTTPException(status_code=503, detail="Could not connect to advanced detection service.")
    except Exception as e:
        print(f"❌ Unexpected error during advanced model processing: {e}")
        raise HTTPException(status_code=500, detail="An internal error occurred during advanced model analysis.")

# --- API Endpoints ---

@app.get("/", tags=["Health"])
def read_root():
    """Provides basic health check and status information."""
    tf_module_name = 'tensorflow' if 'tensorflow' in sys.modules else ('tensorflow-cpu' if 'tensorflow-cpu' in sys.modules else None)
    tf_status = f"Available ({tf_module_name})" if tf_module_name else "Not Imported/Installed"

    model_status = "Not Loaded (TF Missing?)"
    if tf_module_name: # Only check loading status if TF is available
        model_status = "Loaded" if MODEL_LOADED else ("File Not Found" if not os.path.exists(MODEL_PATH) else "Load Failed")

    google_config_status = "OK" if GOOGLE_SERVICE_ACCOUNT_JSON_STR and GOOGLE_DOC_ID else "Secrets Missing"

    return {
        "message": "Deepfake Detector Backend is running",
        "basic_model_status": model_status,
        "tensorflow_status": tf_status,
        "google_doc_integration": google_config_status,
        "allowed_origins": origins
    }

@app.post("/analyze", tags=["Detection"])
async def analyze_image_endpoint(
    method: str = Form(..., description="Detection method ('basic' or 'advanced')"),
    image: UploadFile = File(..., description="Image file to analyze")
):
    """Analyzes an uploaded image for deepfakes using the specified method."""
    print(f"\n🚀 /analyze request: method={method}, filename={image.filename}, content_type={image.content_type}")
    contents = await image.read()
    if not contents:
         raise HTTPException(status_code=400, detail="No image file content received.")

    try:
        pil_image = process_image(contents)
    except HTTPException as e:
         raise e # Re-raise validation errors from process_image
    except Exception as e:
         print(f"❌ Critical error processing image file {image.filename}: {e}")
         raise HTTPException(status_code=500, detail="Server error processing image file.")

    # Route to the chosen detection logic
    if method == "basic":
        result = detect_with_basic_model(pil_image)
    elif method == "advanced":
        result = detect_with_advanced_model(contents)
    else:
        print(f"❌ Invalid method requested: {method}")
        raise HTTPException(status_code=400, detail=f"Invalid detection method '{method}'. Use 'basic' or 'advanced'.")

    print(f"✅ Analysis complete for {image.filename}. Result sent.")
    return result

@app.post("/contact-message", status_code=201, tags=["Contact"])
async def receive_contact_message_endpoint(message_data: ContactMessage):
    """Receives contact form data and appends it to a configured Google Doc."""
    print(f"📩 /contact-message request from: {message_data.email} | Subject: {message_data.subject or '(none)'}")
    entry = {
        "timestamp": datetime.now().isoformat(timespec='seconds'), # Cleaner timestamp
        "name": message_data.name,
        "email": message_data.email,
        "subject": message_data.subject,
        "message": message_data.message,
    }

    try:
        save_message_to_google_doc(entry)
        return {"detail": "Message received successfully!"}
    except (ValueError, PermissionError, FileNotFoundError) as e:
        # Specific configuration or permission errors
        print(f"❌ Configuration/Permission Error saving contact message: {e}")
        raise HTTPException(status_code=500, detail=f"Message could not be saved due to a server configuration error.")
    except Exception as e:
        # Other unexpected errors during the save process
        print(f"❌ Failed to save contact message to Google Doc: {e}")
        raise HTTPException(status_code=500, detail="Message could not be saved due to an unexpected server error.")

# Note: The if __name__ == "__main__": block for local running is typically
# not executed when deploying via Docker CMD instruction. Uvicorn is started directly.
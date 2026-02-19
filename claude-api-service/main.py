from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import logging

from schemas import AnalyzeRequest, AnalyzeResponse
from ai_service import analyze_meeting_transcript

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

# Validate required environment variables at startup
required_env_vars = ['CLAUDE_API_KEY']
for var in required_env_vars:
    if not os.getenv(var):
        logger.error(f"Missing required environment variable: {var}")
        raise RuntimeError(f"Missing required environment variable: {var}")

app = FastAPI(
    title="Claude Meeting Analysis API",
    description="API for analyzing meeting transcripts using Claude AI",
    version="1.0.0"
)

# Configure CORS - restrict to known origins
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
logger.info(f"CORS allowed origins: {allowed_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest):
    """
    Analyze a meeting transcript using Claude API.
    
    Expects JSON: { "text": "meeting transcript" }
    
    Returns:
    - summary: List of bullet points
    - tasks: List of action items with owner, task, deadline, and priority
    - next_meeting_date: Next scheduled meeting date
    """
    try:
        if not request.text or not request.text.strip():
            raise HTTPException(
                status_code=400,
                detail="Transcript text cannot be empty"
            )
        
        # Analyze the transcript
        result = analyze_meeting_transcript(request.text)
        return result
        
    except ValueError as e:
        logger.warning(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Invalid request: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Error analyzing transcript"
        )


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    env = os.getenv("ENV", "development")
    logger.info(f"Starting Claude Meeting Analysis API on port {port} in {env} mode")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=(env == "development"),
        log_level="info"
    )

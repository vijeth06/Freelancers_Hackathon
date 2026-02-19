from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from schemas import AnalyzeRequest, AnalyzeResponse
from ai_service import analyze_meeting_transcript

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="Claude Meeting Analysis API",
    description="API for analyzing meeting transcripts using Claude AI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        raise HTTPException(
            status_code=400,
            detail=f"Invalid transcript or API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing transcript: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )

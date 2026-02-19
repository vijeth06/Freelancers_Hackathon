# Claude Meeting Analysis API

A FastAPI-based service that analyzes meeting transcripts using Claude AI to extract summaries, key points, and action items.

## Features

- ✅ AI-powered meeting analysis using Claude 3 Haiku
- ✅ Extracts summaries, key points, and structured action items
- ✅ Robust error handling and validation
- ✅ CORS-protected (configurable origins)
- ✅ Input validation with Pydantic
- ✅ Comprehensive logging
- ✅ Health check endpoint

## Requirements

- Python 3.8+
- Claude API key from Anthropic

## Installation

### 1. Setup Virtual Environment

```bash
cd claude-api-service
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and set your values:

```
ENV=development
PORT=8000
CLAUDE_API_KEY=sk-ant-your-actual-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000
LOG_LEVEL=INFO
```

## Running the Service

### Development Mode

```bash
python main.py
```

The API will start on `http://localhost:8000`

### Production Mode

```bash
ENV=production python main.py
```

Or with Uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Health Check

```
GET /health
```

Returns:
```json
{
  "status": "ok"
}
```

### Analyze Transcript

```
POST /analyze
Content-Type: application/json

{
  "text": "meeting transcript here..."
}
```

**Request Validation:**
- `text` is required
- Minimum 10 characters
- Cannot be empty

**Response:**
```json
{
  "summary": [
    "Discussed Q1 roadmap",
    "Assigned owners to features",
    "Scheduled follow-up for March 5"
  ],
  "tasks": [
    {
      "owner": "Alice",
      "task": "Complete API integration",
      "deadline": "2026-02-28",
      "priority": "High"
    },
    {
      "owner": "Bob",
      "task": "Optimize database queries",
      "deadline": null,
      "priority": "Medium"
    }
  ],
  "next_meeting_date": "2026-03-05"
}
```

## Data Validation

### Task Priority
Valid values: `High`, `Medium`, `Low`

Default: `Medium`

### Task Structure
- `owner` (string, required): Person responsible
- `task` (string, required): Description of what needs to be done
- `deadline` (string, optional): When it's due (free-form format)
- `priority` (enum, required): High/Medium/Low

## Error Handling

### 400 Bad Request
- Empty or missing `text` field
- Text too short (< 10 characters)
- Invalid JSON in request

**Response:**
```json
{
  "detail": "Invalid request: Text must be at least 10 characters"
}
```

### 500 Internal Server Error
- Claude API error
- Invalid JSON in response
- Unexpected processing error

**Response:**
```json
{
  "detail": "Error analyzing transcript"
}
```

## Security Notes

🔒 **CORS Configuration**
- Allowed origins are configurable via `ALLOWED_ORIGINS` env var
- Default: `localhost:3000` and `localhost:3001`
- Never use `allow_origins=["*"]` in production

🔒 **Environment Variables**
- `CLAUDE_API_KEY` is validated at startup (not at request time)
- Fails fast if missing required configuration

🔒 **Input Validation**
- All inputs validated with Pydantic
- Invalid priority values are defaulted to "Medium"
- Malformed JSON is caught and reported

🔒 **Error Messages**
- Production errors are generic (don't expose internal details)
- Development mode shows more detailed error information

## Logging

Logs are written to console. Configuration:

- **Development**: `level=DEBUG`, `reload=True`
- **Production**: `level=INFO`, `reload=False`

Log entries include:
- Startup events
- API requests
- Claude API calls
- Parsing errors
- Unexpected failures

## Testing the API

### Using curl

```bash
curl -X POST http://localhost:8000/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "In the sprint planning meeting, Alice committed to completing the API integration by Feb 28. Bob will optimize the database queries. We scheduled a follow-up for March 5th."
  }'
```

### Using Python

```python
import requests

response = requests.post(
    "http://localhost:8000/analyze",
    json={"text": "Your meeting transcript here..."}
)

print(response.json())
```

### Using JavaScript

```javascript
const response = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Your meeting transcript here...'
  })
});

const data = await response.json();
console.log(data);
```

## Troubleshooting

### "CLAUDE_API_KEY environment variable not set"

**Solution:** Set your Claude API key in `.env` file:
```
CLAUDE_API_KEY=sk-ant-your-actual-key
```

### "No JSON object found in response"

**Solution:** Claude may have returned invalid JSON. Check:
1. Meeting transcript is clear and well-structured
2. API quota not exceeded
3. Claude service is operational

### CORS errors in browser

**Solution:** Add your frontend URL to `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=http://localhost:3000,http://myapp.com
```

### Port already in use

**Solution:** Change the port:
```bash
PORT=8001 python main.py
```

Or stop the process using the current port:
```bash
# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :8000
kill -9 <PID>
```

## Architecture

```
Client Request
    ↓
FastAPI (main.py)
    ↓ Validation (Pydantic schemas)
    ↓
Request Handler (analyze endpoint)
    ↓ Error Handling
    ↓
AI Service (ai_service.py)
    ↓ Claude API
    ↓
JSON Extraction & Parsing
    ↓ Validation
    ↓
Response (AnalyzeResponse)
    ↓
Client
```

## Performance Notes

- Average response time: 2-5 seconds (depends on Claude API)
- Payload size: Request < 50KB, Response < 20KB
- Concurrent requests: Limited by Claude API rate limits

## Future Enhancements

- [ ] Rate limiting per API key
- [ ] Database persistence of analyses
- [ ] Webhook notifications
- [ ] Batch processing support
- [ ] Custom Claude model selection
- [ ] Token usage tracking
- [ ] Analysis history API

## Support

For issues with:
- **Claude API**: Check Anthropic documentation
- **FastAPI**: See FastAPI docs at https://fastapi.tiangolo.com
- **This service**: Review logs and error messages

---

**Last Updated:** February 2026

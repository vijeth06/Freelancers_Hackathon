import json
import os
import logging
from anthropic import Anthropic
from schemas import Task, AnalyzeResponse

# Setup logging
logger = logging.getLogger(__name__)

client = Anthropic()


def extract_json_from_text(text: str) -> dict:
    """
    Extract JSON object from text that may contain extra text before/after JSON.
    Handles cases where Claude returns markdown code blocks or extra text.
    More robust parsing with better error handling.
    """
    if not text or not text.strip():
        raise ValueError("Empty response from Claude API")
    
    # Remove markdown code blocks if present
    text = text.replace("```json", "").replace("```", "")
    
    # Try to find JSON object in the text
    start_idx = text.find('{')
    if start_idx == -1:
        logger.error(f"No JSON object found in response: {text[:100]}...")
        raise ValueError("Response does not contain valid JSON")
    
    # Work backwards to find the matching closing brace
    brace_count = 0
    end_idx = -1
    for i in range(start_idx, len(text)):
        if text[i] == '{':
            brace_count += 1
        elif text[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                end_idx = i
                break
    
    if end_idx == -1:
        logger.error("Could not find matching closing brace in JSON")
        raise ValueError("JSON structure is malformed - unmatched braces")
    
    json_str = text[start_idx:end_idx + 1]
    
    try:
        parsed = json.loads(json_str)
        logger.debug("Successfully parsed JSON from response")
        return parsed
    except json.JSONDecodeError as e:
        logger.error(f"JSON parsing error: {str(e)}")
        raise ValueError(f"Invalid JSON in response: {str(e)}")



def analyze_meeting_transcript(transcript: str) -> AnalyzeResponse:
    """
    Analyze a meeting transcript using Claude API.
    Extracts summary, tasks, and next meeting date.
    """
    api_key = os.getenv("CLAUDE_API_KEY")
    if not api_key:
        logger.error("CLAUDE_API_KEY environment variable not set")
        raise ValueError("CLAUDE_API_KEY environment variable not set")
    
    system_prompt = """You are a meeting analysis assistant. Analyze the provided meeting transcript and extract the following information in JSON format:

1. **summary**: A list of bullet points summarizing the key discussion points
2. **tasks**: A list of action items with:
   - owner: Person responsible for the task (or "Unassigned" if not mentioned)
   - task: Description of what needs to be done
   - deadline: When it's due (if mentioned, otherwise null)
   - priority: High, Medium, or Low (default to Medium if not clear)
3. **next_meeting_date**: When the next meeting is scheduled (if mentioned, otherwise null)

Return ONLY a valid JSON object with these exact keys. No markdown, no extra text. The output must be parseable JSON.
Priority must be one of: High, Medium, Low
"""

    try:
        logger.info("Sending request to Claude API")
        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1024,
            system=system_prompt,
            messages=[
                {"role": "user", "content": f"Please analyze this meeting transcript:\n\n{transcript}"}
            ]
        )
        
        # Extract the response text
        response_text = message.content[0].text
        logger.debug(f"Claude response received: {response_text[:100]}...")
        
        # Extract and parse JSON from response
        parsed_json = extract_json_from_text(response_text)
        
        # Validate required fields
        if "summary" not in parsed_json or "tasks" not in parsed_json:
            logger.error(f"Missing required fields in response: {list(parsed_json.keys())}")
            raise ValueError("Response missing required fields: summary and tasks")
        
        # Convert to AnalyzeResponse object with validation
        summary = parsed_json.get("summary", [])
        if not isinstance(summary, list):
            logger.warning("Summary is not a list, converting")
            summary = [summary] if summary else []
        
        tasks_data = parsed_json.get("tasks", [])
        if not isinstance(tasks_data, list):
            logger.error("Tasks is not a list")
            raise ValueError("Tasks must be a list")
        
        next_meeting_date = parsed_json.get("next_meeting_date", None)
        
        # Convert task dictionaries to Task objects with validation
        tasks = []
        for idx, task_data in enumerate(tasks_data):
            try:
                if not isinstance(task_data, dict):
                    logger.warning(f"Task {idx} is not a dict, skipping")
                    continue
                
                task_obj = Task(
                    owner=task_data.get("owner", "Unassigned"),
                    task=task_data.get("task", ""),
                    deadline=task_data.get("deadline"),
                    priority=task_data.get("priority", "Medium")
                )
                tasks.append(task_obj)
            except ValueError as e:
                logger.warning(f"Error parsing task {idx}: {str(e)}, skipping")
                continue
        
        logger.info(f"Successfully analyzed transcript: {len(summary)} summary points, {len(tasks)} tasks")
        return AnalyzeResponse(
            summary=summary,
            tasks=tasks,
            next_meeting_date=next_meeting_date
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Error calling Claude API: {str(e)}", exc_info=True)
        raise ValueError(f"Claude API error: {str(e)}")


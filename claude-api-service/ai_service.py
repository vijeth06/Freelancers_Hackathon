import json
import os
from anthropic import Anthropic
from schemas import Task, AnalyzeResponse

client = Anthropic()


def extract_json_from_text(text: str) -> dict:
    """
    Extract JSON object from text that may contain extra text before/after JSON.
    Handles cases where Claude returns markdown code blocks or extra text.
    """
    # Try to find JSON object in the text
    start_idx = text.find('{')
    if start_idx == -1:
        raise ValueError("No JSON object found in response")
    
    # Work backwards to find the matching closing brace
    brace_count = 0
    for i in range(start_idx, len(text)):
        if text[i] == '{':
            brace_count += 1
        elif text[i] == '}':
            brace_count -= 1
            if brace_count == 0:
                json_str = text[start_idx:i + 1]
                try:
                    return json.loads(json_str)
                except json.JSONDecodeError:
                    continue
    
    raise ValueError("Could not parse valid JSON from response")


def analyze_meeting_transcript(transcript: str) -> AnalyzeResponse:
    """
    Analyze a meeting transcript using Claude API.
    Extracts summary, tasks, and next meeting date.
    """
    api_key = os.getenv("CLAUDE_API_KEY")
    if not api_key:
        raise ValueError("CLAUDE_API_KEY environment variable not set")
    
    system_prompt = """You are a meeting analysis assistant. Analyze the provided meeting transcript and extract the following information in JSON format:

1. **summary**: A list of bullet points summarizing the key discussion points
2. **tasks**: A list of action items with:
   - owner: Person responsible for the task
   - task: Description of what needs to be done
   - deadline: When it's due (if mentioned, otherwise null)
   - priority: High, Medium, or Low
3. **next_meeting_date**: When the next meeting is scheduled (if mentioned, otherwise null)

Return ONLY a valid JSON object with these exact keys. No markdown, no extra text. The output must be parseable JSON."""

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
    
    # Extract and parse JSON from response
    parsed_json = extract_json_from_text(response_text)
    
    # Convert to AnalyzeResponse object with validation
    # Handle cases where fields might be missing
    summary = parsed_json.get("summary", [])
    tasks_data = parsed_json.get("tasks", [])
    next_meeting_date = parsed_json.get("next_meeting_date", None)
    
    # Convert task dictionaries to Task objects
    tasks = []
    for task_data in tasks_data:
        tasks.append(Task(
            owner=task_data.get("owner", "Unassigned"),
            task=task_data.get("task", ""),
            deadline=task_data.get("deadline"),
            priority=task_data.get("priority", "Medium")
        ))
    
    return AnalyzeResponse(
        summary=summary,
        tasks=tasks,
        next_meeting_date=next_meeting_date
    )

# Bug Report & Security Issues

## Critical Issues Found

### 1. 🔴 CORS Security Vulnerability
**File:** `claude-api-service/main.py`
**Issue:** `allow_origins=["*"]` - Allows any domain to access the API
**Risk:** Cross-Site Request Forgery (CSRF), credential leaks
**Severity:** HIGH

### 2. 🔴 Missing Environment Validation
**File:** `claude-api-service/ai_service.py`
**Issue:** CLAUDE_API_KEY checked only when endpoint is called, not at startup
**Risk:** API starts but crashes on first request if key missing
**Severity:** HIGH

### 3. 🟡 JSON Parsing Fragility
**File:** `claude-api-service/ai_service.py` - `extract_json_from_text()`
**Issue:** Could fail with nested JSON or malformed responses
**Risk:** Crashes when Claude returns complex structures
**Severity:** MEDIUM

### 4. 🟡 Production Configuration Issues
**File:** `claude-api-service/main.py`
**Issues:**
- `reload=True` in production (should auto-reload code on changes)
- No logging system
- No rate limiting
- Generic error messages expose internal details
**Severity:** MEDIUM

### 5. 🟡 Missing Documentation
**File:** `claude-api-service/`
**Issues:**
- No `.env.example` file
- No setup instructions
- No requirements about Python version
**Severity:** LOW

### 6. 🟡 Backend Integration Gap
**Issue:** Claude API service is separate from Node.js backend
- Backend still uses OpenAI/fallback, not Claude
- No integration between services
- Duplicate analysis logic
**Severity:** MEDIUM

### 7. 🟡 Task Priority Validation
**File:** `claude-api-service/schemas.py`
**Issue:** Priority field accepts any string; should be enum (High/Medium/Low)
**Risk:** Invalid data stored and returned
**Severity:** LOW

## Summary

| Category | Count | Severity |
|----------|-------|----------|
| Critical | 2 | 🔴 |
| Medium | 3 | 🟡 |
| Low | 2 | 🟢 |
| **Total** | **7** | |

## Recommended Actions

1. ✅ Fix CORS to only allow known origins
2. ✅ Validate environment at startup
3. ✅ Improve JSON parsing robustness
4. ✅ Add proper logging & error handling
5. ✅ Create `.env.example` and setup docs
6. ✅ Assess whether to use Claude or OpenAI (currently both exist)
7. ✅ Add input validation with enums for priority

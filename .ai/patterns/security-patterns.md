# Security Patterns

## Authentication

<!-- How authentication works -->

## Authorization

<!-- Permission and access control -->

## Data Protection

<!-- Encryption, sanitization -->

## Security Headers

<!-- HTTP security headers -->

## Best Practices

<!-- Security best practices -->

---

See [api-and-routing.md](api-and-routing.md) for API security.

## Authentication

### API Key Management

**Gemini API Authentication**:
- Uses environment variable for API key storage
- Supports two variable names: `GOOGLE_API_KEY` or `GEMINI_API_KEY`
- Key validated on client initialization

**Best Practices Implemented**:
```python
api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
if not api_key:
    raise EnvironmentError("Set GOOGLE_API_KEY or GEMINI_API_KEY environment variable")
```

**Security Considerations**:
- Never hardcode API keys in source code
- Never commit keys to version control
- Use environment variables or secure secret management
- Rotate keys periodically
- Use project-specific keys (separate dev/prod)

## Authorization

**Current Scope**: Not applicable - single-user CLI tool with no user authentication system.

**API-Level Authorization**:
- Google Cloud project-level permissions
- API key associated with specific Google Cloud project
- Gemini API quota and rate limits enforced by Google

## Data Protection

### Sensitive Data Handling

**API Keys**:
- Stored only in environment variables
- Never logged or printed
- Not persisted to disk by application

**User Images**:
- Processed images sent to Google's Gemini API
- Google's data handling policies apply
- Images stored locally in `in/`, `out/`, and `done/` directories
- No database or cloud storage by this application

**Privacy Considerations**:
- User should understand images are processed by Google's cloud service
- For sensitive/proprietary images, review Google Cloud's data processing terms
- Consider network security when transmitting images

### File System Security

**Directory Permissions**:
- Use restrictive permissions for directories containing sensitive images
- On Unix systems: `chmod 700 in/ out/ done/` for owner-only access

**Temporary Data**:
- Images loaded into memory during processing
- Minimal time in memory (load → process → save → free)
- Python's garbage collection handles cleanup

## Security Headers

Not applicable - CLI application, not a web service.

## Best Practices

### API Security

**Rate Limiting**:
- Be aware of Gemini API quotas
- Implement exponential backoff for retries (future enhancement)
- Monitor API usage in Google Cloud Console

**Error Handling**:
- Don't expose detailed error messages that reveal system internals
- Log errors locally for debugging
- Current implementation catches and logs per-image errors

### Input Validation

**File Type Validation**:
```python
SUPPORTED_FORMATS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}

images = [
    f for f in INPUT_DIR.iterdir()
    if f.is_file() and f.suffix.lower() in SUPPORTED_FORMATS
]
```

**Benefits**:
- Prevents processing of unsupported file types
- Reduces risk of PIL vulnerabilities with unexpected formats

**Future Enhancements**:
- Validate image content (not just extension)
- File size limits to prevent memory exhaustion
- Magic number verification

### Dependency Security

**Current Dependencies**:
- google-genai (>=1.0.0)
- Pillow (>=10.0.0)

**Security Practices**:
- Pin major versions to avoid breaking changes
- Regularly update dependencies for security patches
- Monitor security advisories for Pillow (common vulnerability target)

**Recommendations**:
```bash
# Audit dependencies for known vulnerabilities
pip install safety
safety check

# Keep dependencies updated
pip install --upgrade google-genai Pillow
pip freeze > requirements.txt
```

### Environment Security

**Virtual Environment**:
- Always use virtual environment (venv)
- Isolates dependencies from system Python
- Prevents privilege escalation via system packages

**Execution Permissions**:
```bash
# Make script executable only by owner
chmod 700 upscale.py
```

### Secure Coding Practices

**Avoid Command Injection**:
- Current code doesn't execute shell commands
- If adding subprocess calls, sanitize inputs

**Path Traversal Prevention**:
- Uses pathlib.Path for safe path handling
- Input/output directories are fixed (not user-specified)
- File discovery limited to configured directory

**Error Information Disclosure**:
```python
except Exception as e:
    print(f"  Error processing {image_path.name}: {e}")
```
- Logs errors with context
- Doesn't expose full stack traces to users (prints to stdout)
- For production use, consider proper logging framework

### Network Security

**HTTPS Communication**:
- Gemini API client uses HTTPS by default
- TLS verification enabled

**Proxy Support** (future):
- Consider adding proxy configuration for corporate environments
- Environment variables: HTTP_PROXY, HTTPS_PROXY

### Secrets in Version Control

**Protected Files** (must be in .gitignore):
- `.env` (if implemented)
- `*.key`, `*.pem` (any credential files)
- Virtual environment directory (`venv/`)

**Current .gitignore recommendations**:
```
venv/
.env
*.pyc
__pycache__/
.DS_Store
*.log
```

### Compliance Considerations

**Data Processing**:
- GDPR: If processing EU user images, understand Google's GDPR compliance
- CCPA: Similar considerations for California users
- Review Google Cloud's data processing addendum

**Content Moderation**:
- Google's API may have content policies
- Upscaling certain types of content may be restricted
- Review Gemini API acceptable use policy

---

See [api-and-routing.md](api-and-routing.md) for API security.

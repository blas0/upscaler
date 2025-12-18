# Deployment Architecture

## Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost | Local development |
| Staging | TBD | Pre-production testing |
| Production | TBD | Live application |

## Infrastructure

<!-- Describe hosting, containers, etc. -->

## CI/CD Pipeline

<!-- Describe deployment process -->

## Configuration

<!-- Environment variables, secrets management -->

---

See [development-workflow.md](../development/development-workflow.md) for local setup.

## Environments

| Environment | URL | Purpose |
|-------------|-----|---------|
| Development | localhost | Local development and testing |
| Staging | N/A | Not applicable for CLI tool |
| Production | N/A | Users run locally on their machines |

## Infrastructure

### Deployment Model

**Local Execution**: This is a command-line tool designed to run on end-user machines, not a hosted service. There is no traditional deployment infrastructure.

### Dependencies

**External Services**:
- Google Gemini API (cloud-hosted by Google)
  - Model: gemini-3-pro-image-preview
  - Authentication: API key
  - Network: HTTPS to Google's API endpoints

**Local Requirements**:
- Python 3.14+ runtime
- Virtual environment (venv)
- File system access for input/output directories
- Internet connectivity for API calls

### Resource Requirements

**Compute**: Minimal CPU/memory (image loading and API calls)
**Storage**: Dependent on batch size
- Input images in `in/` directory
- Output WebP files in `out/` directory
- Temporary: PIL image objects in memory during processing

**Network**: Bandwidth for image upload/download to/from Gemini API

## CI/CD Pipeline

Not currently implemented. Potential future considerations:
- Automated testing framework
- GitHub Actions for test execution
- Release packaging/distribution

## Configuration

### Environment Variables

**Required**:
- `GOOGLE_API_KEY` or `GEMINI_API_KEY`: Authentication for Gemini API

**Optional**: None currently implemented

### Secrets Management

**Development**: 
- API key stored in local environment variables
- Can be set in shell profile or loaded via `.env` file (user's choice)

**Best Practices**:
- Never commit API keys to version control
- Use environment-specific keys (dev vs production Google Cloud projects)
- Consider using `.gitignore` for any `.env` files

### Runtime Configuration

All configuration is currently hardcoded in `upscale.py`:
- `INPUT_DIR = Path("in")`
- `OUTPUT_DIR = Path("out")`
- `MODEL = "gemini-3-pro-image-preview"`
- `TARGET_SIZE = "2K"`
- `ASPECT_RATIO = "16:9"`
- `UPSCALE_PROMPT = "..."`

**Future Enhancement**: Could accept command-line arguments for flexibility.

## Distribution

**Current Method**: Git repository clone
1. Clone repository
2. Create virtual environment
3. Install dependencies from requirements.txt
4. Set API key environment variable
5. Run script

**Potential Future Methods**:
- PyPI package distribution
- Docker container image
- Executable binary (PyInstaller)

---

See [development-workflow.md](../development/development-workflow.md) for local setup.

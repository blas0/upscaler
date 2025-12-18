# Development Workflow

## Prerequisites

<!-- List required software -->

## Quick Start

```bash
# Clone repository
git clone <repo-url>
cd <project>

# Install dependencies
# <commands here>

# Start development server
# <commands here>
```

## Development Commands

| Command | Description |
|---------|-------------|
| TBD | TBD |

## Code Style

<!-- Formatting, linting rules -->

## Git Workflow

<!-- Branch naming, commit conventions -->

---

See [testing-patterns.md](testing-patterns.md) for testing instructions.

## Prerequisites

- **Python 3.14** or compatible version
- **pip** package manager
- **Git** for version control
- **Google API Key** with Gemini API access

## Quick Start

```bash
# Clone repository
git clone <repo-url>
cd upscaler

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set API key (choose one method)
export GOOGLE_API_KEY="your-api-key-here"
# or
export GEMINI_API_KEY="your-api-key-here"

# Place images in input directory
mkdir -p in
# (Copy your images to the 'in/' directory)

# Run upscaler
python upscale.py
```

## Development Commands

| Command | Description |
|---------|-------------|
| `python upscale.py` | Run the upscaler on images in `in/` directory |
| `pip install -r requirements.txt` | Install/update dependencies |
| `pip list` | View installed packages and versions |
| `deactivate` | Exit virtual environment |
| `source venv/bin/activate` | Reactivate virtual environment |

## Project Structure

```
upscaler/
├── upscale.py              # Main application script
├── requirements.txt        # Python dependencies
├── in/                     # Input: place images here
├── out/                    # Output: upscaled WebP files
├── done/                   # Archive: processed originals
├── venv/                   # Virtual environment (not in git)
├── .ai/                    # Static documentation
├── .claude/                # Claude Code memory
└── CLAUDE.md               # Claude Code instructions
```

## Workflow

### Standard Image Upscaling Process

1. **Prepare Input**
   - Copy images to `in/` directory
   - Supported formats: PNG, JPG, JPEG, WebP, GIF, BMP

2. **Run Upscaler**
   ```bash
   python upscale.py
   ```

3. **Review Output**
   - Upscaled images saved to `out/` as WebP files
   - Original filenames preserved (extension changed to .webp)
   - Check console output for success/error statistics

4. **Archive Originals** (optional)
   - Move processed images from `in/` to `done/`
   - Keeps workflow clean for next batch

### Configuration Modifications

To change upscaling parameters, edit `upscale.py` constants:

```python
TARGET_SIZE = "2K"        # Change resolution target
ASPECT_RATIO = "16:9"     # Change aspect ratio
```

WebP quality settings in `save_as_webp()` function:
```python
image.save(output_path, "WEBP", quality=95, lossless=False)
```

## Code Style

**Current State**: No enforced linting or formatting

**Recommendations for Future**:
- **black**: Code formatting
- **flake8** or **ruff**: Linting
- **mypy**: Type checking
- **isort**: Import sorting

## Git Workflow

**Branch Naming**: (To be established)
- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`

**Commit Conventions**: Follow conventional commits
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

**Pull Requests**:
- Always create PR for completed work (per global instructions)
- Include summary and test plan
- Reference related issues if applicable

## Environment Variables

**Required**:
```bash
export GOOGLE_API_KEY="your-key-here"
# or
export GEMINI_API_KEY="your-key-here"
```

**Persistent Setup** (optional):

Add to `~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`:
```bash
export GOOGLE_API_KEY="your-key-here"
```

Or use a `.env` file with python-dotenv (not currently implemented).

## Troubleshooting

**"Set GOOGLE_API_KEY or GEMINI_API_KEY environment variable"**
- Solution: Export API key as shown above

**"No images found in in/"**
- Solution: Ensure images are in the `in/` directory with supported extensions

**API Errors**:
- Check API key validity
- Verify internet connection
- Check Google Cloud Console for API quotas/limits

**Module Not Found Errors**:
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`

---

See [testing-patterns.md](testing-patterns.md) for testing instructions.

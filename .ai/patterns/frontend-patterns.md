# Frontend Patterns

## Overview

<!-- Frontend technology and approach -->

## Component Structure

<!-- How components are organized -->

## State Management

<!-- State management approach -->

## Styling

<!-- CSS/styling approach -->

## Best Practices

<!-- Frontend best practices -->

---

See [technology-stack.md](../core/technology-stack.md) for versions.

## Overview

Not applicable - this is a command-line interface (CLI) application with no graphical user interface.

## User Interface

### CLI Interface

**Interaction Model**: Non-interactive batch processing

**User Flow**:
1. User prepares images in `in/` directory
2. User runs `python upscale.py`
3. Script displays progress to console
4. User retrieves results from `out/` directory

### Console Output

**Start Banner**:
```
==================================================
Gemini 3 Pro Image Upscaler (Nano Banana Pro)
Target: 2K @ 16:9
==================================================
```

**Progress Indicators**:
```
Found {count} images to process

  Processing: image_name.png
  Saved: image_name.webp
  
  Processing: next_image.jpg
  Saved: next_image.webp
```

**Completion Summary**:
```
==================================================
Complete: {success}/{total} images upscaled
Output directory: out/
==================================================
```

**Error Messages**:
```
  Error processing {filename}: {error_details}
  Warning: No image returned for {filename}
No images found in in/
```

**Design Principles**:
- Clear, concise messages
- Visual separation (equal signs)
- Contextual information (filename with errors)
- Statistics on completion

## Component Structure

Not applicable - no UI components.

## State Management

**Global State**: Module-level constants
```python
INPUT_DIR = Path("in")
OUTPUT_DIR = Path("out")
MODEL = "gemini-3-pro-image-preview"
TARGET_SIZE = "2K"
ASPECT_RATIO = "16:9"
```

**Runtime State**: Local variables in main()
```python
success_count = 0
images = [discovered files]
client = authenticated API client
```

**No Persistent State**: Each run is independent

## Styling

Not applicable - CLI application.

## Best Practices

### CLI Design Patterns

**Progress Feedback**:
- Per-file processing messages keep user informed
- Indentation (2 spaces) shows sub-actions
- Real-time output (not buffered)

**Error Handling**:
- Errors don't stop batch processing
- Clear error context (which file failed)
- Final statistics show success rate

**Output Verbosity**:
- Current: Balanced (not too quiet, not too verbose)
- Future: Consider adding `-v/--verbose` flag
- Future: Consider adding `-q/--quiet` flag

### Future GUI Considerations

If a graphical interface is added:

**Recommended Technologies**:
- **Tkinter**: Built-in, simple GUIs
- **PyQt/PySide**: Professional desktop applications
- **Electron + Python backend**: Web-based UI
- **Streamlit**: Quick data app prototyping

**Feature Suggestions**:
- Drag-and-drop input area
- Real-time progress bar
- Image preview (before/after)
- Settings panel (resolution, aspect ratio, quality)
- Batch queue management
- Processing history

**Architecture Pattern** (web-based):
```
Frontend (React/Vue)
    ↓ HTTP API
Backend (Flask/FastAPI)
    ↓ Python logic
upscale.py core functions
```

### CLI Enhancement Ideas

**Argument Parsing**:
```python
import argparse

parser = argparse.ArgumentParser(description='Upscale images using Gemini API')
parser.add_argument('--input', default='in', help='Input directory')
parser.add_argument('--output', default='out', help='Output directory')
parser.add_argument('--size', default='2K', choices=['1K', '2K', '4K'])
parser.add_argument('--aspect', default='16:9')
parser.add_argument('--quality', type=int, default=95)
parser.add_argument('--format', default='webp', choices=['webp', 'png', 'jpg'])
args = parser.parse_args()
```

**Interactive Mode** (future):
```python
from rich.progress import Progress

with Progress() as progress:
    task = progress.add_task("[green]Processing images...", total=len(images))
    for image in images:
        upscale_image(client, image)
        progress.update(task, advance=1)
```

**Configuration File** (future):
```yaml
# upscale_config.yaml
input_dir: in
output_dir: out
model: gemini-3-pro-image-preview
target_size: 2K
aspect_ratio: 16:9
webp_quality: 95
supported_formats:
  - png
  - jpg
  - jpeg
  - webp
  - gif
  - bmp
```

### Accessibility

**Current State**: Basic console output

**Improvements for Accessibility**:
- ANSI color codes for visual distinction (success/error)
- Structured output format (JSON mode for parsing)
- Sound notifications on completion (optional)
- Integration with screen readers (proper exit codes)

### User Experience Enhancements

**Pre-flight Checks**:
```python
def validate_environment():
    """Check prerequisites before processing"""
    checks = []
    
    # Check API key
    if not (os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")):
        checks.append("❌ API key not set")
    else:
        checks.append("✓ API key found")
    
    # Check input directory
    if not INPUT_DIR.exists():
        checks.append(f"❌ Input directory '{INPUT_DIR}' not found")
    else:
        count = len(list(INPUT_DIR.glob("*")))
        checks.append(f"✓ Input directory has {count} files")
    
    # Check output directory writable
    try:
        OUTPUT_DIR.mkdir(exist_ok=True)
        checks.append("✓ Output directory ready")
    except Exception as e:
        checks.append(f"❌ Cannot create output directory: {e}")
    
    for check in checks:
        print(check)
```

**Dry-Run Mode**:
```python
# Run with --dry-run flag to preview without processing
if args.dry_run:
    print("DRY RUN - No images will be processed")
    for image in images:
        print(f"  Would process: {image.name}")
    sys.exit(0)
```

**Resume Capability**:
```python
# Skip images that already exist in output
for image_path in images:
    output_path = OUTPUT_DIR / f"{image_path.stem}.webp"
    if output_path.exists() and not args.force:
        print(f"  Skipping (exists): {image_path.name}")
        continue
    # Process image...
```

---

See [technology-stack.md](../core/technology-stack.md) for versions.

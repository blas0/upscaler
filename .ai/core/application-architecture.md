# Application Architecture

## System Overview

<!-- High-level architecture diagram or description -->

## Directory Structure

```
<!-- Project structure here -->
```

## Core Components

<!-- List and describe main components -->

## Data Models

<!-- Key models and relationships -->

## Service Layer

<!-- Business logic organization -->

---

See [technology-stack.md](technology-stack.md) for version details.

## System Overview

The upscaler is a single-file Python CLI application that orchestrates image upscaling through the Google Gemini API. The architecture is intentionally simple: a procedural script that reads images from an input directory, sends them to the Gemini API for upscaling, and saves the results as WebP files.

```
[Input Directory] → [Python Script] → [Gemini API] → [WebP Output] → [Output Directory]
```

## Directory Structure

```
/Users/blaser/Documents/Code/upscaler/
├── upscale.py                    # Main application script (136 lines)
├── requirements.txt              # Python dependencies
├── in/                           # Input directory (place images here)
├── out/                          # Output directory (upscaled WebP files)
├── done/                         # Archive directory (28 processed images)
├── venv/                         # Python virtual environment
├── .ai/                          # Static documentation
├── .claude/                      # Dynamic memory for Claude Code
└── CLAUDE.md                     # Claude Code entry point
```

## Core Components

### 1. Main Script (upscale.py)

**Configuration Constants**:
- `INPUT_DIR`: Path("in") - Source image directory
- `OUTPUT_DIR`: Path("out") - Destination directory
- `MODEL`: "gemini-3-pro-image-preview" - Gemini API model
- `TARGET_SIZE`: "2K" - Output resolution target
- `ASPECT_RATIO`: "16:9" - Output aspect ratio
- `UPSCALE_PROMPT`: Instructions for the AI model
- `SUPPORTED_FORMATS`: {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}

**Functions**:

1. `setup_client() -> genai.Client`
   - Initializes Gemini API client
   - Reads API key from environment variables
   - Returns authenticated client instance

2. `upscale_image(client: genai.Client, image_path: Path) -> PILImage.Image | None`
   - Loads source image using Pillow
   - Sends to Gemini API with upscaling prompt
   - Extracts generated image from API response
   - Returns PIL Image object or None on error

3. `save_as_webp(image: PILImage.Image, output_path: Path) -> None`
   - Handles RGBA transparency preservation
   - Converts to RGB for other modes
   - Saves as WebP with quality=95, lossless=False
   - Prints confirmation message

4. `main()`
   - Entry point and orchestration logic
   - Creates output directory if needed
   - Discovers images in input directory
   - Processes each image sequentially
   - Reports success/failure statistics

### 2. API Integration Layer

**Gemini API Configuration**:
```python
response = client.models.generate_content(
    model=MODEL,
    contents=[UPSCALE_PROMPT, source_image],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(
            aspect_ratio=ASPECT_RATIO,
            image_size=TARGET_SIZE,
        ),
    ),
)
```

**Response Handling**:
- Iterates through response parts
- Extracts `inline_data.data` field
- Handles base64 encoding if necessary
- Converts bytes to PIL Image via BytesIO

## Data Models

No complex data models - the application works with:
- **Input**: File paths (pathlib.Path objects)
- **Images**: PIL Image objects
- **Configuration**: Module-level constants
- **API Responses**: Google SDK response objects

## Service Layer

Not applicable - all business logic is contained in procedural functions within the single script file.

## Processing Flow

1. **Initialization**
   - Ensure output directory exists
   - Scan input directory for supported image formats
   - Authenticate with Gemini API

2. **Batch Processing**
   - For each discovered image:
     - Load image into memory (Pillow)
     - Send to Gemini API with upscaling instructions
     - Wait for API response
     - Extract upscaled image from response
     - Convert to WebP format
     - Save to output directory with .webp extension
   
3. **Completion**
   - Report statistics (success/total count)
   - Display output directory path

## Error Handling

- **Missing API Key**: Raises `EnvironmentError` with setup instructions
- **Image Processing Errors**: Caught per-image with warning message, processing continues
- **API Failures**: Caught as exceptions, logged, next image processed

## Configuration Management

**Environment Variables**:
- `GOOGLE_API_KEY` or `GEMINI_API_KEY` (required)

**Hardcoded Settings** (modifiable in script):
- Target resolution: 2K
- Aspect ratio: 16:9
- WebP quality: 95
- Lossless mode: False

---

See [technology-stack.md](technology-stack.md) for version details.

# Technology Stack

**SINGLE SOURCE OF TRUTH** for all version numbers and dependencies.

## Overview

| Category | Technology | Version |
|----------|------------|---------|
| Language | Python | TBD |
| Framework | TBD | TBD |
| Database | TBD | TBD |
| Cache | TBD | TBD |

## Backend

<!-- Update with actual versions -->

## Frontend

<!-- Update with actual versions -->

## Development Tools

<!-- Update with actual versions -->

## Infrastructure

<!-- Update with actual versions -->

---

**Note**: All version references across documentation should link back to this file.

## Overview

| Category | Technology | Version |
|----------|------------|---------|
| Language | Python | 3.14 |
| AI/ML API | Google Gemini API | N/A (Cloud Service) |
| Image Processing | Pillow (PIL) | >=10.0.0 |
| API Client | google-genai | >=1.0.0 |

## Backend

### Core Dependencies

**google-genai** (>=1.0.0)
- Official Google Generative AI Python SDK
- Provides access to Gemini 3 Pro Image API
- Handles authentication, request/response formatting, and API communication

**Pillow** (>=10.0.0)
- Python Imaging Library (PIL) fork
- Used for image loading, conversion, and WebP encoding
- Handles multiple input formats and RGBA transparency

### Runtime Requirements

- Python 3.14 or compatible version
- Environment variable: `GOOGLE_API_KEY` or `GEMINI_API_KEY`
- Internet connection for API access

## Frontend

Not applicable - CLI-only application.

## Development Tools

- **Virtual Environment**: venv (Python standard library)
- **Package Management**: pip
- **Code Style**: (To be determined if project scales)

## Infrastructure

### API Service

**Gemini 3 Pro Image API**
- Model ID: `gemini-3-pro-image-preview`
- Nickname: "Nano Banana Pro"
- Response Modality: IMAGE
- Configuration: 2K resolution, 16:9 aspect ratio

### File System Structure

```
/
├── in/          # Input directory for source images
├── out/         # Output directory for upscaled WebP files
├── done/        # Archive directory for processed source images
└── upscale.py   # Main application script
```

---

**Note**: All version references across documentation should link back to this file.

# API and Routing Patterns

## Route Structure

<!-- How routes are organized -->

## API Design

<!-- RESTful conventions, versioning -->

## Request Handling

<!-- Validation, middleware -->

## Response Format

<!-- Standard response structure -->

## Error Handling

<!-- Error response patterns -->

---

See [security-patterns.md](security-patterns.md) for API security.

## Route Structure

Not applicable - this is a CLI application, not a web service with HTTP routes.

## API Design

### External API Integration: Gemini API

**API Provider**: Google Generative AI
**Model**: gemini-3-pro-image-preview ("Nano Banana Pro")
**Protocol**: HTTPS REST API (via google-genai SDK)

**Integration Pattern**:
```python
from google import genai
from google.genai import types

# Initialize client
client = genai.Client(api_key=api_key)

# Generate content request
response = client.models.generate_content(
    model="gemini-3-pro-image-preview",
    contents=[prompt_text, image_object],
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(
            aspect_ratio="16:9",
            image_size="2K",
        ),
    ),
)
```

**Request Structure**:
- **Model**: Specified as string identifier
- **Contents**: List containing prompt and image
- **Config**: Typed configuration object
  - Response modality: IMAGE (vs TEXT)
  - Image config: aspect ratio and size constraints

**Response Structure**:
```python
response.parts              # List of response parts
part.inline_data           # Image data container
part.inline_data.data      # Raw bytes or base64 string
```

## Request Handling

### Image Upload Pattern

**Input Processing**:
1. Load image from file system using Pillow
2. PIL Image object passed directly to SDK
3. SDK handles serialization to API format

```python
source_image = PILImage.open(image_path)
response = client.models.generate_content(
    model=MODEL,
    contents=[UPSCALE_PROMPT, source_image],
    config=config
)
```

### Prompt Engineering

**Current Prompt**:
```python
UPSCALE_PROMPT = (
    "Upscale this image to higher resolution. "
    "Do not modify, edit, or change anything about the image content. "
    "Preserve all original details, colors, composition, and elements exactly as they are. "
    "Only increase the resolution."
)
```

**Design Principles**:
- Explicit instruction to preserve content
- Focused on resolution enhancement only
- Minimizes AI "creativity" that might alter original
- Clear directive to avoid unwanted modifications

**Customization Points**:
- Modify prompt for different upscaling behaviors
- Add style directives if artistic enhancement desired
- Adjust instructions for specific image types

## Response Format

### Image Response Handling

**Extraction Pattern**:
```python
for part in response.parts:
    if part.inline_data is not None:
        image_bytes = part.inline_data.data
        # Handle base64 encoding if necessary
        if isinstance(image_bytes, str):
            image_bytes = base64.b64decode(image_bytes)
        return PILImage.open(io.BytesIO(image_bytes))
```

**Format Handling**:
- API returns image as binary data
- May be base64 encoded (detected by type check)
- Converted to PIL Image via BytesIO
- Format agnostic (PIL handles format detection)

**Output Format**:
```python
def save_as_webp(image: PILImage.Image, output_path: Path) -> None:
    if image.mode in ("RGBA", "P"):
        image.save(output_path, "WEBP", quality=95, lossless=False)
    else:
        if image.mode != "RGB":
            image = image.convert("RGB")
        image.save(output_path, "WEBP", quality=95, lossless=False)
```

**Standardization**:
- All outputs saved as WebP
- Quality level: 95 (high quality, not lossless)
- RGBA mode preserved for transparency
- Other modes converted to RGB

## Error Handling

### API Error Patterns

**Authentication Errors**:
```python
def setup_client() -> genai.Client:
    api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "Set GOOGLE_API_KEY or GEMINI_API_KEY environment variable"
        )
    return genai.Client(api_key=api_key)
```

**Processing Errors**:
```python
try:
    # Image processing logic
    ...
except Exception as e:
    print(f"  Error processing {image_path.name}: {e}")
    return None
```

**Error Response Strategy**:
- Per-image error handling (one failure doesn't stop batch)
- Errors logged to console with context
- Function returns None to signal failure
- Main loop continues to next image

### Retry Logic

**Current State**: No automatic retry implemented

**Recommended Enhancement**:
```python
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
def upscale_image_with_retry(client, image_path):
    return upscale_image(client, image_path)
```

**Use Cases**:
- Transient network errors
- API rate limiting (429 responses)
- Temporary service unavailability

## API Configuration Best Practices

### Model Selection

**Current Model**: `gemini-3-pro-image-preview`
- Preview/beta model identifier
- Subject to change or deprecation
- Monitor Google's announcements for stable versions

**Future-Proofing**:
- Make model name configurable (environment variable or CLI arg)
- Version pinning strategy for production use
- Fallback models if primary unavailable

### Rate Limiting

**Considerations**:
- Google Cloud project quotas apply
- Requests per minute/day limits
- Concurrent request limits

**Implementation Strategy** (future):
- Token bucket or sliding window algorithm
- Queue for batch processing
- Respect Retry-After headers
- Exponential backoff for 429 responses

### Cost Optimization

**API Costs**:
- Gemini API charges per request/token
- Image size affects processing cost
- Monitor usage in Google Cloud Console

**Optimization Strategies**:
- Batch similar-sized images together
- Pre-filter out images that don't need upscaling
- Implement caching (don't re-process same images)
- Set budget alerts in Google Cloud

## Integration Testing

**API Health Check**:
```python
def test_api_connection():
    """Verify API credentials and connectivity"""
    client = setup_client()
    # Small test image request
    test_image = PILImage.new('RGB', (10, 10))
    try:
        response = upscale_image(client, test_image)
        return response is not None
    except Exception as e:
        print(f"API test failed: {e}")
        return False
```

**Testing Checklist**:
- Valid credentials accepted
- Invalid credentials rejected with clear error
- Small image processing succeeds
- Large image handling (within limits)
- Timeout handling for slow responses

---

See [security-patterns.md](security-patterns.md) for API security.

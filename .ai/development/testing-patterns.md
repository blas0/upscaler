# Testing Patterns

## Testing Strategy

<!-- Overview of testing approach -->

## Test Types

### Unit Tests

<!-- Unit testing patterns -->

### Integration Tests

<!-- Integration testing patterns -->

### E2E Tests

<!-- End-to-end testing patterns -->

## Running Tests

```bash
# Run all tests
# <command>

# Run specific tests
# <command>
```

## Test Coverage

<!-- Coverage requirements -->

---

See [development-workflow.md](development-workflow.md) for setup.

## Testing Strategy

**Current State**: No automated tests implemented.

This is a single-file CLI script optimized for simplicity. Testing strategy should focus on:
1. **Manual Testing**: Visual inspection of upscaled images
2. **Integration Testing**: API connectivity and error handling
3. **Future Automation**: Unit tests for core functions

## Test Types

### Manual Testing (Current Approach)

**Image Quality Testing**:
1. Place test images in `in/` directory
2. Run `python upscale.py`
3. Visually inspect output in `out/` directory
4. Verify:
   - Resolution increased appropriately
   - Image content preserved (no unwanted modifications)
   - WebP format quality acceptable
   - Aspect ratio handled correctly
   - Transparency preserved (for RGBA images)

**Error Handling Testing**:
1. Test with missing API key
2. Test with empty `in/` directory
3. Test with corrupted image files
4. Test with unsupported formats

### Unit Tests (Recommended for Future)

**Test Coverage Recommendations**:

```python
# Test setup_client()
def test_setup_client_with_valid_key():
    """Should return authenticated client"""
    pass

def test_setup_client_without_key():
    """Should raise EnvironmentError"""
    pass

# Test upscale_image()
def test_upscale_image_success():
    """Should return PIL Image object"""
    pass

def test_upscale_image_with_invalid_file():
    """Should return None and log error"""
    pass

# Test save_as_webp()
def test_save_webp_rgb_image():
    """Should save RGB image correctly"""
    pass

def test_save_webp_rgba_image():
    """Should preserve transparency"""
    pass

# Test main()
def test_main_batch_processing():
    """Should process multiple images"""
    pass
```

**Testing Framework**: pytest (recommended)

### Integration Tests (Recommended for Future)

**API Integration**:
- Test actual API calls with small test images
- Verify response format handling
- Test rate limiting behavior
- Test error responses from API

**File System Integration**:
- Test directory creation
- Test file discovery with various formats
- Test output file naming
- Test permission errors

### E2E Tests (Recommended for Future)

**Complete Workflow**:
1. Set up test environment with fixture images
2. Run complete upscale.py execution
3. Verify output files created correctly
4. Validate output image properties (size, format, quality)
5. Clean up test artifacts

## Running Tests

**Manual Testing** (current):
```bash
# Activate virtual environment
source venv/bin/activate

# Run the script with test images
python upscale.py

# Review output
ls -lh out/
open out/  # macOS: open output directory
```

**Automated Tests** (future):
```bash
# Install testing dependencies
pip install pytest pytest-cov

# Run all tests
pytest

# Run specific test file
pytest tests/test_upscale.py

# Run with coverage report
pytest --cov=upscale --cov-report=html
```

## Test Coverage

**Current Coverage**: 0% (no automated tests)

**Recommended Coverage Goals**:
- Core functions (setup_client, upscale_image, save_as_webp): 90%+
- Error handling paths: 80%+
- Main orchestration logic: 70%+

**Critical Paths to Test**:
1. API authentication and client initialization
2. Image format handling (all supported formats)
3. WebP encoding with various color modes
4. Error handling for API failures
5. Directory and file operations

## Test Data

**Fixture Images** (recommended):
- Small RGB image (~100KB)
- Small RGBA image with transparency
- PNG format
- JPG format
- WebP format
- Edge cases: 1x1 pixel, very large image

**Location**: Create `tests/fixtures/` directory

## Mocking Strategy (for future tests)

**Gemini API Mocking**:
```python
from unittest.mock import Mock, patch

@patch('upscale.genai.Client')
def test_upscale_with_mocked_api(mock_client):
    """Test upscaling without hitting real API"""
    # Mock API response
    mock_response = Mock()
    mock_part = Mock()
    mock_part.inline_data.data = b"fake_image_bytes"
    mock_response.parts = [mock_part]
    
    mock_client.return_value.models.generate_content.return_value = mock_response
    
    # Test function
    result = upscale_image(mock_client.return_value, Path("test.png"))
    assert result is not None
```

## Quality Metrics

**Visual Quality Assessment** (manual):
- Sharpness preservation
- Color accuracy
- Artifact reduction
- Detail enhancement

**Technical Metrics**:
- File size comparison (input vs output)
- Processing time per image
- Success rate (processed / total)
- Error rate by error type

## Testing Checklist

Before releases or significant changes:

- [ ] Test with all supported input formats
- [ ] Test with various image sizes (small, medium, large)
- [ ] Test transparency handling (RGBA, P mode)
- [ ] Test error handling (no API key, bad key, no images, corrupted files)
- [ ] Test batch processing (multiple images)
- [ ] Verify WebP quality settings produce acceptable output
- [ ] Check console output messages are clear
- [ ] Test on clean environment (fresh venv)

---

See [development-workflow.md](development-workflow.md) for setup.

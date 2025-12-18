# Database Patterns

## Overview

<!-- Database technology and approach -->

## Models

<!-- Key models and their purpose -->

## Relationships

<!-- Model relationships -->

## Migrations

<!-- Migration patterns -->

## Query Patterns

<!-- Common query patterns -->

---

See [application-architecture.md](../core/application-architecture.md) for data model overview.

## Overview

Not applicable - this application does not use a database.

## Storage Architecture

**File System Based**:
- All data stored as files on local file system
- No database, ORM, or data persistence layer
- State is implicit in directory contents

## Data Organization

### Directory-Based State

**Input Queue** (`in/` directory):
- Contains images awaiting processing
- Supported formats: PNG, JPG, JPEG, WebP, GIF, BMP
- Discovered dynamically at runtime

**Output Storage** (`out/` directory):
- Contains processed/upscaled images
- Format: WebP only
- Filename: Original stem + .webp extension

**Archive Storage** (`done/` directory):
- Manual archiving of processed originals
- Keeps input directory clean
- Not automated by script

### File Naming Convention

**Pattern**: `{original_filename_stem}.webp`

**Example**:
- Input: `product_image_800x800.png`
- Output: `product_image_800x800.webp`

**Benefits**:
- Maintains traceability to original
- Prevents naming conflicts (extension change)
- Simple manual matching for quality comparison

## Alternative Storage Considerations

### Future Database Integration (if needed)

**Use Cases That Would Justify Database**:
1. **Processing History**: Track what was processed when
2. **Metadata Storage**: Original dimensions, processing time, quality metrics
3. **Batch Management**: Track batch IDs, user info, status
4. **Error Logging**: Persistent error records for analysis

**Recommended Approach**:
- SQLite for simplicity (single file, no server)
- Or PostgreSQL for multi-user/production scenarios

**Schema Example** (hypothetical):
```sql
CREATE TABLE processing_jobs (
    id INTEGER PRIMARY KEY,
    original_filename TEXT NOT NULL,
    input_path TEXT NOT NULL,
    output_path TEXT,
    status TEXT CHECK(status IN ('pending', 'processing', 'completed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    original_size_bytes INTEGER,
    output_size_bytes INTEGER,
    processing_time_seconds REAL
);
```

### Cloud Storage Integration (if needed)

**Use Cases**:
- Remote image storage (S3, GCS)
- Distributed processing
- Centralized output repository

**Implementation Pattern**:
```python
from google.cloud import storage

def upload_to_gcs(local_file: Path, bucket_name: str, blob_name: str):
    """Upload processed image to Google Cloud Storage"""
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.upload_from_filename(str(local_file))
```

### Caching Strategy (if implemented)

**Problem**: Prevent re-processing of already-upscaled images

**Solution**: Hash-based cache lookup
```python
import hashlib

def compute_image_hash(image_path: Path) -> str:
    """Compute SHA256 hash of image file"""
    with open(image_path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()

def is_already_processed(image_hash: str) -> bool:
    """Check if image hash exists in cache"""
    # Could be filesystem-based or database query
    cache_file = Path(f".cache/{image_hash}.json")
    return cache_file.exists()
```

## Models

Not applicable - no data models or ORM.

## Relationships

Not applicable - no relational data.

## Migrations

Not applicable - no database schema to migrate.

## Query Patterns

**File System Queries**:

```python
# Find all images in input directory
images = [
    f for f in INPUT_DIR.iterdir()
    if f.is_file() and f.suffix.lower() in SUPPORTED_FORMATS
]

# Check if output exists
output_path = OUTPUT_DIR / f"{image_path.stem}.webp"
if output_path.exists():
    print(f"Already processed: {image_path.name}")
```

**Pattern**: Use pathlib for file system operations
- Type-safe path handling
- Cross-platform compatibility
- Readable chaining (e.g., `path.parent / "subfolder"`)

---

See [application-architecture.md](../core/application-architecture.md) for data model overview.

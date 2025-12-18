#!/usr/bin/env python3
"""
Image Upscaler using Gemini 3 Pro Image (Nano Banana Pro)
Upscales images to 2K quality, maintains 1:1 aspect ratio, outputs as .webp
"""

import io
import os
from pathlib import Path
import base64
from google import genai
from google.genai import types
from PIL import Image as PILImage

# Configuration
INPUT_DIR = Path("in")
OUTPUT_DIR = Path("out")
MODEL = "gemini-3-pro-image-preview"  # Nano Banana Pro
TARGET_SIZE = "2K"
ASPECT_RATIO = "16:9"

# Minimal upscale prompt - instructs model to preserve original exactly
UPSCALE_PROMPT = (
    "Upscale this image to higher resolution. "
    "Do not modify, edit, or change anything about the image content. "
    "Preserve all original details, colors, composition, and elements exactly as they are. "
    "Only increase the resolution."
)

# Supported input formats
SUPPORTED_FORMATS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp"}


def setup_client() -> genai.Client:
    """Initialize Gemini client. Requires GOOGLE_API_KEY or GEMINI_API_KEY env var."""
    api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise EnvironmentError(
            "Set GOOGLE_API_KEY or GEMINI_API_KEY environment variable"
        )
    return genai.Client(api_key=api_key)


def upscale_image(client: genai.Client, image_path: Path) -> PILImage.Image | None:
    """Upscale a single image using Gemini 3 Pro Image."""
    print(f"  Processing: {image_path.name}")

    try:
        # Load the source image
        source_image = PILImage.open(image_path)

        # Generate upscaled version
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

        # Extract the generated image from response
        for part in response.parts:
            if part.inline_data is not None:
                # Convert Google SDK Image to PIL Image via bytes
                image_bytes = part.inline_data.data
                # Handle base64 encoded data if necessary
                if isinstance(image_bytes, str):
                    image_bytes = base64.b64decode(image_bytes)
                return PILImage.open(io.BytesIO(image_bytes))

        print(f"  Warning: No image returned for {image_path.name}")
        return None

    except Exception as e:
        print(f"  Error processing {image_path.name}: {e}")
        return None


def save_as_webp(image: PILImage.Image, output_path: Path) -> None:
    """Save image as WebP format with high quality."""
    # Convert to RGB if necessary (WebP doesn't support all modes)
    if image.mode in ("RGBA", "P"):
        # Preserve transparency for RGBA
        image.save(output_path, "WEBP", quality=95, lossless=False)
    else:
        if image.mode != "RGB":
            image = image.convert("RGB")
        image.save(output_path, "WEBP", quality=95, lossless=False)
    print(f"  Saved: {output_path.name}")


def main():
    print("=" * 50)
    print("Gemini 3 Pro Image Upscaler (Nano Banana Pro)")
    print(f"Target: {TARGET_SIZE} @ {ASPECT_RATIO}")
    print("=" * 50)

    # Ensure output directory exists
    OUTPUT_DIR.mkdir(exist_ok=True)

    # Find all images in input directory
    images = [
        f for f in INPUT_DIR.iterdir()
        if f.is_file() and f.suffix.lower() in SUPPORTED_FORMATS
    ]

    if not images:
        print(f"No images found in {INPUT_DIR}/")
        return

    print(f"\nFound {len(images)} images to process\n")

    # Initialize client
    client = setup_client()

    # Process each image
    success_count = 0
    for image_path in sorted(images):
        # Upscale
        upscaled = upscale_image(client, image_path)

        if upscaled:
            # Save as .webp with original name (sans extension)
            output_name = image_path.stem + ".webp"
            output_path = OUTPUT_DIR / output_name
            save_as_webp(upscaled, output_path)
            success_count += 1

    print("\n" + "=" * 50)
    print(f"Complete: {success_count}/{len(images)} images upscaled")
    print(f"Output directory: {OUTPUT_DIR}/")
    print("=" * 50)


if __name__ == "__main__":
    main()

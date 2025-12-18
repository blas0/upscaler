# Project Overview

## What This Project Is

<!-- Describe what the project does -->

## Core Mission

<!-- One sentence mission statement -->

## Key Features

<!-- List main features -->

## Target Users

<!-- Who uses this -->

## Architecture Philosophy

<!-- High-level approach -->

---

See [application-architecture.md](application-architecture.md) for technical details.

## What This Project Is

An automated image upscaling utility powered by Google's Gemini 3 Pro Image API (Nano Banana Pro). The tool batch-processes images from an input directory, upscales them to 2K resolution while maintaining a 16:9 aspect ratio, and outputs high-quality WebP files.

## Core Mission

Provide a simple, command-line interface for upscaling product images and other visual assets using state-of-the-art AI image processing, with minimal configuration and maximum quality.

## Key Features

- **AI-Powered Upscaling**: Leverages Gemini 3 Pro Image API for intelligent resolution enhancement
- **Batch Processing**: Processes multiple images from a single input directory
- **Format Flexibility**: Supports PNG, JPG, JPEG, WebP, GIF, and BMP input formats
- **WebP Output**: Converts all output to WebP format for optimal web performance
- **Quality Preservation**: Configured to preserve original image content while enhancing resolution
- **2K Target Resolution**: Outputs images at 2K quality with 16:9 aspect ratio
- **Simple Workflow**: Drop images in `in/` folder, run script, collect from `out/` folder

## Target Users

- **E-commerce Professionals**: Upscaling product images for online stores
- **Content Creators**: Enhancing visual assets for web publishing
- **Designers**: Batch processing images for consistent quality
- **Developers**: Integrating AI upscaling into automated workflows

## Architecture Philosophy

**Simplicity First**: Single-file Python script with minimal dependencies. No database, no web server, no complex configuration. The tool focuses on doing one thing well: upscaling images efficiently using modern AI capabilities.

**Quality Over Speed**: Prioritizes output quality using high-quality WebP encoding (quality=95) and careful aspect ratio handling.

---

See [application-architecture.md](application-architecture.md) for technical details.

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs/promises";
import * as path from "path";
import sharp from "sharp";

const UPSCALE_PROMPT =
  "Upscale this image to higher resolution. " +
  "Do not modify, edit, or change anything about the image content. " +
  "Preserve all original details, colors, composition, and elements exactly as they are. " +
  "Only increase the resolution.";

const SUPPORTED_FORMATS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".bmp",
]);

const MODEL = "gemini-3.1-flash-image-preview";

export type Resolution = "1K" | "2K" | "4K";
export type AspectRatio = "AUTO" | "1:1" | "9:16" | "16:9" | "3:4" | "4:3" | "3:2";

export interface UpscaleOptions {
  resolution: Resolution;
  aspectRatio: AspectRatio;
}

export interface UpscaleProgress {
  current: number;
  total: number;
  currentFile: string;
  status: "processing" | "success" | "error";
}

export function createClient(apiKey: string): GoogleGenerativeAI {
  return new GoogleGenerativeAI(apiKey);
}

export async function discoverImages(inputDir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(inputDir);
    return files.filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return SUPPORTED_FORMATS.has(ext);
    });
  } catch {
    return [];
  }
}

async function imageToBase64(imagePath: string): Promise<string> {
  const buffer = await fs.readFile(imagePath);
  return buffer.toString("base64");
}

function getMimeType(
  filePath: string
): "image/png" | "image/jpeg" | "image/webp" | "image/gif" | "image/bmp" {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<
    string,
    "image/png" | "image/jpeg" | "image/webp" | "image/gif" | "image/bmp"
  > = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
  };
  return mimeTypes[ext] || "image/jpeg";
}

export async function upscaleImage(
  client: GoogleGenerativeAI,
  imagePath: string,
  options: UpscaleOptions
): Promise<Buffer | null> {
  try {
    const prompt = UPSCALE_PROMPT;

    const model = client.getGenerativeModel({
      model: MODEL,
      generationConfig: {
        // @ts-expect-error - responseModalities and imageConfig are valid for image generation models
        responseModalities: ["IMAGE"],
        imageConfig: {
          imageSize: options.resolution === "1K" ? "1K" : options.resolution === "4K" ? "4K" : "2K",
          ...(options.aspectRatio !== "AUTO" && { aspectRatio: options.aspectRatio }),
        },
      },
    });

    const base64Data = await imageToBase64(imagePath);
    const mimeType = getMimeType(imagePath);

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
      prompt,
    ]);

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts;

    if (parts) {
      for (const part of parts) {
        if ("inlineData" in part && part.inlineData) {
          const imageData = part.inlineData.data;
          return Buffer.from(imageData, "base64");
        }
      }
    }

    return null;
  } catch (error) {
    console.error(`Error upscaling ${imagePath}:`, error);
    return null;
  }
}

export async function saveAsJpg(
  imageBuffer: Buffer,
  outputPath: string
): Promise<void> {
  await sharp(imageBuffer).jpeg({ quality: 95 }).toFile(outputPath);
}

export async function moveToComplete(
  sourcePath: string,
  doneDir: string
): Promise<void> {
  const fileName = path.basename(sourcePath);
  const destPath = path.join(doneDir, fileName);
  await fs.rename(sourcePath, destPath);
}

export async function ensureDirectories(
  inputDir: string,
  outputDir: string,
  doneDir: string
): Promise<void> {
  await fs.mkdir(inputDir, { recursive: true });
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(doneDir, { recursive: true });
}

export async function processImages(
  apiKey: string,
  options: UpscaleOptions,
  inputDir: string,
  outputDir: string,
  doneDir: string,
  onProgress: (progress: UpscaleProgress) => void
): Promise<{ success: number; failed: number }> {
  const client = createClient(apiKey);
  const images = await discoverImages(inputDir);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const inputPath = path.join(inputDir, image);
    const baseName = path.basename(image, path.extname(image));
    const outputPath = path.join(outputDir, `${baseName}.jpg`);

    onProgress({
      current: i + 1,
      total: images.length,
      currentFile: image,
      status: "processing",
    });

    const result = await upscaleImage(client, inputPath, options);

    if (result) {
      await saveAsJpg(result, outputPath);
      await moveToComplete(inputPath, doneDir);
      success++;
      onProgress({
        current: i + 1,
        total: images.length,
        currentFile: image,
        status: "success",
      });
    } else {
      failed++;
      onProgress({
        current: i + 1,
        total: images.length,
        currentFile: image,
        status: "error",
      });
    }
  }

  return { success, failed };
}

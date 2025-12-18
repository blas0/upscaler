import React, { useState, useEffect } from "react";
import { Box, Text, useApp, useInput } from "ink";
import {
  Header,
  SelectionMenu,
  ApiKeyInput,
  BouncingLoader,
  CompletionScreen,
} from "./components/index.js";
import {
  Resolution,
  AspectRatio,
  UpscaleProgress,
  processImages,
  discoverImages,
  ensureDirectories,
} from "./upscaler.js";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs/promises";

dotenv.config();

type AppState =
  | "resolution"
  | "aspect-ratio"
  | "api-key"
  | "confirm"
  | "processing"
  | "complete";

const RESOLUTIONS: Resolution[] = ["1K", "2K", "4K"];
const ASPECT_RATIOS: AspectRatio[] = [
  "AUTO",
  "1:1",
  "9:16",
  "16:9",
  "3:4",
  "4:3",
  "3:2",
];

const INPUT_DIR = "in";
const OUTPUT_DIR = "out";
const DONE_DIR = "done";

interface DirCounts {
  inCount: number;
  outCount: number;
  doneCount: number;
}

export function App() {
  const { exit } = useApp();
  const [state, setState] = useState<AppState>("resolution");
  const [resolution, setResolution] = useState<Resolution>("1K");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("AUTO");
  const [apiKey, setApiKey] = useState<string>(
    process.env.GEMINI_API_KEY || ""
  );
  const [progress, setProgress] = useState<UpscaleProgress | null>(null);
  const [result, setResult] = useState<{ success: number; failed: number }>({
    success: 0,
    failed: 0,
  });
  const [dirCounts, setDirCounts] = useState<DirCounts>({
    inCount: 0,
    outCount: 0,
    doneCount: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const refreshCounts = async () => {
    await ensureDirectories(INPUT_DIR, OUTPUT_DIR, DONE_DIR);
    const inImages = await discoverImages(INPUT_DIR);
    const outImages = await discoverImages(OUTPUT_DIR);
    const doneImages = await discoverImages(DONE_DIR);

    setDirCounts({
      inCount: inImages.length,
      outCount: outImages.length,
      doneCount: doneImages.length,
    });
  };

  useEffect(() => {
    refreshCounts();
  }, []);

  useInput((input, key) => {
    if (state === "resolution" && key.return) {
      setState("aspect-ratio");
    } else if (state === "aspect-ratio" && key.return) {
      if (apiKey) {
        setState("confirm");
      } else {
        setState("api-key");
      }
    } else if (state === "confirm") {
      startProcessing();
    } else if (state === "complete") {
      exit();
    }

    if (key.escape) {
      exit();
    }
  });

  const handleApiKeySubmit = async (key: string) => {
    setApiKey(key);
    // Save API key to .env file
    const envPath = path.join(process.cwd(), ".env");
    try {
      let envContent = "";
      try {
        envContent = await fs.readFile(envPath, "utf-8");
      } catch {
        // File doesn't exist
      }

      if (envContent.includes("GEMINI_API_KEY=")) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*/, `GEMINI_API_KEY=${key}`);
      } else {
        envContent += `\nGEMINI_API_KEY=${key}\n`;
      }

      await fs.writeFile(envPath, envContent.trim() + "\n");
    } catch {
      // Ignore write errors
    }
    setState("confirm");
  };

  const startProcessing = async () => {
    setState("processing");
    setError(null);

    try {
      const results = await processImages(
        apiKey,
        { resolution, aspectRatio },
        INPUT_DIR,
        OUTPUT_DIR,
        DONE_DIR,
        (prog) => setProgress(prog)
      );
      setResult(results);
      await refreshCounts();
      setState("complete");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setState("complete");
    }
  };

  return (
    <Box flexDirection="column">
      <Header {...dirCounts} />

      {(state === "resolution" ||
        state === "aspect-ratio" ||
        state === "confirm") && (
        <>
          <SelectionMenu
            title="Resolution"
            options={RESOLUTIONS}
            selected={resolution}
            onSelect={setResolution}
            active={state === "resolution"}
          />
          {(state === "aspect-ratio" || state === "confirm") && (
            <SelectionMenu
              title="Aspect Ratio"
              options={ASPECT_RATIOS}
              selected={aspectRatio}
              onSelect={setAspectRatio}
              active={state === "aspect-ratio"}
            />
          )}
        </>
      )}

      {state === "api-key" && (
        <ApiKeyInput onSubmit={handleApiKeySubmit} active={true} />
      )}

      {state === "confirm" && (
        <Box marginTop={1}>
          <Text backgroundColor="green" color="white">
            {" "}{">"} Press any key to upscale{" "}
          </Text>
        </Box>
      )}

      {state === "processing" && (
        <BouncingLoader
          message="Upscaling images..."
          currentFile={progress?.currentFile}
          progress={
            progress ? { current: progress.current, total: progress.total } : undefined
          }
        />
      )}

      {state === "complete" && (
        <>
          {error ? (
            <Box marginY={1}>
              <Text color="red">Error: {error}</Text>
            </Box>
          ) : (
            <CompletionScreen success={result.success} failed={result.failed} />
          )}
        </>
      )}

      {state !== "complete" && (
        <Box marginTop={1}>
          <Text color="gray" dimColor>
            Press ESC to exit
          </Text>
        </Box>
      )}
    </Box>
  );
}

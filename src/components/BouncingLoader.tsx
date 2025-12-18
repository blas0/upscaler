import React, { useState, useEffect } from "react";
import { Text, Box } from "ink";

interface BouncingLoaderProps {
  message?: string;
  currentFile?: string;
  progress?: { current: number; total: number };
}

export function BouncingLoader({
  message = "Upscaling...",
  currentFile,
  progress,
}: BouncingLoaderProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, 150);

    return () => clearInterval(timer);
  }, []);

  // Single ball bouncing left to right and back
  const frames = ["(o  )", "( o )", "(  o)", "( o )"];

  return (
    <Box flexDirection="column" marginY={1}>
      <Box>
        <Text color="cyan">{frames[frame]}</Text>
      </Box>
      <Box marginTop={1}>
        <Text backgroundColor="magenta" color="white">
          {` ${message} `}
        </Text>
      </Box>
      {progress && (
        <Box marginTop={1}>
          <Text backgroundColor="green" color="white">
            {` Processing ${progress.current} of ${progress.total} `}
          </Text>
        </Box>
      )}
      {currentFile && (
        <Box marginTop={1}>
          <Text backgroundColor="blue" color="white">
            {` Current: ${currentFile} `}
          </Text>
        </Box>
      )}
    </Box>
  );
}

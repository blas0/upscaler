import React, { useState, useEffect } from "react";
import { Text, Box } from "ink";

interface CompletionScreenProps {
  success: number;
  failed: number;
}

const BORDERS = {
  topLeft: "┏",
  topRight: "┓",
  bottomLeft: "┗",
  bottomRight: "┛",
  horizontal: "━",
  vertical: "┃",
};

export function CompletionScreen({ success, failed }: CompletionScreenProps) {
  const [frame, setFrame] = useState(0);
  const plural = (n: number) => (n === 1 ? "image" : "images");

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 2);
    }, 300);

    return () => clearInterval(timer);
  }, []);

  // Animated star title
  const starTitle = frame === 0 ? " ✦ ✧ ✦ ✧ ✦ " : " ✧ ✦ ✧ ✦ ✧ ";

  const width = 60;
  const titleLength = starTitle.length;
  const remainingWidth = width - 2 - titleLength;
  const leftPadding = 2;
  const rightPadding = remainingWidth - leftPadding;

  const bottomBorder =
    BORDERS.bottomLeft + BORDERS.horizontal.repeat(width - 2) + BORDERS.bottomRight;

  return (
    <Box flexDirection="column" marginY={1}>
      <Box>
        <Text color="white">
          {BORDERS.topLeft}
          {BORDERS.horizontal.repeat(leftPadding)}
        </Text>
        <Text backgroundColor="#FF8C00" color="white" bold>
          {starTitle}
        </Text>
        <Text color="white">
          {BORDERS.horizontal.repeat(Math.max(0, rightPadding))}
          {BORDERS.topRight}
        </Text>
      </Box>
      <Box>
        <Text color="white">{BORDERS.vertical}</Text>
        <Box width={width - 2} paddingX={1} paddingTop={1} flexDirection="column">
          <Text color="white">
            {">"} {success} {plural(success)} have been saved to{" "}
            <Text color="yellow">'out/'</Text>
          </Text>
          <Text color="white">
            {">"} {success} {plural(success)} have been moved from{" "}
            <Text color="yellow">'in/'</Text> to{" "}
            <Text color="yellow">'done/'</Text>
          </Text>
          <Box marginTop={1}>
            <Text color="white">{success} {plural(success)} </Text>
            <Text color="green">upscaled</Text>
            <Text color="gray"> | </Text>
            <Text color="white">{failed} {plural(failed)} </Text>
            <Text color="red">failed</Text>
          </Box>
          <Box marginTop={1}>
            <Text backgroundColor="green" color="white">{" "}{">"} Press any key to exit{" "}</Text>
          </Box>
        </Box>
        <Text color="white">{BORDERS.vertical}</Text>
      </Box>
      <Text color="white">{bottomBorder}</Text>
    </Box>
  );
}

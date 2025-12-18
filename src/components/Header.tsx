import React from "react";
import { Text, Box } from "ink";
import { BorderBox } from "./BorderBox.js";

interface HeaderProps {
  inCount: number;
  outCount: number;
  doneCount: number;
}

export function Header({
  inCount,
  outCount,
  doneCount,
}: HeaderProps) {
  const plural = (n: number) => (n === 1 ? "image" : "images");

  return (
    <BorderBox title="Upscaler" variant="bold">
      <Text color="gray">
        {">"} Place images to be upscaled in:{" "}
        <Text color="yellow">'in/'</Text>
      </Text>
      <Text color="gray">
        {">"} Images upscaled will return to:{" "}
        <Text color="yellow">'out/'</Text>
      </Text>
      <Text color="gray">
        {">"} Images that are upscaled will be moved to:{" "}
        <Text color="yellow">'done/'</Text>
      </Text>
      <Box marginTop={1}>
        <Text backgroundColor="magenta" color="white">
          {` In: ${inCount} ${plural(inCount)} `}
        </Text>
        <Text color="gray"> | </Text>
        <Text backgroundColor="green" color="white">
          {` Out: ${outCount} ${plural(outCount)} `}
        </Text>
        <Text color="gray"> | </Text>
        <Text backgroundColor="cyan" color="white">
          {` Done: ${doneCount} ${plural(doneCount)} `}
        </Text>
      </Box>
    </BorderBox>
  );
}

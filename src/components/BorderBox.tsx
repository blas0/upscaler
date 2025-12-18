import React from "react";
import { Text, Box } from "ink";

interface BorderBoxProps {
  title: string;
  children: React.ReactNode;
  variant?: "bold" | "double";
}

const BORDERS = {
  bold: {
    topLeft: "┏",
    topRight: "┓",
    bottomLeft: "┗",
    bottomRight: "┛",
    horizontal: "━",
    vertical: "┃",
  },
  double: {
    topLeft: "╔",
    topRight: "╗",
    bottomLeft: "╚",
    bottomRight: "╝",
    horizontal: "═",
    vertical: "║",
  },
};

export function BorderBox({
  title,
  children,
  variant = "bold",
}: BorderBoxProps) {
  const border = BORDERS[variant];
  const width = 60;
  const titleWithPadding = ` ${title} `;
  const titleLength = titleWithPadding.length;
  const remainingWidth = width - 2 - titleLength;
  const leftPadding = 2;
  const rightPadding = remainingWidth - leftPadding;

  const bottomBorder =
    border.bottomLeft + border.horizontal.repeat(width - 2) + border.bottomRight;

  return (
    <Box flexDirection="column" marginY={1}>
      <Box>
        <Text color="white">
          {border.topLeft}
          {border.horizontal.repeat(leftPadding)}
        </Text>
        <Text backgroundColor="#FF8C00" color="white" bold>
          {titleWithPadding}
        </Text>
        <Text color="white">
          {border.horizontal.repeat(Math.max(0, rightPadding))}
          {border.topRight}
        </Text>
      </Box>
      <Box>
        <Text color="white">{border.vertical}</Text>
        <Box width={width - 2} paddingX={1} paddingTop={1} flexDirection="column">
          {children}
        </Box>
        <Text color="white">{border.vertical}</Text>
      </Box>
      <Text color="white">{bottomBorder}</Text>
    </Box>
  );
}

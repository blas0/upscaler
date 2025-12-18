import React, { useState, useEffect } from "react";
import { Text, Box } from "ink";

interface StarBorderProps {
  title?: string;
  children: React.ReactNode;
}

export function StarBorder({ title, children }: StarBorderProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % 2);
    }, 300);

    return () => clearInterval(timer);
  }, []);

  const pattern1 = "✦ ✧ ".repeat(15);
  const pattern2 = "✧ ✦ ".repeat(15);

  const border = frame === 0 ? pattern1 : pattern2;

  return (
    <Box flexDirection="column" marginY={1}>
      <Box>
        <Text color="yellow">{border.slice(0, 4)}</Text>
        {title && (
          <Text backgroundColor="#FF8C00" color="white" bold>
            {` ${title} `}
          </Text>
        )}
        <Text color="yellow">{border.slice(title ? 4 + title.length + 2 : 0)}</Text>
      </Box>
      <Box marginY={1} paddingTop={1} flexDirection="column">
        {children}
      </Box>
      <Text color="yellow">{border}</Text>
    </Box>
  );
}

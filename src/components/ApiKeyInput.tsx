import React, { useState } from "react";
import { Text, Box, useInput } from "ink";
import { BorderBox } from "./BorderBox.js";

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
  active: boolean;
}

export function ApiKeyInput({ onSubmit, active }: ApiKeyInputProps) {
  const [value, setValue] = useState("");

  useInput(
    (input, key) => {
      if (!active) return;

      if (key.return && value.trim()) {
        onSubmit(value.trim());
      } else if (key.backspace || key.delete) {
        setValue((prev) => prev.slice(0, -1));
      } else if (input && !key.ctrl && !key.meta) {
        setValue((prev) => prev + input);
      }
    },
    { isActive: active }
  );

  const maskedValue = value ? "*".repeat(value.length) : "";

  return (
    <BorderBox title="Gemini API Key" variant="double">
      <Text color="yellow">{">"} Enter Gemini API key:</Text>
      <Box marginTop={1}>
        <Text color="gray">{">"} </Text>
        <Text color="cyan">{maskedValue}</Text>
        {active && <Text color="cyan">█</Text>}
      </Box>
      <Text color="gray" dimColor>
        Press Enter to confirm
      </Text>
    </BorderBox>
  );
}

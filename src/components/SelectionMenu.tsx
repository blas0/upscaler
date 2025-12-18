import React from "react";
import { Text, Box, useInput } from "ink";
import { BorderBox } from "./BorderBox.js";

interface SelectionMenuProps<T extends string> {
  title: string;
  options: T[];
  selected: T;
  onSelect: (value: T) => void;
  active: boolean;
}

export function SelectionMenu<T extends string>({
  title,
  options,
  selected,
  onSelect,
  active,
}: SelectionMenuProps<T>) {
  useInput(
    (input, key) => {
      if (!active) return;

      const currentIndex = options.indexOf(selected);

      if (key.leftArrow || input === "h") {
        const newIndex =
          currentIndex > 0 ? currentIndex - 1 : options.length - 1;
        onSelect(options[newIndex]);
      } else if (key.rightArrow || input === "l") {
        const newIndex =
          currentIndex < options.length - 1 ? currentIndex + 1 : 0;
        onSelect(options[newIndex]);
      }
    },
    { isActive: active }
  );

  return (
    <BorderBox title={title} variant="double">
      <Box>
        {options.map((option, index) => {
          const isSelected = option === selected;

          return (
            <React.Fragment key={option}>
              {index > 0 && <Text color="gray"> | </Text>}
              <Text
                color="white"
                bold={isSelected}
                inverse={isSelected && active}
              >
                {option}
              </Text>
            </React.Fragment>
          );
        })}
        {active && (
          <Text color="gray" dimColor>
            {" "}
            (← →)
          </Text>
        )}
      </Box>
    </BorderBox>
  );
}

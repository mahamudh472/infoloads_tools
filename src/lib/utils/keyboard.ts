import React from "react";

/**
 * Intercepts Tab key in textareas to insert spaces or tab indentation
 * instead of shifting focus to the next HTML element.
 */
export function handleTextareaTabKey(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  onChange?: (val: string) => void,
  indentSpaces = 2
) {
  if (e.key === "Tab") {
    e.preventDefault();
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    const spaces = typeof indentSpaces === "number" ? " ".repeat(indentSpaces) : "\t";

    if (start === end) {
      // Single cursor insertion
      const updated = value.substring(0, start) + spaces + value.substring(end);
      if (onChange) {
        onChange(updated);
      } else {
        textarea.value = updated;
      }
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    } else {
      // Multi-line selection indentation
      const before = value.substring(0, start);
      const selected = value.substring(start, end);
      const after = value.substring(end);

      if (e.shiftKey) {
        // Outdent (Shift + Tab)
        const lines = selected.split("\n");
        const unindented = lines.map((l) =>
          l.startsWith(spaces)
            ? l.substring(spaces.length)
            : l.startsWith(" ")
            ? l.substring(1)
            : l
        );
        const replacement = unindented.join("\n");
        const updated = before + replacement + after;
        if (onChange) onChange(updated);
        setTimeout(() => {
          textarea.selectionStart = start;
          textarea.selectionEnd = start + replacement.length;
        }, 0);
      } else {
        // Indent (Tab)
        const lines = selected.split("\n");
        const indented = lines.map((l) => spaces + l);
        const replacement = indented.join("\n");
        const updated = before + replacement + after;
        if (onChange) onChange(updated);
        setTimeout(() => {
          textarea.selectionStart = start;
          textarea.selectionEnd = start + replacement.length;
        }, 0);
      }
    }
  }
}

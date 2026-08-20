import { calculateReadingTime } from "@/lib/utils/formatters";
import { ToolExecutionContext } from "./types";

export function processWordCounter(context: ToolExecutionContext): string {
  const { input } = context;
  if (!input.trim()) return "";

  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  const chars = input.length;
  const charsNoSpaces = input.replace(/\s/g, "").length;
  const lines = input.split("\n").length;
  const readingTime = calculateReadingTime(words);

  return [
    `Words: ${words}`,
    `Characters: ${chars}`,
    `Characters (no spaces): ${charsNoSpaces}`,
    `Lines: ${lines}`,
    `Estimated Reading Time: ~${readingTime} min`,
  ].join("\n");
}

export function processCaseConverter(context: ToolExecutionContext): string {
  const { input, action = "format" } = context;
  if (!input) return "";

  if (action === "minify") {
    // lowercase
    return input.toLowerCase();
  }

  // default uppercase / titlecase
  return input.toUpperCase();
}

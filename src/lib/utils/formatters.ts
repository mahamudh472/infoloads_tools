/**
 * Recursively sorts all keys in an object or array alphabetically.
 */
export function sortObjectKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }
  if (obj !== null && typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    return Object.keys(record)
      .sort()
      .reduce((result: Record<string, unknown>, key: string) => {
        result[key] = sortObjectKeys(record[key]);
        return result;
      }, {});
  }
  return obj;
}

/**
 * Calculates estimated reading time in minutes from word count.
 */
export function calculateReadingTime(words: number, wordsPerMinute = 200): number {
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Determines file extension based on tool type.
 */
export function getFileExtensionForTool(toolId: string): string {
  if (toolId.includes("json")) return "json";
  if (toolId.includes("html")) return "html";
  if (toolId.includes("javascript")) return "js";
  if (toolId.includes("css")) return "css";
  if (toolId.includes("xml")) return "xml";
  if (toolId.includes("markdown")) return "md";
  if (toolId.includes("svg")) return "svg";
  return "txt";
}

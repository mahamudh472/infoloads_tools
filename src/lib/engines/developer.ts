import { sortObjectKeys } from "@/lib/utils/formatters";
import { ToolExecutionContext } from "./types";

export function processJsonFormatter(context: ToolExecutionContext): string {
  const { input, action = "format", indent = 2, sortKeys = false } = context;
  if (!input.trim()) return "";

  let parsed = JSON.parse(input);
  if (sortKeys && typeof parsed === "object" && parsed !== null) {
    parsed = sortObjectKeys(parsed);
  }

  if (action === "minify") {
    return JSON.stringify(parsed);
  }

  const indentVal = indent === "tab" ? "\t" : indent;
  return JSON.stringify(parsed, null, indentVal);
}

export function processJsonValidator(context: ToolExecutionContext): string {
  const { input } = context;
  if (!input.trim()) return "";

  JSON.parse(input);
  return "Valid JSON syntax! The JSON structure is well-formed.";
}

export function processBase64Encoder(context: ToolExecutionContext): string {
  const { input } = context;
  if (!input) return "";

  return btoa(unescape(encodeURIComponent(input)));
}

export function processBase64Decoder(context: ToolExecutionContext): string {
  const { input } = context;
  if (!input) return "";

  try {
    return decodeURIComponent(escape(atob(input)));
  } catch {
    return atob(input);
  }
}

export function processUrlEncoder(context: ToolExecutionContext): string {
  const { input } = context;
  if (!input) return "";

  return encodeURIComponent(input);
}

export function processUrlDecoder(context: ToolExecutionContext): string {
  const { input } = context;
  if (!input) return "";

  return decodeURIComponent(input);
}

export function processHtmlEncoder(context: ToolExecutionContext): string {
  const { input } = context;
  if (!input) return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function processHtmlDecoder(context: ToolExecutionContext): string {
  const { input } = context;
  if (!input) return "";

  if (typeof document !== "undefined") {
    const txt = document.createElement("textarea");
    txt.innerHTML = input;
    return txt.value;
  }

  return input
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

export function processJsMinifier(context: ToolExecutionContext): string {
  const { input } = context;
  if (!input.trim()) return "";

  return input
    .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "")
    .replace(/^\s+|\s+$/gm, "")
    .replace(/\n+/g, " ")
    .replace(/\s*([=+\-*/%{}();,:<>])\s*/g, "$1")
    .trim();
}

export function processCssMinifier(context: ToolExecutionContext): string {
  const { input } = context;
  if (!input.trim()) return "";

  return input
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([:;{}])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

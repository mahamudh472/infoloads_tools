import {
  processBase64Decoder,
  processBase64Encoder,
  processCssMinifier,
  processHtmlDecoder,
  processHtmlEncoder,
  processJsMinifier,
  processJsonFormatter,
  processJsonValidator,
  processUrlDecoder,
  processUrlEncoder,
} from "./developer";
import { processCaseConverter, processWordCounter } from "./text";
import { ToolExecutionContext, ToolExecutionResult, ToolProcessor } from "./types";

export * from "./types";

const PROCESSORS: Record<string, ToolProcessor> = {
  "json-formatter": processJsonFormatter,
  "json-validator": processJsonValidator,
  "base64-encoder": processBase64Encoder,
  "base64-decoder": processBase64Decoder,
  "base64-encoder-decoder": processBase64Encoder,
  "url-encoder": processUrlEncoder,
  "url-decoder": processUrlDecoder,
  "url-encoder-decoder": processUrlEncoder,
  "html-encoder": processHtmlEncoder,
  "html-decoder": processHtmlDecoder,
  "javascript-minifier": processJsMinifier,
  "css-minifier": processCssMinifier,
  "word-counter": processWordCounter,
  "case-converter": processCaseConverter,
};

/**
 * Executes a tool's core logic with safe error boundary handling.
 */
export function executeTool(context: ToolExecutionContext): ToolExecutionResult {
  if (!context.input || !context.input.trim()) {
    return { output: "", error: null };
  }

  const processor = PROCESSORS[context.toolId];

  try {
    if (processor) {
      const output = processor(context);
      return { output, error: null };
    }

    // Default fallback pass-through
    return { output: context.input, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "An error occurred while processing the data.";

    return {
      output: "",
      error: message,
    };
  }
}

"use client";

import { useState, useCallback, useRef } from "react";
import { executeTool } from "@/lib/engines";
import { downloadFile, readFileAsText } from "@/lib/utils/file";
import { getFileExtensionForTool } from "@/lib/utils/formatters";
import { IndentOption, Tool, ToolAction } from "@/types/tool";
import { useClipboard } from "./useClipboard";
import { handleTextareaTabKey } from "@/lib/utils/keyboard";

export function useToolExecution(tool: Tool) {
  const [currentToolId, setCurrentToolId] = useState(tool.id);
  const [inputText, setInputText] = useState(tool.sampleInput || "");
  const [outputText, setOutputText] = useState(() => {
    if (tool.sampleInput) {
      return executeTool({
        toolId: tool.id,
        input: tool.sampleInput,
        action: "format",
      }).output;
    }
    return "";
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [indentSize, setIndentSize] = useState<IndentOption>(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  // Sync state if tool changes
  if (tool.id !== currentToolId) {
    setCurrentToolId(tool.id);
    const initialInput = tool.sampleInput || "";
    setInputText(initialInput);
    setErrorMessage(null);
    if (initialInput) {
      setOutputText(
        executeTool({
          toolId: tool.id,
          input: initialInput,
          action: "format",
          indent: indentSize,
          sortKeys,
        }).output
      );
    } else {
      setOutputText("");
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const outputTextAreaRef = useRef<HTMLTextAreaElement>(null);

  const { copied, copy } = useClipboard();

  // Execute processing logic
  const executeAction = useCallback(
    (
      action: ToolAction = "format",
      overrideText?: string,
      currentIndent: IndentOption = indentSize,
      currentSort: boolean = sortKeys
    ) => {
      const textToProcess = overrideText !== undefined ? overrideText : inputText;
      setErrorMessage(null);

      if (!textToProcess.trim()) {
        setOutputText("");
        return;
      }

      const result = executeTool({
        toolId: tool.id,
        input: textToProcess,
        action,
        indent: currentIndent,
        sortKeys: currentSort,
      });

      if (result.error) {
        setErrorMessage(result.error);
      } else {
        setOutputText(result.output);
      }
    },
    [tool.id, inputText, indentSize, sortKeys]
  );

  // Handle Tab key indentation in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      const spaceCount = indentSize === "tab" ? 2 : indentSize;
      handleTextareaTabKey(e, (val) => {
        setInputText(val);
        executeAction("format", val, indentSize, sortKeys);
      }, spaceCount);
    }
  };

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await readFileAsText(file);
      setInputText(content);
      executeAction("format", content, indentSize, sortKeys);
    } catch {
      setErrorMessage("Failed to read file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Clear workspace
  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setErrorMessage(null);
  };

  // Copy output to clipboard
  const handleCopy = () => {
    if (!outputText) return;
    copy(outputText);
  };

  // Download output
  const handleDownload = () => {
    if (!outputText) return;
    const extension = getFileExtensionForTool(tool.id);
    const filename = `${tool.slug}-result.${extension}`;
    downloadFile(outputText, filename);
  };

  return {
    inputText,
    setInputText,
    outputText,
    setOutputText,
    errorMessage,
    setErrorMessage,
    indentSize,
    setIndentSize,
    sortKeys,
    setSortKeys,
    optionsOpen,
    setOptionsOpen,
    copied,
    fileInputRef,
    inputTextAreaRef,
    outputTextAreaRef,
    executeAction,
    handleKeyDown,
    handleFileUpload,
    handleClear,
    handleCopy,
    handleDownload,
  };
}

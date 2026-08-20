"use client";

import React from "react";
import { Upload, RotateCcw, Copy, Download, Check, AlertCircle } from "lucide-react";
import { Tool } from "@/types/tool";
import ToolEditorPanel from "./ToolEditorPanel";
import ToolToolbar from "./ToolToolbar";
import { useToolExecution } from "@/hooks/useToolExecution";

interface ToolWorkspaceProps {
  tool: Tool;
}

export default function ToolWorkspace({ tool }: ToolWorkspaceProps) {
  const {
    inputText,
    setInputText,
    outputText,
    errorMessage,
    indentSize,
    setIndentSize,
    sortKeys,
    setSortKeys,
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
  } = useToolExecution(tool);

  const inputActions = (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".json,.txt,.js,.css,.html,.xml,.md"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors shadow-xs"
      >
        <Upload className="h-3.5 w-3.5" />
        <span>Upload {tool.id.includes("json") ? "JSON" : "File"}</span>
      </button>
      <button
        onClick={handleClear}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors shadow-xs"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Clear</span>
      </button>
    </>
  );

  const outputActions = (
    <>
      <button
        onClick={handleCopy}
        disabled={!outputText}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-50 transition-colors shadow-xs"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
      <button
        onClick={handleDownload}
        disabled={!outputText}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-50 transition-colors shadow-xs"
      >
        <Download className="h-3.5 w-3.5" />
        <span>Download</span>
      </button>
    </>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Input Panel Card */}
      <ToolEditorPanel
        title="Input"
        value={inputText}
        onChange={(val) => {
          setInputText(val);
          executeAction("format", val, indentSize, sortKeys);
        }}
        onKeyDown={handleKeyDown}
        placeholder={`Paste or type your ${tool.name.toLowerCase()} input here...`}
        actions={inputActions}
        textareaRef={inputTextAreaRef}
      />

      {/* Action Controls Toolbar */}
      <ToolToolbar
        tool={tool}
        indentSize={indentSize}
        sortKeys={sortKeys}
        onExecute={(action, indent, sort) => executeAction(action, undefined, indent, sort)}
        onIndentChange={setIndentSize}
        onSortChange={setSortKeys}
      />

      {/* Error Banner */}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3.5 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in fade-in duration-150">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
          <div>
            <span className="font-semibold">Syntax Error: </span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Output Panel Card */}
      <ToolEditorPanel
        title="Output"
        value={outputText}
        readOnly
        placeholder={`Processed ${tool.name.toLowerCase()} result will appear here...`}
        actions={outputActions}
        textareaRef={outputTextAreaRef}
      />
    </div>
  );
}

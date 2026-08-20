"use client";

import React, { useState } from "react";
import { Sparkles, Code, Settings2, ChevronRight } from "lucide-react";
import { IndentOption, Tool, ToolAction } from "@/types/tool";

interface ToolToolbarProps {
  tool: Tool;
  indentSize: IndentOption;
  sortKeys: boolean;
  onExecute: (action: ToolAction, indent?: IndentOption, sort?: boolean) => void;
  onIndentChange: (indent: IndentOption) => void;
  onSortChange: (sort: boolean) => void;
}

export default function ToolToolbar({
  tool,
  indentSize,
  sortKeys,
  onExecute,
  onIndentChange,
  onSortChange,
}: ToolToolbarProps) {
  const [optionsOpen, setOptionsOpen] = useState(false);

  const isJsonOrCode =
    tool.id.includes("json") ||
    tool.id.includes("html") ||
    tool.id.includes("javascript") ||
    tool.id.includes("css");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-1">
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => onExecute("format", indentSize, sortKeys)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all active:scale-[0.98]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>
            {tool.id === "json-validator"
              ? "Validate JSON"
              : `Format ${tool.id.includes("json") ? "JSON" : "Code"}`}
          </span>
        </button>

        {isJsonOrCode && tool.id !== "json-validator" && (
          <button
            onClick={() => onExecute("minify", indentSize, sortKeys)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors shadow-xs"
          >
            <Code className="h-3.5 w-3.5" />
            <span>Minify</span>
          </button>
        )}
      </div>

      {/* Options Dropdown Menu */}
      {tool.id.includes("json") && (
        <div className="relative">
          <button
            onClick={() => setOptionsOpen(!optionsOpen)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 px-3 py-2 text-xs sm:text-sm font-medium transition-colors shadow-xs"
          >
            <Settings2 className="h-3.5 w-3.5 text-gray-500" />
            <span>Options</span>
            <ChevronRight
              className={`h-3.5 w-3.5 transition-transform ${
                optionsOpen ? "rotate-90" : ""
              }`}
            />
          </button>

          {optionsOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 p-3 shadow-lg z-20 animate-in fade-in zoom-in-95 duration-100">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Indentation
              </div>
              <div className="grid grid-cols-3 gap-1 mb-3">
                <button
                  onClick={() => {
                    onIndentChange(2);
                    onExecute("format", 2, sortKeys);
                  }}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    indentSize === 2
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  2 Spaces
                </button>
                <button
                  onClick={() => {
                    onIndentChange(4);
                    onExecute("format", 4, sortKeys);
                  }}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    indentSize === 4
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  4 Spaces
                </button>
                <button
                  onClick={() => {
                    onIndentChange("tab");
                    onExecute("format", "tab", sortKeys);
                  }}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    indentSize === "tab"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Tabs
                </button>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>

              <label className="flex items-center justify-between cursor-pointer py-1 text-xs text-gray-700 dark:text-gray-300">
                <span>Sort Object Keys</span>
                <input
                  type="checkbox"
                  checked={sortKeys}
                  onChange={(e) => {
                    onSortChange(e.target.checked);
                    onExecute("format", indentSize, e.target.checked);
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

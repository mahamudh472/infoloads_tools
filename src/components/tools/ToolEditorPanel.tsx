"use client";

import React, { useMemo } from "react";

import { handleTextareaTabKey } from "@/lib/utils/keyboard";

interface ToolEditorPanelProps {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  readOnly?: boolean;
  placeholder?: string;
  actions?: React.ReactNode;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export default function ToolEditorPanel({
  title,
  value,
  onChange,
  onKeyDown,
  readOnly = false,
  placeholder,
  actions,
  textareaRef,
}: ToolEditorPanelProps) {
  // Generate line numbers
  const lineNumbers = useMemo(() => {
    const linesCount = Math.max(1, value.split("\n").length);
    return Array.from({ length: linesCount }, (_, i) => i + 1);
  }, [value]);

  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
    if (!e.defaultPrevented && e.key === "Tab" && !readOnly) {
      handleTextareaTabKey(e, onChange);
    }
  };

  return (
    <div className="rounded-xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-[#0f131c] shadow-xs overflow-hidden">
      {/* Panel Header */}
      <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-between">
        <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </span>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {/* Editor Body */}
      <div className="flex min-h-[160px] sm:min-h-[190px] max-h-[380px] overflow-auto relative">
        {/* Line Numbers Column */}
        <div className="w-10 sm:w-11 py-3 pr-2.5 text-right text-gray-400 dark:text-gray-600 font-mono text-xs select-none border-r border-gray-100 dark:border-gray-800/80 bg-gray-50/40 dark:bg-gray-900/20 shrink-0 leading-relaxed">
          {lineNumbers.map((num) => (
            <div key={num}>{num}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyDown={handleKeyDownInternal}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
          className="flex-1 p-3 font-mono text-xs sm:text-sm bg-transparent outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 leading-relaxed w-full whitespace-pre"
        />
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import {
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRightLeft,
  Download,
} from "lucide-react";
import { Tool } from "@/types/tool";
import { useClipboard } from "@/hooks/useClipboard";
import { downloadFile } from "@/lib/utils/file";
import { handleTextareaTabKey } from "@/lib/utils/keyboard";

interface CaseConverterWorkspaceProps {
  tool: Tool;
}

const SAMPLE_TEXT = "convert any text between various letter cases easily";

export default function CaseConverterWorkspace({ tool }: CaseConverterWorkspaceProps) {
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { copy } = useClipboard();

  const handleCopyCase = (key: string, text: string) => {
    copy(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const caseTransformations = useMemo(() => {
    const text = inputText.trim();
    if (!text) {
      return [];
    }

    const words = text
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .split(" ")
      .filter(Boolean);

    // UPPERCASE
    const upper = inputText.toUpperCase();

    // lowercase
    const lower = inputText.toLowerCase();

    // Title Case
    const title = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

    // Sentence case
    const sentence = inputText
      .toLowerCase()
      .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

    // camelCase
    const camel = words
      .map((w, i) =>
        i === 0
          ? w.toLowerCase()
          : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      )
      .join("");

    // PascalCase
    const pascal = words
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("");

    // snake_case
    const snake = words.map((w) => w.toLowerCase()).join("_");

    // kebab-case
    const kebab = words.map((w) => w.toLowerCase()).join("-");

    // CONSTANT_CASE
    const constant = words.map((w) => w.toUpperCase()).join("_");

    // dot.case
    const dot = words.map((w) => w.toLowerCase()).join(".");

    // Alternating case: aLtErNaTiNg
    const alternating = inputText
      .split("")
      .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
      .join("");

    // Toggle/Inverse case
    const toggle = inputText
      .split("")
      .map((c) =>
        c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()
      )
      .join("");

    return [
      { id: "upper", label: "UPPERCASE", value: upper, example: "UPPERCASE TEXT" },
      { id: "lower", label: "lowercase", value: lower, example: "lowercase text" },
      { id: "title", label: "Title Case", value: title, example: "Title Case Text" },
      { id: "sentence", label: "Sentence case", value: sentence, example: "Sentence case text." },
      { id: "camel", label: "camelCase", value: camel, example: "camelCaseText" },
      { id: "pascal", label: "PascalCase", value: pascal, example: "PascalCaseText" },
      { id: "snake", label: "snake_case", value: snake, example: "snake_case_text" },
      { id: "kebab", label: "kebab-case", value: kebab, example: "kebab-case-text" },
      { id: "constant", label: "CONSTANT_CASE", value: constant, example: "CONSTANT_CASE_TEXT" },
      { id: "dot", label: "dot.case", value: dot, example: "dot.case.text" },
      { id: "alternating", label: "aLtErNaTiNg", value: alternating, example: "aLtErNaTiNg cAsE" },
      { id: "toggle", label: "tOGGLE cASE", value: toggle, example: "tOGGLE cASE tEXT" },
    ];
  }, [inputText]);

  return (
    <div className="flex flex-col gap-5">
      {/* Input Panel */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 py-2.5 bg-gray-50/70 dark:bg-gray-800/40">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Source Text
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setInputText("")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => handleTextareaTabKey(e, setInputText, 2)}
          placeholder="Type or paste text to convert casing..."
          className="w-full min-h-[140px] p-4 text-sm leading-relaxed bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none resize-y"
        />

        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 px-4 py-2 bg-gray-50/50 dark:bg-gray-800/20 text-xs text-gray-500 dark:text-gray-400">
          <span>{inputText.length} characters • {inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words</span>
          <button
            onClick={() => downloadFile(inputText, "converted-text.txt")}
            disabled={!inputText}
            className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-50 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Case Options Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
          <ArrowRightLeft className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Converted Cases (Click to Copy or Apply)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {caseTransformations.map((item) => {
            const isCopied = copiedKey === item.id;
            return (
              <div
                key={item.id}
                className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-3.5 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setInputText(item.value)}
                      title="Apply as source"
                      className="px-2 py-1 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      Use
                    </button>
                    <button
                      onClick={() => handleCopyCase(item.id, item.value)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-all cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 font-mono text-xs text-gray-800 dark:text-gray-200 truncate select-all">
                  {item.value || item.example}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

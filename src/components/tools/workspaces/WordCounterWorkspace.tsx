"use client";

import React, { useState, useMemo } from "react";
import {
  Type,
  FileText,
  Clock,
  Mic,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  AlignLeft,
  BookOpen,
} from "lucide-react";
import { Tool } from "@/types/tool";
import { useClipboard } from "@/hooks/useClipboard";
import { downloadFile } from "@/lib/utils/file";
import { handleTextareaTabKey } from "@/lib/utils/keyboard";

interface WordCounterWorkspaceProps {
  tool: Tool;
}

const SAMPLE_TEXT = `Welcome to the InfoLoads Word Counter and Text Analyzer tool.

This tool helps writers, developers, SEO specialists, and students analyze their content in real time. You can measure word count, character density, sentence structure, estimated reading time, and speaking duration.

Writing clear and concise copy is essential for effective communication. Whether you are drafting a blog post, social media caption, or technical essay, this workspace provides instant insights to improve your writing clarity.`;

export default function WordCounterWorkspace({ tool }: WordCounterWorkspaceProps) {
  const [text, setText] = useState(SAMPLE_TEXT);
  const { copied, copy } = useClipboard();

  // Metrics computation
  const stats = useMemo(() => {
    const raw = text;
    const trimmed = raw.trim();

    const characters = raw.length;
    const charactersNoSpaces = raw.replace(/\s+/g, "").length;

    const wordsArray = trimmed ? trimmed.split(/\s+/).filter(Boolean) : [];
    const words = wordsArray.length;

    // Sentences: split by . ! ? followed by whitespace or end
    const sentences = trimmed
      ? (raw.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || (words > 0 ? 1 : 0)
      : 0;

    // Paragraphs: split by double newlines or non-empty lines
    const paragraphs = trimmed
      ? raw
          .split(/\n+/)
          .map((p) => p.trim())
          .filter(Boolean).length
      : 0;

    const readingTimeMinutes = (words / 200).toFixed(1);
    const speakingTimeMinutes = (words / 130).toFixed(1);
    const pages = (words / 300).toFixed(1);

    // Keyword density
    const frequencyMap: Record<string, number> = {};
    const stopWords = new Set([
      "the", "and", "a", "an", "in", "on", "of", "to", "for", "is", "it", "this",
      "that", "with", "as", "by", "at", "or", "from", "be", "are", "was", "were",
      "your", "you", "can", "their", "our", "will", "all", "more"
    ]);

    wordsArray.forEach((w) => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean.length > 2 && !stopWords.has(clean)) {
        frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({
        word,
        count,
        percentage: words > 0 ? ((count / words) * 100).toFixed(1) : "0",
      }));

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes,
      speakingTimeMinutes,
      pages,
      topKeywords,
    };
  }, [text]);

  // Cleaners
  const removeExtraSpaces = () => {
    setText(text.replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n\n").trim());
  };

  const removeEmptyLines = () => {
    setText(
      text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join("\n")
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 4-Stat Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Words</span>
            <Type className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {stats.words.toLocaleString()}
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Characters</span>
            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {stats.characters.toLocaleString()}
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sentences</span>
            <AlignLeft className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {stats.sentences.toLocaleString()}
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Paragraphs</span>
            <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            {stats.paragraphs.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Text Area Editor */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 dark:border-gray-800 px-4 py-2.5 bg-gray-50/70 dark:bg-gray-800/40">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Text Editor
          </span>
          <div className="flex items-center flex-wrap gap-1.5">
            <button
              onClick={removeExtraSpaces}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
            >
              <Sparkles className="h-3 w-3" />
              <span>Clean Spaces</span>
            </button>
            <button
              onClick={removeEmptyLines}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
            >
              <span>Remove Blank Lines</span>
            </button>
            <button
              onClick={() => setText("")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => handleTextareaTabKey(e, setText, 2)}
          placeholder="Paste or type your text here to analyze..."
          className="w-full min-h-[300px] p-4 text-sm leading-relaxed bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none resize-y"
        />

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 dark:border-gray-800 px-4 py-2.5 bg-gray-50/50 dark:bg-gray-800/20 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span>{stats.charactersNoSpaces.toLocaleString()} chars (no spaces)</span>
            <span>•</span>
            <span>~{stats.pages} pages</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copy(text)}
              disabled={!text}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-50 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
            <button
              onClick={() => downloadFile(text, `${tool.slug}.txt`)}
              disabled={!text}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download .txt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reading Time & Top Keywords Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estimated Times */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Reading & Speaking Estimates
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Reading Time</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                ~{stats.readingTimeMinutes} min
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">Speaking Time</span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">
                ~{stats.speakingTimeMinutes} min
              </span>
            </div>
          </div>
        </div>

        {/* Top Keywords */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Top Keyword Density
          </h3>
          {stats.topKeywords.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {stats.topKeywords.map((kw) => (
                <div
                  key={kw.word}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs"
                >
                  <span className="font-medium text-gray-800 dark:text-gray-200 capitalize">
                    {kw.word}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 font-semibold">
                    {kw.count} ({kw.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400 py-4 text-center">
              Type more text to see keyword density analysis.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

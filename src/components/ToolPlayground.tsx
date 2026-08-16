"use client";

import React, { useState, useEffect } from "react";
import { X, Copy, Trash2, Check, ArrowLeftRight, Download, Sparkles, RefreshCw } from "lucide-react";
import { TOOLS, Tool } from "@/data/tools";

interface ToolPlaygroundProps {
  toolId: string | null;
  onClose: () => void;
}

export default function ToolPlayground({ toolId, onClose }: ToolPlaygroundProps) {
  const [copied, setCopied] = useState(false);
  const [tool, setTool] = useState<Tool | null>(null);

  // JSON Formatter states
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonError, setJsonError] = useState("");

  // Word Counter states
  const [textInput, setTextInput] = useState("");

  // QR Code states
  const [qrText, setQrText] = useState("https://infoloads.com");
  const [qrSize, setQrSize] = useState("200");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  // Base64 states
  const [base64Mode, setBase64Mode] = useState<"encode" | "decode">("encode");
  const [base64Input, setBase64Input] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const [base64Error, setBase64Error] = useState("");

  // Suggestions states for "Coming Soon" tools
  const [suggestion, setSuggestion] = useState("");
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);

  // Sync current tool
  useEffect(() => {
    if (toolId) {
      const selected = TOOLS.find((t) => t.id === toolId);
      setTool(selected || null);
      // Reset tool-specific states
      setJsonInput("");
      setJsonOutput("");
      setJsonError("");
      setTextInput("");
      setQrText("https://infoloads.com");
      setBase64Input("");
      setBase64Output("");
      setBase64Error("");
      setSuggestion("");
      setSuggestionSubmitted(false);
    }
  }, [toolId]);

  // Set QR code URL
  useEffect(() => {
    if (toolId === "qr-code-generator" && qrText) {
      setQrCodeUrl(`https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrText)}`);
    }
  }, [qrText, qrSize, toolId]);

  if (!toolId || !tool) return null;

  // Copy to Clipboard utility
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. JSON Formatter Logic
  const handleFormatJson = (minify = false) => {
    setJsonError("");
    if (!jsonInput.trim()) {
      setJsonOutput("");
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const formatted = minify
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, 2);
      setJsonOutput(formatted);
    } catch (err: any) {
      setJsonError(err.message || "Invalid JSON structure");
      setJsonOutput("");
    }
  };

  const loadSampleJson = () => {
    const sample = {
      name: "InfoLoads Tools",
      type: "Everyday web helpers",
      active: true,
      features: ["Formatters", "Converters", "Analyzers"],
      stats: {
        totalTools: 120,
        averageSpeedMs: 5
      }
    };
    setJsonInput(JSON.stringify(sample, null, 2));
    setJsonError("");
  };

  // 2. Word Counter Stats
  const getWordStats = () => {
    const charCount = textInput.length;
    const charNoSpaces = textInput.replace(/\s/g, "").length;
    
    // Words
    const words = textInput.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Sentences
    const sentences = textInput.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    // Paragraphs
    const paragraphs = textInput.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length;

    // Reading time (average 200 WPM)
    const readingTimeSeconds = Math.ceil((wordCount / 200) * 60);
    let readingTimeText = "0s";
    if (readingTimeSeconds >= 60) {
      readingTimeText = `${Math.floor(readingTimeSeconds / 60)}m ${readingTimeSeconds % 60}s`;
    } else if (readingTimeSeconds > 0) {
      readingTimeText = `${readingTimeSeconds}s`;
    }

    return { charCount, charNoSpaces, wordCount, sentenceCount, paragraphCount, readingTimeText };
  };

  const wordStats = getWordStats();

  // 4. Base64 Logic
  const handleBase64Convert = () => {
    setBase64Error("");
    if (!base64Input.trim()) {
      setBase64Output("");
      return;
    }
    try {
      if (base64Mode === "encode") {
        setBase64Output(btoa(base64Input));
      } else {
        setBase64Output(atob(base64Input));
      }
    } catch (err) {
      setBase64Error("Invalid Base64 or decoding error. Please verify input data.");
      setBase64Output("");
    }
  };

  // Suggestions submit
  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) return;
    setSuggestionSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-muted/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {tool.category}
              </span>
              {tool.popular && (
                <span className="rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  Interactive Live
                </span>
              )}
            </div>
            <h2 className="mt-1 text-xl font-bold text-foreground">
              {tool.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-border p-1.5 hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* JSON Formatter */}
          {tool.id === "json-formatter" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[400px]">
              {/* Input Area */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground">Raw Input JSON</label>
                  <div className="flex gap-2">
                    <button
                      onClick={loadSampleJson}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" /> Load Sample
                    </button>
                    <button
                      onClick={() => setJsonInput("")}
                      className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Clear
                    </button>
                  </div>
                </div>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='Paste your JSON here (e.g. {"key": "value"})'
                  className="flex-1 min-h-[280px] rounded-xl border border-border bg-muted/20 p-4 font-mono text-sm text-foreground focus:outline-none focus:border-indigo-500 resize-none"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleFormatJson(false)}
                    className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                  >
                    Format (Pretty)
                  </button>
                  <button
                    onClick={() => handleFormatJson(true)}
                    className="flex-1 rounded-xl border border-border hover:bg-muted py-2.5 text-sm font-semibold text-foreground transition-colors"
                  >
                    Minify
                  </button>
                </div>
              </div>

              {/* Output Area */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground">Formatted Output</label>
                  {jsonOutput && (
                    <button
                      onClick={() => handleCopy(jsonOutput)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied!" : "Copy Output"}
                    </button>
                  )}
                </div>
                <div className="flex-1 min-h-[280px] rounded-xl border border-border bg-muted/40 p-4 font-mono text-sm text-foreground overflow-auto relative">
                  {jsonError && (
                    <div className="absolute inset-x-4 top-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-500 text-xs">
                      {jsonError}
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap">{jsonOutput || (!jsonError && "Output will appear here...")}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Word Counter */}
          {tool.id === "word-counter" && (
            <div className="flex flex-col gap-6">
              {/* Text Input */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground">Input Text</label>
                  <button
                    onClick={() => setTextInput("")}
                    className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Clear
                  </button>
                </div>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type or paste your text here..."
                  className="w-full min-h-[220px] rounded-xl border border-border bg-muted/20 p-4 text-base text-foreground focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Live Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: "Words", value: wordStats.wordCount },
                  { label: "Characters", value: wordStats.charCount },
                  { label: "Chars (No Spaces)", value: wordStats.charNoSpaces },
                  { label: "Sentences", value: wordStats.sentenceCount },
                  { label: "Paragraphs", value: wordStats.paragraphCount },
                  { label: "Reading Time", value: wordStats.readingTimeText },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-4 text-center shadow-sm">
                    <span className="text-xs text-muted-foreground block font-medium uppercase tracking-wider">{stat.label}</span>
                    <span className="text-xl font-extrabold text-foreground mt-1.5 block">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QR Code Generator */}
          {tool.id === "qr-code-generator" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[350px]">
              {/* Controls */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">Enter URL or Plain Text</label>
                  <input
                    type="text"
                    value={qrText}
                    onChange={(e) => setQrText(e.target.value)}
                    placeholder="https://example.com"
                    className="rounded-xl border border-border bg-muted/20 px-4 py-2.5 text-base text-foreground focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-foreground">QR Code Dimensions</label>
                  <select
                    value={qrSize}
                    onChange={(e) => setQrSize(e.target.value)}
                    className="rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                  >
                    <option value="150">150x150 px</option>
                    <option value="200">200x200 px</option>
                    <option value="250">250x250 px</option>
                    <option value="300">300x300 px</option>
                  </select>
                </div>
              </div>

              {/* QR Render view */}
              <div className="flex flex-col items-center justify-center border border-border bg-muted/10 rounded-2xl p-6 shadow-inner min-h-[280px]">
                {qrText.trim() ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="rounded-xl border border-border bg-white p-4 shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrCodeUrl} alt="QR Code" className="h-full w-full object-contain" />
                    </div>
                    <a
                      href={qrCodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download QR
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Please enter input text to render QR Code</p>
                )}
              </div>
            </div>
          )}

          {/* Base64 Encoder / Decoder */}
          {tool.id === "base64-encoder-decoder" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full min-h-[400px]">
              {/* Input Area */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBase64Mode("encode")}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                        base64Mode === "encode"
                          ? "bg-indigo-600 text-white"
                          : "border border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      Encode Mode
                    </button>
                    <button
                      onClick={() => setBase64Mode("decode")}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                        base64Mode === "decode"
                          ? "bg-indigo-600 text-white"
                          : "border border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      Decode Mode
                    </button>
                  </div>
                  <button
                    onClick={() => setBase64Input("")}
                    className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Clear
                  </button>
                </div>
                <textarea
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  placeholder={
                    base64Mode === "encode"
                      ? "Enter plain text to encode to Base64..."
                      : "Enter Base64 string to decode to plain text..."
                  }
                  className="flex-1 min-h-[280px] rounded-xl border border-border bg-muted/20 p-4 font-mono text-sm text-foreground focus:outline-none focus:border-indigo-500 resize-none"
                />
                <button
                  onClick={handleBase64Convert}
                  className="rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="h-4 w-4" /> Convert Base64
                </button>
              </div>

              {/* Output Area */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground">Converted Output</label>
                  {base64Output && (
                    <button
                      onClick={() => handleCopy(base64Output)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied!" : "Copy Output"}
                    </button>
                  )}
                </div>
                <div className="flex-1 min-h-[280px] rounded-xl border border-border bg-muted/40 p-4 font-mono text-sm text-foreground overflow-auto relative">
                  {base64Error && (
                    <div className="absolute inset-x-4 top-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-red-500 text-xs">
                      {base64Error}
                    </div>
                  )}
                  <pre className="whitespace-pre-wrap">{base64Output || (!base64Error && "Output will appear here...")}</pre>
                </div>
              </div>
            </div>
          )}

          {/* Under Construction Fallback */}
          {tool.id !== "json-formatter" &&
            tool.id !== "word-counter" &&
            tool.id !== "qr-code-generator" &&
            tool.id !== "base64-encoder-decoder" && (
              <div className="py-12 text-center flex flex-col items-center max-w-md mx-auto">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 mb-6">
                  <Sparkles className="h-8 w-8 animate-bounce" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Tool Under Development
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  We are working hard to build the most efficient and feature-rich version of <span className="font-semibold text-foreground">{tool.name}</span>. Submit your feedback to prioritize this tool!
                </p>

                {suggestionSubmitted ? (
                  <div className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-500 text-sm flex items-center gap-2">
                    <Check className="h-5 w-5 shrink-0" />
                    <span>Thank you! We have prioritized this tool based on your interest.</span>
                  </div>
                ) : (
                  <form onSubmit={handleSuggestionSubmit} className="mt-8 w-full flex flex-col gap-3">
                    <textarea
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      placeholder="What specific features would you like to see in this tool?"
                      required
                      className="w-full min-h-[90px] rounded-xl border border-border bg-muted/20 p-3 text-sm text-foreground focus:outline-none focus:border-indigo-500 resize-none"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                    >
                      Request Early Access
                    </button>
                  </form>
                )}
              </div>
            )}

        </div>
      </div>
    </div>
  );
}

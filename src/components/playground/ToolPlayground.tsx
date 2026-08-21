"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Copy, Trash2, Check, Sparkles } from "lucide-react";
import { getToolBySlug } from "@/lib/tools";
import { executeTool } from "@/lib/engines";
import { useClipboard } from "@/hooks/useClipboard";
import { handleTextareaTabKey } from "@/lib/utils/keyboard";

interface ToolPlaygroundProps {
  toolId: string | null;
  onClose: () => void;
}

export default function ToolPlayground({ toolId, onClose }: ToolPlaygroundProps) {
  const { copied, copy } = useClipboard();

  const tool = toolId ? getToolBySlug(toolId) || null : null;

  // States
  const [currentToolId, setCurrentToolId] = useState(toolId);
  const [inputText, setInputText] = useState(tool?.sampleInput || "");
  const [outputText, setOutputText] = useState(() => {
    if (tool?.sampleInput) {
      return executeTool({
        toolId: tool.id,
        input: tool.sampleInput,
        action: "format",
      }).output;
    }
    return "";
  });
  const [error, setError] = useState<string | null>(null);

  // QR Code states
  const [qrText, setQrText] = useState("https://infoloads.com");
  const qrSize = "200";

  // Base64 states
  const [base64Mode, setBase64Mode] = useState<"encode" | "decode">("encode");

  // Sync state if toolId changes
  if (toolId !== currentToolId) {
    setCurrentToolId(toolId);
    const initialInput = tool?.sampleInput || "";
    setInputText(initialInput);
    setError(null);
    if (initialInput && tool) {
      setOutputText(
        executeTool({
          toolId: tool.id,
          input: initialInput,
          action: "format",
        }).output
      );
    } else {
      setOutputText("");
    }
  }

  if (!toolId || !tool) return null;

  const qrCodeUrl =
    tool.id === "qr-code-generator" && qrText
      ? `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(
          qrText
        )}`
      : "";

  const handleExecute = (action: "format" | "minify" = "format") => {
    setError(null);
    if (!inputText.trim()) {
      setOutputText("");
      return;
    }

    const actualToolId =
      tool.id === "base64-encoder-decoder"
        ? base64Mode === "encode"
          ? "base64-encoder"
          : "base64-decoder"
        : tool.id;

    const result = executeTool({
      toolId: actualToolId,
      input: inputText,
      action,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setOutputText(result.output);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{tool.name}</h2>
              <p className="text-xs text-muted-foreground">{tool.category}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tool.id === "qr-code-generator" ? (
            <div className="flex flex-col items-center gap-4">
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                placeholder="Enter URL or text..."
                className="w-full rounded-xl border border-border bg-muted/20 px-4 py-2.5 text-sm"
              />
              {qrCodeUrl && (
                <div className="p-4 bg-white rounded-xl shadow-md">
                  <Image
                    src={qrCodeUrl}
                    alt="QR Code"
                    width={200}
                    height={200}
                    unoptimized
                    className="h-48 w-48"
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              {tool.id === "base64-encoder-decoder" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setBase64Mode("encode")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      base64Mode === "encode"
                        ? "bg-indigo-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Encode
                  </button>
                  <button
                    onClick={() => setBase64Mode("decode")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      base64Mode === "decode"
                        ? "bg-indigo-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Decode
                  </button>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Input</label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => handleTextareaTabKey(e, setInputText, 2)}
                  placeholder="Paste or type content here..."
                  className="w-full h-32 mt-1 rounded-xl border border-border bg-muted/20 p-3 font-mono text-xs focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleExecute("format")}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  Run / Format
                </button>
                <button
                  onClick={() => setInputText("")}
                  className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {outputText && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-muted-foreground">Output</label>
                    <button
                      onClick={() => copy(outputText)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={outputText}
                    className="w-full h-32 rounded-xl border border-border bg-muted/30 p-3 font-mono text-xs"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

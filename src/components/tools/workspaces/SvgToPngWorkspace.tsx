"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  Code,
} from "lucide-react";
import { Tool } from "@/types/tool";
import { readFileAsText } from "@/lib/utils/file";
import { handleTextareaTabKey } from "@/lib/utils/keyboard";

interface SvgToPngWorkspaceProps {
  tool: Tool;
}

const DEFAULT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#ec4899" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="40" fill="url(#grad)" />
  <circle cx="100" cy="100" r="45" fill="#ffffff" opacity="0.9" />
  <path d="M85 80 L125 100 L85 120 Z" fill="#6366f1" />
</svg>`;

export default function SvgToPngWorkspace({ tool }: SvgToPngWorkspaceProps) {
  const [svgCode, setSvgCode] = useState(DEFAULT_SVG);
  const [scale, setScale] = useState<number>(2);
  const [bgType, setBgType] = useState<"transparent" | "white" | "black">("transparent");
  const [pngUrl, setPngUrl] = useState<string | null>(null);
  const [svgDimensions, setSvgDimensions] = useState<{ width: number; height: number }>({
    width: 200,
    height: 200,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Render SVG onto Canvas and generate PNG
  useEffect(() => {
    if (!svgCode.trim()) {
      setPngUrl(null);
      return;
    }

    try {
      // Parse SVG dimensions
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgCode, "image/svg+xml");
      const svgEl = doc.querySelector("svg");
      if (!svgEl) return;

      const viewBox = svgEl.getAttribute("viewBox");
      let width = parseFloat(svgEl.getAttribute("width") || "300");
      let height = parseFloat(svgEl.getAttribute("height") || "300");

      if (viewBox) {
        const parts = viewBox.split(/[\s,]+/).map(Number);
        if (parts.length === 4) {
          width = parts[2];
          height = parts[3];
        }
      }

      setSvgDimensions({ width, height });

      const canvas = canvasRef.current || document.createElement("canvas");
      const targetWidth = Math.round(width * scale);
      const targetHeight = Math.round(height * scale);
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (bgType === "white") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      } else if (bgType === "black") {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      } else {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
      }

      const img = new window.Image();
      const blob = new Blob([svgCode], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const dataUrl = canvas.toDataURL("image/png");
        setPngUrl(dataUrl);
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch {
      // Silent catch for incomplete typing
    }
  }, [svgCode, scale, bgType]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const content = await readFileAsText(file);
      setSvgCode(content);
    } catch {
      alert("Failed to load SVG file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownloadPng = () => {
    if (!pngUrl) return;
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = `rendered-${Math.round(svgDimensions.width * scale)}x${Math.round(
      svgDimensions.height * scale
    )}.png`;
    a.click();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Left SVG Editor & Controls */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* SVG Markup Box */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              <Code className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>SVG Markup</span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".svg"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
              >
                <Upload className="h-3 w-3" />
                <span>Upload .svg</span>
              </button>
              <button
                onClick={() => setSvgCode("")}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <textarea
            value={svgCode}
            onChange={(e) => setSvgCode(e.target.value)}
            onKeyDown={(e) => handleTextareaTabKey(e, setSvgCode, 2)}
            placeholder="Paste raw <svg> markup here..."
            className="w-full h-56 p-3 text-xs font-mono rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none"
            spellCheck={false}
          />
        </div>

        {/* Export Settings */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
            <Layers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
              Raster Resolution Scale
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: "1x Standard", val: 1 },
              { label: "2x High-DPI", val: 2 },
              { label: "3x Crisp", val: 3 },
              { label: "4x Ultra HD", val: 4 },
            ].map((item) => (
              <button
                key={item.val}
                onClick={() => setScale(item.val)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  scale === item.val
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Background selector */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Canvas Background
            </span>
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <button
                onClick={() => setBgType("transparent")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                  bgType === "transparent"
                    ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Transparent
              </button>
              <button
                onClick={() => setBgType("white")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                  bgType === "white"
                    ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                White
              </button>
              <button
                onClick={() => setBgType("black")}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
                  bgType === "black"
                    ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Black
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Rendered Preview */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-6 shadow-xs flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Raster PNG Preview
            </span>
            <span className="text-xs font-mono font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
              {Math.round(svgDimensions.width * scale)} × {Math.round(svgDimensions.height * scale)} px
            </span>
          </div>

          {/* Checkerboard container for transparency */}
          <div
            className="w-full aspect-square max-h-[320px] rounded-2xl border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-center overflow-hidden"
            style={{
              backgroundImage:
                bgType === "transparent"
                  ? "repeating-conic-gradient(#80808020 0% 25%, transparent 0% 50%)"
                  : "none",
              backgroundSize: "20px 20px",
              backgroundColor:
                bgType === "white" ? "#ffffff" : bgType === "black" ? "#000000" : "transparent",
            }}
          >
            {pngUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pngUrl}
                alt="Rendered PNG"
                className="max-h-full max-w-full object-contain rounded-lg drop-shadow-md"
              />
            ) : (
              <span className="text-xs text-gray-400">Invalid or empty SVG</span>
            )}
          </div>

          <button
            onClick={handleDownloadPng}
            disabled={!pngUrl}
            className="w-full mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>Download PNG ({Math.round(svgDimensions.width * scale)}×{Math.round(svgDimensions.height * scale)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

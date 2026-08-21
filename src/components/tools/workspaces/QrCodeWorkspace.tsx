"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  QrCode,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Palette,
  Sliders,
} from "lucide-react";
import { Tool } from "@/types/tool";
import { useClipboard } from "@/hooks/useClipboard";

interface QrCodeWorkspaceProps {
  tool: Tool;
}

export default function QrCodeWorkspace({ tool }: QrCodeWorkspaceProps) {
  const [content, setContent] = useState("https://infoloads.com");
  const [size, setSize] = useState<number>(250);
  const [fgColor, setFgColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [ecc, setEcc] = useState<"L" | "M" | "Q" | "H">("M");
  const [margin, setMargin] = useState<number>(1);

  const { copied, copy } = useClipboard();

  // API URL for QR Code generation (clean hex without #)
  const cleanFg = fgColor.replace("#", "");
  const cleanBg = bgColor.replace("#", "");

  const qrImageUrl = content.trim()
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
        content
      )}&color=${cleanFg}&bgcolor=${cleanBg}&ecc=${ecc}&margin=${margin}`
    : "";

  const handleDownloadPng = async () => {
    if (!qrImageUrl) return;
    try {
      const res = await fetch(qrImageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-${size}x${size}.png`;
      a.click();
    } catch {
      window.open(qrImageUrl, "_blank");
    }
  };

  const handleDownloadSvg = async () => {
    if (!content.trim()) return;
    const svgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
      content
    )}&color=${cleanFg}&bgcolor=${cleanBg}&ecc=${ecc}&margin=${margin}&format=svg`;
    try {
      const res = await fetch(svgUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-${size}x${size}.svg`;
      a.click();
    } catch {
      window.open(svgUrl, "_blank");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Form Settings Column */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        {/* Content Card */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              QR Code Content / URL
            </label>
            <button
              onClick={() => setContent("")}
              className="text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear</span>
            </button>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter URL, text, email, or Wi-Fi credentials..."
            className="w-full h-28 p-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Customization Options */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-800">
            <Sliders className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
              Styling & Options
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Size Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Size ({size}x{size} px)
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="500"
                step="25"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Error Correction */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Error Correction Level
              </label>
              <select
                value={ecc}
                onChange={(e) => setEcc(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-200 focus:outline-none"
              >
                <option value="L">Low (7% recovery)</option>
                <option value="M">Medium (15% recovery)</option>
                <option value="Q">Quartile (25% recovery)</option>
                <option value="H">High (30% recovery)</option>
              </select>
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Foreground Color
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                  {fgColor.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
              <div className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Background Color
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                  {bgColor.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Preview Column */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              Live QR Preview
            </span>
            <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
              {size}x{size}
            </span>
          </div>

          <div
            className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md flex items-center justify-center transition-all"
            style={{ backgroundColor: bgColor }}
          >
            {qrImageUrl ? (
              <Image
                src={qrImageUrl}
                alt="Generated QR Code"
                width={size > 260 ? 260 : size}
                height={size > 260 ? 260 : size}
                unoptimized
                className="rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-xs text-gray-400">
                Enter text or URL to preview QR code
              </div>
            )}
          </div>

          {/* Download Buttons */}
          <div className="w-full grid grid-cols-2 gap-2.5 mt-6">
            <button
              onClick={handleDownloadPng}
              disabled={!content.trim()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={handleDownloadSvg}
              disabled={!content.trim()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-gray-200 text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Download SVG</span>
            </button>
          </div>

          {/* Copy Link */}
          <button
            onClick={() => copy(content)}
            disabled={!content.trim()}
            className="mt-3 text-xs text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied Content" : "Copy Raw Content"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

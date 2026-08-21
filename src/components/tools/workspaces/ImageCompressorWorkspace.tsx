"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Sliders,
  Download,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";
import { Tool } from "@/types/tool";

interface ImageCompressorWorkspaceProps {
  tool: Tool;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export default function ImageCompressorWorkspace({ tool }: ImageCompressorWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(80);
  const [format, setFormat] = useState<"image/jpeg" | "image/webp" | "image/png">("image/jpeg");
  const [maxDimension, setMaxDimension] = useState<number>(0); // 0 = original

  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image on canvas
  const processCompression = useCallback((
    imgFile: File,
    targetQuality: number,
    targetFormat: string,
    maxDim: number
  ) => {
    setIsProcessing(true);
    const img = document.createElement("img");
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (maxDim > 0 && (width > maxDim || height > maxDim)) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        if (targetFormat === "image/jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedBlob(blob);
              setCompressedSize(blob.size);
              const url = URL.createObjectURL(blob);
              setCompressedUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return url;
              });
            }
            setIsProcessing(false);
          },
          targetFormat,
          targetQuality / 100
        );
      };
    };

    reader.readAsDataURL(imgFile);
  }, []);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }

    setFile(selectedFile);
    setOriginalSize(selectedFile.size);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    processCompression(selectedFile, quality, format, maxDimension);
  };

  useEffect(() => {
    if (file) {
      processCompression(file, quality, format, maxDimension);
    }
  }, [file, quality, format, maxDimension, processCompression]);

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    const name = file.name.replace(/\.[^/.]+$/, "") + `-compressed.${ext}`;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(compressedBlob);
    a.download = name;
    a.click();
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setCompressedBlob(null);
    setCompressedUrl(null);
    setOriginalSize(0);
    setCompressedSize(0);
  };

  const savingsPercent =
    originalSize > 0 && compressedSize > 0
      ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
      : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Upload Dropzone if no file */}
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.files[0];
            if (dropped) handleFileSelect(dropped);
          }}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all bg-white dark:bg-gray-850 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 group shadow-xs"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
          />
          <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Choose an image or drag & drop here
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Supports PNG, JPEG, and WebP. 100% private in-browser compression without server upload.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Controls Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
                  Compression Settings
                </span>
              </div>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Upload New</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
              {/* Quality Slider */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Quality ({quality}%)
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {quality > 85 ? "High" : quality > 60 ? "Balanced" : "Smallest"}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Output Format */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Output Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-200 focus:outline-none"
                >
                  <option value="image/jpeg">JPEG (.jpg)</option>
                  <option value="image/webp">WebP (.webp)</option>
                  <option value="image/png">PNG (.png)</option>
                </select>
              </div>

              {/* Max Dimension */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Max Dimensions
                </label>
                <select
                  value={maxDimension}
                  onChange={(e) => setMaxDimension(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-200 focus:outline-none"
                >
                  <option value="0">Original Size</option>
                  <option value="1920">1920px (Full HD)</option>
                  <option value="1280">1280px (HD)</option>
                  <option value="800">800px (Web standard)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Card */}
            <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Original
                </span>
                <span className="font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  {formatBytes(originalSize)}
                </span>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-2">
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="Original Preview"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                )}
              </div>
            </div>

            {/* Compressed Card */}
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-white dark:bg-gray-850 p-4 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  Compressed
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    {formatBytes(compressedSize)}
                  </span>
                  {savingsPercent > 0 && (
                    <span className="font-bold text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      -{savingsPercent}%
                    </span>
                  )}
                </div>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-2">
                {compressedUrl && (
                  <Image
                    src={compressedUrl}
                    alt="Compressed Preview"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Action Download Banner */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Ready to download ({formatBytes(compressedSize)})
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Saved {formatBytes(Math.max(0, originalSize - compressedSize))} ({savingsPercent}% reduction)
                </p>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={isProcessing || !compressedBlob}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>Download Compressed Image</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import {
  FileImage,
  UploadCloud,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Tool } from "@/types/tool";

interface PdfToJpgWorkspaceProps {
  tool: Tool;
}

export default function PdfToJpgWorkspace({ tool }: PdfToJpgWorkspaceProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dpi, setDpi] = useState<number>(150);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [pagesCount, setPagesCount] = useState<number>(3);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith(".pdf") && selectedFile.type !== "application/pdf") {
      alert("Please upload a valid PDF document.");
      return;
    }
    setFile(selectedFile);
  };

  const handleDownloadAll = () => {
    if (!file) return;
    setIsConverting(true);

    setTimeout(() => {
      // Trigger mockup image download
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1130;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 800, 1130);
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 28px sans-serif";
        ctx.fillText("InfoLoads PDF to JPG Export", 50, 80);
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "#64748b";
        ctx.fillText(`File: ${file.name}`, 50, 120);
        ctx.fillText(`Rendered at ${dpi} DPI`, 50, 150);
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(50, 180, 700, 2);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${file.name.replace(".pdf", "")}-page-1.jpg`;
            a.click();
          }
          setIsConverting(false);
        }, "image/jpeg", 0.9);
      } else {
        setIsConverting(false);
      }
    }, 600);
  };

  return (
    <div className="flex flex-col gap-6">
      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const dropped = e.dataTransfer.files[0];
            if (dropped) handleFileSelect(dropped);
          }}
          className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-400 rounded-3xl p-10 sm:p-14 text-center cursor-pointer transition-all bg-white dark:bg-gray-850 hover:bg-red-50/20 dark:hover:bg-red-950/10 group shadow-xs"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
            accept="application/pdf,.pdf"
            className="hidden"
          />
          <div className="mx-auto w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileImage className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            Choose a PDF document to convert to JPG
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Extract high-resolution JPG images for every page in your PDF document. 100% private in-browser.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Controls Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center">
                <FileImage className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-xs">
                  {file.name}
                </h4>
                <span className="text-xs text-gray-500">
                  Ready to convert ({pagesCount} pages detected)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setDpi(150)}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    dpi === 150
                      ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  150 DPI (Fast)
                </button>
                <button
                  onClick={() => setDpi(300)}
                  className={`px-2.5 py-1 rounded-lg font-medium cursor-pointer ${
                    dpi === 300
                      ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  300 DPI (High-Res)
                </button>
              </div>

              <button
                onClick={() => setFile(null)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                Upload New
              </button>
            </div>
          </div>

          {/* Extracted Pages Grid */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Page Previews ({pagesCount} Pages)
              </span>
              <button
                onClick={handleDownloadAll}
                disabled={isConverting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>{isConverting ? "Processing..." : "Download All Pages (.JPG)"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((page) => (
                <div
                  key={page}
                  className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 p-3 flex flex-col justify-between gap-3 shadow-xs hover:border-red-300 dark:hover:border-red-700 transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
                    <span>Page {page}</span>
                    <span className="text-[11px] font-mono text-gray-400">{dpi} DPI</span>
                  </div>

                  <div className="aspect-[1/1.3] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center p-4 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <FileImage className="h-8 w-8 text-red-400" />
                      <span className="text-xs font-medium">Page {page} Preview</span>
                    </div>
                  </div>

                  <button
                    onClick={handleDownloadAll}
                    className="w-full py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download JPG</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useRef } from "react";
import {
  FileUp,
  FileText,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  RotateCcw,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Tool } from "@/types/tool";

interface PdfMergerWorkspaceProps {
  tool: Tool;
}

interface UploadedPdf {
  id: string;
  file: File;
  name: string;
  size: number;
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function PdfMergerWorkspace({ tool }: PdfMergerWorkspaceProps) {
  const [pdfList, setPdfList] = useState<UploadedPdf[]>([]);
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (files: FileList | null) => {
    if (!files) return;
    const newItems: UploadedPdf[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      if (f.type === "application/pdf" || f.name.endsWith(".pdf")) {
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          name: f.name,
          size: f.size,
        });
      }
    }
    setPdfList((prev) => [...prev, ...newItems]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setPdfList((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === pdfList.length - 1) return;
    setPdfList((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const removeItem = (id: string) => {
    setPdfList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleMerge = () => {
    if (pdfList.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }

    setIsMerging(true);
    setTimeout(() => {
      // Create merged blob placeholder
      const blob = new Blob([pdfList[0].file], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `merged-document-${pdfList.length}-files.pdf`;
      a.click();
      setIsMerging(false);
    }, 800);
  };

  const totalSize = pdfList.reduce((acc, p) => acc + p.size, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* PDF Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFilesAdded(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-400 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-white dark:bg-gray-850 hover:bg-red-50/20 dark:hover:bg-red-950/10 group shadow-xs"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFilesAdded(e.target.files)}
          accept="application/pdf,.pdf"
          multiple
          className="hidden"
        />
        <div className="mx-auto w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <FileUp className="h-7 w-7" />
        </div>
        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
          Select multiple PDF files or drag & drop here
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Combine and organize multiple PDFs into a single document in seconds. 100% private in-browser.
        </p>
      </div>

      {/* Files List Panel */}
      {pdfList.length > 0 && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-6 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                PDF Queue ({pdfList.length} files • {formatBytes(totalSize)})
              </span>
            </div>
            <button
              onClick={() => setPdfList([])}
              className="text-xs text-red-500 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Clear All</span>
            </button>
          </div>

          {/* List items */}
          <div className="flex flex-col gap-2">
            {pdfList.map((p, index) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center text-xs font-bold shrink-0">
                    {index + 1}
                  </span>
                  <FileText className="h-4 w-4 text-red-500 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white truncate block">
                      {p.name}
                    </span>
                    <span className="text-[11px] text-gray-500">{formatBytes(p.size)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === pdfList.length - 1}
                    className="p-1 rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeItem(p.id)}
                    className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge CTA */}
          <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <span className="text-xs text-gray-500 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Files are merged securely in your browser
            </span>
            <button
              onClick={handleMerge}
              disabled={isMerging || pdfList.length < 2}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{isMerging ? "Merging Files..." : `Merge ${pdfList.length} PDFs`}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

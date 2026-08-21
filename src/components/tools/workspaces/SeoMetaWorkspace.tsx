"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Globe,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RotateCcw,
  Smartphone,
  Monitor,
} from "lucide-react";
import { Tool } from "@/types/tool";
import { useClipboard } from "@/hooks/useClipboard";

interface SeoMetaWorkspaceProps {
  tool: Tool;
}

export default function SeoMetaWorkspace({ tool }: SeoMetaWorkspaceProps) {
  const [title, setTitle] = useState("InfoLoads Tools - Fast, Secure & Free Developer Utilities");
  const [description, setDescription] = useState(
    "Format, validate, convert, and debug your data with 50+ free developer tools. 100% private in-browser processing with zero server uploads."
  );
  const [url, setUrl] = useState("https://infoloads.com/tools");
  const [imageUrl, setImageUrl] = useState("https://infoloads.com/og-image.png");
  const [serpView, setSerpView] = useState<"desktop" | "mobile">("desktop");

  const { copied, copy } = useClipboard();

  // Title & Description length diagnostics
  const titleLen = title.length;
  const descLen = description.length;

  const titleStatus = useMemo(() => {
    if (titleLen === 0) return { color: "text-red-500", label: "Empty", ok: false };
    if (titleLen < 30) return { color: "text-amber-500", label: "Too Short", ok: false };
    if (titleLen <= 60) return { color: "text-emerald-500", label: "Optimal (30-60 chars)", ok: true };
    return { color: "text-red-500", label: "Too Long (Will truncate)", ok: false };
  }, [titleLen]);

  const descStatus = useMemo(() => {
    if (descLen === 0) return { color: "text-red-500", label: "Empty", ok: false };
    if (descLen < 70) return { color: "text-amber-500", label: "Too Short", ok: false };
    if (descLen <= 160) return { color: "text-emerald-500", label: "Optimal (70-160 chars)", ok: true };
    return { color: "text-red-500", label: "Too Long (Will truncate)", ok: false };
  }, [descLen]);

  // Generated Meta HTML snippet
  const generatedMetaHtml = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">`;

  return (
    <div className="flex flex-col gap-6">
      {/* 2-Column: Inputs vs Previews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Meta Tag Information
            </h3>

            {/* Title Tag */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  Page Title (&lt;title&gt;)
                </label>
                <span className={`font-semibold ${titleStatus.color}`}>
                  {titleLen}/60 • {titleStatus.label}
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Meta Description */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-gray-700 dark:text-gray-300">
                  Meta Description
                </label>
                <span className={`font-semibold ${descStatus.color}`}>
                  {descLen}/160 • {descStatus.label}
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Canonical URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Canonical URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none"
              />
            </div>

            {/* Open Graph Image URL */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                OG Image URL
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Previews */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* Google SERP Preview Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                <Search className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Google SERP Preview</span>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                <button
                  onClick={() => setSerpView("desktop")}
                  className={`p-1 rounded-lg text-xs cursor-pointer ${
                    serpView === "desktop"
                      ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                      : "text-gray-500"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setSerpView("mobile")}
                  className={`p-1 rounded-lg text-xs cursor-pointer ${
                    serpView === "mobile"
                      ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                      : "text-gray-500"
                  }`}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 font-sans ${
                serpView === "mobile" ? "max-w-[340px] mx-auto shadow-md" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  i
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200 leading-tight truncate">
                    {url.replace(/^https?:\/\//, "").split("/")[0] || "infoloads.com"}
                  </span>
                  <span className="text-[11px] text-gray-500 truncate">{url}</span>
                </div>
              </div>

              <h4 className="text-base sm:text-lg font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-snug line-clamp-1">
                {title || "Untitled Page"}
              </h4>

              <p className="text-xs sm:text-sm text-[#4d5156] dark:text-[#bdc1c6] mt-1 leading-relaxed line-clamp-2">
                {description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Social Share Preview Card */}
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-100 dark:border-gray-800">
              <Share2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Social Share Card (Open Graph)</span>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900">
              <div className="aspect-[1.91/1] bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400 font-medium p-4 text-center">
                <span>OG Image: {imageUrl}</span>
              </div>
              <div className="p-3 bg-white dark:bg-gray-850">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold block">
                  {url.replace(/^https?:\/\//, "").split("/")[0]}
                </span>
                <h5 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 mt-0.5">
                  {title}
                </h5>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Meta Tags Box */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Generated HTML Meta Tags
          </span>
          <button
            onClick={() => copy(generatedMetaHtml)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Copied" : "Copy Meta Tags"}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-gray-950 text-gray-200 text-xs font-mono overflow-x-auto leading-relaxed">
          <code>{generatedMetaHtml}</code>
        </pre>
      </div>
    </div>
  );
}

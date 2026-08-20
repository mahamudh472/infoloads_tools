"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Type,
  Code2,
  Image as ImageIcon,
  FileText,
  ArrowLeftRight,
  Calculator,
  Globe,
  Shield,
} from "lucide-react";
import { useUI } from "@/context/UIContext";
import { getToolBySlug } from "@/lib/tools";

interface HeroProps {
  onOpenSearch?: () => void;
  onSelectTool?: (toolId: string) => void;
}

const POPULAR_TOOLS = [
  { name: "JSON Formatter", id: "json-formatter" },
  { name: "Image Compressor", id: "image-compressor" },
  { name: "PDF Merger", id: "pdf-merger" },
  { name: "Word Counter", id: "word-counter" },
];

export default function Hero({ onOpenSearch, onSelectTool }: HeroProps) {
  const router = useRouter();
  const ui = useUI();

  const handleSearch = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      ui.openSearch("all");
    }
  };

  const handleToolClick = (toolId: string) => {
    if (onSelectTool) {
      onSelectTool(toolId);
    } else {
      const tool = getToolBySlug(toolId);
      if (tool) {
        router.push(`/tools/${tool.categorySlug || "developer-tools"}/${tool.slug}`);
      }
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 dot-grid-hero">
      {/* Background soft glow elements */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15"></div>
      <div className="absolute top-1/3 left-1/3 -z-10 h-[300px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/10"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-[1.1]">
              Everyday tools,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
                simplified.
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              Free, fast and easy-to-use tools to solve your daily digital problems. No signups, no hidden costs, just raw utility.
            </p>

            {/* Simulated Search input */}
            <div className="mt-8 max-w-lg">
              <div
                onClick={handleSearch}
                className="flex items-center cursor-pointer rounded-xl border border-border bg-card p-2 shadow-md hover:border-indigo-500/50 hover:shadow-indigo-500/5 transition-all"
              >
                <div className="flex flex-1 items-center gap-3 px-3 py-2 text-muted-foreground">
                  <Search className="h-5 w-5 text-muted-foreground/75" />
                  <span className="text-base text-left select-none">Search a tool...</span>
                </div>
                <button
                  onClick={handleSearch}
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-600/15 hover:bg-indigo-500 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Popular Right Now */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5 text-sm">
              <span className="text-muted-foreground font-medium">Popular right now:</span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool.id)}
                    className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground hover:bg-muted hover:border-muted-foreground/30 hover:scale-[1.03] active:scale-[0.97] transition-all"
                  >
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Premium Mock Dashboard Graphic */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="w-full max-w-[420px] rounded-2xl border border-border/80 bg-card p-5 shadow-2xl shadow-indigo-500/5 dark:shadow-indigo-950/10 animate-float-slow">
              {/* Header bar of window */}
              <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400/80"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-400/80"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400/80"></div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-muted-foreground/60">
                  <Image
                    src="/infoloads-logo/logo mark/infoloads-mark.svg"
                    alt="InfoLoads Logo"
                    width={14}
                    height={14}
                    className="h-3.5 w-auto"
                  />
                  INFOLOADS TOOLS
                </div>
              </div>

              {/* Inside window input */}
              <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground/70 mb-5 flex items-center gap-2">
                <Search className="h-3 w-3" />
                <span>Search a tool...</span>
              </div>

              {/* Grid of category mockup shapes */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { icon: Type, color: "text-purple-500 bg-purple-500/10" },
                  { icon: Code2, color: "text-blue-500 bg-blue-500/10" },
                  { icon: ImageIcon, color: "text-green-500 bg-green-500/10" },
                  { icon: FileText, color: "text-red-500 bg-red-500/10" },
                  { icon: Calculator, color: "text-rose-500 bg-rose-500/10" },
                  { icon: ArrowLeftRight, color: "text-amber-500 bg-amber-500/10" },
                  { icon: Shield, color: "text-teal-500 bg-teal-500/10" },
                  { icon: Globe, color: "text-indigo-500 bg-indigo-500/10" },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl flex items-center justify-center border border-border/40 hover:scale-[1.06] transition-transform shadow-sm bg-card"
                    >
                      <div className={`p-2.5 rounded-lg ${item.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

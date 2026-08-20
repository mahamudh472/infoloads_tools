"use client";

import React from "react";
import { ArrowRight, Sparkles, MessageSquareCode, PencilLine, FileText, LockKeyhole } from "lucide-react";
import { useUI } from "@/context/UIContext";

interface CTASectionProps {
  onExploreAI?: () => void;
}

export default function CTASection({ onExploreAI }: CTASectionProps) {
  const ui = useUI();

  const handleExplore = () => {
    if (onExploreAI) {
      onExploreAI();
    } else {
      ui.openSearch("ai");
    }
  };

  return (
    <section id="ai-tools" className="py-16 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#090d16] border border-[#1e293b] px-8 py-12 shadow-2xl sm:px-16 sm:py-16 md:grid md:grid-cols-12 md:gap-8 md:items-center">
          {/* Subtle grid and glow effects in background */}
          <div className="absolute inset-0 dot-grid opacity-10"></div>
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"></div>

          {/* Left Column Content */}
          <div className="relative z-10 md:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-400">
              <Sparkles className="h-3 w-3" />
              Next-Gen AI Capabilities
            </div>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Do more with{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                AI
              </span>
            </h2>
            <p className="mt-4 text-base text-slate-300 max-w-md leading-relaxed">
              Smart AI-powered tools to write, summarize, generate and automate faster. Tap into instant intelligence inside your workspace.
            </p>
            <button
              onClick={handleExplore}
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Explore AI Tools
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Column Layout: Animated Floating AI Panel */}
          <div className="relative z-10 mt-12 md:mt-0 md:col-span-5 flex justify-center items-center h-48 sm:h-64">
            {/* Center AI glow node */}
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-indigo-600/80 text-white shadow-lg shadow-indigo-500/50 border border-indigo-400/30 animate-pulse">
              <span className="text-3xl font-black tracking-tight select-none">AI</span>
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-indigo-300" />
            </div>

            {/* Floating Circle Icons */}
            <div className="absolute -translate-x-20 -translate-y-16 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/60 bg-[#0f172a]/90 text-indigo-400 shadow-md animate-float-slow">
              <PencilLine className="h-5 w-5" />
            </div>

            <div className="absolute translate-x-20 -translate-y-16 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/60 bg-[#0f172a]/90 text-indigo-400 shadow-md animate-float-medium">
              <MessageSquareCode className="h-5 w-5" />
            </div>

            <div className="absolute -translate-x-20 translate-y-16 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/60 bg-[#0f172a]/90 text-indigo-400 shadow-md animate-float-medium">
              <FileText className="h-5 w-5" />
            </div>

            <div className="absolute translate-x-20 translate-y-16 flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700/60 bg-[#0f172a]/90 text-indigo-400 shadow-md animate-float-slow">
              <LockKeyhole className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

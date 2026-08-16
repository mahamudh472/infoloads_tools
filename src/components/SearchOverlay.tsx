"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, Sparkles, HelpCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { TOOLS, Tool, CATEGORIES } from "@/data/tools";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
  initialCategory?: string; // e.g. "text-tools", "all", "ai"
}

export default function SearchOverlay({
  isOpen,
  onClose,
  onSelectTool,
  initialCategory = "all",
}: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState(initialCategory);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync category state when initialCategory changes
  useEffect(() => {
    setSelectedCategoryTab(initialCategory);
  }, [initialCategory]);

  // Focus input on mount/open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter tools
  const filteredTools = TOOLS.filter((tool) => {
    // Filter by search query
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by category tab
    if (selectedCategoryTab === "all") {
      return matchesSearch;
    }
    if (selectedCategoryTab === "ai") {
      // AI Tools categories (we can simulate or highlight AI categories or check if it matches)
      return matchesSearch && tool.popular; // let's treat popular tools or certain tools as AI tools for this mock
    }
    
    // Find category name by category id
    const categoryObj = CATEGORIES.find((cat) => cat.id === selectedCategoryTab);
    const matchesCategory = categoryObj ? tool.category === categoryObj.name : true;
    
    return matchesSearch && matchesCategory;
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/40 p-4 pt-16 backdrop-blur-sm sm:pt-28 animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
          <Search className="h-5 w-5 text-muted-foreground/80" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a tool name to search..."
            className="flex-1 bg-transparent text-base text-foreground placeholder-muted-foreground focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="rounded-md p-1 hover:bg-muted text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            Esc
          </button>
        </div>

        {/* Categories Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto border-b border-border/60 p-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryTab("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategoryTab === "all"
                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Tools
          </button>
          <button
            onClick={() => setSelectedCategoryTab("ai")}
            className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategoryTab === "ai"
                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Sparkles className="h-3 w-3 text-indigo-400" />
            AI Tools
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryTab(cat.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategoryTab === cat.id
                  ? "bg-indigo-600 text-white dark:bg-indigo-500"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results List Area */}
        <div className="max-h-[360px] overflow-y-auto p-3 space-y-1">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => {
              const IconComponent = (Icons as any)[tool.iconName] || HelpCircle;

              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    onSelectTool(tool.id);
                    onClose();
                  }}
                  className="group flex items-start gap-4 rounded-xl p-3 hover:bg-muted/70 cursor-pointer transition-colors"
                >
                  <div className="rounded-lg border border-border bg-card p-2 text-muted-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {tool.name}
                      </span>
                      {tool.popular && (
                        <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-bold text-indigo-500 dark:text-indigo-400">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                      {tool.description}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">No tools found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategoryTab("all");
                }}
                className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

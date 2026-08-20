"use client";

import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { TOOLS } from "@/data/tools";
import DynamicIcon from "@/components/common/DynamicIcon";
import Breadcrumb from "@/components/common/Breadcrumb";
import ToolCard from "@/components/common/ToolCard";
import AppShell from "@/components/layout/AppShell";

export default function AllToolsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filter tools based on search query and category filter
  const filteredCategories = useMemo(() => {
    return CATEGORIES.map((category) => {
      // Find tools belonging to this category
      const categoryTools = TOOLS.filter(
        (t) =>
          t.categorySlug === category.id ||
          t.category.toLowerCase() === category.name.toLowerCase() ||
          t.category.toLowerCase().replace(/\s+/g, "-") === category.id
      );

      // Filter by search query
      const matchingTools = categoryTools.filter((tool) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          (tool.shortDesc && tool.shortDesc.toLowerCase().includes(q)) ||
          tool.category.toLowerCase().includes(q)
        );
      });

      return {
        ...category,
        tools: matchingTools,
        totalCount: categoryTools.length,
      };
    }).filter((category) => {
      if (selectedCategory !== "all" && category.id !== selectedCategory) {
        return false;
      }
      return category.tools.length > 0;
    });
  }, [searchQuery, selectedCategory]);

  const totalMatchingTools = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.tools.length, 0);
  }, [filteredCategories]);

  const breadcrumbItems = [{ label: "All Tools" }];

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Page Heading & Search Bar */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-border pb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              All Online Tools
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl">
              Browse our complete catalog of {TOOLS.length}+ free, client-side, privacy-first online utilities.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground/70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name or keyword..."
              className="w-full rounded-xl border border-border bg-card pl-10 pr-9 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-xs ${
              selectedCategory === "all"
                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            All Categories ({TOOLS.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = TOOLS.filter(
              (t) => t.categorySlug === cat.id || t.category.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shadow-xs ${
                  selectedCategory === cat.id
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Filter Stats */}
        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing <strong className="text-foreground">{totalMatchingTools}</strong> tools
            {searchQuery ? ` matching "${searchQuery}"` : ""}
          </span>
          {(searchQuery || selectedCategory !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Categorized Tools Sections */}
        <div className="mt-8 flex flex-col gap-12">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <section key={category.id} className="flex flex-col gap-4">
                {/* Category Section Header */}
                <div className="flex items-center gap-3 border-b border-border/60 pb-3">
                  <div className={`p-2 rounded-xl ${category.colorClass}`}>
                    <DynamicIcon
                      name={category.iconName}
                      className={`h-5 w-5 ${category.iconColorClass}`}
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{category.name}</h2>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </div>
                  <span className="ml-auto text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    {category.tools.length} {category.tools.length === 1 ? "tool" : "tools"}
                  </span>
                </div>

                {/* Tools Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {category.tools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="py-20 text-center flex flex-col items-center gap-3">
              <p className="text-base text-muted-foreground">
                No tools found matching your search term.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Clear all filters and search
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

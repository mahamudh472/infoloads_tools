"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Category, Tool } from "@/types/tool";
import DynamicIcon from "@/components/common/DynamicIcon";

interface ToolSidebarProps {
  currentTool: Tool;
  category: Category;
  categoryTools: Tool[];
}

export default function ToolSidebar({
  currentTool,
  category,
  categoryTools,
}: ToolSidebarProps) {
  return (
    <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-[#0f131c]/90 p-5 shadow-xs flex flex-col backdrop-blur-sm">
      {/* Category Header */}
      <div className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-800/80">
        <div className={`w-10 h-10 rounded-xl ${category.colorClass} flex items-center justify-center shrink-0`}>
          <DynamicIcon
            name={category.iconName}
            className={`h-5 w-5 ${category.iconColorClass}`}
          />
        </div>
        <div>
          <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
            {category.name}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
            {category.description}
          </p>
        </div>
      </div>

      {/* Tools List in Category */}
      <div className="mt-3.5 flex flex-col gap-1.5">
        {categoryTools.map((t) => {
          const isActive = t.id === currentTool.id || t.slug === currentTool.slug;
          return (
            <Link
              key={t.id}
              href={`/tools/${t.categorySlug || "developer-tools"}/${t.slug}`}
              className={`group rounded-xl p-2.5 sm:p-3 transition-all flex items-center justify-between ${
                isActive
                  ? "bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs"
                  : "hover:bg-gray-50 dark:hover:bg-gray-850/60 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                    isActive
                      ? "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950/50 dark:group-hover:text-indigo-400"
                  }`}
                >
                  {t.iconSymbol ? t.iconSymbol : <DynamicIcon name={t.iconName} className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <h4
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      isActive
                        ? "text-indigo-950 dark:text-indigo-200"
                        : "text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                    }`}
                  >
                    {t.name}
                  </h4>
                  <p
                    className={`text-[11px] truncate ${
                      isActive
                        ? "text-indigo-700/80 dark:text-indigo-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {t.shortDesc || t.description}
                  </p>
                </div>
              </div>

              {isActive && (
                <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 ml-2"></span>
              )}
            </Link>
          );
        })}
      </div>

      {/* View all tools button */}
      <Link
        href={`/tools/${category.id}`}
        className="w-full mt-4 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-800 text-center text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
      >
        <span>View all {category.countText || `${categoryTools.length} tools`}</span>
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

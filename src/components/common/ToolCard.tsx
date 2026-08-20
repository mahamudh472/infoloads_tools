"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Tool } from "@/types/tool";
import DynamicIcon from "./DynamicIcon";

interface ToolCardProps {
  tool: Tool;
  showCategoryBadge?: boolean;
}

export default function ToolCard({ tool, showCategoryBadge = false }: ToolCardProps) {
  const categorySlug = tool.categorySlug || "developer-tools";
  const toolHref = `/tools/${categorySlug}/${tool.slug}`;

  return (
    <Link
      href={toolHref}
      className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:border-indigo-500/40 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div>
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 transition-all">
            <DynamicIcon name={tool.iconName} className="h-5 w-5" />
          </div>

          <div className="flex items-center gap-1.5">
            {showCategoryBadge && (
              <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {tool.category}
              </span>
            )}
            {tool.popular && (
              <span className="flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                <Sparkles className="h-2.5 w-2.5" />
                Popular
              </span>
            )}
          </div>
        </div>

        <h3 className="mt-3.5 text-base font-semibold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {tool.name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {tool.shortDesc || tool.description}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-end border-t border-border/40 pt-3">
        <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 group-hover:underline">
          Use tool
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

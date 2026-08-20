"use client";

import React from "react";
import { ShieldCheck, Zap } from "lucide-react";
import { Tool } from "@/types/tool";
import { getToolsByCategory, getCategoryById } from "@/lib/tools";
import DynamicIcon from "@/components/common/DynamicIcon";
import Breadcrumb from "@/components/common/Breadcrumb";
import AppShell from "@/components/layout/AppShell";
import ToolWorkspace from "./ToolWorkspace";
import ToolDetails from "./ToolDetails";
import ToolSidebar from "./ToolSidebar";
import RelatedTools from "./RelatedTools";

interface ToolPageViewProps {
  tool: Tool;
}

export default function ToolPageView({ tool }: ToolPageViewProps) {
  // Category info & tools for sidebar
  const categorySlug = tool.categorySlug || "developer-tools";
  const categoryTools = getToolsByCategory(categorySlug);
  const categoryInfo = getCategoryById(categorySlug) || {
    id: categorySlug,
    name: tool.category,
    description: "Essential utilities to write, test and debug more efficiently.",
    countText: `${categoryTools.length} tools`,
    iconName: "Code2",
    colorClass: "bg-purple-100 dark:bg-purple-950/40",
    iconColorClass: "text-purple-600 dark:text-purple-400",
  };

  const breadcrumbItems = [
    { label: "Tools", href: "/tools" },
    { label: tool.category, href: `/tools/${categorySlug}` },
    { label: tool.name },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* 2-Column Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Tool Header, Workspace & Details */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Tool Header */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-100/90 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 text-3xl font-mono font-medium shadow-xs shrink-0">
                {tool.iconSymbol ? (
                  tool.iconSymbol
                ) : (
                  <DynamicIcon name={tool.iconName} className="h-8 w-8 sm:h-9 sm:w-9" />
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {tool.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                  {tool.description}
                </p>
                <div className="flex items-center gap-4 mt-2.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                    <ShieldCheck className="h-4 w-4" />
                    100% Private
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                    <Zap className="h-3.5 w-3.5" />
                    Instant Result
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Workspace */}
            <ToolWorkspace tool={tool} />

            {/* About & Features Information */}
            <ToolDetails tool={tool} />

            {/* Related Tools */}
            <RelatedTools currentTool={tool} />
          </div>

          {/* Right Column: Category Sidebar List */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <ToolSidebar
              currentTool={tool}
              category={categoryInfo}
              categoryTools={categoryTools}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import * as Icons from "lucide-react";
import { CATEGORIES, Category } from "@/data/tools";

interface CategoryGridProps {
  onSelectCategory: (categoryId: string) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  return (
    <section id="categories" className="py-16 bg-background border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Browse tools by category
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Find the right utility for your workflow, categorized for efficiency.
            </p>
          </div>
          <button 
            onClick={() => onSelectCategory("all")}
            className="group flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
          >
            View all tools
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            // Dynamically resolve the Lucide Icon component
            const IconComponent = (Icons as any)[category.iconName] || Icons.HelpCircle;

            return (
              <div
                key={category.id}
                onClick={() => onSelectCategory(category.id)}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-indigo-500/40 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div>
                  {/* Icon Wrapper */}
                  <div className={`inline-flex rounded-xl p-3 ${category.colorClass}`}>
                    <IconComponent className={`h-6 w-6 ${category.iconColorClass}`} />
                  </div>

                  {/* Text Content */}
                  <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    {category.description}
                  </p>
                </div>

                {/* Footer elements */}
                <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {category.countText}
                  </span>
                  <div className="rounded-full bg-muted p-1 text-muted-foreground group-hover:bg-indigo-600 group-hover:text-white dark:group-hover:bg-indigo-500 transition-all">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

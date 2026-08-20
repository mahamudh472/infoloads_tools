"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Category } from "@/types/tool";
import DynamicIcon from "./DynamicIcon";

interface CategoryCardProps {
  category: Category;
  onClick: (categoryId: string) => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={() => onClick(category.id)}
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-indigo-500/40 hover:shadow-md hover:shadow-indigo-500/5 hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      <div>
        {/* Icon Wrapper */}
        <div className={`inline-flex rounded-xl p-3 ${category.colorClass}`}>
          <DynamicIcon
            name={category.iconName}
            className={`h-6 w-6 ${category.iconColorClass}`}
          />
        </div>

        {/* Text Content */}
        <h3 className="mt-4 text-base font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {category.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {category.description}
        </p>
      </div>

      {/* Footer */}
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
}

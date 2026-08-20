"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import CategoryCard from "@/components/common/CategoryCard";
import { useUI } from "@/context/UIContext";

interface CategoryGridProps {
  onSelectCategory?: (categoryId: string) => void;
}

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const ui = useUI();

  const handleSelect = (categoryId: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    } else {
      ui.openSearch(categoryId);
    }
  };

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
          <Link
            href="/tools"
            className="group flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
          >
            View all tools
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleSelect}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

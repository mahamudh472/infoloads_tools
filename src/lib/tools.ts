import { CATEGORIES } from "@/data/categories";
import { TOOLS } from "@/data/tools";
import { Category, Tool } from "@/types/tool";

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug || t.id === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === slug);
}

export function getAllCategories(): Category[] {
  return CATEGORIES;
}

export function getAllTools(): Tool[] {
  return TOOLS;
}

export function getToolsByCategory(categoryNameOrSlug: string): Tool[] {
  return TOOLS.filter(
    (t) =>
      t.category.toLowerCase() === categoryNameOrSlug.toLowerCase() ||
      t.categorySlug === categoryNameOrSlug ||
      t.category.toLowerCase().replace(/\s+/g, "-") === categoryNameOrSlug.toLowerCase()
  );
}

export function getRelatedTools(currentTool: Tool, limit = 3): Tool[] {
  return TOOLS.filter(
    (t) =>
      t.id !== currentTool.id &&
      (t.categorySlug === currentTool.categorySlug ||
        t.category.toLowerCase() === currentTool.category.toLowerCase())
  ).slice(0, limit);
}

export function searchTools(query: string, categoryFilter = "all"): Tool[] {
  const q = query.trim().toLowerCase();

  return TOOLS.filter((tool) => {
    const matchesCategory =
      categoryFilter === "all" ||
      tool.categorySlug === categoryFilter ||
      tool.category.toLowerCase() === categoryFilter.toLowerCase();

    if (!matchesCategory) return false;

    if (!q) return true;

    return (
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      (tool.shortDesc && tool.shortDesc.toLowerCase().includes(q)) ||
      tool.category.toLowerCase().includes(q)
    );
  });
}

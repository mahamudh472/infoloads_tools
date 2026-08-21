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

export function getToolWorkspaceType(tool: Tool): import("@/types/tool").ToolWorkspaceType {
  if (tool.workspaceType) {
    return tool.workspaceType;
  }

  switch (tool.id) {
    case "markdown-previewer":
      return "markdown";
    case "word-counter":
      return "word-counter";
    case "case-converter":
      return "case-converter";
    case "image-compressor":
      return "image-compressor";
    case "qr-code-generator":
      return "qr-code";
    case "svg-to-png":
      return "svg-to-png";
    case "unit-converter":
      return "unit-converter";
    case "currency-converter":
      return "currency-converter";
    case "scientific-calculator":
      return "scientific-calculator";
    case "loan-calculator":
      return "loan-calculator";
    case "seo-meta-checker":
      return "seo-meta";
    case "dns-lookup":
      return "dns-lookup";
    case "pdf-merger":
      return "pdf-merger";
    case "pdf-to-jpg":
      return "pdf-to-jpg";
  }

  // Check category or ID patterns
  if (tool.categorySlug === "image-tools" || tool.category === "Image Tools") {
    if (tool.id.includes("qr")) return "qr-code";
    if (tool.id.includes("svg")) return "svg-to-png";
    return "image-compressor";
  }

  if (tool.categorySlug === "pdf-tools" || tool.category === "PDF Tools") {
    if (tool.id.includes("jpg") || tool.id.includes("image")) return "pdf-to-jpg";
    return "pdf-merger";
  }

  if (tool.categorySlug === "converters" || tool.category === "Converters") {
    if (tool.id.includes("currency")) return "currency-converter";
    return "unit-converter";
  }

  if (tool.categorySlug === "calculators" || tool.category === "Calculators") {
    if (tool.id.includes("loan") || tool.id.includes("emi")) return "loan-calculator";
    return "scientific-calculator";
  }

  if (tool.categorySlug === "web-tools" || tool.category === "Web Tools") {
    if (tool.id.includes("dns")) return "dns-lookup";
    return "seo-meta";
  }

  // Default to developer code workspace (e.g. JSON, Base64, URL, HTML, CSS, JS, XML)
  return "code";
}

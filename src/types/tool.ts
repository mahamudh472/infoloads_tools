export type ToolWorkspaceType =
  | "code"
  | "markdown"
  | "word-counter"
  | "case-converter"
  | "image-compressor"
  | "qr-code"
  | "svg-to-png"
  | "unit-converter"
  | "currency-converter"
  | "scientific-calculator"
  | "loan-calculator"
  | "seo-meta"
  | "dns-lookup"
  | "pdf-merger"
  | "pdf-to-jpg";

export interface Tool {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  shortDesc?: string;
  slug: string;
  popular?: boolean;
  iconName: string;
  iconSymbol?: string; // e.g. "{}"
  aboutTitle?: string;
  aboutText?: string;
  features?: string[];
  sampleInput?: string;
  workspaceType?: ToolWorkspaceType;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  countText: string;
  iconName: string;
  colorClass: string; // Tailwind bg color for icon wrapper
  iconColorClass: string; // Tailwind text color for icon
}

export type IndentOption = 2 | 4 | "tab";

export type ToolAction = "format" | "minify" | "validate";

export interface CategoryWithTools extends Category {
  tools: Tool[];
  totalCount: number;
}


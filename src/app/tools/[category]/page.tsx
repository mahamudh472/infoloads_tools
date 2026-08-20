import { notFound, redirect } from "next/navigation";
import {
  getCategoryById,
  getCategoryBySlug,
  getToolBySlug,
  getToolsByCategory,
} from "@/data/tools";

interface Props {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryOrDirectToolPage({ params }: Props) {
  const resolvedParams = await params;
  const param = resolvedParams.category;

  // 1. Check if param matches a tool slug (e.g. /tools/json-formatter)
  const tool = getToolBySlug(param);
  if (tool) {
    redirect(`/tools/${tool.categorySlug || "developer-tools"}/${tool.slug}`);
  }

  // 2. Check if param matches a category slug (e.g. /tools/developer-tools)
  const category = getCategoryBySlug(param) || getCategoryById(param);
  if (category) {
    const categoryTools = getToolsByCategory(category.id);
    if (categoryTools.length > 0) {
      redirect(`/tools/${category.id}/${categoryTools[0].slug}`);
    }
    redirect("/");
  }

  notFound();
}

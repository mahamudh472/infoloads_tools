import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ToolPageView from "@/components/tools/ToolPageView";
import { TOOLS } from "@/data/tools";
import { getToolBySlug } from "@/lib/tools";

interface Props {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return TOOLS.map((tool) => ({
    category: tool.categorySlug || "developer-tools",
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);

  if (!tool) {
    return {
      title: "Tool Not Found - InfoLoads",
    };
  }

  return {
    title: `${tool.name} - Free Online Tool | InfoLoads`,
    description: tool.description,
  };
}

export default async function ToolPage({ params }: Props) {
  const resolvedParams = await params;
  const tool = getToolBySlug(resolvedParams.slug);

  if (!tool) {
    notFound();
  }

  return <ToolPageView tool={tool} />;
}

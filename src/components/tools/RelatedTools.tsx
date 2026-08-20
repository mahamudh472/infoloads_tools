import React from "react";
import { Tool } from "@/types/tool";
import ToolCard from "@/components/common/ToolCard";
import { getRelatedTools } from "@/lib/tools";

interface RelatedToolsProps {
  currentTool: Tool;
}

export default function RelatedTools({ currentTool }: RelatedToolsProps) {
  const related = getRelatedTools(currentTool, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Related Tools</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Other popular utilities in {currentTool.category}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {related.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}

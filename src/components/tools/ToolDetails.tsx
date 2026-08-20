import React from "react";
import { Check } from "lucide-react";
import { Tool } from "@/types/tool";

interface ToolDetailsProps {
  tool: Tool;
}

export default function ToolDetails({ tool }: ToolDetailsProps) {
  const defaultFeatures = [
    "Instant real-time processing",
    "100% private client-side execution",
    "One-click copy and download",
    "Zero data stored on servers",
  ];

  const features = tool.features && tool.features.length > 0 ? tool.features : defaultFeatures;

  return (
    <div className="rounded-xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-[#0f131c] p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <div className="md:col-span-7">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          {tool.aboutTitle || `About ${tool.name}`}
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
          {tool.aboutText ||
            `This ${tool.name} provides clean, instantaneous client-side processing without uploading any data to external servers.`}
        </p>
      </div>

      <div className="md:col-span-5 flex flex-col gap-2.5">
        {features.map((feat, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
          >
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Check className="h-3 w-3 stroke-[3]" />
            </div>
            <span>{feat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

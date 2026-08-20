"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";

interface DynamicIconProps {
  name: string;
  className?: string;
}

export default function DynamicIcon({ name, className = "h-5 w-5" }: DynamicIconProps) {
  const iconDict = LucideIcons as unknown as Record<
    string,
    React.ComponentType<{ className?: string }> | undefined
  >;
  const IconComponent = iconDict[name] || HelpCircle;

  return <IconComponent className={className} />;
}

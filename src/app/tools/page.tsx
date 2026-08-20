import React from "react";
import { Metadata } from "next";
import AllToolsView from "@/components/AllToolsView";

export const metadata: Metadata = {
  title: "All Online Tools - Free Developer, Text, Image & Data Utilities | InfoLoads",
  description:
    "Browse our complete catalog of free, fast, and 100% private online tools grouped by category. Format JSON, convert Base64, compress images, count words, and more.",
};

export default function AllToolsPage() {
  return <AllToolsView />;
}

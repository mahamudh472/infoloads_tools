"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Home,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Code2,
  FileText,
  Network,
  Code,
  Cpu,
  ArrowLeftRight,
  Globe,
  FileCode,
  Database,
  Type,
  Baseline,
  Image as ImageIcon,
  QrCode,
  ImageDown,
  FileUp,
  FileImage,
  Scale,
  Coins,
  Calculator,
  Percent,
  ShieldCheck,
  Zap,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchOverlay from "@/components/SearchOverlay";
import SignInModal from "@/components/SignInModal";
import { Tool, TOOLS, CATEGORIES, Category } from "@/data/tools";

export default function AllToolsView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  // Filter tools based on search query and category filter
  const filteredCategories = useMemo(() => {
    return CATEGORIES.map((category) => {
      // Find tools belonging to this category
      const categoryTools = TOOLS.filter(
        (t) =>
          t.categorySlug === category.id ||
          t.category.toLowerCase() === category.name.toLowerCase() ||
          t.category.toLowerCase().replace(/\s+/g, "-") === category.id
      );

      // Filter by search query
      const matchingTools = categoryTools.filter((tool) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          (tool.shortDesc && tool.shortDesc.toLowerCase().includes(q)) ||
          tool.category.toLowerCase().includes(q)
        );
      });

      return {
        ...category,
        tools: matchingTools,
        totalCount: categoryTools.length,
      };
    }).filter((category) => {
      if (selectedCategory !== "all" && category.id !== selectedCategory) {
        return false;
      }
      return category.tools.length > 0;
    });
  }, [searchQuery, selectedCategory]);

  const totalMatchingTools = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.tools.length, 0);
  }, [filteredCategories]);

  // Icon mapping helper
  const renderIcon = (name: string, className = "h-5 w-5") => {
    switch (name) {
      case "Code2":
        return <Code2 className={className} />;
      case "ShieldCheck":
        return <ShieldCheck className={className} />;
      case "FileText":
        return <FileText className={className} />;
      case "Network":
        return <Network className={className} />;
      case "Code":
        return <Code className={className} />;
      case "Cpu":
        return <Cpu className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      case "ArrowLeftRight":
        return <ArrowLeftRight className={className} />;
      case "Globe":
        return <Globe className={className} />;
      case "FileCode":
        return <FileCode className={className} />;
      case "Database":
        return <Database className={className} />;
      case "Type":
        return <Type className={className} />;
      case "Baseline":
        return <Baseline className={className} />;
      case "Image":
        return <ImageIcon className={className} />;
      case "QrCode":
        return <QrCode className={className} />;
      case "ImageDown":
        return <ImageDown className={className} />;
      case "FileUp":
        return <FileUp className={className} />;
      case "FileImage":
        return <FileImage className={className} />;
      case "Scale":
        return <Scale className={className} />;
      case "Coins":
        return <Coins className={className} />;
      case "Calculator":
        return <Calculator className={className} />;
      case "Percent":
        return <Percent className={className} />;
      case "Search":
        return <Search className={className} />;
      default:
        return <Code2 className={className} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc] dark:bg-[#090b11] text-foreground transition-colors duration-300">
      {/* Global Navigation Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSignIn={() => setSignInOpen(true)}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 border-b border-border/60 bg-gradient-to-b from-purple-50/40 via-transparent to-transparent dark:from-purple-950/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
              <Link
                href="/"
                className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                aria-label="Home"
              >
                <Home className="h-4 w-4" />
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                All Tools
              </span>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-4">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>100% Free & Client-Side Tools</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Explore All Online Tools
              </h1>
              <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Browse our complete collection of fast, private, and easy-to-use digital utilities grouped by category. No sign-ups required.
              </p>
            </div>

            {/* Live Search & Filter Bar */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any tool (e.g. JSON, Base64, QR, PDF, Minifier)..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f131c] text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5 self-end sm:self-center">
                <span>Showing</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">
                  {totalMatchingTools}
                </span>
                <span>tools</span>
              </div>
            </div>

            {/* Category Quick Filter Pills */}
            <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                }`}
              >
                All Categories ({TOOLS.length})
              </button>

              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = TOOLS.filter(
                  (t) =>
                    t.categorySlug === cat.id ||
                    t.category.toLowerCase() === cat.name.toLowerCase()
                ).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

          </div>
        </section>

        {/* Grouped Tools Listing */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {filteredCategories.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#0f131c]/50">
                <Search className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  No tools found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                  We couldn't find any tools matching "{searchQuery}". Try checking for typos or searching by keyword.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors shadow-xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="space-y-14">
                {filteredCategories.map((cat) => (
                  <div key={cat.id} id={cat.id} className="scroll-mt-24">
                    
                    {/* Category Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-200/80 dark:border-gray-800 gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.colorClass} shadow-xs`}>
                          <span className={cat.iconColorClass}>
                            {renderIcon(cat.iconName, "h-5 w-5")}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                              {cat.name}
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                              {cat.tools.length} {cat.tools.length === 1 ? "tool" : "tools"}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {cat.description}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/tools/${cat.id}/${cat.tools[0]?.slug || ""}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors self-start sm:self-center"
                      >
                        <span>Open first tool</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    {/* Tools Grid for this Category */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                      {cat.tools.map((tool) => (
                        <Link
                          key={tool.id}
                          href={`/tools/${tool.categorySlug || cat.id}/${tool.slug}`}
                          className="group relative flex flex-col justify-between p-5 rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#0f131c] shadow-xs hover:shadow-md hover:border-indigo-500/50 hover:shadow-indigo-500/5 transition-all hover:-translate-y-0.5"
                        >
                          <div>
                            {/* Top row: Icon + Popular Badge */}
                            <div className="flex items-center justify-between mb-3.5">
                              <div className="w-10 h-10 rounded-xl bg-purple-100/80 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-mono font-bold text-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                                {tool.iconSymbol || renderIcon(tool.iconName, "h-5 w-5")}
                              </div>

                              {tool.popular && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40">
                                  <Sparkles className="h-2.5 w-2.5" />
                                  Popular
                                </span>
                              )}
                            </div>

                            {/* Tool Title & Description */}
                            <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {tool.name}
                            </h3>
                            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                              {tool.shortDesc || tool.description}
                            </p>
                          </div>

                          {/* Bottom Action Hint */}
                          <div className="mt-5 pt-3.5 border-t border-gray-100 dark:border-gray-850 flex items-center justify-between text-xs text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            <span className="font-medium text-[11px]">Free Utility</span>
                            <div className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                              <span>Open</span>
                              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={(toolId) => {
          const targetTool = TOOLS.find((t) => t.id === toolId || t.slug === toolId);
          if (targetTool) {
            router.push(`/tools/${targetTool.categorySlug}/${targetTool.slug}`);
          }
        }}
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
      />
    </div>
  );
}

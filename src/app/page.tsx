"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SearchOverlay from "@/components/SearchOverlay";
import SignInModal from "@/components/SignInModal";

import { useRouter } from "next/navigation";
import { TOOLS } from "@/data/tools";

export default function Home() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState("all");

  const handleOpenSearch = (category = "all") => {
    setSearchCategory(category);
    setSearchOpen(true);
  };

  const handleSelectTool = (toolId: string) => {
    const tool = TOOLS.find((t) => t.id === toolId || t.slug === toolId);
    if (tool) {
      router.push(`/tools/${tool.categorySlug || "developer-tools"}/${tool.slug}`);
    }
  };

  const handleExploreAI = () => {
    // Open search overlay pre-filtered with "ai" category tab
    handleOpenSearch("ai");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Header component */}
      <Header
        onOpenSearch={() => handleOpenSearch("all")}
        onOpenSignIn={() => setSignInOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* Hero section */}
        <Hero
          onOpenSearch={() => handleOpenSearch("all")}
          onSelectTool={handleSelectTool}
        />

        {/* Category Grid section */}
        <CategoryGrid
          onSelectCategory={(catId) => handleOpenSearch(catId)}
        />

        {/* Why Choose InfoLoads benefits section */}
        <WhyChooseUs />

        {/* CTA section (AI capabilities showcase) */}
        <CTASection
          onExploreAI={handleExploreAI}
        />
        
      </main>

      {/* Footer component */}
      <Footer />

      {/* Search Overlay Dialog (Triggered globally or by components) */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={handleSelectTool}
        initialCategory={searchCategory}
      />

      {/* Sign In Flow Modal */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
      />
      
    </div>
  );
}

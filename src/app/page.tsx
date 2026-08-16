"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategoryGrid from "@/components/CategoryGrid";
import WhyChooseUs from "@/components/WhyChooseUs";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SearchOverlay from "@/components/SearchOverlay";
import ToolPlayground from "@/components/ToolPlayground";
import SignInModal from "@/components/SignInModal";

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [searchCategory, setSearchCategory] = useState("all");

  const handleOpenSearch = (category = "all") => {
    setSearchCategory(category);
    setSearchOpen(true);
  };

  const handleSelectTool = (toolId: string) => {
    setSelectedToolId(toolId);
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

      {/* Tool Playground Modal (For interacting with working tools) */}
      <ToolPlayground
        toolId={selectedToolId}
        onClose={() => setSelectedToolId(null)}
      />

      {/* Sign In Flow Modal */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
      />
      
    </div>
  );
}

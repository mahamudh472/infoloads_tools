"use client";

import React from "react";
import AppShell from "@/components/layout/AppShell";
import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <AppShell>
      {/* Hero section */}
      <Hero />

      {/* Category Grid section */}
      <CategoryGrid />

      {/* Why Choose InfoLoads benefits section */}
      <WhyChooseUs />

      {/* CTA section (AI capabilities showcase) */}
      <CTASection />
    </AppShell>
  );
}

"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import SearchOverlay from "@/components/modals/SearchOverlay";
import SignInModal from "@/components/modals/SignInModal";

interface AppShellProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export default function AppShell({
  children,
  showHeader = true,
  showFooter = true,
}: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {showHeader && <Header />}
      <main className="flex-grow">{children}</main>
      {showFooter && <Footer />}

      {/* Global Modals */}
      <SearchOverlay />
      <SignInModal />
    </div>
  );
}

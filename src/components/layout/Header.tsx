"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Moon, Sun, Menu, X, ChevronDown } from "lucide-react";
import { useUI } from "@/context/UIContext";

interface HeaderProps {
  onOpenSearch?: () => void;
  onOpenSignIn?: () => void;
}

export default function Header({ onOpenSearch, onOpenSignIn }: HeaderProps) {
  const ui = useUI();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const handleSearch = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      ui.openSearch("all");
    }
  };

  const handleSignIn = () => {
    if (onOpenSignIn) {
      onOpenSignIn();
    } else {
      ui.openSignIn();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image
            src="/infoloads-logo/logo mark/infoloads-mark.svg"
            alt="InfoLoads Mark"
            width={32}
            height={32}
            className="h-8 w-auto transition-transform group-hover:scale-105"
            priority
          />
          <Image
            src="/infoloads-logo/word mark/infoloads-wordmark.svg"
            alt="InfoLoads"
            width={130}
            height={26}
            className="h-[26px] w-auto dark:invert"
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/tools"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Tools
          </Link>
          <button
            onClick={handleSearch}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            AI Tools
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          </button>
          <a
            href="#blog"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </a>
          <div className="relative">
            <button
              onClick={() => setResourcesOpen(!resourcesOpen)}
              onBlur={() => setTimeout(() => setResourcesOpen(false), 200)}
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            >
              Resources
              <ChevronDown className="h-4 w-4" />
            </button>

            {resourcesOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-100">
                <a
                  href="#guides"
                  className="block rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  Guides
                </a>
                <a
                  href="#changelog"
                  className="block rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  Changelog
                </a>
                <a
                  href="#help"
                  className="block rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  Help Center
                </a>
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Header Search Bar */}
          <div
            onClick={handleSearch}
            className="hidden sm:flex items-center gap-2 cursor-pointer rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted/70 hover:border-muted-foreground/30 transition-all w-48 lg:w-64"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search tools...</span>
            <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground shadow-sm">
              /
            </kbd>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={ui.toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted text-foreground transition-colors"
            aria-label="Toggle dark mode"
          >
            {ui.theme === "light" ? (
              <Moon className="h-4.5 w-4.5" />
            ) : (
              <Sun className="h-4.5 w-4.5" />
            )}
          </button>

          {/* Sign In Button */}
          <button
            onClick={handleSignIn}
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-600 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign in
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border hover:bg-muted md:hidden text-foreground"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-4 space-y-3 animate-in slide-in-from-top duration-200">
          <div
            onClick={() => {
              setMobileMenuOpen(false);
              handleSearch();
            }}
            className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground"
          >
            <Search className="h-4 w-4" />
            <span>Search tools...</span>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Tools
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSearch();
              }}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left"
            >
              AI Tools
              <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
            </button>
            <a
              href="#blog"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Blog
            </a>
            <div className="border-t border-border/60 my-1"></div>
            <a
              href="#guides"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Guides
            </a>
            <a
              href="#changelog"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Changelog
            </a>
          </nav>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleSignIn();
            }}
            className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Sign in
          </button>
        </div>
      )}
    </header>
  );
}

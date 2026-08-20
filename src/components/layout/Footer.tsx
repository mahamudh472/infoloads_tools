"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Check } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail("");
    }, 1000);
  };

  return (
    <footer className="bg-[#0b0f19] text-slate-400 border-t border-slate-800">
      {/* Upper Footer: Main links grid */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-16">
          {/* Logo & Brand Details */}
          <div className="md:col-span-4 flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/infoloads-logo/logo mark/infoloads-mark.svg"
                alt="InfoLoads Logo"
                width={32}
                height={32}
                className="h-8 w-auto brightness-200"
              />
              <Image
                src="/infoloads-logo/word mark/infoloads-wordmark.svg"
                alt="InfoLoads"
                width={130}
                height={26}
                className="h-[26px] w-auto invert brightness-200"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              Simple tools. Real results. All in one place. Your ultimate toolbox for everyday digital chores.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              {/* Twitter / X */}
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-indigo-600 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* GitHub */}
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-indigo-600 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-indigo-600 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              {/* Email */}
              <a
                href="mailto:contact@infoloads.com"
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-indigo-600 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 md:col-span-5 sm:grid-cols-3">
            {/* Product */}
            <div>
              <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-4">
                Product
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/tools" className="hover:text-white transition-colors">
                    All Tools
                  </Link>
                </li>
                <li>
                  <Link href="/tools" className="hover:text-white transition-colors">
                    AI Tools
                  </Link>
                </li>
                <li>
                  <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default">
                    API
                    <span className="rounded bg-slate-800 px-1 py-0.5 text-[9px] font-semibold text-slate-300">
                      Soon
                    </span>
                  </span>
                </li>
                <li>
                  <a href="#suggest" className="hover:text-white transition-colors">
                    Suggest a Tool
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-4">
                Resources
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#blog" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#guides" className="hover:text-white transition-colors">
                    Guides
                  </a>
                </li>
                <li>
                  <a href="#changelog" className="hover:text-white transition-colors">
                    Changelog
                  </a>
                </li>
                <li>
                  <a href="#help" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-4">
                Company
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-white transition-colors">
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Stay Updated Newsletter */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              Stay updated
            </h3>
            <p className="text-sm text-slate-400">
              Get updates on new tools and features. No spam.
            </p>
            {subscribed ? (
              <div className="rounded-xl border border-emerald-800/40 bg-emerald-950/20 p-3 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="h-4 w-4 shrink-0" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="rounded-lg bg-slate-900 border border-slate-800 px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 transition-colors disabled:opacity-75"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Lower Footer: Copyright */}
        <div className="mt-12 border-t border-slate-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2025 InfoLoads. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-300">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-slate-300">
              Terms of Service
            </a>
            <a href="#cookies" className="hover:text-slate-300">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

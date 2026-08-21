"use client";

import React, { useState } from "react";
import {
  Network,
  Search,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Tool } from "@/types/tool";
import { useClipboard } from "@/hooks/useClipboard";

interface DnsLookupWorkspaceProps {
  tool: Tool;
}

interface DnsRecord {
  type: string;
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

const MOCK_RECORDS: Record<string, DnsRecord[]> = {
  "google.com": [
    { type: "A", name: "google.com", value: "142.250.190.46", ttl: 300 },
    { type: "AAAA", name: "google.com", value: "2607:f8b0:4005:805::200e", ttl: 300 },
    { type: "MX", name: "google.com", value: "smtp.google.com", ttl: 3600, priority: 10 },
    { type: "TXT", name: "google.com", value: "v=spf1 include:_spf.google.com ~all", ttl: 3600 },
    { type: "NS", name: "google.com", value: "ns1.google.com", ttl: 86400 },
    { type: "NS", name: "google.com", value: "ns2.google.com", ttl: 86400 },
  ],
  "github.com": [
    { type: "A", name: "github.com", value: "140.82.121.3", ttl: 60 },
    { type: "MX", name: "github.com", value: "aspmx.l.google.com", ttl: 3600, priority: 1 },
    { type: "TXT", name: "github.com", value: "v=spf1 include:_spf.google.com ip4:192.30.252.0/22 ~all", ttl: 3600 },
    { type: "NS", name: "github.com", value: "dns1.p08.nsone.net", ttl: 86400 },
  ],
  default: [
    { type: "A", name: "@", value: "76.76.21.21", ttl: 300 },
    { type: "AAAA", name: "@", value: "2600:9000:a416:4750:3061:742e:f331:188c", ttl: 300 },
    { type: "CNAME", name: "www", value: "cname.vercel-dns.com", ttl: 600 },
    { type: "MX", name: "@", value: "mail.protonmail.ch", ttl: 3600, priority: 10 },
    { type: "TXT", name: "@", value: "v=spf1 include:_spf.mxroute.com ~all", ttl: 3600 },
    { type: "NS", name: "@", value: "ns1.cloudflare.com", ttl: 86400 },
    { type: "NS", name: "@", value: "ns2.cloudflare.com", ttl: 86400 },
  ],
};

export default function DnsLookupWorkspace({ tool }: DnsLookupWorkspaceProps) {
  const [domain, setDomain] = useState("google.com");
  const [activeType, setActiveType] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [records, setRecords] = useState<DnsRecord[]>(MOCK_RECORDS["google.com"]);

  const { copied, copy } = useClipboard();

  const handleLookup = () => {
    if (!domain.trim()) return;
    setIsLoading(true);

    setTimeout(() => {
      const clean = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
      const found = MOCK_RECORDS[clean] || MOCK_RECORDS.default.map((r) => ({ ...r, name: clean }));
      setRecords(found);
      setIsLoading(false);
    }, 300);
  };

  const filteredRecords = records.filter(
    (r) => activeType === "ALL" || r.type === activeType
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Search Header Bar */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Network className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              placeholder="Enter domain name (e.g. google.com)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <button
            onClick={handleLookup}
            disabled={isLoading || !domain.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            <span>{isLoading ? "Querying..." : "DNS Lookup"}</span>
          </button>
        </div>

        {/* Record Type Filters */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {["ALL", "A", "AAAA", "CNAME", "MX", "TXT", "NS"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                activeType === t
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-6 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Resolved Records ({filteredRecords.length})
            </span>
          </div>
          <button
            onClick={() =>
              copy(
                filteredRecords
                  .map((r) => `${r.type}\t${r.name}\t${r.value}\t${r.ttl}s`)
                  .join("\n")
              )
            }
            className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy All Records"}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-semibold bg-gray-50/50 dark:bg-gray-800/30">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Name / Host</th>
                <th className="py-2.5 px-3">Target / Value</th>
                <th className="py-2.5 px-3">TTL</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-800 dark:text-gray-200 font-mono">
              {filteredRecords.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                      {r.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-gray-600 dark:text-gray-300 font-medium">
                    {r.name}
                  </td>
                  <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white max-w-xs break-all">
                    {r.priority !== undefined && (
                      <span className="text-amber-500 font-bold mr-1.5">
                        [{r.priority}]
                      </span>
                    )}
                    {r.value}
                  </td>
                  <td className="py-3 px-3 text-gray-500">{r.ttl}s</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import {
  Coins,
  ArrowLeftRight,
  TrendingUp,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react";
import { Tool } from "@/types/tool";
import { useClipboard } from "@/hooks/useClipboard";

interface CurrencyConverterWorkspaceProps {
  tool: Tool;
}

const RATES: Record<string, { name: string; symbol: string; flag: string; rateAgainstUSD: number }> = {
  USD: { name: "US Dollar", symbol: "$", flag: "🇺🇸", rateAgainstUSD: 1.0 },
  EUR: { name: "Euro", symbol: "€", flag: "🇪🇺", rateAgainstUSD: 0.92 },
  GBP: { name: "British Pound", symbol: "£", flag: "🇬🇧", rateAgainstUSD: 0.79 },
  JPY: { name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rateAgainstUSD: 154.5 },
  CAD: { name: "Canadian Dollar", symbol: "CA$", flag: "🇨🇦", rateAgainstUSD: 1.36 },
  AUD: { name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", rateAgainstUSD: 1.52 },
  CHF: { name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭", rateAgainstUSD: 0.91 },
  INR: { name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", rateAgainstUSD: 83.45 },
  SGD: { name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", rateAgainstUSD: 1.35 },
  AED: { name: "UAE Dirham", symbol: "AED", flag: "🇦🇪", rateAgainstUSD: 3.67 },
  SAR: { name: "Saudi Riyal", symbol: "SAR", flag: "🇸🇦", rateAgainstUSD: 3.75 },
  CNY: { name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", rateAgainstUSD: 7.24 },
  BRL: { name: "Brazilian Real", symbol: "R$", flag: "🇧🇷", rateAgainstUSD: 5.15 },
  KRW: { name: "South Korean Won", symbol: "₩", flag: "🇰🇷", rateAgainstUSD: 1370.0 },
  MXN: { name: "Mexican Peso", symbol: "Mex$", flag: "🇲🇽", rateAgainstUSD: 16.9 },
};

export default function CurrencyConverterWorkspace({ tool }: CurrencyConverterWorkspaceProps) {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurr, setFromCurr] = useState<string>("USD");
  const [toCurr, setToCurr] = useState<string>("EUR");

  const { copied, copy } = useClipboard();

  const handleSwap = () => {
    const temp = fromCurr;
    setFromCurr(toCurr);
    setToCurr(temp);
  };

  const conversion = useMemo(() => {
    const num = parseFloat(amount) || 0;
    const from = RATES[fromCurr];
    const to = RATES[toCurr];
    if (!from || !to) return { result: "0.00", singleRate: "0.00" };

    // Convert to USD base first
    const amountInUSD = num / from.rateAgainstUSD;
    const converted = amountInUSD * to.rateAgainstUSD;

    const singleRate = (1 / from.rateAgainstUSD) * to.rateAgainstUSD;

    return {
      result: converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      singleRate: singleRate.toFixed(4),
      rawConverted: converted,
    };
  }, [amount, fromCurr, toCurr]);

  return (
    <div className="flex flex-col gap-6">
      {/* Main Conversion Card */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Amount & From */}
          <div className="md:col-span-5 flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Amount & Currency
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-2xl font-bold p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <select
              value={fromCurr}
              onChange={(e) => setFromCurr(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              {Object.entries(RATES).map(([code, cur]) => (
                <option key={code} value={code}>
                  {cur.flag} {code} - {cur.name} ({cur.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <div className="md:col-span-1 flex justify-center py-2">
            <button
              onClick={handleSwap}
              title="Swap Currencies"
              className="p-3 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs transition-all cursor-pointer"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>

          {/* Converted Result */}
          <div className="md:col-span-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Converted Amount
              </label>
              <button
                onClick={() =>
                  copy(`${amount} ${fromCurr} = ${conversion.result} ${toCurr}`)
                }
                className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="w-full text-2xl font-bold p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-100 truncate select-all">
              {RATES[toCurr]?.symbol} {conversion.result}
            </div>
            <select
              value={toCurr}
              onChange={(e) => setToCurr(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              {Object.entries(RATES).map(([code, cur]) => (
                <option key={code} value={code}>
                  {cur.flag} {code} - {cur.name} ({cur.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Indicative Rate Bar */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span>
              1 {fromCurr} = <strong>{conversion.singleRate} {toCurr}</strong>
            </span>
          </div>
          <span className="text-[11px] text-gray-400">Indicative midpoint rate</span>
        </div>
      </div>

      {/* Popular Currency Pairs Quick Matrix */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-1.5">
          <Coins className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          Popular Conversion Rates
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {["EUR", "GBP", "JPY", "CAD", "AUD", "INR"].map((code) => {
            const targetRate = RATES[code];
            const converted = (100 * (targetRate?.rateAgainstUSD || 1)).toFixed(2);
            return (
              <div
                key={code}
                onClick={() => {
                  setFromCurr("USD");
                  setToCurr(code);
                }}
                className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer transition-all text-center"
              >
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  100 USD to {code}
                </div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {targetRate?.symbol} {converted}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

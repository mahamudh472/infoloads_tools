"use client";

import React, { useState, useMemo } from "react";
import {
  Percent,
  DollarSign,
  Calendar,
  PieChart,
  Table as TableIcon,
  Copy,
  Check,
} from "lucide-react";
import { Tool } from "@/types/tool";
import { useClipboard } from "@/hooks/useClipboard";

interface LoanCalculatorWorkspaceProps {
  tool: Tool;
}

export default function LoanCalculatorWorkspace({ tool }: LoanCalculatorWorkspaceProps) {
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(5);

  const { copied, copy } = useClipboard();

  // EMI and Amortization Calculation
  const loanData = useMemo(() => {
    const P = loanAmount;
    const annualR = interestRate;
    const N = loanTermYears * 12;

    if (P <= 0 || annualR <= 0 || N <= 0) {
      return {
        monthlyEmi: 0,
        totalInterest: 0,
        totalPayment: 0,
        principalPercent: 100,
        interestPercent: 0,
        schedule: [],
      };
    }

    const r = annualR / (12 * 100);
    const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    const principalPercent = Math.round((P / totalPayment) * 100);
    const interestPercent = 100 - principalPercent;

    // Build yearly amortization schedule
    let balance = P;
    const schedule: {
      year: number;
      principalPaid: number;
      interestPaid: number;
      totalYearPayment: number;
      endingBalance: number;
    }[] = [];

    for (let y = 1; y <= loanTermYears; y++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let m = 1; m <= 12; m++) {
        const monthInterest = balance * r;
        const monthPrincipal = emi - monthInterest;
        yearlyInterest += monthInterest;
        yearlyPrincipal += monthPrincipal;
        balance = Math.max(0, balance - monthPrincipal);
      }

      schedule.push({
        year: y,
        principalPaid: Math.round(yearlyPrincipal),
        interestPaid: Math.round(yearlyInterest),
        totalYearPayment: Math.round(yearlyPrincipal + yearlyInterest),
        endingBalance: Math.round(balance),
      });
    }

    return {
      monthlyEmi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principalPercent,
      interestPercent,
      schedule,
    };
  }, [loanAmount, interestRate, loanTermYears]);

  return (
    <div className="flex flex-col gap-6">
      {/* 2-Column: Inputs and Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Controls */}
        <div className="lg:col-span-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-6 shadow-xs flex flex-col gap-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
            Loan Parameters
          </h3>

          {/* Loan Amount */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                Loan Amount ($)
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                ${loanAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Math.max(0, Number(e.target.value)))}
              className="w-full text-lg font-bold p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[10000, 25000, 50000, 100000, 250000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setLoanAmount(amt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                    loanAmount === amt
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  ${amt >= 1000 ? `${amt / 1000}k` : amt}
                </button>
              ))}
            </div>
          </div>

          {/* Interest Rate */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Percent className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                Interest Rate (% per year)
              </span>
              <span className="font-bold text-gray-900 dark:text-white">{interestRate}%</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="25"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="flex-1 accent-indigo-600 cursor-pointer"
              />
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-20 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white text-center focus:outline-none"
              />
            </div>
          </div>

          {/* Loan Term */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                Loan Term (Years)
              </span>
              <span className="font-bold text-gray-900 dark:text-white">{loanTermYears} Years ({loanTermYears * 12} Mos)</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="flex-1 accent-indigo-600 cursor-pointer"
              />
              <input
                type="number"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-20 p-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-bold text-gray-900 dark:text-white text-center focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-6 shadow-xs flex flex-col justify-between gap-5">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              Repayment Summary
            </span>
            <button
              onClick={() =>
                copy(
                  `Monthly EMI: $${loanData.monthlyEmi.toLocaleString()}\nTotal Principal: $${loanAmount.toLocaleString()}\nTotal Interest: $${loanData.totalInterest.toLocaleString()}\nTotal Payment: $${loanData.totalPayment.toLocaleString()}`
                )
              }
              className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copied ? "Copied" : "Copy Breakdown"}</span>
            </button>
          </div>

          {/* Monthly EMI Highlight */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              Monthly Payment (EMI)
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-indigo-900 dark:text-indigo-100">
              ${loanData.monthlyEmi.toLocaleString()}
            </span>
            <span className="text-xs text-indigo-600/80 dark:text-indigo-300 mt-1">
              for {loanTermYears * 12} monthly installments
            </span>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400 block">Total Interest</span>
              <span className="font-bold text-gray-900 dark:text-white text-base">
                ${loanData.totalInterest.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <span className="text-xs text-gray-500 dark:text-gray-400 block">Total Payment</span>
              <span className="font-bold text-gray-900 dark:text-white text-base">
                ${loanData.totalPayment.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Visual Ratio Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-300">
              <span>Principal: {loanData.principalPercent}%</span>
              <span>Interest: {loanData.interestPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex">
              <div
                className="bg-indigo-600 transition-all duration-500"
                style={{ width: `${loanData.principalPercent}%` }}
              />
              <div
                className="bg-amber-500 transition-all duration-500"
                style={{ width: `${loanData.interestPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Annual Amortization Table */}
      {loanData.schedule.length > 0 && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-6 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
            <TableIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            Yearly Amortization Schedule
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 font-semibold bg-gray-50/50 dark:bg-gray-800/30">
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Principal Paid</th>
                  <th className="py-2.5 px-3">Interest Paid</th>
                  <th className="py-2.5 px-3">Total Payment</th>
                  <th className="py-2.5 px-3">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-800 dark:text-gray-200 font-mono">
                {loanData.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                    <td className="py-2.5 px-3 font-sans font-bold">Year {row.year}</td>
                    <td className="py-2.5 px-3 text-indigo-600 dark:text-indigo-400">
                      ${row.principalPaid.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400">
                      ${row.interestPaid.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">${row.totalYearPayment.toLocaleString()}</td>
                    <td className="py-2.5 px-3 font-semibold">
                      ${row.endingBalance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

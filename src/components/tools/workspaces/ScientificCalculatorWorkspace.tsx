"use client";

import React, { useState } from "react";
import {
  Calculator,
  History,
  RotateCcw,
  Delete,
  Equal,
} from "lucide-react";
import { Tool } from "@/types/tool";

interface ScientificCalculatorWorkspaceProps {
  tool: Tool;
}

export default function ScientificCalculatorWorkspace({ tool }: ScientificCalculatorWorkspaceProps) {
  const [expression, setExpression] = useState<string>("");
  const [result, setResult] = useState<string>("0");
  const [isRad, setIsRad] = useState<boolean>(false);
  const [history, setHistory] = useState<{ expr: string; res: string }[]>([]);

  const appendToExpression = (val: string) => {
    setExpression((prev) => prev + val);
  };

  const clearAll = () => {
    setExpression("");
    setResult("0");
  };

  const backspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const calculate = () => {
    if (!expression.trim()) return;

    try {
      // Safe math evaluator replacement
      let sanitized = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")
        .replace(/\^/g, "**");

      // Math functions
      if (!isRad) {
        // DEG mode
        sanitized = sanitized
          .replace(/sin\(([^)]+)\)/g, "Math.sin(($1) * Math.PI / 180)")
          .replace(/cos\(([^)]+)\)/g, "Math.cos(($1) * Math.PI / 180)")
          .replace(/tan\(([^)]+)\)/g, "Math.tan(($1) * Math.PI / 180)");
      } else {
        sanitized = sanitized
          .replace(/sin\(/g, "Math.sin(")
          .replace(/cos\(/g, "Math.cos(")
          .replace(/tan\(/g, "Math.tan(");
      }

      sanitized = sanitized
        .replace(/sqrt\(/g, "Math.sqrt(")
        .replace(/log\(/g, "Math.log10(")
        .replace(/ln\(/g, "Math.log(");

      // Safe Function evaluation
      // eslint-disable-next-line no-new-func
      const evalResult = new Function(`"use strict"; return (${sanitized})`)();

      const formattedResult =
        typeof evalResult === "number" && !isNaN(evalResult)
          ? Number.isInteger(evalResult)
            ? evalResult.toString()
            : Number(evalResult.toFixed(8)).toString()
          : "Error";

      setResult(formattedResult);
      setHistory((prev) => [{ expr: expression, res: formattedResult }, ...prev.slice(0, 7)]);
    } catch {
      setResult("Error");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Calculator Body */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-6 shadow-md flex flex-col gap-5">
          {/* LCD Display */}
          <div className="rounded-2xl bg-gray-950 p-5 text-right font-mono flex flex-col justify-between shadow-inner min-h-[110px]">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-semibold px-2 py-0.5 rounded bg-gray-800 text-indigo-400">
                {isRad ? "RAD" : "DEG"}
              </span>
              <span className="truncate max-w-[280px]">{expression || "0"}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight truncate mt-1">
              {result}
            </div>
          </div>

          {/* Radian/Degree toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
              <button
                onClick={() => setIsRad(false)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  !isRad
                    ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                DEG
              </button>
              <button
                onClick={() => setIsRad(true)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  isRad
                    ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                RAD
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearAll}
                className="px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer"
              >
                AC
              </button>
              <button
                onClick={backspace}
                className="p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <Delete className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scientific Keypad Grid */}
          <div className="grid grid-cols-5 gap-2 text-sm font-semibold">
            {/* Row 1 */}
            <button onClick={() => appendToExpression("sin(")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">sin</button>
            <button onClick={() => appendToExpression("cos(")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">cos</button>
            <button onClick={() => appendToExpression("tan(")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">tan</button>
            <button onClick={() => appendToExpression("(")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">(</button>
            <button onClick={() => appendToExpression(")")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">)</button>

            {/* Row 2 */}
            <button onClick={() => appendToExpression("ln(")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">ln</button>
            <button onClick={() => appendToExpression("log(")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">log</button>
            <button onClick={() => appendToExpression("sqrt(")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">√</button>
            <button onClick={() => appendToExpression("^")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">x^y</button>
            <button onClick={() => appendToExpression("÷")} className="py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold transition-colors cursor-pointer active:scale-95">÷</button>

            {/* Row 3 */}
            <button onClick={() => appendToExpression("π")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">π</button>
            <button onClick={() => appendToExpression("7")} className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white font-bold transition-colors cursor-pointer active:scale-95">7</button>
            <button onClick={() => appendToExpression("8")} className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white font-bold transition-colors cursor-pointer active:scale-95">8</button>
            <button onClick={() => appendToExpression("9")} className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white font-bold transition-colors cursor-pointer active:scale-95">9</button>
            <button onClick={() => appendToExpression("×")} className="py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold transition-colors cursor-pointer active:scale-95">×</button>

            {/* Row 4 */}
            <button onClick={() => appendToExpression("e")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">e</button>
            <button onClick={() => appendToExpression("4")} className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white font-bold transition-colors cursor-pointer active:scale-95">4</button>
            <button onClick={() => appendToExpression("5")} className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white font-bold transition-colors cursor-pointer active:scale-95">5</button>
            <button onClick={() => appendToExpression("6")} className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white font-bold transition-colors cursor-pointer active:scale-95">6</button>
            <button onClick={() => appendToExpression("-")} className="py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold transition-colors cursor-pointer active:scale-95">-</button>

            {/* Row 5 */}
            <button onClick={() => appendToExpression("%")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">%</button>
            <button onClick={() => appendToExpression("1")} className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white font-bold transition-colors cursor-pointer active:scale-95">1</button>
            <button onClick={() => appendToExpression("2")} className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white font-bold transition-colors cursor-pointer active:scale-95">2</button>
            <button onClick={() => appendToExpression("3")} className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white font-bold transition-colors cursor-pointer active:scale-95">3</button>
            <button onClick={() => appendToExpression("+")} className="py-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold transition-colors cursor-pointer active:scale-95">+</button>

            {/* Row 6 */}
            <button onClick={() => appendToExpression("Ans")} className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer active:scale-95">Ans</button>
            <button onClick={() => appendToExpression("0")} className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white font-bold transition-colors cursor-pointer active:scale-95 col-span-2">0</button>
            <button onClick={() => appendToExpression(".")} className="py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-900 dark:text-white font-bold transition-colors cursor-pointer active:scale-95">.</button>
            <button
              onClick={calculate}
              className="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center"
            >
              <Equal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* History Log */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-5 shadow-xs flex flex-col gap-3 min-h-[380px]">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              <History className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>History</span>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="text-[11px] text-gray-500 hover:text-red-500 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto flex-1">
            {history.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-10">
                Previous calculations will appear here.
              </p>
            ) : (
              history.map((h, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setExpression(h.expr);
                    setResult(h.res);
                  }}
                  className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer text-right"
                >
                  <div className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate">
                    {h.expr} =
                  </div>
                  <div className="text-base font-bold font-mono text-gray-900 dark:text-white">
                    {h.res}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

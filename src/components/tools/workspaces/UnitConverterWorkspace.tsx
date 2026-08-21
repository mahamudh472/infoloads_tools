"use client";

import React, { useState, useMemo } from "react";
import {
  ArrowLeftRight,
  Copy,
  Check,
  Scale,
  Ruler,
  Thermometer,
  Grid,
  Box,
  Gauge,
  HardDrive,
  Clock,
} from "lucide-react";
import { Tool } from "@/types/tool";
import { useClipboard } from "@/hooks/useClipboard";

interface UnitConverterWorkspaceProps {
  tool: Tool;
}

type UnitCategory =
  | "length"
  | "weight"
  | "temperature"
  | "area"
  | "volume"
  | "speed"
  | "storage"
  | "time";

interface CategoryDef {
  id: UnitCategory;
  name: string;
  icon: React.ElementType;
  units: Record<string, { name: string; toBase: (v: number) => number; fromBase: (v: number) => number }>;
  defaultFrom: string;
  defaultTo: string;
}

const UNIT_CATEGORIES: CategoryDef[] = [
  {
    id: "length",
    name: "Length",
    icon: Ruler,
    units: {
      m: { name: "Meters (m)", toBase: (v) => v, fromBase: (v) => v },
      km: { name: "Kilometers (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      cm: { name: "Centimeters (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      mm: { name: "Millimeters (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      mi: { name: "Miles (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      yd: { name: "Yards (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      ft: { name: "Feet (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      in: { name: "Inches (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    },
    defaultFrom: "m",
    defaultTo: "ft",
  },
  {
    id: "weight",
    name: "Weight / Mass",
    icon: Scale,
    units: {
      kg: { name: "Kilograms (kg)", toBase: (v) => v, fromBase: (v) => v },
      g: { name: "Grams (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      mg: { name: "Milligrams (mg)", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      lb: { name: "Pounds (lb)", toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      oz: { name: "Ounces (oz)", toBase: (v) => v * 0.028349523, fromBase: (v) => v / 0.028349523 },
      t: { name: "Metric Tonnes (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    },
    defaultFrom: "kg",
    defaultTo: "lb",
  },
  {
    id: "temperature",
    name: "Temperature",
    icon: Thermometer,
    units: {
      c: { name: "Celsius (°C)", toBase: (v) => v, fromBase: (v) => v },
      f: { name: "Fahrenheit (°F)", toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      k: { name: "Kelvin (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    },
    defaultFrom: "c",
    defaultTo: "f",
  },
  {
    id: "area",
    name: "Area",
    icon: Grid,
    units: {
      sqm: { name: "Square Meters (m²)", toBase: (v) => v, fromBase: (v) => v },
      sqkm: { name: "Square Kilometers (km²)", toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      sqft: { name: "Square Feet (ft²)", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      ac: { name: "Acres", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
      ha: { name: "Hectares", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    },
    defaultFrom: "sqm",
    defaultTo: "sqft",
  },
  {
    id: "volume",
    name: "Volume",
    icon: Box,
    units: {
      l: { name: "Liters (L)", toBase: (v) => v, fromBase: (v) => v },
      ml: { name: "Milliliters (mL)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      gal: { name: "Gallons (US)", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
      qt: { name: "Quarts (US)", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      pt: { name: "Pints (US)", toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
      cup: { name: "Cups (US)", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    },
    defaultFrom: "l",
    defaultTo: "gal",
  },
  {
    id: "speed",
    name: "Speed",
    icon: Gauge,
    units: {
      kmh: { name: "Kilometers / hour (km/h)", toBase: (v) => v, fromBase: (v) => v },
      mph: { name: "Miles / hour (mph)", toBase: (v) => v * 1.609344, fromBase: (v) => v / 1.609344 },
      ms: { name: "Meters / second (m/s)", toBase: (v) => v * 3.6, fromBase: (v) => v / 3.6 },
      knot: { name: "Knots (kn)", toBase: (v) => v * 1.852, fromBase: (v) => v / 1.852 },
    },
    defaultFrom: "kmh",
    defaultTo: "mph",
  },
  {
    id: "storage",
    name: "Digital Storage",
    icon: HardDrive,
    units: {
      b: { name: "Bytes (B)", toBase: (v) => v, fromBase: (v) => v },
      kb: { name: "Kilobytes (KB)", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      mb: { name: "Megabytes (MB)", toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
      gb: { name: "Gigabytes (GB)", toBase: (v) => v * Math.pow(1024, 3), fromBase: (v) => v / Math.pow(1024, 3) },
      tb: { name: "Terabytes (TB)", toBase: (v) => v * Math.pow(1024, 4), fromBase: (v) => v / Math.pow(1024, 4) },
    },
    defaultFrom: "gb",
    defaultTo: "mb",
  },
  {
    id: "time",
    name: "Time",
    icon: Clock,
    units: {
      s: { name: "Seconds (s)", toBase: (v) => v, fromBase: (v) => v },
      min: { name: "Minutes (min)", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      h: { name: "Hours (h)", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      d: { name: "Days (d)", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      wk: { name: "Weeks (wk)", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    },
    defaultFrom: "h",
    defaultTo: "min",
  },
];

export default function UnitConverterWorkspace({ tool }: UnitConverterWorkspaceProps) {
  const [activeCat, setActiveCat] = useState<UnitCategory>("length");
  const currentCat = UNIT_CATEGORIES.find((c) => c.id === activeCat) || UNIT_CATEGORIES[0];

  const [fromUnit, setFromUnit] = useState<string>(currentCat.defaultFrom);
  const [toUnit, setToUnit] = useState<string>(currentCat.defaultTo);
  const [fromValue, setFromValue] = useState<string>("10");
  const [precision, setPrecision] = useState<number>(4);

  const { copied, copy } = useClipboard();

  // Change category handler
  const handleCategoryChange = (catId: UnitCategory) => {
    setActiveCat(catId);
    const cat = UNIT_CATEGORIES.find((c) => c.id === catId);
    if (cat) {
      setFromUnit(cat.defaultFrom);
      setToUnit(cat.defaultTo);
    }
  };

  // Convert computation
  const result = useMemo(() => {
    const num = parseFloat(fromValue);
    if (isNaN(num)) return "0";

    const fromDef = currentCat.units[fromUnit];
    const toDef = currentCat.units[toUnit];
    if (!fromDef || !toDef) return "0";

    const baseVal = fromDef.toBase(num);
    const converted = toDef.fromBase(baseVal);

    // Format with precision
    const rounded = Number(converted.toFixed(precision));
    return isNaN(rounded) ? "0" : rounded.toLocaleString(undefined, { maximumFractionDigits: precision });
  }, [fromValue, fromUnit, toUnit, currentCat, precision]);

  // Swap units
  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {UNIT_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCat === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Conversion Panel */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* From Column */}
          <div className="md:col-span-5 flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              From
            </label>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => setFromValue(e.target.value)}
              className="w-full text-2xl font-bold p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              {Object.entries(currentCat.units).map(([key, u]) => (
                <option key={key} value={key}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button Column */}
          <div className="md:col-span-1 flex justify-center py-2">
            <button
              onClick={handleSwap}
              title="Swap Units"
              className="p-3 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
          </div>

          {/* To Column */}
          <div className="md:col-span-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                To (Result)
              </label>
              <button
                onClick={() => copy(`${fromValue} ${currentCat.units[fromUnit]?.name} = ${result} ${currentCat.units[toUnit]?.name}`)}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <div className="w-full text-2xl font-bold p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-100 truncate select-all">
              {result}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold text-gray-800 dark:text-gray-200 focus:outline-none"
            >
              {Object.entries(currentCat.units).map(([key, u]) => (
                <option key={key} value={key}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bottom Formula & Precision Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
          <div className="font-mono">
            <span>Formula: </span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              1 {currentCat.units[fromUnit]?.name.split(" ")[0]} ≈{" "}
              {currentCat.units[toUnit]
                ?.fromBase(currentCat.units[fromUnit]?.toBase(1))
                .toFixed(precision)}{" "}
              {currentCat.units[toUnit]?.name.split(" ")[0]}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>Decimals:</span>
            {[2, 4, 6].map((p) => (
              <button
                key={p}
                onClick={() => setPrecision(p)}
                className={`px-2 py-0.5 rounded text-xs font-medium cursor-pointer ${
                  precision === p
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

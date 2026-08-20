"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  ChevronRight,
  ShieldCheck,
  Zap,
  Upload,
  RotateCcw,
  Copy,
  Download,
  Settings2,
  Check,
  AlertCircle,
  Code2,
  FileText,
  Network,
  Code,
  Cpu,
  Sparkles,
  ArrowLeftRight,
  Globe,
  FileCode,
  Database,
  Type,
  Baseline,
  Image as ImageIcon,
  QrCode,
  ImageDown,
  FileUp,
  FileImage,
  Scale,
  Coins,
  Calculator,
  Percent,
  Search,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchOverlay from "@/components/SearchOverlay";
import SignInModal from "@/components/SignInModal";
import { Tool, TOOLS, CATEGORIES, getToolsByCategory } from "@/data/tools";

interface ToolPageViewProps {
  tool: Tool;
}

export default function ToolPageView({ tool }: ToolPageViewProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  // Editor states
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  // Formatting options
  const [indentSize, setIndentSize] = useState<2 | 4 | "tab">(2);
  const [sortKeys, setSortKeys] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const outputTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // Category tools for sidebar
  const categoryTools = getToolsByCategory(tool.categorySlug || tool.category);
  const categoryInfo = CATEGORIES.find(
    (c) => c.id === tool.categorySlug || c.name.toLowerCase() === tool.category.toLowerCase()
  ) || {
    id: "developer-tools",
    name: tool.category,
    description: "Essential utilities to write, test and debug more efficiently.",
    countText: `${categoryTools.length} tools`,
    iconName: "Code2",
    colorClass: "bg-purple-100 dark:bg-purple-950/40",
    iconColorClass: "text-purple-600 dark:text-purple-400",
  };

  // Populate sample data if initial tool loaded
  useEffect(() => {
    if (tool.sampleInput && !inputText) {
      setInputText(tool.sampleInput);
      executeToolAction(tool.sampleInput, "format", indentSize, sortKeys);
    }
  }, [tool.id]);

  // Execute processing logic
  const executeToolAction = (
    textToProcess: string,
    action: "format" | "minify" | "validate" = "format",
    currentIndent = indentSize,
    currentSort = sortKeys
  ) => {
    setErrorMessage(null);
    if (!textToProcess.trim()) {
      setOutputText("");
      return;
    }

    try {
      if (tool.id === "json-formatter" || tool.id === "json-validator") {
        let parsed = JSON.parse(textToProcess);
        if (currentSort && typeof parsed === "object" && parsed !== null) {
          parsed = sortObjectKeys(parsed);
        }

        if (action === "minify") {
          setOutputText(JSON.stringify(parsed));
        } else {
          const indent = currentIndent === "tab" ? "\t" : currentIndent;
          setOutputText(JSON.stringify(parsed, null, indent));
        }
      } else if (tool.id === "base64-encoder") {
        setOutputText(btoa(unescape(encodeURIComponent(textToProcess))));
      } else if (tool.id === "base64-decoder") {
        try {
          setOutputText(decodeURIComponent(escape(atob(textToProcess))));
        } catch {
          setOutputText(atob(textToProcess));
        }
      } else if (tool.id === "url-encoder") {
        setOutputText(encodeURIComponent(textToProcess));
      } else if (tool.id === "url-decoder") {
        setOutputText(decodeURIComponent(textToProcess));
      } else if (tool.id === "html-encoder") {
        setOutputText(
          textToProcess
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
        );
      } else if (tool.id === "html-decoder") {
        const txt = document.createElement("textarea");
        txt.innerHTML = textToProcess;
        setOutputText(txt.value);
      } else if (tool.id === "javascript-minifier") {
        // Strip single & multiline comments and extra whitespace
        const minified = textToProcess
          .replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, "")
          .replace(/^\s+|\s+$/gm, "")
          .replace(/\n+/g, " ")
          .replace(/\s*([=+\-*/%{}();,:<>])\s*/g, "$1")
          .trim();
        setOutputText(minified);
      } else if (tool.id === "css-minifier") {
        const minified = textToProcess
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/\s+/g, " ")
          .replace(/\s*([:;{}])\s*/g, "$1")
          .replace(/;}/g, "}")
          .trim();
        setOutputText(minified);
      } else if (tool.id === "word-counter") {
        const words = textToProcess.trim() ? textToProcess.trim().split(/\s+/).length : 0;
        const chars = textToProcess.length;
        const charsNoSpaces = textToProcess.replace(/\s/g, "").length;
        const lines = textToProcess.split("\n").length;
        const readingTime = Math.ceil(words / 200);
        setOutputText(
          `Words: ${words}\nCharacters: ${chars}\nCharacters (no spaces): ${charsNoSpaces}\nLines: ${lines}\nEstimated Reading Time: ~${readingTime} min`
        );
      } else {
        // Generic fallback or beauty pass
        setOutputText(textToProcess);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while processing the data.");
    }
  };

  // Helper for recursive object key sorting
  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    }
    if (obj !== null && typeof obj === "object") {
      return Object.keys(obj)
        .sort()
        .reduce((result: any, key: string) => {
          result[key] = sortObjectKeys(obj[key]);
          return result;
        }, {});
    }
    return obj;
  };

  // Handle Tab key in textarea to insert spaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const spaces = "  ";
      const newValue = inputText.substring(0, start) + spaces + inputText.substring(end);
      setInputText(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + spaces.length;
      }, 0);
    }
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInputText(content);
      executeToolAction(content, "format", indentSize, sortKeys);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Clear Editor
  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setErrorMessage(null);
  };

  // Copy to Clipboard
  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download Output
  const handleDownload = () => {
    if (!outputText) return;
    const extension =
      tool.id.includes("json")
        ? "json"
        : tool.id.includes("html")
        ? "html"
        : tool.id.includes("javascript")
        ? "js"
        : tool.id.includes("css")
        ? "css"
        : "txt";
    const mime = extension === "json" ? "application/json" : "text/plain";
    const blob = new Blob([outputText], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${tool.slug}-result.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper for generating line number list
  const getLineNumbers = (text: string) => {
    const linesCount = Math.max(1, text.split("\n").length);
    return Array.from({ length: linesCount }, (_, i) => i + 1);
  };

  const inputLineNumbers = getLineNumbers(inputText);
  const outputLineNumbers = getLineNumbers(outputText);

  // Icon mapping helper
  const renderIcon = (name: string, className = "h-4 w-4") => {
    switch (name) {
      case "Code2":
        return <Code2 className={className} />;
      case "ShieldCheck":
        return <ShieldCheck className={className} />;
      case "FileText":
        return <FileText className={className} />;
      case "Network":
        return <Network className={className} />;
      case "Code":
        return <Code className={className} />;
      case "Cpu":
        return <Cpu className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      case "ArrowLeftRight":
        return <ArrowLeftRight className={className} />;
      case "Globe":
        return <Globe className={className} />;
      case "FileCode":
        return <FileCode className={className} />;
      case "Database":
        return <Database className={className} />;
      case "Type":
        return <Type className={className} />;
      case "Baseline":
        return <Baseline className={className} />;
      case "Image":
        return <ImageIcon className={className} />;
      case "QrCode":
        return <QrCode className={className} />;
      case "ImageDown":
        return <ImageDown className={className} />;
      case "FileUp":
        return <FileUp className={className} />;
      case "FileImage":
        return <FileImage className={className} />;
      case "Scale":
        return <Scale className={className} />;
      case "Coins":
        return <Coins className={className} />;
      case "Calculator":
        return <Calculator className={className} />;
      case "Percent":
        return <Percent className={className} />;
      case "Search":
        return <Search className={className} />;
      default:
        return <Code2 className={className} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc] dark:bg-[#090b11] text-foreground transition-colors duration-300">
      {/* Global Navigation Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSignIn={() => setSignInOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6">
            <Link
              href="/"
              className="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
            <Link
              href="/tools"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Tools
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
            <Link
              href={`/tools/${tool.categorySlug || "developer-tools"}`}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {tool.category}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
            <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {tool.name}
            </span>
          </nav>

          {/* 2-Column Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Tool Header, Interactive Panels & About Card */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Tool Header */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-100/90 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 dark:text-purple-400 text-3xl font-mono font-medium shadow-xs shrink-0">
                  {tool.iconSymbol || renderIcon(tool.iconName, "h-8 w-8 sm:h-9 sm:w-9")}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {tool.name}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <ShieldCheck className="h-4 w-4" />
                      100% Private
                    </span>
                    <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <Zap className="h-3.5 w-3.5" />
                      Instant Result
                    </span>
                  </div>
                </div>
              </div>

              {/* Workspace Container */}
              <div className="flex flex-col gap-3">
                
                {/* Input Panel Card */}
                <div className="rounded-xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-[#0f131c] shadow-xs overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Input
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".json,.txt,.js,.css,.html,.xml"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors shadow-xs"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        <span>Upload {tool.id.includes("json") ? "JSON" : "File"}</span>
                      </button>
                      <button
                        onClick={handleClear}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors shadow-xs"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Clear</span>
                      </button>
                    </div>
                  </div>

                  {/* Input Textarea with Line Numbers */}
                  <div className="flex min-h-[160px] sm:min-h-[190px] max-h-[380px] overflow-auto relative">
                    <div className="w-10 sm:w-11 py-3 pr-2.5 text-right text-gray-400 dark:text-gray-600 font-mono text-xs select-none border-r border-gray-100 dark:border-gray-800/80 bg-gray-50/40 dark:bg-gray-900/20 shrink-0 leading-relaxed">
                      {inputLineNumbers.map((num) => (
                        <div key={num}>{num}</div>
                      ))}
                    </div>
                    <textarea
                      ref={inputTextAreaRef}
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        executeToolAction(e.target.value, "format", indentSize, sortKeys);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Paste or type your JSON here..."
                      spellCheck={false}
                      className="flex-1 p-3 font-mono text-xs sm:text-sm bg-transparent outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 leading-relaxed w-full whitespace-pre"
                    />
                  </div>
                </div>

                {/* Middle Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 py-1">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => executeToolAction(inputText, "format", indentSize, sortKeys)}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all active:scale-[0.98]"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Format {tool.id.includes("json") ? "JSON" : "Code"}</span>
                    </button>
                    
                    <button
                      onClick={() => executeToolAction(inputText, "minify", indentSize, sortKeys)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors shadow-xs"
                    >
                      <Code className="h-3.5 w-3.5" />
                      <span>Minify</span>
                    </button>
                  </div>

                  {/* Options Dropdown Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setOptionsOpen(!optionsOpen)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 px-3 py-2 text-xs sm:text-sm font-medium transition-colors shadow-xs"
                    >
                      <Settings2 className="h-3.5 w-3.5 text-gray-500" />
                      <span>Options</span>
                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-transform ${
                          optionsOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {optionsOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 p-3 shadow-lg z-20 animate-in fade-in zoom-in-95 duration-100">
                        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          Indentation
                        </div>
                        <div className="grid grid-cols-3 gap-1 mb-3">
                          <button
                            onClick={() => {
                              setIndentSize(2);
                              executeToolAction(inputText, "format", 2, sortKeys);
                            }}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              indentSize === 2
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                          >
                            2 Spaces
                          </button>
                          <button
                            onClick={() => {
                              setIndentSize(4);
                              executeToolAction(inputText, "format", 4, sortKeys);
                            }}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              indentSize === 4
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                          >
                            4 Spaces
                          </button>
                          <button
                            onClick={() => {
                              setIndentSize("tab");
                              executeToolAction(inputText, "format", "tab", sortKeys);
                            }}
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              indentSize === "tab"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                          >
                            Tabs
                          </button>
                        </div>

                        <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>

                        <label className="flex items-center justify-between cursor-pointer py-1 text-xs text-gray-700 dark:text-gray-300">
                          <span>Sort Object Keys</span>
                          <input
                            type="checkbox"
                            checked={sortKeys}
                            onChange={(e) => {
                              setSortKeys(e.target.checked);
                              executeToolAction(inputText, "format", indentSize, e.target.checked);
                            }}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3.5 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
                    <div>
                      <span className="font-semibold">Syntax Error: </span>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Output Panel Card */}
                <div className="rounded-xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-[#0f131c] shadow-xs overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/30 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Output
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        disabled={!outputText}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-50 transition-colors shadow-xs"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleDownload}
                        disabled={!outputText}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-50 transition-colors shadow-xs"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  {/* Output Display with Line Numbers */}
                  <div className="flex min-h-[160px] sm:min-h-[190px] max-h-[380px] overflow-auto relative">
                    <div className="w-10 sm:w-11 py-3 pr-2.5 text-right text-gray-400 dark:text-gray-600 font-mono text-xs select-none border-r border-gray-100 dark:border-gray-800/80 bg-gray-50/40 dark:bg-gray-900/20 shrink-0 leading-relaxed">
                      {outputLineNumbers.map((num) => (
                        <div key={num}>{num}</div>
                      ))}
                    </div>
                    <textarea
                      ref={outputTextAreaRef}
                      readOnly
                      value={outputText}
                      placeholder="Formatted JSON will appear here..."
                      spellCheck={false}
                      className="flex-1 p-3 font-mono text-xs sm:text-sm bg-transparent outline-none resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 leading-relaxed w-full whitespace-pre"
                    />
                  </div>
                </div>

              </div>

              {/* About Tool & Key Features Card */}
              <div className="rounded-xl border border-gray-200/90 dark:border-gray-800 bg-white dark:bg-[#0f131c] p-6 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                <div className="md:col-span-7">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    {tool.aboutTitle || `About ${tool.name}`}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                    {tool.aboutText ||
                      `This ${tool.name} provides clean, instantaneous client-side processing without uploading any data to external servers.`}
                  </p>
                </div>
                <div className="md:col-span-5 flex flex-col gap-2.5">
                  {(tool.features || [
                    "Formats and indents JSON",
                    "Validates JSON syntax",
                    "Minify JSON data",
                    "100% client-side processing",
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Category Sidebar List */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-[#0f131c]/90 p-5 shadow-xs flex flex-col backdrop-blur-sm">
                
                {/* Category Header */}
                <div className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-800/80">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    {renderIcon(categoryInfo.iconName, "h-5 w-5")}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                      {categoryInfo.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                      {categoryInfo.description}
                    </p>
                  </div>
                </div>

                {/* Tools List in Category */}
                <div className="mt-3.5 flex flex-col gap-1.5">
                  {categoryTools.map((t) => {
                    const isActive = t.id === tool.id || t.slug === tool.slug;
                    return (
                      <Link
                        key={t.id}
                        href={`/tools/${t.categorySlug || "developer-tools"}/${t.slug}`}
                        className={`group rounded-xl p-2.5 sm:p-3 transition-all flex items-center justify-between ${
                          isActive
                            ? "bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs"
                            : "hover:bg-gray-50 dark:hover:bg-gray-850/60 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                              isActive
                                ? "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950/50 dark:group-hover:text-indigo-400"
                            }`}
                          >
                            {t.iconSymbol || renderIcon(t.iconName, "h-4 w-4")}
                          </div>
                          <div className="min-w-0">
                            <h4
                              className={`text-xs sm:text-sm font-semibold truncate ${
                                isActive
                                  ? "text-indigo-950 dark:text-indigo-200"
                                  : "text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                              }`}
                            >
                              {t.name}
                            </h4>
                            <p
                              className={`text-[11px] truncate ${
                                isActive
                                  ? "text-indigo-700/80 dark:text-indigo-400"
                                  : "text-gray-500 dark:text-gray-400"
                              }`}
                            >
                              {t.shortDesc || t.description}
                            </p>
                          </div>
                        </div>

                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 shrink-0 ml-2"></span>
                        )}
                      </Link>
                    );
                  })}
                </div>

                {/* View all tools button */}
                <Link
                  href={`/tools/${tool.categorySlug || "developer-tools"}`}
                  className="w-full mt-4 py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-800 text-center text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>View all {categoryInfo.countText || `${categoryTools.length} tools`}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>

              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectTool={(toolId) => {
          const targetTool = TOOLS.find((t) => t.id === toolId || t.slug === toolId);
          if (targetTool) {
            router.push(`/tools/${targetTool.categorySlug}/${targetTool.slug}`);
          }
        }}
      />

      {/* Sign In Modal */}
      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
      />
    </div>
  );
}

"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Table as TableIcon,
  Link2,
  Minus,
  Copy,
  Check,
  Download,
  Upload,
  RotateCcw,
  Eye,
  Columns,
  Edit3,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Tool } from "@/types/tool";
import { useClipboard } from "@/hooks/useClipboard";
import { downloadFile, readFileAsText } from "@/lib/utils/file";
import { handleTextareaTabKey } from "@/lib/utils/keyboard";
import { highlightCode } from "@/lib/utils/syntaxHighlight";

interface MarkdownWorkspaceProps {
  tool: Tool;
}

const DEFAULT_MARKDOWN = `# Markdown Live Previewer 🚀

Welcome to the **InfoLoads Markdown Editor**! Write standard or GitHub-flavored markdown on the left and preview the rendered output instantly on the right.

---

## Key Features
- **Real-time Live Preview**: Zero latency client-side rendering
- **Formatting Tools**: Bold, italic, headings, lists, tables, and code
- **Export Options**: Download as \`.md\` file or copy rendered HTML
- **100% Private**: Your text never leaves your browser

## Rich Typography Demo

Here is a blockquote with helpful insight:
> "Simplicity is prerequisite for reliability." – *Edsger W. Dijkstra*

### Code Example
\`\`\`javascript
function calculateScore(points, multiplier = 1.5) {
  return points * multiplier;
}
console.log(calculateScore(100)); // 150
\`\`\`

### Data Table
| Feature | Status | Infoloads |
| :--- | :---: | ---: |
| Live Preview | ✅ Enabled | Instant |
| HTML Export | ✅ Enabled | 1-Click |
| Client-Side | 🔒 Secure | 100% |

### Task List
- [x] Create modern developer tools
- [x] Build rich interactive workspace
- [ ] Add your customized markdown content!
`;

export default function MarkdownWorkspace({ tool }: MarkdownWorkspaceProps) {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [viewMode, setViewMode] = useState<"split" | "edit" | "preview">("split");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { copied: copiedMd, copy: copyMd } = useClipboard();
  const { copied: copiedHtml, copy: copyHtml } = useClipboard();

  // Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Lock body scroll in fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // Statistics
  const stats = useMemo(() => {
    const trimmed = markdown.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = markdown.length;
    const readingTime = Math.ceil(words / 200);
    return { words, chars, readingTime };
  }, [markdown]);

  // Insert markdown helper at cursor
  const insertFormatting = (prefix: string, suffix: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end) || defaultText;
    const replacement = `${prefix}${selected}${suffix}`;

    const updated = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(updated);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selected.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Convert markdown to clean HTML
  const renderedHtml = useMemo(() => {
    // 1. Extract fenced code blocks to prevent markdown rules from mangling them
    const codeBlocks: string[] = [];
    let processed = markdown.replace(
      /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,
      (_match, lang, code) => {
        const index = codeBlocks.length;
        const language = lang || "code";
        const highlighted = highlightCode(code.trim(), language);
        const blockHtml = `<div class="rounded-xl overflow-hidden my-4 border border-gray-200 dark:border-gray-800 bg-[#0d1117] shadow-md">
          <div class="flex items-center justify-between px-3.5 py-1.5 bg-[#161b22] border-b border-gray-800 text-[11px] text-gray-400 font-mono select-none">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
              <span class="ml-2 font-semibold text-gray-300 uppercase tracking-wider">${language}</span>
            </div>
          </div>
          <pre class="language-${language} p-4 overflow-x-auto text-xs font-mono leading-relaxed bg-[#0d1117] m-0"><code class="language-${language}">${highlighted}</code></pre>
        </div>`;
        codeBlocks.push(blockHtml);
        return `\n\n__CODE_BLOCK_${index}__\n\n`;
      }
    );

    // 2. Escape HTML entities on remaining markdown content
    let html = processed
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Inline code `code`
    html = html.replace(
      /`([^`]+)`/g,
      `<code class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold">$1</code>`
    );

    // Headings
    html = html.replace(/^######\s+(.+)$/gm, `<h6 class="text-xs font-bold text-gray-900 dark:text-white mt-4 mb-2">$1</h6>`);
    html = html.replace(/^#####\s+(.+)$/gm, `<h5 class="text-sm font-bold text-gray-900 dark:text-white mt-4 mb-2">$1</h5>`);
    html = html.replace(/^####\s+(.+)$/gm, `<h4 class="text-base font-bold text-gray-900 dark:text-white mt-5 mb-2">$1</h4>`);
    html = html.replace(/^###\s+(.+)$/gm, `<h3 class="text-lg font-bold text-gray-900 dark:text-white mt-5 mb-2">$1</h3>`);
    html = html.replace(/^##\s+(.+)$/gm, `<h2 class="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3 border-b border-gray-200 dark:border-gray-800 pb-1">$1</h2>`);
    html = html.replace(/^#\s+(.+)$/gm, `<h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-6 mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">$1</h1>`);

    // Blockquotes
    html = html.replace(/^>\s+(.+)$/gm, `<blockquote class="border-l-4 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 pl-4 py-2 my-3 rounded-r-lg text-gray-700 dark:text-gray-300 italic">$1</blockquote>`);

    // Horizontal Rule
    html = html.replace(/^---$/gm, `<hr class="my-6 border-gray-200 dark:border-gray-800" />`);

    // Task Lists
    html = html.replace(/^- \[x\]\s+(.+)$/gm, `<div class="flex items-center gap-2 my-1"><input type="checkbox" checked disabled class="rounded text-indigo-600 h-4 w-4" /><span class="line-through text-gray-400 dark:text-gray-500 text-sm">$1</span></div>`);
    html = html.replace(/^- \[ \]\s+(.+)$/gm, `<div class="flex items-center gap-2 my-1"><input type="checkbox" disabled class="rounded text-indigo-600 h-4 w-4" /><span class="text-gray-700 dark:text-gray-300 text-sm">$1</span></div>`);

    // Bullet Lists
    html = html.replace(/^[*-]\s+(.+)$/gm, `<li class="ml-5 list-disc text-sm text-gray-700 dark:text-gray-300 my-1">$1</li>`);

    // Numbered Lists
    html = html.replace(/^(\d+)\.\s+(.+)$/gm, `<li class="ml-5 list-decimal text-sm text-gray-700 dark:text-gray-300 my-1">$2</li>`);

    // Bold & Italic & Strike
    html = html.replace(/\*\*\*([^*]+)\*\*\*/g, `<strong><em>$1</em></strong>`);
    html = html.replace(/\*\*([^*]+)\*\*/g, `<strong class="font-bold text-gray-900 dark:text-white">$1</strong>`);
    html = html.replace(/\*([^*]+)\*/g, `<em class="italic">$1</em>`);
    html = html.replace(/~~([^~]+)~~/g, `<del class="line-through text-gray-400">$1</del>`);

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500 font-medium">$1</a>`);

    // Tables
    const tableRegex = /\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g;
    html = html.replace(tableRegex, (_match, header, rows) => {
      const headers = header.split("|").filter((h: string) => h.trim() !== "");
      const headerHtml = `<tr>${headers.map((h: string) => `<th class="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-left font-semibold text-xs text-gray-700 dark:text-gray-300">${h.trim()}</th>`).join("")}</tr>`;

      const rowsList = rows.trim().split("\n");
      const rowsHtml = rowsList.map((row: string) => {
        const cols = row.split("|").filter((c: string) => c.trim() !== "");
        return `<tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">${cols.map((c: string) => `<td class="border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs text-gray-700 dark:text-gray-300">${c.trim()}</td>`).join("")}</tr>`;
      }).join("");

      return `<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg text-xs">${headerHtml}${rowsHtml}</table></div>`;
    });

    // Paragraphs
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs
      .map((p) => {
        const trimmed = p.trim();
        if (
          trimmed.startsWith("<h") ||
          trimmed.startsWith("<pre") ||
          trimmed.startsWith("<blockquote") ||
          trimmed.startsWith("<hr") ||
          trimmed.startsWith("<div") ||
          trimmed.startsWith("<li") ||
          trimmed.startsWith("<table") ||
          trimmed.startsWith("__CODE_BLOCK_")
        ) {
          return trimmed;
        }
        return `<p class="my-2.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">${trimmed.replace(/\n/g, "<br />")}</p>`;
      })
      .join("");

    // 3. Re-inject highlighted code blocks
    codeBlocks.forEach((blockHtml, index) => {
      html = html.replace(`__CODE_BLOCK_${index}__`, blockHtml);
      // In case wrapped in <p> tag
      html = html.replace(`<p class="my-2.5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">__CODE_BLOCK_${index}__</p>`, blockHtml);
    });

    return html;
  }, [markdown]);


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const content = await readFileAsText(file);
      setMarkdown(content);
    } catch {
      alert("Failed to read file.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 p-4 sm:p-6 bg-gray-50 dark:bg-gray-950 flex flex-col h-screen w-screen overflow-hidden animate-in fade-in duration-200"
          : "flex flex-col gap-3"
      }
    >
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 shadow-xs shrink-0">
        {/* Formatting Buttons */}
        <div className="flex items-center flex-wrap gap-1">
          <button
            onClick={() => insertFormatting("**", "**", "bold text")}
            title="Bold"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("*", "*", "italic text")}
            title="Italic"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <Italic className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-0.5" />
          <button
            onClick={() => insertFormatting("# ", "", "Heading 1")}
            title="Heading 1"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("## ", "", "Heading 2")}
            title="Heading 2"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("### ", "", "Heading 3")}
            title="Heading 3"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-0.5" />
          <button
            onClick={() => insertFormatting("- ", "", "List item")}
            title="Bullet List"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("1. ", "", "List item")}
            title="Numbered List"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("- [ ] ", "", "Task")}
            title="Task List"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <CheckSquare className="h-4 w-4" />
          </button>
          <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-0.5" />
          <button
            onClick={() => insertFormatting("> ", "", "Quote text")}
            title="Quote"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("```javascript\n", "\n```", "console.log('hello');")}
            title="Code Block"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <Code className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("[", "](https://example.com)", "Link Title")}
            title="Insert Link"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <Link2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("\n| Header 1 | Header 2 |\n| :--- | :--- |\n| Cell 1 | Cell 2 |\n")}
            title="Insert Table"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <TableIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => insertFormatting("\n---\n")}
            title="Horizontal Line"
            className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors cursor-pointer"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>

        {/* View Mode & Fullscreen Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("edit")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "edit"
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Write</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "split"
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === "preview"
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-white shadow-xs"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>

          {/* Full Screen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen (Esc)" : "Full Screen Split View"}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
              isFullscreen
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750"
            }`}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor & Preview Split Panels */}
      <div
        className={`grid gap-4 ${
          isFullscreen ? "flex-1 min-h-0 h-full mt-2" : ""
        } ${
          viewMode === "split"
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {/* Editor Panel */}
        {(viewMode === "split" || viewMode === "edit") && (
          <div className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 shadow-xs overflow-hidden h-full min-h-0">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 py-2.5 bg-gray-50/70 dark:bg-gray-800/40 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Markdown Source
              </span>
              <div className="flex items-center gap-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".md,.txt,.markdown"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                >
                  <Upload className="h-3 w-3" />
                  <span>Upload .md</span>
                </button>
                <button
                  onClick={() => setMarkdown("")}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onKeyDown={(e) => handleTextareaTabKey(e, setMarkdown, 2)}
              placeholder="Type your markdown here..."
              className={`w-full p-4 text-xs font-mono leading-relaxed bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none resize-none flex-1 min-h-0 overflow-y-auto ${
                isFullscreen ? "h-full" : "min-h-[420px]"
              }`}
              spellCheck={false}
            />

            {/* Bottom Status Bar */}
            <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 px-4 py-2 bg-gray-50/50 dark:bg-gray-800/20 text-[11px] text-gray-500 dark:text-gray-400 shrink-0">
              <div className="flex items-center gap-3">
                <span>{stats.words} Words</span>
                <span>{stats.chars} Characters</span>
                <span>~{stats.readingTime} min read</span>
              </div>
              <button
                onClick={() => copyMd(markdown)}
                className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer"
              >
                {copiedMd ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                <span>{copiedMd ? "Copied MD" : "Copy Markdown"}</span>
              </button>
            </div>
          </div>
        )}

        {/* Live Preview Panel */}
        {(viewMode === "split" || viewMode === "preview") && (
          <div className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-850 shadow-xs overflow-hidden h-full min-h-0">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 py-2.5 bg-gray-50/70 dark:bg-gray-800/40 shrink-0">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                Rendered Preview
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyHtml(renderedHtml)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                >
                  {copiedHtml ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied HTML</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy HTML</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => downloadFile(markdown, `${tool.slug}.md`)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[11px] font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer"
                >
                  <Download className="h-3 w-3" />
                  <span>Download .md</span>
                </button>
              </div>
            </div>

            <div
              className={`p-5 overflow-y-auto text-gray-800 dark:text-gray-200 flex-1 min-h-0 ${
                isFullscreen ? "h-full" : "min-h-[420px]"
              }`}
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </div>
        )}
      </div>
    </div>
  );
}


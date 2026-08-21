import Prism from "prismjs";

// Import common language definitions
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markup"; // HTML / XML / SVG
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";

export function highlightCode(code: string, lang = "javascript"): string {
  const language = (lang || "").toLowerCase().trim();

  // Alias mappings
  const langMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    html: "markup",
    xml: "markup",
    svg: "markup",
    py: "python",
    sh: "bash",
    shell: "bash",
    yml: "yaml",
    md: "markdown",
  };

  const targetLang = langMap[language] || language;

  try {
    if (Prism.languages[targetLang]) {
      return Prism.highlight(code, Prism.languages[targetLang], targetLang);
    }
    // Fallback to javascript or markup if available, otherwise raw escaped code
    if (Prism.languages.javascript) {
      return Prism.highlight(code, Prism.languages.javascript, "javascript");
    }
  } catch {
    // Fallback
  }

  // Safe fallback: HTML escape
  return code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

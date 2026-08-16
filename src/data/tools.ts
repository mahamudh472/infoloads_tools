export interface Tool {
  id: string;
  name: string;
  category: string;
  description: string;
  slug: string;
  popular?: boolean;
  iconName: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  countText: string;
  iconName: string;
  colorClass: string; // Tailwind bg color for icon wrapper
  iconColorClass: string; // Tailwind text color for icon
}

export const CATEGORIES: Category[] = [
  {
    id: "text-tools",
    name: "Text Tools",
    description: "Edit, format and analyze your text easily.",
    countText: "12 tools",
    iconName: "Type",
    colorClass: "bg-purple-100 dark:bg-purple-950/40",
    iconColorClass: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    description: "Code formatters, generators and debugging helpers.",
    countText: "18 tools",
    iconName: "Code2",
    colorClass: "bg-blue-100 dark:bg-blue-950/40",
    iconColorClass: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "image-tools",
    name: "Image Tools",
    description: "Compress, convert and optimize images.",
    countText: "15 tools",
    iconName: "Image",
    colorClass: "bg-green-100 dark:bg-green-950/40",
    iconColorClass: "text-green-600 dark:text-green-400",
  },
  {
    id: "pdf-tools",
    name: "PDF Tools",
    description: "Merge, split, convert and work with PDFs.",
    countText: "20 tools",
    iconName: "FileText",
    colorClass: "bg-red-100 dark:bg-red-950/40",
    iconColorClass: "text-red-600 dark:text-red-400",
  },
  {
    id: "converters",
    name: "Converters",
    description: "Convert units, data, time and more.",
    countText: "25 tools",
    iconName: "ArrowLeftRight",
    colorClass: "bg-amber-100 dark:bg-amber-950/40",
    iconColorClass: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "calculators",
    name: "Calculators",
    description: "Smart calculators for daily use and beyond.",
    countText: "17 tools",
    iconName: "Calculator",
    colorClass: "bg-rose-100 dark:bg-rose-950/40",
    iconColorClass: "text-rose-600 dark:text-rose-400",
  },
  {
    id: "data-tools",
    name: "Data Tools",
    description: "Work with JSON, CSV, XML and more.",
    countText: "14 tools",
    iconName: "Database",
    colorClass: "bg-cyan-100 dark:bg-cyan-950/40",
    iconColorClass: "text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "web-tools",
    name: "Web Tools",
    description: "SEO, domain, and website utility tools.",
    countText: "13 tools",
    iconName: "Globe",
    colorClass: "bg-indigo-100 dark:bg-indigo-950/40",
    iconColorClass: "text-indigo-600 dark:text-indigo-400",
  },
];

export const TOOLS: Tool[] = [
  // Developer / Data Tools
  {
    id: "json-formatter",
    name: "JSON Formatter",
    category: "Developer Tools",
    description: "Format, validate, beautify, and minify JSON data instantly.",
    slug: "json-formatter",
    popular: true,
    iconName: "Code2",
  },
  {
    id: "xml-to-json",
    name: "XML to JSON Converter",
    category: "Data Tools",
    description: "Convert XML data structures into clean JSON format.",
    slug: "xml-to-json",
    iconName: "Database",
  },
  {
    id: "base64-encoder-decoder",
    name: "Base64 Encoder/Decoder",
    category: "Developer Tools",
    description: "Encode text to Base64 format or decode Base64 back to plain text.",
    slug: "base64-encoder-decoder",
    iconName: "ArrowLeftRight",
  },
  {
    id: "url-encoder-decoder",
    name: "URL Encoder/Decoder",
    category: "Developer Tools",
    description: "Encode special characters in URLs or decode them into readable text.",
    slug: "url-encoder-decoder",
    iconName: "Globe",
  },
  {
    id: "html-formatter",
    name: "HTML Formatter & Beautifier",
    category: "Developer Tools",
    description: "Beautify raw HTML code with proper indentation and nesting.",
    slug: "html-formatter",
    iconName: "FileCode",
  },
  // Text Tools
  {
    id: "word-counter",
    name: "Word Counter",
    category: "Text Tools",
    description: "Count words, characters, sentences, paragraphs, and reading time.",
    slug: "word-counter",
    popular: true,
    iconName: "Type",
  },
  {
    id: "case-converter",
    name: "Case Converter",
    category: "Text Tools",
    description: "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, and more.",
    slug: "case-converter",
    iconName: "Baseline",
  },
  {
    id: "markdown-previewer",
    name: "Markdown Live Previewer",
    category: "Text Tools",
    description: "Write and view styled Markdown output side-by-side in real-time.",
    slug: "markdown-previewer",
    iconName: "FileText",
  },
  // Image Tools
  {
    id: "image-compressor",
    name: "Image Compressor",
    category: "Image Tools",
    description: "Reduce file sizes of JPG, PNG, and WebP images while maintaining quality.",
    slug: "image-compressor",
    popular: true,
    iconName: "Image",
  },
  {
    id: "qr-code-generator",
    name: "QR Code Generator",
    category: "Image Tools",
    description: "Generate customized QR codes for URLs, text, Wi-Fi, or contact info.",
    slug: "qr-code-generator",
    iconName: "QrCode",
  },
  {
    id: "svg-to-png",
    name: "SVG to PNG Converter",
    category: "Image Tools",
    description: "Convert vector SVG graphics into raster PNG images.",
    slug: "svg-to-png",
    iconName: "ImageDown",
  },
  // PDF Tools
  {
    id: "pdf-merger",
    name: "PDF Merger",
    category: "PDF Tools",
    description: "Combine multiple PDF documents into a single PDF file easily.",
    slug: "pdf-merger",
    popular: true,
    iconName: "FileUp",
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPG Converter",
    category: "PDF Tools",
    description: "Extract pages from a PDF and convert them into high-quality JPEG images.",
    slug: "pdf-to-jpg",
    iconName: "FileImage",
  },
  // Converters
  {
    id: "unit-converter",
    name: "Unit Converter",
    category: "Converters",
    description: "Convert length, weight, area, volume, and temperature units.",
    slug: "unit-converter",
    iconName: "Scale",
  },
  {
    id: "currency-converter",
    name: "Currency Converter",
    category: "Converters",
    description: "Get real-time exchange rates and convert global currencies.",
    slug: "currency-converter",
    iconName: "Coins",
  },
  // Calculators
  {
    id: "scientific-calculator",
    name: "Scientific Calculator",
    category: "Calculators",
    description: "Perform advanced arithmetic, trigonometric, and algebraic calculations.",
    slug: "scientific-calculator",
    iconName: "Calculator",
  },
  {
    id: "loan-calculator",
    name: "Loan & EMI Calculator",
    category: "Calculators",
    description: "Calculate monthly loan EMI payments and interest breakdowns.",
    slug: "loan-calculator",
    iconName: "Percent",
  },
  // Web Tools
  {
    id: "seo-meta-checker",
    name: "SEO Meta Tag Checker",
    category: "Web Tools",
    description: "Analyze title tags, meta descriptions, and header tags for search engines.",
    slug: "seo-meta-checker",
    iconName: "Search",
  },
  {
    id: "dns-lookup",
    name: "DNS Lookup Checker",
    category: "Web Tools",
    description: "Query DNS records (A, AAAA, MX, TXT) for any domain name.",
    slug: "dns-lookup",
    iconName: "Network",
  },
];

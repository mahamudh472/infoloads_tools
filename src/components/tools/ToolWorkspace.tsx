"use client";

import React from "react";
import { Tool } from "@/types/tool";
import { getToolWorkspaceType } from "@/lib/tools";
import {
  CodeWorkspace,
  MarkdownWorkspace,
  WordCounterWorkspace,
  CaseConverterWorkspace,
  ImageCompressorWorkspace,
  QrCodeWorkspace,
  SvgToPngWorkspace,
  UnitConverterWorkspace,
  CurrencyConverterWorkspace,
  ScientificCalculatorWorkspace,
  LoanCalculatorWorkspace,
  SeoMetaWorkspace,
  DnsLookupWorkspace,
  PdfMergerWorkspace,
  PdfToJpgWorkspace,
} from "./workspaces";

interface ToolWorkspaceProps {
  tool: Tool;
}

export default function ToolWorkspace({ tool }: ToolWorkspaceProps) {
  const workspaceType = getToolWorkspaceType(tool);

  switch (workspaceType) {
    case "markdown":
      return <MarkdownWorkspace tool={tool} />;

    case "word-counter":
      return <WordCounterWorkspace tool={tool} />;

    case "case-converter":
      return <CaseConverterWorkspace tool={tool} />;

    case "image-compressor":
      return <ImageCompressorWorkspace tool={tool} />;

    case "qr-code":
      return <QrCodeWorkspace tool={tool} />;

    case "svg-to-png":
      return <SvgToPngWorkspace tool={tool} />;

    case "unit-converter":
      return <UnitConverterWorkspace tool={tool} />;

    case "currency-converter":
      return <CurrencyConverterWorkspace tool={tool} />;

    case "scientific-calculator":
      return <ScientificCalculatorWorkspace tool={tool} />;

    case "loan-calculator":
      return <LoanCalculatorWorkspace tool={tool} />;

    case "seo-meta":
      return <SeoMetaWorkspace tool={tool} />;

    case "dns-lookup":
      return <DnsLookupWorkspace tool={tool} />;

    case "pdf-merger":
      return <PdfMergerWorkspace tool={tool} />;

    case "pdf-to-jpg":
      return <PdfToJpgWorkspace tool={tool} />;

    case "code":
    default:
      return <CodeWorkspace tool={tool} />;
  }
}

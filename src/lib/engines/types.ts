import { IndentOption, ToolAction } from "@/types/tool";

export interface ToolExecutionContext {
  toolId: string;
  input: string;
  action?: ToolAction;
  indent?: IndentOption;
  sortKeys?: boolean;
}

export interface ToolExecutionResult {
  output: string;
  error?: string | null;
}

export type ToolProcessor = (context: ToolExecutionContext) => string;

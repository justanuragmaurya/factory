"use client";

import Editor from "@monaco-editor/react";
import { FileCode } from "lucide-react";

interface CodeViewerProps {
  filename: string;
  content: string;
}

// Get Monaco language from filename
function getLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
      return "javascript";
    case "jsx":
      return "javascript";
    case "ts":
      return "typescript";
    case "tsx":
      return "typescript";
    case "json":
      return "json";
    case "html":
      return "html";
    case "css":
      return "css";
    case "scss":
      return "scss";
    case "sass":
      return "scss";
    case "md":
      return "markdown";
    case "py":
      return "python";
    case "rb":
      return "ruby";
    case "go":
      return "go";
    case "rs":
      return "rust";
    case "java":
      return "java";
    case "c":
      return "c";
    case "cpp":
    case "cc":
      return "cpp";
    case "sh":
    case "bash":
      return "shell";
    case "yml":
    case "yaml":
      return "yaml";
    case "xml":
      return "xml";
    case "sql":
      return "sql";
    default:
      return "plaintext";
  }
}

export function CodeViewer({ filename, content }: CodeViewerProps) {
  const language = getLanguage(filename);

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Tab bar */}
      <div className="flex items-center border-b border-[#2d2d2d] bg-[#252526]">
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] border-r border-[#2d2d2d]">
          <FileCode className="size-4 text-[#cccccc]" />
          <span className="text-sm text-[#cccccc]">{filename}</span>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={content}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            padding: { top: 16 },
          }}
        />
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center bg-[#1e1e1e]">
      <div className="text-center text-[#808080]">
        <FileCode className="size-16 mx-auto mb-4 opacity-20" />
        <p>Select a file to view its contents</p>
      </div>
    </div>
  );
}

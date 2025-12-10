"use client";

import { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  FileJson,
  FileCode,
  FileText,
  Image,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileData {
  filename: string;
  content: string;
}

interface TreeNode {
  name: string;
  path: string;
  type: "file" | "folder";
  children?: TreeNode[];
  content?: string;
}

interface FileExplorerProps {
  files: FileData[];
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
}

// Build tree structure from flat file list
function buildFileTree(files: FileData[]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.filename.split("/");
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFile = i === parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join("/");

      let existing = currentLevel.find((node) => node.name === part);

      if (!existing) {
        const newNode: TreeNode = {
          name: part,
          path: currentPath,
          type: isFile ? "file" : "folder",
          children: isFile ? undefined : [],
          content: isFile ? file.content : undefined,
        };
        currentLevel.push(newNode);
        existing = newNode;
      }

      if (!isFile && existing.children) {
        currentLevel = existing.children;
      }
    }
  }

  // Sort: folders first, then files, both alphabetically
  const sortNodes = (nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "folder" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      })
      .map((node) => ({
        ...node,
        children: node.children ? sortNodes(node.children) : undefined,
      }));
  };

  return sortNodes(root);
}

// Get icon for file based on extension
function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "json":
      return <FileJson className="size-4 text-yellow-500" />;
    case "js":
    case "jsx":
      return <FileCode className="size-4 text-yellow-400" />;
    case "ts":
    case "tsx":
      return <FileCode className="size-4 text-blue-400" />;
    case "css":
    case "scss":
    case "sass":
      return <FileCode className="size-4 text-pink-400" />;
    case "html":
      return <FileCode className="size-4 text-orange-500" />;
    case "md":
    case "txt":
      return <FileText className="size-4 text-[#cccccc]" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "ico":
      return <Image className="size-4 text-purple-400" />;
    default:
      return <File className="size-4 text-[#cccccc]" />;
  }
}

interface TreeNodeItemProps {
  node: TreeNode;
  depth: number;
  selectedFile: string | null;
  onSelectFile: (path: string) => void;
  expandedFolders: Set<string>;
  toggleFolder: (path: string) => void;
}

function TreeNodeItem({
  node,
  depth,
  selectedFile,
  onSelectFile,
  expandedFolders,
  toggleFolder,
}: TreeNodeItemProps) {
  const isExpanded = expandedFolders.has(node.path);
  const isSelected = selectedFile === node.path;

  const handleClick = () => {
    if (node.type === "folder") {
      toggleFolder(node.path);
    } else {
      onSelectFile(node.path);
    }
  };

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-1 py-0.5 px-2 cursor-pointer hover:bg-[#2a2d2e] text-sm text-[#cccccc]",
          isSelected && "bg-[#094771]"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === "folder" ? (
          <>
            {isExpanded ? (
              <ChevronDown className="size-4 text-[#cccccc] shrink-0" />
            ) : (
              <ChevronRight className="size-4 text-[#cccccc] shrink-0" />
            )}
            {isExpanded ? (
              <FolderOpen className="size-4 text-[#dcb67a] shrink-0" />
            ) : (
              <Folder className="size-4 text-[#dcb67a] shrink-0" />
            )}
          </>
        ) : (
          <>
            <span className="w-4 shrink-0" />
            {getFileIcon(node.name)}
          </>
        )}
        <span className="truncate">{node.name}</span>
      </div>

      {node.type === "folder" && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({
  files,
  selectedFile,
  onSelectFile,
}: FileExplorerProps) {
  const tree = useMemo(() => buildFileTree(files), [files]);

  // Initialize with all folders expanded
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    const folders = new Set<string>();
    const collectFolders = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        if (node.type === "folder") {
          folders.add(node.path);
          if (node.children) collectFolders(node.children);
        }
      }
    };
    collectFolders(tree);
    return folders;
  });

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  return (
    <div className="h-full overflow-auto bg-[#252526] border-r border-[#3c3c3c]">
      <div className="p-2 text-xs font-semibold text-[#bbbbbb] uppercase tracking-wider border-b border-[#3c3c3c]">
        Explorer
      </div>
      <div className="py-1">
        {tree.map((node) => (
          <TreeNodeItem
            key={node.path}
            node={node}
            depth={0}
            selectedFile={selectedFile}
            onSelectFile={onSelectFile}
            expandedFolders={expandedFolders}
            toggleFolder={toggleFolder}
          />
        ))}
      </div>
    </div>
  );
}

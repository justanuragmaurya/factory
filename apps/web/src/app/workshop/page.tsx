"use client";
import { Button } from "@/components/ui/button";
import { FileExplorer, FileData } from "@/components/file-explorer";
import { CodeViewer, EmptyState } from "@/components/code-viewer";
import api from "@/lib/utils";
import { useRef, useState, useMemo } from "react";

export default function App() {
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const build = async () => {
    const response = await api.post("/v1/ai/generate", {
      prompt: promptRef.current?.value,
      attachments: [],
    });

    const { success, data } = response.data;

    if (!success) {
      console.log("error");
    } else {
      setFiles(data.files);
      if (data.files.length > 0) {
        setSelectedFile(data.files[0].filename);
      }
    }
  };

  const selectedFileData = useMemo(() => {
    return files.find((f) => f.filename === selectedFile);
  }, [files, selectedFile]);

  return (
    <div className="h-screen">
      {files.length !== 0 ? (
        <div className="flex h-full">
          {/* File Explorer Sidebar */}
          <div className="w-64 shrink-0">
            <FileExplorer
              files={files}
              selectedFile={selectedFile}
              onSelectFile={setSelectedFile}
            />
          </div>

          {/* Code Viewer */}
          <div className="flex-1 min-w-0">
            {selectedFileData ? (
              <CodeViewer
                filename={selectedFileData.filename}
                content={selectedFileData.content}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center p-5 flex-col h-screen max-w-3xl mx-auto">
          <h1 className="text-2xl"> What do want to Build today BoSS </h1>
          <textarea
            ref={promptRef}
            className="border p-2 rounded-md m-2 w-full"
          />
          <Button onClick={build}>Build it !</Button>
        </div>
      )}
    </div>
  );
}
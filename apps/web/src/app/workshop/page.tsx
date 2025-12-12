"use client";
import { Button } from "@/components/ui/button";
import { FileExplorer, FileData } from "@/components/file-explorer";
import { CodeViewer, EmptyState } from "@/components/code-viewer";
import api from "@/lib/utils";
import { useRef, useState, useMemo, useEffect } from "react";
import { useWebContainer } from "@/hooks/useWebContainer";
import { Loader2 } from "lucide-react";

export default function App() {
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [loading,setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewURL , setURL] = useState<string>();

  const [chat, setChat] = useState<ChatType[]>([
    {
      role: "ai",
      message: "Good Morning Boss , I am Ready to Build What ever you want.",
    },
  ]);
  const [preview, setPreview] = useState<Boolean>(true);
  
  const container = useWebContainer()

  interface ChatType {
    role: "user" | "ai";
    message: string;
  }
  
  const build = async () => {
    setLoading(true)
    if (!promptRef.current?.value) {
      return;
    }
    setChat([
      ...(chat ?? []),
      { role: "user", message: promptRef.current.value },
    ]);
    const response = await api.post("/v1/ai/generate", {
      prompt: promptRef.current.value,
      attachments: [],
    });

    const { success, data } = response.data;
    console.log(data.files)
    if (!success) {
      console.log("error");
    } else {
      setFiles(data.files);
      if (data.files.length > 0) {
        setSelectedFile(data.files[0].filename);
      }
    }
    setLoading(false)
  };

  const selectedFileData = useMemo(() => {
    return files.find((f) => f.filename === selectedFile);
  }, [files, selectedFile]);
  
  useEffect(()=>{
    if(!container)return;
    
    // Converting flat file paths to nested WebContainer structure
    const buildNestedStructure = (files: FileData[]) => {
      const root: Record<string, any> = {};
      for (const file of files) {
        const parts = file.filename.split('/');
        let current = root;
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          const isLastPart = i === parts.length - 1;
          if (isLastPart) {
            // It's a file
            current[part] = {
              file: {
                contents: file.content
              }
            };
          } else {
            // It's a directory
            if (!current[part]) {
              current[part] = {
                directory: {}
              };
            }
            current = current[part].directory;
          }
        }
      }
      return root;
    };
    
    const run = async () => {
      try {
        const containerFiles = buildNestedStructure(files);
        console.log('Mounting files:', containerFiles);
        

        await container.mount(containerFiles);
        console.log('Mount complete, running ls...');
        
        const process = await container.spawn('npm', ['install']);
        
        // Read the output stream
        process.output.pipeTo(new WritableStream({
          write(data) {
            console.log(data);
          }
        }));
        
        const exitCode = await process.exit;
        
        await container.spawn('npm', ['run', 'dev']);
        
        container.on('server-ready', (port, url) => {
          setURL(url);
        })
        console.log('Exit code:', exitCode);
      } catch (error) {
        console.error('Error running command:', error);
      }
    };
    
    run();
  },[files, container])

  return (
    <div className="h-screen">
      <div>
        <Button onClick={()=>{setPreview(!preview)}}> Preview </Button>
      </div>
      {files.length !== 0 ? (
        <div className="flex h-full">
          <div className="flex-col items-end w-72 p-2 gap-2 justify-between h-full">
            {chat.map((chat, index) => {
              return (
                <div
                  key={index}
                  className={`border my-5 p-2 ${chat.role == "ai" ? "bg-green-900 rounded-tl-none" : "bg-blue-950 rounded-tr-none"} rounded-xl`}
                >
                  {chat.message}
                </div>
              );
            })}
            <div className="bg-white">
              <input type="text" className="h-full w-full p-2" />
            </div>
          </div>
          <div className="flex w-full  h-full">
            {!preview ? (
              <div className="flex h-full w-full">
                <div className="w-64 shrink-0">
                  <FileExplorer
                    files={files}
                    selectedFile={selectedFile}
                    onSelectFile={setSelectedFile}
                  />
                </div>
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
              <div className="flex-col h-screen w-full">
                <div className="h-full">
                  {previewURL&&<iframe src={previewURL} height={"100%"} width={"100%"}/>}
                </div>
                <div className="p-32 border m-2">
                  Terminal
                </div>
              </div>
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
          <Button onClick={build} disabled={loading}>{!loading?"Build It":<div><Loader2 className="animate-spin"/><p>loading...</p></div>}</Button>
        </div>
      )}
    </div>
  );
}
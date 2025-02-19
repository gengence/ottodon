"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, Upload } from "lucide-react";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

export default function Home() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  return (
    <div className="flex-1" {...getRootProps()}>
      <input {...getInputProps()} />
      <main className="h-full flex items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center gap-8 max-w-3xl w-full">
          {/* Drag Indicator */}
          <div className={cn(
            "fixed inset-0 pointer-events-none transition-all duration-200 z-50",
            isDragActive ? "bg-foreground/5" : "bg-transparent"
          )}>
            {isDragActive && (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="border-2 border-dashed border-foreground/30 rounded-lg max-w-3xl w-full h-[500px] flex flex-col items-center justify-center bg-transparent">
                  <div className="bg-card/50 backdrop-blur-sm p-4 rounded-lg shadow-lg flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-foreground" />
                    <span className="text-foreground">Drop your file here</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Logo */}
          <div className="relative w-48 h-48 -mt-12">
            <Image
              src="/fish.png"
              alt="Logo"
              fill
              sizes="(max-width: 768px) 100vw, 192px"
              className="object-contain"
              priority
            />
          </div>

          {/* Input Field */}
          <div className="w-full relative">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/70">
                <LinkIcon className="h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="paste the link here"
                className="px-4 py-2 text-sm text-foreground placeholder:text-foreground/70 pl-9 pr-16"
              />
              <Button 
                className="absolute right-0 top-0 bottom-0 text-foreground hover:bg-foreground/10 rounded-l-none h-full"
                variant="ghost"
                size="sm"
              >
                paste
              </Button>
            </div>
          </div>

          {/* File Upload */}
          <div className="text-center">
            <label>
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onDrop([e.target.files[0]]);
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-foreground hover:bg-foreground/10"
                type="button"
              >
                <Upload className="w-4 h-4" />
                or choose a file
              </Button>
            </label>
          </div>
          
          {/* Footer */}
          <div className="text-center text-xs text-foreground">
            by using this website, you agree to the{" "}
            <Link 
              href="/about/terms" 
              className="font-medium underline underline-offset-4 hover:text-foreground/70"
            >
              terms and ethical usages
            </Link>{" "}
            of what you download.
          </div>
        </div>
      </main>
    </div>
  );
}

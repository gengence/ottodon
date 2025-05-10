"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon, Upload, Check, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Job } from "@/lib/queue/types";

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');
  const [hasClipboardPermission, setHasClipboardPermission] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setStatus('uploading');
      setError(null);
      setDownloadUrl(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const { jobId } = await response.json();
      setStatus('processing');
      await pollJobStatus(jobId);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/media/status/${jobId}`);
        const job = await response.json();

        setCurrentJob(job);

        if (job.status === 'completed') {
          setStatus('complete');
          setDownloadUrl(job.result.url);
        } else if (job.status === 'failed') {
          setStatus('error');
          setError(job.error || 'Processing failed');
        } else {
          setTimeout(checkStatus, 1000);
        }
      } catch {
        setStatus('error');
        setError('Failed to check status');
      }
    };

    await checkStatus();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  const requestClipboardPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
      if (result.state === 'granted') {
        setHasClipboardPermission(true);
        return true;
      } else if (result.state === 'prompt') {
        await navigator.clipboard.readText();
        setHasClipboardPermission(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handlePasteButtonClick = async () => {
    if (!hasClipboardPermission) {
      const granted = await requestClipboardPermission();
      if (!granted) {
        setError('Please allow clipboard access when prompted');
        return;
      }
    }

    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      }
    } catch {
      setError('Please allow clipboard access or use Ctrl+V/⌘+V');
    }
  };

  const handleSubmit = async (submittedUrl: string) => {
    try {
      setStatus('uploading');
      setError(null);
      setDownloadUrl(null);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: submittedUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload URL');
      }

      const { jobId } = await response.json();
      setStatus('processing');
      await pollJobStatus(jobId);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to upload URL');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && url) {
      handleSubmit(url);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('text');
    console.log('Pasted data:', pastedData);
  };

  const handleConversion = async (format: string) => {
    if (!currentJob) return;
    try {
      setStatus('processing');
      const response = await fetch(`/api/media/convert/${currentJob.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Conversion failed');
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const originalName = currentJob.file.originalName;
      const newFilename = originalName.replace(/\.[^/.]+$/, '') + '.' + format;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = newFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
      setStatus('error');
    }
  };

  const handleOperation = async (operationId: string, options?: Record<string, unknown>) => {
    try {
      setStatus('processing');
      const response = await fetch(`/api/media/operation/${currentJob?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: operationId, options })
      });

      if (!response.ok) throw new Error('Operation failed');
      
      const result = await response.json();
      window.location.href = result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
      setStatus('error');
    }
  };

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
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                onPaste={handlePaste}
                placeholder="paste the link here, press enter to upload"
                className="px-4 py-2 text-sm text-foreground placeholder:text-foreground/70 pl-9 pr-16"
              />
              <Button 
                className="absolute right-0 top-0 bottom-0 text-foreground hover:bg-foreground/10 rounded-l-none h-full"
                variant="ghost"
                size="sm"
                onClick={handlePasteButtonClick}
              >
                paste
              </Button>
            </div>
          </div>
          
          {/* Divider */}
          <div className="flex items-center w-full">
            <div className="flex-grow h-px bg-border"></div>
            <span className="px-3 text-xs text-muted-foreground font-medium">or</span>
            <div className="flex-grow h-px bg-border"></div>
          </div>
          
          {/* File Upload */}
          <div className="text-center">
            <label>
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleUpload(e.target.files[0]);
                  }
                }}
                accept="*/*" 
              />
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-foreground hover:bg-foreground/10"
                type="button"
                onClick={() => {
                  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                  fileInput?.click();
                }}
              >
                <Upload className="w-4 h-4" />
                choose a file
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

          {/* Status Overlay */}
          {status !== 'idle' && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
                {status === 'uploading' && (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Uploading file...</span>
                  </div>
                )}
                
                {status === 'processing' && (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Processing file...</span>
                  </div>
                )}
                
                {status === 'complete' && downloadUrl && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-green-500">
                      <Check className="h-6 w-6" />
                      <span>File ready!</span>
                    </div>

                    {/* Show available operations based on file type */}
                    {currentJob?.manipulationOptions && (
                      <div className="space-y-4 border-t pt-4">
                        <h3 className="font-medium">Available Operations</h3>
                        
                        {/* Conversion Options */}
                        {currentJob.manipulationOptions.conversions.length > 0 && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Convert to:</label>
                            <div className="flex flex-wrap gap-2">
                              {currentJob.manipulationOptions.conversions.map((conv: { format: string; label: string }) => (
                                <Button
                                  key={conv.format}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleConversion(conv.format)}
                                >
                                  {conv.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Operation Options */}
                        {currentJob.manipulationOptions.operations.length > 0 && (
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Operations:</label>
                            <div className="flex flex-wrap gap-2">
                              {currentJob.manipulationOptions.operations.map((op: { id: string; label: string; options?: Record<string, unknown> }) => (
                                <Button
                                  key={op.id}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOperation(op.id, op.options)}
                                >
                                  {op.label}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <Button 
                      className="w-full"
                      onClick={() => {
                        window.location.href = downloadUrl;
                        setStatus('idle');
                      }}
                    >
                      Download Original
                    </Button>
                  </div>
                )}
                
                {status === 'error' && (
                  <div className="text-destructive">
                    <p>{error}</p>
                    <Button 
                      variant="ghost" 
                      className="mt-4"
                      onClick={() => setStatus('idle')}
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

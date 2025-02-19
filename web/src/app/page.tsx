import Link from "next/link";
import Image from "next/image";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link as LinkIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-3xl mx-auto w-full">
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
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#586e75]/70">
                <LinkIcon className="h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="paste the link here"
                className="px-4 py-2 text-sm text-[#586e75] placeholder:text-[#586e75]/70 pl-9 pr-16"
              />
              <Button 
                className="absolute right-0 top-0 bottom-0 text-[#586e75] hover:bg-[#00000010] dark:hover:bg-[#ffffff10] rounded-l-none h-full"
                variant="ghost"
                size="sm"
              >
                paste
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="ghost"
              size="sm"
              className="gap-1.5 text-[#586e75] hover:bg-[#00000010] dark:hover:bg-[#ffffff10]"
            >
              <span className="text-lg">✨</span>
              auto
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              className="gap-1.5 text-[#586e75] hover:bg-[#00000010] dark:hover:bg-[#ffffff10]"
            >
              <span className="text-lg">🎵</span>
              audio
            </Button>
            <Button 
              variant="ghost"
              size="sm"
              className="gap-1.5 text-[#586e75] hover:bg-[#00000010] dark:hover:bg-[#ffffff10]"
            >
              <span className="text-lg">🔇</span>
              mute
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-[#586e75] mt-8">
            by using this website, you agree to the{" "}
            <Link 
              href="/terms" 
              className="font-medium underline underline-offset-4 hover:text-[#586e75]/70"
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

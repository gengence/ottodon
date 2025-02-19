import Link from "next/link";
import Image from "next/image";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-custom-bgblue">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-8 max-w-3xl mx-auto w-full">
          {/* Logo */}
          <div className="relative w-48 h-48 -mt-12">
            <Image
              src="/placeholder-logo.png"
              alt="Logo"
              fill
              sizes="(max-width: 768px) 100vw, 192px"
              className="object-contain"
              priority
            />
          </div>

          {/* Input Field */}
          <div className="w-full relative">
            <Input
              type="text"
              placeholder="paste the link here"
              className="px-4 py-2 text-sm"
            />
            <Button 
              className="absolute right-2 top-1/2 -translate-y-1/2"
              variant="secondary"
              size="sm"
            >
              paste
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              variant="default"
              size="sm"
              className="gap-1.5"
            >
              <span className="text-lg">✨</span>
              auto
            </Button>
            <Button 
              variant="secondary"
              size="sm"
              className="gap-1.5"
            >
              <span className="text-lg">🎵</span>
              audio
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="gap-1.5"
            >
              <span className="text-lg">🔇</span>
              mute
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8">
            By using this website, you agree to the{" "}
            <Link 
              href="/terms" 
              className="font-medium underline underline-offset-4 hover:text-gray-800"
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

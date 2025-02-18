import Link from "next/link";
import Image from "next/image";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-custom-bgblue">
      <Sidebar />

      <main className="flex-1 p-8 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-custom-textblue">Welcome</h1>
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-800"
          >
            + Hello, Captain Ahab
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center gap-12 max-w-4xl mx-auto w-full">
          {/* Logo */}
          <div className="relative w-80 h-80 -mt-20">
            <Image
              src="/placeholder-logo.png"
              alt="Logo"
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-contain"
              priority
            />
          </div>

          {/* Input Field */}
          <div className="w-full relative">
            <Input
              type="text"
              placeholder="paste the link here"
              className="w-full px-6 py-8 text-xl h-auto rounded-lg"
            />
            <Button 
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 h-auto"
              variant="secondary"
            >
              paste
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              size="lg"
              className="h-auto py-4 px-8 text-lg font-medium"
            >
              <span className="text-2xl mr-2">✨</span>
              auto
            </Button>
            <Button 
              variant="secondary"
              size="lg"
              className="h-auto py-4 px-8 text-lg font-medium"
            >
              <span className="text-2xl mr-2">🎵</span>
              audio
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="h-auto py-4 px-8 text-lg font-medium"
            >
              <span className="text-2xl mr-2">🔇</span>
              mute
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 mt-12">
          By using this website, you agree to the{" "}
          <Link 
            href="/terms" 
            className="font-medium underline underline-offset-4 hover:text-gray-800"
          >
            terms and ethical usages
          </Link>{" "}
          of what you download.
        </div>
      </main>
    </div>
  );
}

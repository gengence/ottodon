import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-custom-bgblue">
      {/* Sidebar */}
      <nav className="w-40 bg-blue-600 text-white flex flex-col items-center py-8">
        {/* Top section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="text-4xl font-bold">&gt;&gt;</div>
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors group">
            <div className="flex flex-col items-center">
              <span className="text-6xl mb-3">⬇️</span>
              <span className="text-3xl">download</span>
            </div>
          </button>
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors group">
            <div className="flex flex-col items-center">
              <span className="text-6xl mb-3">🔄</span>
              <span className="text-3xl">remux</span>
            </div>
          </button>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col items-center space-y-6 mt-auto pt-8">
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors">
            <div className="flex flex-col items-center">
              <span className="text-6xl mb-3">⚙️</span>
              <span className="text-3xl">settings</span>
            </div>
          </button>
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors">
            <div className="flex flex-col items-center">
              <span className="text-6xl mb-3">❤️</span>
              <span className="text-3xl">donate</span>
            </div>
          </button>
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors">
            <div className="flex flex-col items-center">
              <span className="text-6xl mb-3">⭐️</span>
              <span className="text-3xl">updates</span>
            </div>
          </button>
          <button className="p-3 hover:bg-gray-800 rounded-lg transition-colors">
            <div className="flex flex-col items-center">
              <span className="text-6xl mb-3">ℹ️</span>
              <span className="text-3xl">about</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 flex flex-col items-center justify-between">
        {/* Header */}
        <div className="w-full max-w-3xl flex justify-end mb-4">
          <button className="text-gray-600 hover:text-gray-800">
            + Hello, Captain Ahab.
          </button>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-4xl flex flex-col items-center space-y-12">
          {/* Logo */}
          <div className="relative w-80 h-80">
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
            <input
              type="text"
              placeholder="paste the link here"
              className="w-full px-14 py-8 pr-32 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 text-3xl"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 px-10 py-5 bg-gray-100 rounded-md text-xl">
              paste
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-6">
            <button className="px-12 py-6 bg-gray-400 text-blue-100 rounded-md flex items-center space-x-3 text-2xl">
              <span className="text-4xl">✨</span>
              <span>auto</span>
            </button>
            <button className="px-12 py-6 bg-gray-200 border border-gray-400 rounded-md flex items-center space-x-3 text-2xl">
              <span className="text-4xl">🎵</span>
              <span>audio</span>
            </button>
            <button className="px-12 py-6 bg-white border border-gray-200 rounded-md flex items-center space-x-3 text-2xl">
              <span className="text-4xl">🔇</span>
              <span>mute</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full max-w-4xl text-center text-base text-gray-600 mt-12">
          By using this website, you agree to the{" "}
          <Link href="/terms" className="underline">
            terms and ethical usages
          </Link>{" "}
          of what you download.
        </div>
      </main>
    </div>
  );
}

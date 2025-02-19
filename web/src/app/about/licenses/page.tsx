export default function Licenses() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6 text-foreground">Licenses & Attribution</h1>
      
      <div className="space-y-6 text-foreground">
        <h2 className="text-2xl font-semibold mb-4">Open Source</h2>
        <p>
          Ottodon is open source software, licensed under the MIT License.
          You can find the source code and contribute on our <a href="https://github.com/gengence/ottodon" target="_blank" rel="noopener noreferrer" className="text-primary">GitHub repository</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Core</h2>
        <div className="space-y-4">
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-medium mb-2">Next.js</h3>
            <p className="text-sm">
              The React Framework for Production - MIT License
            </p>
          </div>
          
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-medium mb-2">FFmpeg</h3>
            <p className="text-sm">
              Complete, cross-platform solution for media processing - LGPL v2.1+
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-medium mb-2">yt-dlp</h3>
            <p className="text-sm">
              Media download library - Unlicense
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">UI Components</h2>
        <div className="space-y-4">
          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-medium mb-2">shadcn/ui</h3>
            <p className="text-sm">
              Beautifully designed components - MIT License
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-medium mb-2">Lucide Icons</h3>
            <p className="text-sm">
              Beautiful & consistent icons - ISC License
            </p>
          </div>

          <div className="bg-card p-4 rounded-lg border">
            <h3 className="font-medium mb-2">Tailwind CSS</h3>
            <p className="text-sm">
              Utility-first CSS framework - MIT License
            </p>
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border mt-8">
          <p className="text-sm">
            We&apos;re grateful to all the open source projects that make Ottodon possible.
            Full license texts are available in our <a href="https://github.com/gengence/ottodon" target="_blank" rel="noopener noreferrer" className="text-primary">GitHub repository</a>.
          </p>
        </div>
      </div>
    </div>
  );
} 
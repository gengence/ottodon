export default function TermsPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6 text-[#586e75]">Terms of Use</h1>
      
      <div className="space-y-6 text-[#586e75]">
        <div className="bg-card p-4 rounded-lg border mb-8">
          <p className="text-sm">
            Made with ❤️ by General Intelligence LLC
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Usage Guidelines</h2>
        <p>
          By using Ottodon, you agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Use the service responsibly and legally</li>
          <li>Not abuse or attempt to exploit the service</li>
          <li>Respect intellectual property rights</li>
          <li>Not use the service for malicious purposes</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Service Limitations</h2>
        <p>
          Ottodon is provided as-is, without any warranties. We reserve the right to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Modify or discontinue the service at any time</li>
          <li>Block access to users who violate these terms</li>
          <li>Update these terms as needed</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Ethical Usage</h2>
        <p>
          We expect users to exercise good judgment and respect copyright laws when using
          Ottodon. The service is intended for personal use with content you have the right
          to download.
        </p>
      </div>
    </div>
  );
} 
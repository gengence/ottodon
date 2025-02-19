export default function Privacy() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6 text-foreground">Privacy Policy</h1>
      
      <div className="space-y-6 text-foreground">
        <h2 className="text-2xl font-semibold mb-4">Zero Data Collection</h2>
        <p>
          We take your privacy seriously. Ottodon operates on a strict zero-data collection policy:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>No personal information is collected</li>
          <li>No usage statistics are tracked</li>
          <li>No cookies are used</li>
          <li>No IP addresses are logged</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Local Processing</h2>
        <p>
          All media processing happens locally on your device. When you use Ottodon:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Files are processed entirely on your device</li>
          <li>No data is sent to external servers</li>
          <li>All operations are performed offline when possible</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Temporary Data</h2>
        <p>
          In cases where remote processing is necessary:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Data is encrypted using industry-standard AES-256</li>
          <li>Information is stored in memory only, never on disk</li>
          <li>All data is automatically purged after 90 seconds</li>
          <li>Processing servers operate on a no-logs policy</li>
        </ul>

        <div className="bg-card p-4 rounded-lg border mt-8">
          <p className="text-sm">
            This privacy policy applies to the official Ottodon instance. If you&apos;re using a third-party instance,
            please refer to their privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
} 
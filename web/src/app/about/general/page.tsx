export default function General() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6 text-foreground">What&apos;s Ottodon?</h1>
      
      <div className="space-y-6 text-foreground">
        <p>
          Ottodon is a utility that allows you to save and manipulate video, audio, photo,
          or gif file formats universally. Just paste a link or upload a file. It&apos;ll work.
        </p>

        <p>
          No ads, trackers, paywalls, or other nonsense.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Privacy First</h2>
        <p>
          All requests to the backend are anonymous and all information about downloads is
          encrypted. We have a strict zero log policy and we don&apos;t track anything.
        </p>
      </div>
    </div>
  );
} 
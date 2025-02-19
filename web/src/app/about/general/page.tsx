export default function GeneralPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6 text-foreground">What&apos;s Ottodon?</h1>
      
      <div className="space-y-6 text-foreground">
        <p>
          Ottodon helps you save anything from your favorite websites: video, audio, photos,
          or gifs. Just paste the link and you&apos;re ready to rock!
        </p>

        <p>
          No ads, trackers, paywalls, or other nonsense. Just a convenient web app that
          works anywhere, whenever you need it.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p>
          Ottodon was created for public benefit, to protect people from ads and malware
          pushed by its alternatives. We believe that the best software is safe, open, and
          accessible.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Privacy First</h2>
        <p>
          All requests to the backend are anonymous and all information about downloads is
          encrypted. We have a strict zero log policy and don&apos;t track anything about
          individual people.
        </p>
      </div>
    </div>
  );
} 
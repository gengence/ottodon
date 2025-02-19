import { Badge } from "@/components/ui/badge"

interface ChangelogEntry {
  version?: string;
  date: string;
  title: string;
  description: string[];
  tags: string[];
}

const changelogEntries: ChangelogEntry[] = [
  {
    version: "1.3.0",
    date: "March 2024",
    title: "Enhanced Media Processing",
    description: [
      "Improved video processing with better quality and faster speeds",
      "Added support for 15+ new platforms",
      "Introduced advanced format selection options",
      "Optimized memory usage during processing"
    ],
    tags: ["Feature", "Performance"]
  },
  {
    version: "1.2.0",
    date: "March 2024",
    title: "Dark Mode & UI Updates",
    description: [
      "Introduced system-wide dark mode support",
      "Added smooth transitions between themes",
      "Improved component consistency",
      "Enhanced mobile responsiveness"
    ],
    tags: ["UI", "Feature"]
  },
  {
    version: "1.1.1",
    date: "February 2024",
    title: "Privacy Enhancements",
    description: [
      "Strengthened zero-logs policy implementation",
      "Added offline-first processing mode",
      "Improved local file handling",
      "Enhanced encryption for temporary data"
    ],
    tags: ["Privacy", "Security"]
  },
  {
    version: "1.1.0",
    date: "January 2024",
    title: "Audio Features Update",
    description: [
      "Added advanced audio extraction options",
      "Introduced quality presets for common formats",
      "Improved metadata preservation",
      "Added batch processing for audio files"
    ],
    tags: ["Feature", "Audio"]
  },
  {
    version: "1.0.0",
    date: "December 2023",
    title: "Initial Release",
    description: [
      "Core video download functionality",
      "Basic format conversion support",
      "Simple audio extraction",
      "Cross-platform compatibility"
    ],
    tags: ["Release"]
  }
];

export default function ChangelogPage() {
  return (
    <div className="pl-[100px] min-h-screen bg-background flex justify-center">
      <main className="w-[800px] p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4 text-foreground">Changelog</h1>
          <p className="text-foreground/70">New updates and improvements</p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[8.5rem] top-0 bottom-0 w-px bg-foreground/10" />
          
          <div className="space-y-16">
            {changelogEntries.map((entry, index) => (
              <div key={index} className="relative grid grid-cols-[8rem_1fr] gap-12">
                {/* Date column */}
                <div className="text-sm text-foreground/70">
                  <div>{entry.date}</div>
                  {entry.version && (
                    <div className="mt-1 font-mono">{entry.version}</div>
                  )}
                </div>

                {/* Content column */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    {/* Timeline dot */}
                    <div className="absolute left-[8.25rem] top-[0.5rem] w-2 h-2 rounded-full bg-foreground ring-4 ring-background" />
                    
                    <h2 className="text-xl font-medium text-foreground">
                      {entry.title}
                    </h2>
                    
                    <div className="flex gap-2">
                      {entry.tags.map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="secondary"
                          className="bg-foreground/5 text-foreground hover:bg-foreground/10"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <ul className="space-y-2 text-foreground">
                    {entry.description.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="mr-3 mt-2 w-1 h-1 rounded-full bg-foreground" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 
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
    version: "1.0.0",
    date: "FEB 26, 2025",
    title: "Initial Release",
    description: [
      "Core video download functionality",
      "Basic format conversion support",
      "Simple audio extraction"
    ],
    tags: []
  }
];

export default function Changelog() {
  return (
    <div className="min-h-screen bg-background flex justify-center pl-[240px]">
      <main className="max-w-[1400px] w-full px-8 py-16">
        <div className="mb-24 -ml-16">
          <h1 className="text-7xl font-bold mb-6 text-foreground [text-shadow:_0_4px_8px_rgb(0_0_0_/_40%)] dark:[text-shadow:_0_0_20px_rgb(255_255_255_/_50%),_0_0_35px_rgb(255_255_255_/_40%),_0_0_50px_rgb(255_255_255_/_25%)]">Changelog</h1>
          <p className="text-2xl text-foreground/70 [text-shadow:_0_2px_4px_rgb(0_0_0_/_30%)] dark:[text-shadow:_0_0_15px_rgb(255_255_255_/_40%),_0_0_30px_rgb(255_255_255_/_25%)]">New updates and improvements</p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 -ml-[1px] top-0 bottom-0 w-[2px] bg-foreground/10" />
          
          <div className="space-y-32">
            {changelogEntries.map((entry, index) => (
              <div key={index} className="relative grid grid-cols-[1fr_1fr] gap-24">
                {/* Date column */}
                <div className="text-right pr-24 flex flex-col items-end gap-3">
                  {entry.version && (
                    <Badge variant="outline" className="text-2xl py-2 px-6 font-mono">
                      {entry.version}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-2xl py-2 px-6">
                    {entry.date}
                  </Badge>
                </div>

                {/* Content column */}
                <div className="pl-24">
                  <div className="mb-8">
                    {/* Timeline dot */}
                    <div className="absolute left-1/2 -ml-[8px] top-[1rem] w-4 h-4 rounded-full bg-foreground ring-4 ring-background" />
                    
                    <h2 className="text-4xl font-medium text-foreground mb-2">
                      {entry.title}
                    </h2>
                  </div>

                  <ul className="space-y-6 text-xl text-foreground">
                    {entry.description.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <span className="mr-4 mt-[0.7rem] w-2 h-2 rounded-full bg-foreground" />
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
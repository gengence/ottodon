import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export default function Social() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6 text-foreground">Connect With Us</h1>
      
      <div className="space-y-6 text-foreground">
        <p className="mb-8">
          Follow our development and contribute to the project:
        </p>

        <div className="flex flex-col gap-4">
          <a 
            href="https://github.com/yourusername/ottodon" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="gap-2 text-foreground hover:bg-[#00000010] dark:hover:bg-[#ffffff10]"
            >
              <Github className="w-5 h-5" />
              GitHub Repository
            </Button>
          </a>
        </div>

        <div className="mt-12 text-sm">
          <p>
            Want to contribute or report an issue? Visit our GitHub repository.
          </p>
        </div>
      </div>
    </div>
  );
} 
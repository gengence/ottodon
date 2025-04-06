import { Github } from "lucide-react";
import { SocialCard } from "../components/social-card";

export default function Social() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-semibold mb-6 text-foreground">Social</h1>
      
      <div className="space-y-6 text-foreground">
        <p>
          Connect with Ottodon&apos;s community and development:
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <SocialCard
            href="https://github.com/gengence/ottodon"
            icon={Github}
            title="github"
            description="ottodon's source code, development, and issues"
            className="hover:bg-[#6e5494]/10"
          />
        </div>
        
        <div className="bg-card p-4 rounded-lg border">
          <p className="text-sm text-foreground">
            Want to contribute or report an issue? We encourage you to visit our GitHub repository and start a pull request.
          </p>
        </div>
      </div>
    </div>
  );
} 
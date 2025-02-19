import { LucideIcon, ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SocialCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function SocialCard({
  href,
  icon: Icon,
  title,
  description,
  className,
}: SocialCardProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative block w-full overflow-hidden rounded-xl p-6 transition-all hover:scale-[1.02]",
        "bg-background/40 backdrop-blur-sm",
        className
      )}
    >
      <div className="absolute inset-0 transition-opacity group-hover:opacity-90" />
      
      <div className="relative z-10 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute inset-0 bg-[#8465b3] rounded-full blur-[12px] opacity-85" />
            <Icon className="relative z-10 h-6 w-6 text-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
          <ExternalLink className="h-4 w-4 text-muted-foreground opacity-50" />
        </div>
        <p className="text-sm text-foreground">{description}</p>
      </div>
    </Link>
  );
} 
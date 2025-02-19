"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const aboutNavItems = [
  { href: "/about/general", label: "What's Ottodon?" },
  { href: "/about/terms", label: "Terms" },
  { href: "/about/licenses", label: "Licenses" },
  { href: "/about/privacy", label: "Privacy" },
  { href: "/about/social", label: "Social" },
];

export function AboutNavigation() {
  const pathname = usePathname();

  return (
    <div className="w-72 border-r-[0.5px] pr-4 bg-background/50 backdrop-blur-sm">
      <div className="py-4 pb-2 pl-1">
        <h2 className="text-lg font-semibold text-foreground">About</h2>
      </div>
      <nav className="p-1 flex flex-col">
        {aboutNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full rounded-xl transition-all flex items-center justify-start px-3 py-2",
                  !isActive && "text-foreground",
                  "hover:bg-[#00000010] dark:hover:bg-[#ffffff10]",
                  "hover:text-current",
                  isActive && "bg-[#00000010] dark:bg-[#ffffff10] hover:bg-[#00000010] dark:hover:bg-[#ffffff10] cursor-default"
                )}
                disabled={isActive}
              >
                <span className="text-lg font-medium">
                  {item.label}
                </span>
              </Button>
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const aboutNavItems = [
  { href: "/about/general", label: "What's Ottodon?" },
  { href: "/about/terms", label: "Terms" },
  { href: "/about/licenses", label: "Licenses" },
  { href: "/about/privacy", label: "Privacy" },
  { href: "/about/socials", label: "Socials" },
];

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pl-[100px] flex flex-1">
      {/* About Navigation Sidebar */}
      <div className="w-64 border-r bg-card/50 backdrop-blur-sm">
        <nav className="p-4 flex flex-col gap-1">
          {aboutNavItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start text-[#586e75]",
                  "hover:bg-[#00000010] dark:hover:bg-[#ffffff10]"
                )}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
} 
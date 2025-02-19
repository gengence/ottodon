'use client'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Download, RefreshCw, Settings, History, Info, type LucideIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  className?: string;
  href?: string;
}

const SidebarButton = ({ icon: Icon, label, className, href }: SidebarButtonProps) => {
  const button = (
    <Button 
      variant="ghost" 
      className={cn(
        "w-full h-auto rounded-md transition-all flex flex-col items-center justify-center",
        "min-h-[80px] p-0 text-[#586e75]",
        "hover:bg-[#00000010] dark:hover:bg-[#ffffff10]",
        "active:scale-90 transform duration-100",
        "[&>svg]:!w-[24px] [&>svg]:!h-[24px] [&>svg]:stroke-[1.2]",
        className
      )}
    >
      <Icon />
      <span className="text-xs font-light tracking-wide mt-0.5">{label}</span>
    </Button>
  )

  if (href) {
    return <Link href={href}>{button}</Link>
  }

  return button
}

export function Sidebar() {
  const topButtons = [
    { icon: Download, label: 'save', href: '/' },
    { icon: RefreshCw, label: 'remux' },
  ]

  const bottomButtons = [
    { icon: Settings, label: 'settings', href: '/settings/default' },
    { icon: History, label: 'changelog', href: '/changelog' },
    { icon: Info, label: 'about', href: '/about/general' },
  ]

  return (
    <aside className="fixed left-0 top-0 w-[100px] bg-card backdrop-blur-sm text-card-foreground flex flex-col h-screen border-r">
      <div className="py-4 flex flex-col">
        <div className="px-2 mb-4 flex justify-center">
          <ThemeToggle />
        </div>
        
        <nav className="flex flex-col">
          {topButtons.map((button, index) => (
            <SidebarButton key={index} {...button} />
          ))}
        </nav>
      </div>

      <div className="mt-auto flex flex-col">
        {bottomButtons.map((button, index) => (
          <SidebarButton key={index} {...button} />
        ))}
      </div>
    </aside>
  )
} 
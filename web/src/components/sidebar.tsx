'use client'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Download, RefreshCw, Settings, History, Info, type LucideIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useState } from "react"

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  href?: string;
}

const SidebarButton = ({ icon: Icon, label, isActive, onClick, className, href }: SidebarButtonProps) => {
  const button = (
    <Button 
      variant="ghost" 
      className={cn(
        "w-full h-auto rounded-xl transition-all flex flex-col items-center justify-center",
        "min-h-[70px] p-0",
        !isActive && "text-foreground",
        "hover:bg-[#00000010] dark:hover:bg-[#ffffff10]",
        "hover:text-current",
        "active:scale-90 transform duration-75 hover:scale-105",
        "[&>svg]:!w-[22px] [&>svg]:!h-[22px] [&>svg]:stroke-[1.2]",
        isActive && "bg-[#00000010] dark:bg-[#ffffff10] hover:bg-[#00000010] dark:hover:bg-[#ffffff10] cursor-default",
        className
      )}
      onClick={href ? undefined : onClick}
      disabled={isActive}
    >
      <Icon />
      <span className="text-[11px] font-light tracking-wide mt-0.5">{label}</span>
    </Button>
  )

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="w-full block">
        {button}
      </Link>
    );
  }

  return button
}

export function Sidebar() {
  const [activeButton, setActiveButton] = useState<string | null>(null);

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
    <aside className="fixed left-0 top-0 w-[70px] bg-card backdrop-blur-sm text-card-foreground flex flex-col h-screen border-r">
      <div className="py-4 flex flex-col">
        <div className="px-2 mb-4 flex justify-center">
          <ThemeToggle />
        </div>
        
        <nav className="flex flex-col">
          {topButtons.map((button, index) => (
            <SidebarButton 
              key={index} 
              {...button} 
              isActive={activeButton === button.label}
              onClick={() => setActiveButton(button.label)}
            />
          ))}
        </nav>
      </div>

      <div className="mt-auto flex flex-col">
        {bottomButtons.map((button, index) => (
          <SidebarButton 
            key={index} 
            {...button} 
            isActive={activeButton === button.label}
            onClick={() => setActiveButton(button.label)}
          />
        ))}
      </div>
    </aside>
  )
} 
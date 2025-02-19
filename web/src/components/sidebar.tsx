'use client'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Download, RefreshCw, Settings, History, Info, type LucideIcon } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

const SidebarButton = ({ icon: Icon, label, className }: SidebarButtonProps) => (
  <Button 
    variant="ghost" 
    className={cn(
      "w-full h-auto rounded-lg transition-all flex flex-col items-center justify-center",
      "min-h-[80px] p-0 text-[#586e75]",
      "hover:bg-[#00000010] dark:hover:bg-[#ffffff10]",
      "[&>svg]:!w-[24px] [&>svg]:!h-[24px] [&>svg]:stroke-[1.2]",
      className
    )}
  >
    <Icon />
    <span className="text-xs font-light tracking-wide mt-0.5">{label}</span>
  </Button>
)

export function Sidebar() {
  const topButtons = [
    { icon: Download, label: 'save' },
    { icon: RefreshCw, label: 'remux' },
  ]

  const bottomButtons = [
    { icon: Settings, label: 'settings' },
    { icon: History, label: 'changelog' },
    { icon: Info, label: 'about' },
  ]

  return (
    <aside className="w-[100px] bg-card backdrop-blur-sm text-card-foreground flex flex-col h-screen border-r">
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
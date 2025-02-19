'use client'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Download, RefreshCw, Settings, Star, Info, type LucideIcon } from "lucide-react"

interface SidebarButtonProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

const SidebarButton = ({ icon: Icon, label, className }: SidebarButtonProps) => (
  <Button 
    variant="ghost" 
    className={cn(
      "w-full h-auto hover:bg-white/5 rounded-lg transition-all flex flex-col items-center justify-center",
      "text-white hover:text-white focus:text-white min-h-[80px] p-0",
      "border-none focus:ring-1 focus:ring-white/10",
      "[&>svg]:!w-[24px] [&>svg]:!h-[24px] [&>svg]:stroke-[1.2]",
      className
    )}
  >
    <Icon />
    <span className="text-xs font-light tracking-wide mt-1.5">{label}</span>
  </Button>
)

export function Sidebar() {
  const topButtons = [
    { icon: Download, label: 'save' },
    { icon: RefreshCw, label: 'remux' },
  ]

  const bottomButtons = [
    { icon: Settings, label: 'settings' },
    { icon: Star, label: 'changelog' },
    { icon: Info, label: 'about' },
  ]

  return (
    <aside className="w-[100px] bg-blue-600/90 backdrop-blur-sm text-white flex flex-col h-screen shadow-lg">
      <div className="py-4 flex flex-col">
        <div className="px-2 mb-4 text-center">
          <span className="text-2xl font-bold">&gt;&gt;</span>
        </div>
        
        <nav className="flex flex-col">
          {topButtons.map((button, index) => (
            <SidebarButton key={index} {...button} />
          ))}
        </nav>
      </div>

      <div className="mt-auto flex flex-col border-t border-white/5">
        {bottomButtons.map((button, index) => (
          <SidebarButton key={index} {...button} />
        ))}
      </div>
    </aside>
  )
} 
'use client'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Download,
  RefreshCw,
  Settings,
  Heart,
  Star,
  Info,
  type LucideIcon
} from "lucide-react"

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
      "text-white hover:text-white focus:text-white min-h-[160px] p-0",
      "border-none focus:ring-1 focus:ring-white/10",
      "[&>svg]:!w-[48px] [&>svg]:!h-[48px] [&>svg]:stroke-[1.2]", // Using exact pixel values
      className
    )}
  >
    <Icon />
    <span className="text-lg font-light tracking-wide mt-3">{label}</span>
  </Button>
)

export function Sidebar() {
  const topButtons = [
    { icon: Download, label: 'download' },
    { icon: RefreshCw, label: 'remux' },
  ]

  const bottomButtons = [
    { icon: Settings, label: 'settings' },
    { icon: Heart, label: 'donate' },
    { icon: Star, label: 'updates' },
    { icon: Info, label: 'about' },
  ]

  return (
    <aside className="w-[180px] bg-blue-600/90 backdrop-blur-sm text-white flex flex-col h-screen shadow-lg">
      <div className="py-8 flex flex-col">
        <div className="px-6 mb-12 text-center">
          <span className="text-4xl font-bold">&gt;&gt;</span>
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
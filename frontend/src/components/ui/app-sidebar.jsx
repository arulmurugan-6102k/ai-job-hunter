import {Home, Settings, Zap, ChartCandlestick, MessagesSquare } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "#",
    icon: ChartCandlestick,
  },
  {
    title: "AI Chat",
    url: "#",
    icon: MessagesSquare,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },

]

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
    <SidebarHeader className="flex space-x-2 p-4 group-data-[collapsible=icon]:items-center">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap/>
          <span className="font-bold text-xl group-data-[collapsible=icon]:hidden">
            Scrapy
          </span>
        </div>
      </div>
    </SidebarHeader>
  
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title} >
                <SidebarMenuButton asChild tooltip={item.title} className="hover:bg-gray-100 hover:text-gray-800">
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
  )
}
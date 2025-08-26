import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { AppHeader } from "@/components/ui/app-header"

export default function App() {

  return (
    <SidebarProvider>
      <AppSidebar />
      <AppHeader />
    </SidebarProvider>
  )
}

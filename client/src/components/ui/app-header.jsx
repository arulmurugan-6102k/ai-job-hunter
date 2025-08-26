
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BotMessageSquare, Zap, Search, Sun, Moon, Monitor } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function AppHeader() {

    return (
        <header className="w-full border-b border-gray-200 bg-card mb-6 h-16">
            <div className="px-4 py-3">
                <div className="flex flex-col items-start space-y-4">
                    <div className="flex items-center space-x-4 w-full justify-between">
                        <div className="flex space-x-4  items-center">
                            <SidebarTrigger />
                            <div
                                data-orientation="vertical"
                                role="none"
                                className="bg-border shrink-0 w-[1px] mr-2 h-4"
                            />
                            <div className="relative flex items-center">
                                <Search className="absolute left-3 h-4 w-4 text-muted-foreground z-10" />
                                <Button variant="outline" className="min-w-[250px] pl-10 pr-10 justify-between">
                                    <span>Search...</span>
                                </Button>
                                <kbd className="absolute right-3 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                    ⌘ K
                                </kbd>
                            </div>

                            <Button variant="outline">
                                <BotMessageSquare className="w-4 h-4 mr-2" />
                                Ask AI
                            </Button>

                            <Button variant="outline">
                                <Zap className="w-4 h-4 mr-2" />
                                Start Scrap
                            </Button>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Sun className="mr-2 h-4 w-4" />
                                    <span>Light</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Moon className="mr-2 h-4 w-4" />
                                    <span>Dark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Monitor className="mr-2 h-4 w-4" />
                                    <span>System</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    )
}

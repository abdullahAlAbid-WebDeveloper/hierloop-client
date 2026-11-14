import React from "react"
import { Toaster } from "@/components/ui/toast"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashBoardSideber } from "../components/DashBoardSideBer"

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashBoardSideber />
      <main className="min-w-0 flex-1">
        <SidebarTrigger />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  )
}

export default DashBoardLayout

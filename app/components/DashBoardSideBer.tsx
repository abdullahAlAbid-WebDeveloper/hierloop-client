import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "@/lib/auth-client"
import { Plus } from "lucide-react"

const menuItemsByName = {
  seeker: [],
  recruiter: [],
  admin: [],
}

export function DashBoardSideber() {
  const { data: session, isPending } = useSession()
  const role = session?.user?.role || "seeker"

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
        <SidebarGroup>
          <SidebarMenu>
            {
            
              //        menuItemsByName[role].map((item) => (
              // <SidebarMenuItem key={item.id}>
              //   <SidebarMenuButton render={<a href={item.url} />}>
              //     <item.icon />
              //     <span>{item.name}</span>
              //   </SidebarMenuButton>
              // </SidebarMenuItem>
              //   ))
            
            
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

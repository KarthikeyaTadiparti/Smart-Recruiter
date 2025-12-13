import * as React from "react"
import {
  Home,
  ArrowBigUpDash,
  Plus,
  FileText,
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
} from "lucide-react"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAppSelector } from "@/hooks/use-redux"
import { useSidebar } from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/recruiter",
    icon: Home,
  },
  {
    title: "Create Interview",
    url: "/recruiter/create-interview",
    icon: Plus,
  },
  {
    title: "Manage Interivew",
    url: "/recruiter/manage-interview",
    icon: FileText,
  },
]

export function RecruiterSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation()
  const { userData } = useAppSelector((state) => state.auth);
  const user = userData;
  const { open } = useSidebar() 


  return (
    <Sidebar collapsible="icon" {...props} className="z-110">
      <SidebarHeader className="flex flex-row justify-center items-center">
        <ArrowBigUpDash className="p-1 w-[35px] h-[35px] bg-primary text-white rounded-md" />
        {open && <h1 className="text-xl font-bold py-3 text-center">Smart Recruiter</h1>}
      </SidebarHeader>


      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="h-12">
                  <SidebarMenuButton asChild className="h-12" isActive={pathname === item.url} >
                  <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

import * as React from "react"
import { Home, ArrowBigUpDash, Search, FileText } from "lucide-react"
import { useLocation, Link } from "react-router-dom"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAppSelector } from "@/hooks/use-redux"

const items = [
  { title: "Dashboard", url: "/candidate", icon: Home },
  { title: "Explore", url: "/candidate/explore", icon: Search },
  { title: "My Interivews", url: "/candidate/my-interviews", icon: FileText },
]

export function CandidateSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation()
  const { userData } = useAppSelector((state) => state.auth)
  const user = userData?.data?.user
  const { open } = useSidebar() 

  return (
    <Sidebar collapsible="icon" {...props} className="z-110">
      <SidebarHeader className="flex flex-row justify-center items-center">
        <ArrowBigUpDash className="p-1 w-[35px] h-[35px] bg-primary text-white rounded-md" />
        {open && <h1 className="text-xl font-bold py-3 text-center">Smart Recruiter</h1>}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="h-12">
                  <SidebarMenuButton
                    asChild
                    className="h-12"
                    isActive={pathname === item.url}
                  >
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

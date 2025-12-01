import React from "react";
import { RecruiterSidebar } from "./RecruiterSidebar";
import { CandidateSidebar } from "./CandidateSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet, useLocation, Link } from "react-router-dom";

export default function Layout() {
  const location = useLocation();
  const { pathname } = location;

  // Split URL path into segments, e.g. "/candidate/my-interviews" → ["candidate", "my-interviews"]
  const pathSegments: string[] = pathname.split("/").filter(Boolean);

  // Build partial URL for each breadcrumb
  const buildPath = (index: number): string =>
    "/" + pathSegments.slice(0, index + 1).join("/");

  // Format segment text: replace dashes and capitalize
  const formatText = (text: string): string =>
    text
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <SidebarProvider>
      {pathname.startsWith("/candidate") && <CandidateSidebar />}
      {pathname.startsWith("/recruiter") && <RecruiterSidebar />}

      <SidebarInset>
        <header className="z-100 sticky top-0 bg-white shadow-sm flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4">
            {/* Sidebar toggle button */}
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />

            {/* 🧭 Dynamic Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList className="flex items-center flex-wrap">
                {pathSegments.map((segment: string, index: number) => {
                  const isLast = index === pathSegments.length - 1;
                  const segmentPath = buildPath(index);

                  return (
                    <React.Fragment key={segmentPath}>
                      <BreadcrumbItem className="hidden md:inline-flex">
                        {!isLast ? (
                          <BreadcrumbLink asChild>
                            <Link to={segmentPath}>{formatText(segment)}</Link>
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage>{formatText(segment)}</BreadcrumbPage>
                        )}
                      </BreadcrumbItem>

                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 p-6 pt-4 bg-(--color-primary-foreground)">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Home, PaintBucket } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Workspace",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Designs",
    url: "/designs",
    icon: PaintBucket,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  console.log(pathname);
  return (
    <Sidebar className="outline-none border-none">
      <SidebarHeader>
        <a
          className="flex-none text-xl font-bold text-primary p-4"
          href="#"
          aria-label="Brand"
        >
          DesignToCode
        </a>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-5">
              {items.map((item, index) => (
                <a
                  href={item.url}
                  key={index}
                  className={`p-2 text-lg flex gap-2 items-center hover:bg-primary/40 rounded-lg ${
                    pathname == item.url && "bg-primary"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </a>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <h2 className="p-2 text-gray-400 text-sm">@kyyril</h2>
      </SidebarFooter>
    </Sidebar>
  );
}

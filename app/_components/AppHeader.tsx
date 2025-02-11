import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import ProfileAvatar from "./ProfileAvatar";

function AppHeader({ hideSidebar = false }) {
  return (
    <div className="p-4  flex items-center justify-between w-full border-b">
      {!hideSidebar && <SidebarTrigger />}

      <ProfileAvatar />
    </div>
  );
}

export default AppHeader;

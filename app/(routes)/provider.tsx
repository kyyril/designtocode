"use client";
import React, { useEffect } from "react";
import { useAuthContext } from "../provider";
import { useRouter } from "next/navigation";

import axios from "axios";
import AppHeader from "../_components/AppHeader";

function DashboardProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!user?.user && user.user) return router.replace("/");

    user?.user && checkUser();
  }, [user]);

  const checkUser = async () => {
    const result = await axios.post("/api/user", {
      userName: user?.user?.displayName,
      userEmail: user?.user?.email,
    });
    console.log(user);
  };

  return (
    <main className="w-full">
      <AppHeader />
      {/* <SidebarTrigger /> */}
      <div className="p-10">{children}</div>
    </main>
  );
}

export default DashboardProvider;

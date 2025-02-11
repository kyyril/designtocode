"use client";
import { auth } from "@/configs/firebaseConfig";
import { signOut } from "firebase/auth";
import React from "react";
import { useAuthContext } from "../provider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { DoorClosed, Home, Paintbrush } from "lucide-react";

function ProfileAvatar() {
  const user = useAuthContext();
  const router = useRouter();
  const onButtonPress = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.replace("/");
      })
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <div>
      <Popover>
        <PopoverTrigger>
          {user?.user?.photoURL ? (
            <img
              src={user?.user?.photoURL}
              alt="profile"
              className="w-[35px] h-[35px] rounded-full"
              loading="lazy"
            />
          ) : (
            <Skeleton className="w-[35px] h-[35px] rounded-full"></Skeleton>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-[150px]">
          <div className="flex flex-col gap-2">
            <Button variant={"outline"} className="w-full ">
              <a className="flex flex-row gap-2 ml-1" href={"/dashboard"}>
                <Home /> Dashboard
              </a>
            </Button>
            <Button variant={"outline"} className="w-full ">
              <a
                className="flex flex-row gap-2 text-start items-start justify-start w-full"
                href={"/designs"}
              >
                <Paintbrush /> Design
              </a>
            </Button>
            <Button
              variant={"destructive"}
              onClick={onButtonPress}
              className="w-full flex flex-row text-left items-start justify-start"
            >
              <DoorClosed /> Logout
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ProfileAvatar;

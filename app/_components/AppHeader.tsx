import React from "react";
import ProfileAvatar from "./ProfileAvatar";

function AppHeader({ hideSidebar = false }) {
  return (
    <div className="p-3 flex items-center justify-between w-full shadow-md backdrop-blur-xl bg-black/20">
      <ProfileAvatar />
      <div className="flex gap-x-4">
        <button>
          <a
            href={"/dashboard"}
            className="text-gray-500 hover:text-white text-sm md:text-md transition underline h-[40px]"
          >
            Dashboard
          </a>
        </button>

        <button>
          <a
            href={"designs"}
            className="text-gray-500 hover:text-white text-sm md:text-md transition underline h-[40px]"
          >
            Designs
          </a>
        </button>
      </div>
    </div>
  );
}

export default AppHeader;

"use client";

import { Moon, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SidebarTrigger } from "./ui/sidebar";

const AppSidebarTrigger = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };
  return (
    <div className="block md:hidden w-full flex flex-row justify-between p-2">
      <SidebarTrigger className="bg-red-500 p-2 rounded-full bg-white/20" />
      <div
        className="flex items-center space-x-2 cursor-pointer hover:bg-primary p-2 rounded-md transition-colors"
        onClick={changeTheme}
      >
        {mounted && (theme === "dark" ? <SunMedium /> : <Moon />)}
      </div>
    </div>
  );
};

export default AppSidebarTrigger;

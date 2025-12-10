"use client";
import { logout } from "@/lib/actions/auth";
import {
  BriefcaseBusiness,
  Calendar,
  EllipsisVertical,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  Settings2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar";
import { useLogout } from "@/hooks/use-logout";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";

interface IAdminAppSidebar {
  children: React.ReactNode;
}

const items = [
  {
    title: "Home",
    url: "/administrator",
    icon: Home,
  },
  {
    title: "Projects",
    url: "/administrator/projects",
    icon: Inbox,
  },
  {
    title: "Work Experience",
    url: "#",
    icon: BriefcaseBusiness,
  },
];

const AdminAppSidebar = ({ children }: IAdminAppSidebar) => {
  const session = useSession();
  const { logout } = useLogout();
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <div className="px-2">
              <h1>Iregho Web Admin</h1>
            </div>
            <SidebarGroupLabel>
              <span className="text-xs">
                Manage website content like showing projects, work experience
                and blog
              </span>
            </SidebarGroupLabel>

            <Separator className="mt-3" />
            <SidebarGroupContent className="mt-5">
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <div className="absolute w-full bottom-2">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <div className="flex flex-nowrap justify-around gap-3">
                    <div className="flex justify-center">
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex w-full items-center">
                      {/* <UserInfo /> */}
                      <span>
                        {session.data?.user?.name ??
                          "Session expired, please relogin !"}
                      </span>
                    </div>
                    <div className="flex justify-center items-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer">
                          <EllipsisVertical size={17} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuRadioGroup>
                            <DropdownMenuItem disabled>
                              Settings
                              <DropdownMenuShortcut>
                                <Settings2 />
                              </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={logout}
                            >
                              Logout
                              <DropdownMenuShortcut>
                                <LogOut />
                              </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            {/* <Logout /> */}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        </SidebarContent>
      </Sidebar>
      <main className="w-full">
        {/* <SidebarTrigger /> */}
        {children}
      </main>
    </SidebarProvider>
  );
};

export default AdminAppSidebar;

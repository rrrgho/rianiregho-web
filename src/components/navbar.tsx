"use client";

import {
  Book,
  Briefcase,
  ChevronDown,
  Facebook,
  Home,
  Instagram,
  Linkedin,
  Menu,
  Moon,
  Route,
  Sun,
  SunMedium,
} from "lucide-react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { useIsMobile } from "@/hooks/use-mobile";

import { Avatar } from "@/components/ui/avatar";
import { useWorkingExperiences } from "@/hooks/queries/working-experience.query";
import { useDetectPathname } from "@/hooks/use-detect-pathname";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import WorkingExperienceNavList from "./working-experience-nav-list";
import moment from "moment";
import WorkingExperienceNavMobileList from "./working-experience-nav-mobile-list";

export function Navbar() {
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isAdminPage = useDetectPathname({ pathname: "administrator" });

  const workingExperiences = useWorkingExperiences();

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

  useEffect(() => {}, [isAdminPage]);

  if (isAdminPage) return;

  if (mounted) {
    return (
      <Fragment>
        <div className="w-full flex flex-row justify-center md:justify-between px-5 lg:px-40 py-4 md:py-5 md fixed top-0 z-40">
          <NavigationMenu className="w-full" viewport={isMobile}>
            <NavigationMenuList className="w-full flex-wrap">
              <NavigationMenuItem className="mr-1">
                <Avatar
                  onClick={() => {
                    alert("s");
                  }}
                  className="items-center hover:bg-primary cursor-pointer justify-center p-2 border border-2"
                >
                  <Instagram className="text-center" />
                </Avatar>
              </NavigationMenuItem>
              <NavigationMenuItem className="mr-1">
                <Avatar className="items-center hover:bg-primary cursor-pointer justify-center p-2 border border-2">
                  <Facebook className="text-center" />
                </Avatar>
              </NavigationMenuItem>
              <NavigationMenuItem className="mr-1">
                <Avatar className="items-center hover:bg-primary cursor-pointer justify-center p-2 border border-2">
                  <Linkedin className="text-center" />
                </Avatar>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <NavigationMenu className="w-full" viewport={isMobile}>
            <NavigationMenuList className="w-full flex-wrap">
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/">Home</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/docs">Resume</Link>
                </NavigationMenuLink>
              </NavigationMenuItem> */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/projects">Projects</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <div className="animate-bounce">
                  <NavigationMenuTrigger className="bg-primary/50 font-bold text-white hover:bg-primary/20">
                    ✨ Career Journey
                  </NavigationMenuTrigger>
                </div>
                <WorkingExperienceNavList />
              </NavigationMenuItem>
              <NavigationMenuItem className="mr-1 ms-5">
                <ThemeSwitch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => {
                    setTheme(checked ? "dark" : "light");
                  }}
                />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div>
          <Drawer>
            <div className="md:hidden fixed top-5 z-40 w-full flex flex-row justify-between px-5">
              <DrawerTrigger asChild>
                <Button variant="outline">
                  <Menu />
                </Button>
              </DrawerTrigger>
              <ThemeSwitch
                checked={theme === "dark"}
                onCheckedChange={(checked) => {
                  setTheme(checked ? "dark" : "light");
                }}
              />
            </div>
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>You are goergous !</DrawerTitle>
                  <DrawerDescription>
                    Always say thank you for today, new day is new chance to do
                    good thing
                  </DrawerDescription>
                </DrawerHeader>
                <div className="flex flex-row m-2 p-2">
                  <div>
                    <Home />
                  </div>
                  <div className="ms-3">Home</div>
                </div>
                <div className="m-2 p-2 rounded">
                  <Collapsible defaultOpen className="group/collapsible">
                    <CollapsibleTrigger asChild>
                      <div className="flex flex-row relative animate-bounce ">
                        <div>
                          <Route />
                        </div>
                        <div className="ms-3">Carrer Journey</div>
                        <div className="absolute top-0 right-0">
                          <ChevronDown />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <WorkingExperienceNavMobileList />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                <div className="flex flex-row m-2 p-2">
                  <div>
                    <Book />
                  </div>
                  <div className="ms-3">Blogs</div>
                </div>
                <div className="flex flex-row m-2 p-2">
                  <div>
                    <Briefcase />
                  </div>
                  <div className="ms-3">Projects</div>
                </div>
                <DrawerFooter></DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </Fragment>
    );
  }
  return <></>;
}

export function ListItem({
  title,
  icon,
  children,
  href,
  start_date,
  end_date,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon: string | any;
  start_date?: any;
  end_date?: any;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium flex flex-nowrap items-center">
            <div className="h-[30px] w-[35px] relative">
              <Image
                src={process.env.NEXT_PUBLIC_STORAGE_URL + icon}
                alt="Description of SVG"
                fill
                className="rounded"
              />
            </div>
            <div className="ms-2">
              {title} <br />
              <span className="text-xs text-primary">
                {moment(start_date).format("MMMM YYYY")} -{" "}
                {end_date ? moment(end_date).format("MMMM YYYY") : "Present"}
              </span>
            </div>
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

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
  Route,
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
import { useDetectPathname } from "@/hooks/use-detect-pathname";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import moment from "moment";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";
import WorkingExperienceNavList from "./working-experience-nav-list";
import WorkingExperienceNavMobileList from "./working-experience-nav-mobile-list";

const SocialMedia = ({ isMobile }: { isMobile: boolean }) => {
  return (
    <NavigationMenu className="w-full" viewport={isMobile}>
      <NavigationMenuList className="w-full flex-wrap">
        <NavigationMenuItem className="mr-1">
          <Link
            href="https://medium.com/@rianiregho"
            target="_blank"
            className="text-sm"
          >
            <Button variant="outline" className="cursor-pointer">
              Follow on Medium
            </Button>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="mr-1">
          <Link
            href="https://www.facebook.com/profile.php?id=61550814435864"
            target="_blank"
          >
            <Avatar className="items-center hover:bg-primary cursor-pointer justify-center p-2 border border-2">
              <Facebook className="text-center" />
            </Avatar>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className="mr-1">
          <Link href="https://www.linkedin.com/in/rian-gho/" target="_blank">
            <Avatar className="items-center hover:bg-primary cursor-pointer justify-center p-2 border border-2">
              <Linkedin className="text-center" />
            </Avatar>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export function Navbar() {
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAdminPage = useDetectPathname({ pathname: "administrator" });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {}, [isAdminPage]);

  if (isAdminPage) return;

  if (mounted) {
    return (
      <Fragment>
        <div className="w-full flex flex-row justify-center md:justify-between px-5 lg:px-40 py-4 md:py-5 md fixed top-0 z-40">
          <SocialMedia isMobile={isMobile} />
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
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/docs">Docs</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
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
                    ✨ My Career
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
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <div className="md:hidden px-5 fixed top-5 z-40 w-full flex flex-row justify-between ">
              <DrawerTrigger asChild>
                <Button variant="outline">
                  <Menu />
                </Button>
              </DrawerTrigger>
              <SocialMedia isMobile={false} />
              <ThemeSwitch
                checked={theme === "dark"}
                onCheckedChange={(checked) => {
                  setTheme(checked ? "dark" : "light");
                }}
              />
            </div>
            {/* Mobile Menu */}
            <DrawerContent>
              <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                  <DrawerTitle>You are goergous !</DrawerTitle>
                </DrawerHeader>
                <Link href="/" onClick={() => setDrawerOpen(false)}>
                  <div className="flex flex-row m-2 p-2">
                    <div>
                      <Home />
                    </div>
                    <div className="ms-3">Home</div>
                  </div>
                </Link>
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
                      <WorkingExperienceNavMobileList
                        onNavigate={() => setDrawerOpen(false)}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                <Link href="/docs" onClick={() => setDrawerOpen(false)}>
                  <div className="flex flex-row m-2 p-2">
                    <div>
                      <Book />
                    </div>
                    <div className="ms-3">Docs</div>
                  </div>
                </Link>
                <Link href="/projects" onClick={() => setDrawerOpen(false)}>
                  <div className="flex flex-row m-2 p-2">
                    <div>
                      <Briefcase />
                    </div>
                    <div className="ms-3">Projects</div>
                  </div>
                </Link>
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

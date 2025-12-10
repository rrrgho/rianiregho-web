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
  NavigationMenuContent,
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
import { useIsMobile } from "@/hooks/use-mobile";

import { Avatar } from "@/components/ui/avatar";
import { useDetectPathname } from "@/hooks/use-detect-pathname";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import Detikcom from "../../public/svg/detikcom.jpeg";
import Gic from "../../public/svg/gic.png";
import Lunata from "../../public/svg/lunata.png";
import Telkomsel from "../../public/svg/telkomsel.svg";
import { Collapsible, CollapsibleTrigger } from "./ui/collapsible";

export const JourneyItems: {
  title: string;
  href: string;
  description: string;
  icon: string;
}[] = [
  {
    title: "Telkomsel | 2023 - Now",
    icon: Telkomsel,
    href: "/docs/primitives/alert-dialog",
    description:
      "Like to see how exiciting my work in Telkomsel? Come I'll show you.",
  },
  {
    title: "Detikcom, Transmedia | 2022",
    icon: Detikcom,
    href: "/docs/primitives/alert-dialog",
    description:
      "Working here has brought me some interesting story, see why !",
  },
  {
    title: "GIC Trade | 2021",
    icon: Gic,
    href: "/docs/primitives/alert-dialog",
    description:
      "Working here has brought me some interesting story, see why !",
  },
  {
    title: "Lunata Technologies | 2019",
    icon: Lunata,
    href: "/docs/primitives/scroll-area",
    description: "Given a chance as newcomer in Tech industries was a blessing",
  },
];

export function Navbar() {
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isAdminPage = useDetectPathname({ pathname: "administrator" });

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
              <NavigationMenuItem>
                <NavigationMenuTrigger>Journey</NavigationMenuTrigger>
                <NavigationMenuContent className="ml-[-360]">
                  <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {JourneyItems.map((item) => (
                      <ListItem
                        key={item.title}
                        icon={item.icon}
                        title={item.title}
                        href={item.href}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/docs">Blogs</Link>
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
              <NavigationMenuItem className="mr-1">
                <div
                  className="flex items-center space-x-2 cursor-pointer hover:bg-primary p-2 rounded-md transition-colors"
                  onClick={changeTheme}
                >
                  {mounted && (theme === "dark" ? <Sun /> : <Moon />)}
                </div>
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
              <div
                className="flex items-center space-x-2 cursor-pointer hover:bg-primary p-2 rounded-md transition-colors"
                onClick={changeTheme}
              >
                {mounted && (theme === "dark" ? <SunMedium /> : <Moon />)}
              </div>
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
                <div className="m-2 p-2">
                  <Collapsible defaultOpen className="group/collapsible">
                    <CollapsibleTrigger asChild>
                      <div className="flex flex-row relative ">
                        <div>
                          <Route />
                        </div>
                        <div className="ms-3">Wanna see my journey?</div>
                        <div className="absolute top-0 right-0">
                          <ChevronDown />
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {JourneyItems.map((item) => (
                        <div className="px-2 mt-2" key={item.title}>
                          <div className="border border-1 rounded-lg p-2">
                            <div className="text-sm leading-none font-medium flex flex-nowrap items-center">
                              <div>
                                <Image
                                  src={item.icon}
                                  alt="Description of SVG"
                                  width={15}
                                  height={15}
                                />
                              </div>
                              <div className="ms-2">{item.title}</div>
                            </div>
                            <p className="mt-2 text-muted-foreground line-clamp-2 text-sm leading-snug">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
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
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string; icon: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium flex flex-nowrap items-center">
            <div>
              <Image
                src={icon}
                alt="Description of SVG"
                width={15}
                height={15}
              />
            </div>
            <div className="ms-2">{title}</div>
          </div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

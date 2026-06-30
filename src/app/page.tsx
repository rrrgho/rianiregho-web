"use client";

import MainChar from "@/assets/images/main-char.jpg";
import nextjsicon from "@/assets/images/nextjslogo.png";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDynamicHeight } from "@/hooks/use-dynamic-height";
import { GithubIcon, Link as IconLink, Video, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const isTall = useDynamicHeight();
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className={`relative ${isTall ? "h-screen" : "h-[700px]"}`}>
      <div className="fixed w-[25px] h-[25px] bottom-5 right-5 z-95 rounded-full overflow-hidden">
        <Tooltip>
          <TooltipTrigger>
            <Image src={nextjsicon} alt="nextjs" width={25} height={25} />
          </TooltipTrigger>
          <TooltipContent>
            This website is built with Next JS & ShadCN
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex flex-nowrap h-full">
        <div className="hidden sm:block xl:hidden w-full h-full absolute top-0 left-0">
          <div>
            <Image src={MainChar} fill alt="Rian Iregho" />
          </div>
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{ background: "#111111", opacity: 0.6 }}
          ></div>
        </div>

        <div
          id="background"
          className="absolute xl:relative flex xl:w-[55%] h-full 2xl:w-[63%] items-center px-5 lg:px-40"
        >
          <div className="">
            <div className="flex mb-5 ms-[-5px] flex-nowrap gap-2 block sm:hidden">
              <div className="w-[100px] h-[100px] rounded-full bg-primary overflow-hidden">
                <Image
                  src={MainChar}
                  className="mt-[-20px]"
                  alt="Rian Iregho"
                />
              </div>
            </div>
            <span className="text-2xl lg:text-3xl text-primary text-primary font-bold">
              Software Engineer,
            </span>{" "}
            <br />
            <div className="leading-none">
              {/* <span className="text-[110px] font-extrabold">RIAN</span> <br /> */}
              <span className="text-[60px] lg:text-[80px] 2xl:text-[110px] font-extrabold ms-[-5px]">
                Rian Iregho
              </span>
            </div>
            <div className="w-[400px] lg:w-[500px] mt-5">
              <span className="text-foreground/70">
                5+ years of experience building innovative, scalable, and
                user-focused applications.
              </span>
            </div>
            <div className="w-full mt-4">
              <Link href="/get-in-touch">
                <Button className="p-5 md:p-7">
                  <IconLink />
                  <span className="text-sm lg:text-lg cursor-pointer">
                    Get in touch
                  </span>
                </Button>
              </Link>
            </div>
            <div className="w-[400px] lg:w-[500px] mt-5 flex flex-nowrap">
              <GithubIcon size={20} />
              <span className="text-foreground/70 text-xs mt-1 ms-2">
                Want to fork this website?
                <Link className="ms-1 underline decoration-1" href="/docs">
                  See documentation
                </Link>
              </span>
            </div>
            <div className="w-[400px] absolute bottom-5 lg:w-[500px] mt-5 flex flex-nowrap">
              <span className="text-foreground/70 text-xs mt-1 ms-2">
                Powered by
                <a
                  href="https://nextjs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ms-1 underline decoration-solid"
                >
                  Next.JS
                </a>
              </span>
            </div>
          </div>
        </div>

        <div className="flex xl:w-[45%] 2xl:w-[37%] relative bg-primary items-end ">
          <div>
            <Image src={MainChar} fill className="" alt="Rian Iregho" />
          </div>
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{ background: "#111111", opacity: 0.6 }}
          ></div>
        </div>
      </div>

      {/* Video Modal Overlay */}
      {showVideo && (
        <div className="fixed inset-0 z-95 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            <div className="flex justify-end mb-4">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowVideo(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div
              className="relative w-full bg-black rounded-lg overflow-hidden"
              style={{ paddingBottom: "62.5%" }}
            >
              <iframe
                src="https://www.loom.com/embed/ad9a9e31f899482d9b17c1aa0454fe47"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

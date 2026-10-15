"use client";

import nextjsicon from "@/assets/images/nextjslogo.png";
import slide1 from "@/assets/images/slide1.jpg";
import slide2 from "@/assets/images/slide2.jpg";
import slide3 from "@/assets/images/slide3.jpg";
import { PhotoStack } from "@/components/photo-stack";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpRight, Building2, GithubIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  { src: slide1, alt: "Rian Iregho" },
  { src: slide2, alt: "Rian Iregho" },
  { src: slide3, alt: "Rian Iregho" },
];

const STATS = [
  { value: "Telkomsel", label: "Frontend Lead Engineer" },
  { value: "Doiscode", label: "CEO" },
  { value: "8+", label: "Years of Experience" },
];

export default function Home() {
  return (
    <div className="relative min-h-[700px] h-screen max-w-[1920px] mx-auto overflow-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]"
      />

      {/* <div className="fixed bottom-5 right-5 z-95 h-[25px] w-[25px] overflow-hidden rounded-full">
        <Tooltip>
          <TooltipTrigger>
            <Image src={nextjsicon} alt="nextjs" width={25} height={25} />
          </TooltipTrigger>
          <TooltipContent>
            This website is built with Next JS & ShadCN
          </TooltipContent>
        </Tooltip>
      </div> */}

      <div className="relative mx-auto flex h-full max-w-7xl flex-col-reverse items-center justify-center gap-10 px-6 pt-20 pb-12 lg:flex-row lg:justify-between lg:gap-16 lg:px-12 lg:pb-0">
        {/* Copy */}
        <div className="flex w-full max-w-xl flex-col items-center text-center duration-700 animate-in fade-in slide-in-from-bottom-4 lg:items-start lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary lg:text-sm">
            {/* <span className="h-1.5 w-1.5 rounded-full bg-primary" /> */}
            Software Engineer <span className="h-1.5 mt-[2px] w-1.5 rounded-full bg-primary" /> Founder of Doiscode
          </span>

          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl 2xl:text-7xl">
            Rian{" "}
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Iregho
            </span>
          </h1>

          <p className="mt-5 max-w-md text-base text-foreground/70 lg:text-lg">
            8+ Years in Software Engineering, Leading Doiscode Technology Focused on the Oil Palm & Agriculture Industry.
          </p>


          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Link href="/get-in-touch">
              <Button size="lg" className="group h-12 cursor-pointer px-6">
                Get in touch
                <ArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/projects">
              <Button
                size="lg"
                variant="outline"
                className="h-12 cursor-pointer px-6"
              >
                View projects
              </Button>
            </Link>
          </div>

          <dl className="mt-10 grid w-full grid-cols-3 gap-4 border-t border-foreground/10 pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="text-lg font-bold lg:text-xl">{s.value}</dt>
                <dd className="text-xs text-foreground/60">{s.label}</dd>
              </div>
            ))}
          </dl>

          {/* <div className="mt-8 flex items-center gap-2 text-xs text-foreground/60">
            <GithubIcon size={16} />
            <span>
              Want to fork this website?
              <Link className="ms-1 underline decoration-1" href="/docs">
                See documentation
              </Link>
            </span>
          </div> */}
        </div>

        {/* Portrait */}
        <div className="relative w-full max-w-[260px] duration-700 animate-in fade-in zoom-in-95 sm:max-w-[320px] lg:max-w-[420px] 2xl:max-w-[500px] mt-10 lg:mt-0">
          <div
            aria-hidden
            className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-primary/40 to-transparent blur-xl"
          />
          <PhotoStack images={SLIDES} />
        </div>
      </div>

      {/* <div className="absolute bottom-5 left-0 w-full text-center text-xs text-foreground/50">
        Powered by
        <a
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="ms-1 underline decoration-solid"
        >
          Next.JS
        </a>
      </div> */}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export function useDynamicHeight() {
  const [isTall, setIsTall] = useState(true);

  useEffect(() => {
    const checkHeight = () => {
      setIsTall(window.innerHeight > 600);
    };

    checkHeight(); // run on mount
    window.addEventListener("resize", checkHeight);

    return () => window.removeEventListener("resize", checkHeight);
  }, []);

  return isTall;
}

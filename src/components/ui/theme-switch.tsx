"use client";

import { Moon, Sun } from "lucide-react";
import * as React from "react";

interface ThemeSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ThemeSwitch({ checked, onCheckedChange }: ThemeSwitchProps) {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-5 w-14 items-center rounded-full transition-colors ${
        checked ? "bg-slate-700" : "bg-slate-300"
      }`}
      role="switch"
      aria-checked={checked}
    >
      {/* Thumb/Toggle Circle */}
      <div
        className={`absolute inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-md transition-transform ${
          checked ? "translate-x-7" : "translate-x-0.10"
        }`}
      >
        {/* Icon inside the thumb */}
        {checked ? (
          <Moon className="h-4 w-4 text-slate-700" />
        ) : (
          <Sun className="h-4 w-4 text-yellow-500" />
        )}
      </div>
    </button>
  );
}

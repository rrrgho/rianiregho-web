"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DayPickerProps } from "react-day-picker";

export function DatePicker({
  value,
  onChange,
  ...calendarProps
}: {
  value?: Date;
  onChange: (date: Date | undefined) => void;
} & Omit<DayPickerProps, "mode" | "selected" | "onSelect">) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
          >
            {value ? value.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

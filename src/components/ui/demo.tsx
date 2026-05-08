"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function CalendarDropdown() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex w-full items-center justify-center bg-background p-8">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        captionLayout="dropdown"
        startMonth={new Date(2020, 0)}
        endMonth={new Date(2030, 11)}
      />
    </div>
  );
}


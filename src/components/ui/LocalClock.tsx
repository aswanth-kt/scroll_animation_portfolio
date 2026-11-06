"use client";

import { useEffect, useState } from "react";
import RollingNumber from "./RollingNumber";
import { site } from "@/data/content";

function now() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("hour")}:${get("minute")}:${get("second")}`;
}

/** Live local time in Kannur with odometer digits. Renders a placeholder until mounted. */
export default function LocalClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime(now());
    const id = setInterval(() => setTime(now()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={className}>
      {time ? <RollingNumber value={time} duration={0.7} stagger={0.03} /> : <span className="tabular-nums">--:--:--</span>}
      <span className="ml-1.5">IST</span>
    </span>
  );
}

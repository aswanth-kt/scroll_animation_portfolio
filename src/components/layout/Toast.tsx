"use client";

import { useEffect, useState } from "react";
import { toast } from "@/lib/bus";
import { Check } from "@/components/ui/Icons";

export default function Toast() {
  const [current, setCurrent] = useState<{ id: number; message: string } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const unsub = toast.subscribe((t) => {
      if (!t) return;
      setCurrent(t);
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), 2400);
    });
    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed bottom-6 left-1/2 z-[150] -translate-x-1/2 transition-all duration-500 ease-[var(--ease-expo)] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      {current && (
        <div className="flex items-center gap-2.5 rounded-full border border-line-strong bg-raised/90 py-2.5 pr-5 pl-3 text-sm shadow-2xl backdrop-blur-xl">
          <span className="grid size-6 place-items-center rounded-full bg-accent text-accent-ink">
            <Check size={14} strokeWidth={2.4} />
          </span>
          {current.message}
        </div>
      )}
    </div>
  );
}

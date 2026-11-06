"use client";

import { cn } from "@/lib/utils";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

type Props = {
  value: string | number;
  /** Text for screen readers / search engines when `value` is a temporary animation state. */
  srValue?: string | number;
  className?: string;
  /** Delay between digits, right-most digit moves first. */
  stagger?: number;
  duration?: number;
  delay?: number;
};

/**
 * Odometer-style number: every digit is a vertical 0–9 strip that rolls to its
 * value with a soft overshoot. Change `value` and the digits roll.
 */
export default function RollingNumber({ value, srValue, className, stagger = 0.07, duration = 1.1, delay = 0 }: Props) {
  const chars = String(value).split("");
  return (
    <span className={cn("inline-flex tabular-nums leading-[1.1]", className)}>
      <span className="sr-only">{srValue ?? value}</span>
      {chars.map((char, i) => {
        const fromRight = chars.length - 1 - i;
        if (!/\d/.test(char)) {
          return (
            <span key={`s-${fromRight}`} aria-hidden="true" data-c={char} className="glyph" />
          );
        }
        return (
          <span key={`d-${fromRight}`} aria-hidden="true" className="relative inline-block h-[1.1em] overflow-hidden">
            <span
              className="block will-change-transform"
              style={{
                transform: `translate3d(0, ${-Number(char) * 10}%, 0)`,
                transition: `transform ${duration}s cubic-bezier(0.34, 1.32, 0.5, 1) ${delay + fromRight * stagger}s`,
              }}
            >
              {DIGITS.map((d) => (
                <span key={d} data-c={d} className="glyph block h-[1.1em] leading-[1.1]" />
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}

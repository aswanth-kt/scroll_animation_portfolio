"use client";

import { useEffect, useState } from "react";
import { BUILD_DATE } from "@/data/content";

/**
 * The current year, hydration-safe: renders the build year first (matching the static HTML),
 * then updates to the visitor's year — so "© 2026" becomes "© 2027" without a redeploy.
 */
export function useCurrentYear() {
  const [year, setYear] = useState(BUILD_DATE.getUTCFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);
  return year;
}

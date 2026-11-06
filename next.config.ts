import type { NextConfig } from "next";

// Accept both the new NEXT_PUBLIC_* names and the old VITE_* names, so the
// EmailJS keys already configured on the host keep working after the migration.
const pick = (name: string) =>
  process.env[`NEXT_PUBLIC_${name}`] ?? process.env[`VITE_${name}`] ?? "";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  images: { unoptimized: true },
  env: {
    // Frozen build timestamp, identical in the server HTML and the browser bundle. Anything
    // date-based renders from this first (so hydration matches), then updates to "now".
    BUILD_TIME: new Date().toISOString(),
    EMAILJS_SERVICE_ID: pick("EMAILJS_SERVICE_ID"),
    EMAILJS_TEMPLATE_ID: pick("EMAILJS_TEMPLATE_ID"),
    EMAILJS_PUBLIC_KEY: pick("EMAILJS_PUBLIC_KEY"),
  },
};

export default nextConfig;

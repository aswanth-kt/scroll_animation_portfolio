import type { MetadataRoute } from "next";
import { projects, site } from "@/data/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${site.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
      // Image sitemap entries help the portrait and project screenshots show up in Google Images.
      images: [`${site.url}/og-image-v2.jpg`, `${site.url}/profile.webp`, ...projects.map((p) => `${site.url}${p.image}`)],
    },
  ];
}

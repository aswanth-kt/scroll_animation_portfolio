import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { projects, site } from "@/data/content";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["italic", "normal"], variable: "--font-instrument", display: "swap" });

// Kept under ~60 / ~155 characters so Google shows them without truncation.
const title = "Aswanth K T | Full Stack MERN Developer, Kannur, Kerala";
const description =
  "Aswanth K T — Full Stack MERN Developer at Talkisam, Kannur, Kerala. React, Node.js, MongoDB & AWS projects, experience and how to get in touch.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description,
  applicationName: "Aswanth Portfolio",
  authors: [{ name: "Aswanth K T", url: site.url }],
  creator: "Aswanth K T",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  verification: { google: "8WjVDAQP9QkY5HSxlpXYEnM71jJu1aKL9ebAGZLdAdo" },
  appleWebApp: { title: "Aswanth Portfolio", statusBarStyle: "black-translucent" },
  openGraph: {
    type: "website",
    siteName: "Aswanth Portfolio",
    title: "Aswanth K T — Full Stack MERN Developer",
    description: "Full Stack Developer at Talkisam Private Limited. Production-ready React, Node.js, MongoDB and AWS projects.",
    url: "/",
    locale: "en_US",
    images: [{ url: "/og-image-v2.jpg", width: 1200, height: 630, alt: "Aswanth K T — Full Stack MERN Developer portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aswanth K T — Full Stack MERN Developer",
    description: "Full Stack Developer at Talkisam Private Limited, Kannur. React.js, Node.js, Express.js, MongoDB, AWS and REST APIs.",
    images: ["/og-image-v2.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Structured data: a ProfilePage whose main entity is the Person — Google's recommended
// markup for personal profile sites. Name variants help search engines match all spellings.
const PERSON_ID = `${site.url}/#person`;
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/#profile`,
      url: `${site.url}/`,
      name: title,
      description,
      inLanguage: "en",
      dateModified: new Date().toISOString(),
      mainEntity: { "@id": PERSON_ID },
      primaryImageOfPage: `${site.url}/og-image-v2.jpg`,
    },
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: "Aswanth K T",
      alternateName: ["Aswanth KT", "Aswanth K.T", "Aswanth K. T."],
      givenName: "Aswanth",
      url: `${site.url}/`,
      image: { "@type": "ImageObject", url: `${site.url}/profile.webp`, width: 1254, height: 1254 },
      description: "Full Stack (MERN) Developer at Talkisam Private Limited in Kannur, Kerala, India. Former railway construction supervisor at L&T.",
      jobTitle: "Full Stack Developer",
      worksFor: { "@type": "Organization", name: site.company },
      alumniOf: [
        { "@type": "EducationalOrganization", name: "Brototype" },
        { "@type": "Organization", name: "L&T Construction" },
      ],
      email: `mailto:${site.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Kannur", addressRegion: "Kerala", addressCountry: "IN" },
      homeLocation: { "@type": "Place", name: "Kannur, Kerala, India" },
      knowsLanguage: ["ml", "hi", "en"],
      sameAs: [site.links.github, site.links.linkedin],
      knowsAbout: ["MERN Stack", "React.js", "Node.js", "Express.js", "MongoDB", "JavaScript", "Redux", "Tailwind CSS", "REST API design", "JWT authentication", "Role-based access control", "AWS EC2", "Nginx", "PM2", "Razorpay", "Cloudinary"],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: `${site.url}/`,
      name: "Aswanth K T — Portfolio",
      alternateName: ["Aswanth Portfolio", "aswanthkt.in"],
      publisher: { "@id": PERSON_ID },
      inLanguage: "en",
    },
    {
      "@type": "ItemList",
      name: "Projects by Aswanth K T",
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: p.name,
          description: p.description,
          url: p.links.live,
          sameAs: p.links.github,
          image: `${site.url}${p.image}`,
          keywords: p.stack.join(", "),
          creator: { "@id": PERSON_ID },
        },
      })),
    },
  ],
};

const GA_ID = "G-HQ7Q03JWMV";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body>
        {/* Without JS there is no preloader exit, so never show it. */}
        <noscript>
          <style>{`[data-preloader]{display:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {/* rel="me" ties this site to the same person's profiles (identity verification). */}
        <link rel="me" href={site.links.github} />
        <link rel="me" href={site.links.linkedin} />
        {children}
        {/* Analytics only on the real domain, so local dev and previews don't pollute the data. */}
        <Script id="ga" strategy="afterInteractive">
          {`if(/(^|\\.)aswanthkt\\.in$/.test(location.hostname)){var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_ID}');}`}
        </Script>
      </body>
    </html>
  );
}

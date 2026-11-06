import SmoothScroll from "@/components/layout/SmoothScroll";
import Preloader from "@/components/layout/Preloader";
import Navbar from "@/components/layout/Navbar";
import CommandPalette from "@/components/layout/CommandPalette";
import Cursor from "@/components/layout/Cursor";
import Toast from "@/components/layout/Toast";
import Effects from "@/components/layout/Effects";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/hero/Hero";
import CautionTape from "@/components/sections/CautionTape";
import About from "@/components/sections/About";
import Stack from "@/components/sections/Stack";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <Preloader />
      <a
        href="#main"
        className="fixed top-3 left-3 z-[130] -translate-y-24 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <div id="page">
        <Navbar />
        <Effects />
        <main id="main">
          <Hero />
          <CautionTape />
          <About />
          <Stack />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
      <CommandPalette />
      <Toast />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </SmoothScroll>
  );
}

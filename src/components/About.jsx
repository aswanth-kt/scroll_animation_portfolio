import SectionHeader from "./SectionHeader";
import AsciiImage from "./AsciiImage";
import profileImage from "../assets/images/profileImage.webp";

export default function About() {
  return (
    <section id="about" className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader sheet="SHEET 01 - ABOUT" title="Blueprint discipline, software delivery." />
        <div className="flex flex-col md:flex-row gap-10 items-center justify-between">
          <div className="w-full md:w-[55%] lg:w-[60%] flex flex-col gap-10">
            <p className="font-display text-lg font-semibold leading-8 text-paper">
              Aswanth K.T moved from supervising live railway construction to building MERN applications, carrying forward the same habits that matter when mistakes are expensive: ownership, coordination, planning, and a zero-error mindset.
            </p>
            <div className="space-y-5 text-lg leading-8 text-paper/75">
              <p>
                His 4.5 years as a Front Line Supervisor at L&T Construction meant scheduling crews, machinery, billing reports, and live track-changing work while maintaining a zero safety incident record. Today that experience shows up in how he structures APIs, protects routes, documents systems, and keeps production concerns in view.
              </p>
              <p>
                He is currently developing a gym management web application at Hall Dot X with member onboarding, subscription billing, attendance tracking, dashboards, WhatsApp Cloud API automation, and role-based portals.
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-[45%] lg:w-[40%] flex justify-center">
            <div className="relative overflow-hidden rounded-2xl w-full bg-transparent mx-auto mt-10 md:mt-0 max-w-[320px] md:max-w-[380px] lg:max-w-[420px] h-[400px] md:h-[440px] lg:h-[520px]">
              <AsciiImage
                image={profileImage}
                reveal={true}
                columns={180}
                colorMode="mono"
                contrast={110}
                fit="cover"
                focusY={30}
                inkColor="#ffffff"
                alt="Aswanth KT - MERN Stack Developer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

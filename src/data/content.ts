const whatsappMessage = `Hello Aswanth,

I came across your portfolio and was impressed by your skills and projects.

We have a Full Stack Developer opportunity that matches your profile, and we'd like to discuss it with you.

If you're interested, please let us know a convenient time to connect.

Looking forward to hearing from you.

Best regards,
Recruitment Team`;

export const site = {
  url: "https://www.aswanthkt.in",
  name: "Aswanth K.T",
  shortName: "AKT",
  role: "Full Stack Developer",
  stack: "MERN Stack",
  company: "Talkisam Private Limited",
  companyShort: "Talkisam",
  location: "Kannur, Kerala, India",
  city: "Kannur, IN",
  timezone: "Asia/Kolkata",
  email: "aswanthkt.official@gmail.com",
  phone: "+91 75609 90989",
  availability: "Open to opportunities",
  languages: ["Malayalam (Native)", "Hindi (Fluent)", "English (Conversational)"],
  links: {
    resume: "https://drive.google.com/file/d/1O3gbc0TACTu_2hFDFM82lhTaD99rui0I/view?usp=sharing",
    linkedin: "https://www.linkedin.com/in/aswanth-kt",
    github: "https://github.com/aswanth-kt",
    whatsapp: `https://wa.me/917560990989?text=${encodeURIComponent(whatsappMessage)}`,
  },
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
] as const;

/** Hero story, synced to the scroll-scrubbed frame sequence. */
export const chapters = [
  {
    id: "track",
    chainage: "CH 0+000",
    period: "2018 — 2023",
    title: "The Track.",
    body: "Front Line Supervisor at L&T Construction, Railways. Crews of 15, heavy machinery, live track — 4.5 years with zero safety incidents.",
  },
  {
    id: "switch",
    chainage: "CH 2+250",
    period: "2024",
    title: "The Switch.",
    body: "Same discipline, new tools. A full-time MERN bootcamp at Brototype: real projects, AWS deployments, payment gateways and REST APIs.",
  },
  {
    id: "stack",
    chainage: "CH 4+500",
    period: "2026 — Now",
    title: "The Stack.",
    body: "Full Stack Developer at Talkisam Private Limited since August 2026 — after going from intern to full-time at Hall Dot X on a production gym platform.",
  },
] as const;


/** Keys must exist in src/components/ui/BrandIcon.tsx; others render as text-only chips. */
export const skills: { group: string; blurb: string; items: string[] }[] = [
  {
    group: "Backend",
    blurb: "APIs that are boring in production — on purpose.",
    items: ["Node.js", "Express.js", "REST API Design", "MVC Architecture", "Middleware"],
  },
  {
    group: "Frontend",
    blurb: "Fast, accessible interfaces with a clean state model.",
    items: ["React.js", "JavaScript (ES6+)", "Redux", "Tailwind CSS", "Vite", "EJS", "HTML5", "CSS3"],
  },
  {
    group: "Database",
    blurb: "Schemas designed around how the data is read.",
    items: ["MongoDB", "Mongoose", "Aggregation Pipelines", "Schema Design", "Indexing"],
  },
  {
    group: "Auth & Security",
    blurb: "Every route protected, every role separated.",
    items: ["JWT", "bcrypt", "Google OAuth", "Passport.js", "Session Auth", "RBAC"],
  },
  {
    group: "Deployment",
    blurb: "From git push to a stable production uptime.",
    items: ["AWS EC2", "Ubuntu", "Nginx", "PM2", "Vercel", "Render", "Netlify"],
  },
  {
    group: "Integrations",
    blurb: "Payments, media, mail and messaging wired in.",
    items: ["Razorpay", "Cloudinary", "WhatsApp Cloud API", "Nodemailer", "Multer", "Sharp", "TMDB API"],
  },
  {
    group: "Tools",
    blurb: "The everyday kit.",
    items: ["Git", "GitHub", "Postman", "VS Code", "npm", "Excel"],
  },
];

/* Stats row: developer numbers, computed at build time so they stay current.
   (The railway facts live in the hero, the About "Before tech" note and the timeline.) */
/** Started full-time MERN training at Brototype — 1 Sep 2024 (local date). */
export const DEV_SINCE = { year: 2024, month: 9, day: 1 };

/** When the site was built — inlined at build time (see next.config.ts). */
export const BUILD_DATE = new Date(process.env.BUILD_TIME || Date.now());

/**
 * Whole calendar years since DEV_SINCE; ticks over on the anniversary itself (1 Sep).
 * `utc` gives a timezone-independent answer for the pre-rendered HTML.
 */
export function devYearsAt(now: Date = new Date(), utc = false) {
  const { year, month, day } = DEV_SINCE;
  const y = utc ? now.getUTCFullYear() : now.getFullYear();
  const anniversary = utc ? new Date(Date.UTC(y, month - 1, day)) : new Date(y, month - 1, day);
  return Math.max(1, y - year - (now < anniversary ? 1 : 0));
}

// Value baked into the HTML (and the first render in the browser, so hydration matches);
// About.tsx then swaps in the live value for the visitor's date.
const devYears = devYearsAt(BUILD_DATE, true);
const toolCount = skills.reduce((n, s) => n + s.items.length, 0);
const toolsRounded = Math.floor(toolCount / 10) * 10;
const zeros = (v: number) => "0".repeat(String(v).length);

export type Stat = { value: string; from: string; suffix: string; label: string; live?: () => string };

export const stats: Stat[] = [
  {
    value: String(devYears),
    from: zeros(devYears),
    suffix: "+ yrs",
    label: `Building full-stack apps with the MERN stack, since ${DEV_SINCE.year}`,
    live: () => String(devYearsAt()),
  },
  { value: "15", from: "00", suffix: "+", label: "REST API endpoints built & documented in production" },
  { value: "5", from: "0", suffix: "", label: "Full-stack apps designed, built & deployed live" },
  { value: String(toolsRounded), from: zeros(toolsRounded), suffix: "+", label: "Tools & technologies across my stack" },
];

export const marquee = ["React", "Node.js", "Express", "MongoDB", "Redux", "Tailwind CSS", "JWT", "AWS EC2", "Nginx", "PM2", "Razorpay", "Cloudinary", "Vercel", "Git"];

export type TimelineEntry = {
  kind: "work" | "education";
  current?: boolean;
  chainage: string;
  period: string;
  role: string;
  org: string;
  tag?: string;
  meta?: string;
  bullets?: string[];
  stack?: string[];
};

export const timeline: TimelineEntry[] = [
  {
    kind: "work",
    current: true,
    chainage: "CH 4+500",
    period: "Aug 2026 — Present",
    role: "Full Stack Developer",
    org: "Talkisam Private Limited",
    tag: "Joined 17 Aug 2026",
  },
  {
    kind: "work",
    chainage: "CH 4+000",
    period: "Mar 2026 — Aug 2026",
    role: "MERN Stack Developer",
    org: "Hall Dot X",
    tag: "Promoted · Intern → Full-time",
    meta: "Service-based company · Project: Gym Management Web App",
    bullets: [
      "Developed a gym management web application handling member onboarding, subscription billing, attendance tracking and admin dashboards for day-to-day gym operations.",
      "Engineered an automated fee-reminder system with the WhatsApp Cloud API and Node Cron, scheduling messages to members before and after payment due dates.",
      "Built and documented 15+ RESTful API endpoints in Node.js and Express.js, with MongoDB schemas designed for efficient gym data management.",
      "Implemented RBAC with JWT authentication — separate admin, trainer and member portals behind protected routes.",
      "Delivered full-stack features across the React UI, Node.js backend and deployment configuration.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "WhatsApp Cloud API"],
  },
  {
    kind: "education",
    chainage: "CH 3+000",
    period: "Sep 2024 — Present",
    role: "MERN Stack Development Bootcamp",
    org: "Brototype",
    tag: "Full-time",
    meta: "Full-stack MERN training with real project development, AWS deployment, payment gateway integration and REST API development.",
  },
  {
    kind: "work",
    chainage: "CH 0+000",
    period: "Sep 2018 — Feb 2023",
    role: "Front Line Supervisor",
    org: "L&T Construction, Railways Division",
    tag: "4.5 years · Zero incidents",
    bullets: [
      "Supervised a team of 15 labourers and heavy-machinery operators across live railway track construction and replacement sites, with a zero safety-incident record over 4.5 years.",
      "Coordinated daily scheduling, task allocation and resource planning for live track-changing operations in a high-risk, time-critical environment.",
      "Produced contractor billing reports and material-tracking documentation in Excel, supporting cost management and compliance across project phases.",
    ],
  },
  {
    kind: "education",
    chainage: "—",
    period: "2018",
    role: "ITI in Fitter Technology",
    org: "NCVT",
  },
  {
    kind: "education",
    chainage: "—",
    period: "2016",
    role: "Higher Secondary Education",
    org: "Kerala State Board",
  },
];

export type Project = {
  slug: string;
  name: string;
  short: string;
  category: string;
  description: string;
  highlights: string[];
  stack: string[];
  image: string;
  accent: string;
  links: { live: string; github: string };
};

export const projects: Project[] = [
  {
    slug: "earcrafters",
    name: "EarCrafters",
    short: "EarCrafters",
    category: "Full-stack e-commerce",
    description:
      "An audio-gear store engineered from scratch — separate admin and user portals, cart to checkout with real-time inventory validation, Razorpay payments and automated PDF invoices.",
    highlights: [
      "Deployed on AWS EC2 (Ubuntu) behind Nginx, managed with PM2",
      "Session auth with bcrypt, plus Google OAuth via Passport.js",
      "Multer + Sharp image pipeline and Excel admin reports",
    ],
    stack: ["Node.js", "Express.js", "MongoDB", "EJS", "AWS EC2", "Nginx", "PM2"],
    image: "/work/earcrafters.webp",
    accent: "#ff7a6b",
    links: { live: "https://earcrafters.onrender.com", github: "https://github.com/aswanth-kt/EarCrafters" },
  },
  {
    slug: "client-project-manager",
    name: "Client Project Manager",
    short: "Project Manager",
    category: "Web agency tool",
    description:
      "A multi-role project management tool for web agencies: full client CRUD, developer assignment, deadline tracking and chart-based project analytics.",
    highlights: [
      "JWT authentication with Admin and Developer access levels",
      "Server-side pagination for optimised data loading",
      "Split deployment — Vercel frontend, Render backend",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Tailwind CSS"],
    image: "/work/client-project-manager.webp",
    accent: "#6b8bff",
    links: { live: "https://client-project-manager-nine.vercel.app", github: "https://github.com/aswanth-kt/HDX_Client_Project_Manager" },
  },
  {
    slug: "payslip",
    name: "Payslip Generation System",
    short: "PayslipGen",
    category: "Payroll automation",
    description:
      "Stores employee records and generates printable monthly payslips — HRA, DA, allowances, ESI, PF and leave deductions calculated from a configurable base salary.",
    highlights: [
      "Automated salary calculations from one configurable base",
      "Print-ready monthly payslips",
      "Employee records persisted with Mongoose models",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose"],
    image: "/work/payslip.webp",
    accent: "#a78bfa",
    links: { live: "https://payslip-gen-app.vercel.app", github: "https://github.com/aswanth-kt/Payslip-Model-Machine-task" },
  },
  {
    slug: "movie-app",
    name: "Movie Management App",
    short: "Movie App",
    category: "REST API catalog",
    description:
      "A REST API-backed movie catalog managing 250+ records, with TMDB bulk import and server-side search, multi-field sorting and pagination for performance at scale.",
    highlights: [
      "JWT auth with admin / user role-based access",
      "TMDB API bulk import of 250+ titles",
      "Server-side search, sorting and pagination",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "TMDB API"],
    image: "/work/movie-app.webp",
    accent: "#ffb547",
    links: { live: "https://movie-app-box.vercel.app", github: "https://github.com/aswanth-kt/Movie-App" },
  },
  {
    slug: "codemate-ai",
    name: "CodeMate AI",
    short: "CodeMate AI",
    category: "AI developer tool",
    description:
      "Paste any code snippet and get a plain-English explanation back — a full-stack tool built around an AI API integration.",
    highlights: [
      "AI API integration behind an Express backend",
      "Frontend on Netlify, backend on Render",
      "Pick the snippet's language, get a plain-English walkthrough",
    ],
    stack: ["React.js", "Node.js", "Express.js", "AI API"],
    image: "/work/codemate-ai.webp",
    accent: "#4fd1c5",
    links: { live: "https://codemate-ai-frontend.netlify.app", github: "https://github.com/aswanth-kt/CodeMate-Ai" },
  },
];

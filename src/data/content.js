const wa_msg = `Hello Aswanth,

I came across your portfolio and was impressed by your skills and projects.

We have a Full Stack Developer opportunity that matches your profile, and we'd like to discuss it with you.

If you're interested, please let us know a convenient time to connect.

Looking forward to hearing from you.

Best regards,
Recruitment Team`;

export const content = {
  name: "Aswanth K.T",
  title: "Full Stack Developer | MERN Stack",
  location: "Kannur, Kerala, India",
  email: "aswanthkt.official@gmail.com",
  phone: "+91 75609 90989",
  links: {
    portfolio: "#home",
    linkedin: "#contact",
    github: "#projects",
  },
  summary:
    "Full Stack Developer and MERN Stack Developer with hands-on experience building, deploying, and maintaining production web applications. Proficient in Node.js, Express.js, React.js, MongoDB, REST API design, JWT authentication, and AWS EC2 deployment. Currently developing a gym management web application at Hall Dot X, including WhatsApp Cloud API automation and role-based access systems. Background in high-stakes operations leadership builds strong ownership, reliability, and real-world problem-solving in software delivery. Open to Full Stack Developer, JavaScript Developer, React Developer, and Backend Developer roles. Immediately available for full-time positions.",
  skills: {
    Backend: ["Node.js", "Express.js", "REST API Design", "MVC Architecture", "Middleware Development"],
    Frontend: ["React.js", "JavaScript (ES6+)", "Redux", "Tailwind CSS", "EJS", "HTML5", "CSS3", "Vite"],
    Database: ["MongoDB", "Mongoose", "Aggregation Pipelines", "Schema Design", "Indexing"],
    "Auth & Security": ["JWT", "bcrypt", "Google OAuth (Passport.js)", "Session-based Auth", "Role-Based Access Control (RBAC)"],
    Deployment: ["AWS EC2 (Ubuntu)", "Nginx", "PM2", "Vercel", "Render", "Netlify"],
    Integrations: ["Razorpay", "Cloudinary", "Nodemailer", "Multer", "Sharp", "TMDB API", "Google OAuth"],
    Tools: ["Git", "GitHub", "Postman", "VS Code", "NPM", "Microsoft Excel"],
  },
  experience: [
    {
      role: "MERN Stack Developer",
      company: "Hall Dot X",
      period: "March 2026 - Present",
      meta: "Service-based company | Promoted from Intern (Mar 2026) to Full-Time Employee | Project: Gym Management Web App",
      bullets: [
        "Developed a gym management web application handling member onboarding, subscription billing, attendance tracking, and admin dashboards for day-to-day gym operations.",
        "Engineered an automated fee reminder system using WhatsApp Cloud API and Node Cron, reducing manual follow-up effort by scheduling messages to members before and after payment due dates.",
        "Built and documented 15+ RESTful API endpoints using Node.js and Express.js, with MongoDB schemas designed for efficient gym data management.",
        "Implemented Role-Based Access Control (RBAC) with JWT authentication, separating gym admin, trainer, and member portals with protected routes.",
        "Delivered full-stack features across React.js UI, Node.js backend, and deployment configuration as a promoted full-time developer within the same internship cycle.",
      ],
    },
    {
      role: "Front Line Supervisor",
      company: "L&T Construction, Railways Division",
      period: "Sep 2018 - Feb 2023",
      bullets: [
        "Supervised a team of 15 laborers and heavy machinery operators across live railway track construction and replacement sites, maintaining a zero safety incident record over 4.5 years.",
        "Coordinated daily scheduling, task allocation, and resource planning for live track-changing operations, ensuring zero errors in a high-risk, time-critical environment.",
        "Produced and maintained contractor billing reports and material tracking documentation in Microsoft Excel, supporting cost management and compliance across multiple project phases.",
      ],
    },
  ],
  projects: [
    {
      name: "EarCrafters: Full-Stack E-Commerce Platform",
      stack: ["Node.js", "Express.js", "MongoDB", "EJS", "AWS EC2", "Nginx", "PM2"],
      links: {
        live: "https://earcrafters.onrender.com", 
        github: "https://github.com/aswanth-kt/EarCrafters" 
      },
      bullets: [
        "Engineered a complete e-commerce platform from scratch with separate admin and user portals, session-based authentication with bcrypt password hashing, and Google OAuth via Passport.js.",
        "Deployed on AWS EC2 (Ubuntu) with Nginx as reverse proxy and PM2 for Node.js process management, achieving stable production uptime.",
        "Delivered end-to-end order management covering cart, checkout, real-time inventory validation, Razorpay payment gateway integration, and automated PDF invoice delivery via Nodemailer.",
        "Built an image processing pipeline using Multer and Sharp for upload and compression, and generated Excel-based admin reports for order and inventory tracking.",
      ],
    },
    {
      name: "Client Project Manager: Web Agency Tool",
      stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "Tailwind CSS"],
      links: { 
        live: "https://client-project-manager-nine.vercel.app", 
        github: "https://github.com/aswanth-kt/HDX_Client_Project_Manager" 
      },
      bullets: [
        "Developed a multi-role project management tool for web agencies with JWT authentication, Admin and Developer access levels, full client CRUD, developer assignment, deadline tracking, and chart-based project analytics.",
        "Implemented server-side pagination for optimised data loading and deployed the full-stack application across Vercel (frontend) and Render (backend).",
      ],
    },
    {
      name: "Employee Payslip Generation System",
      stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Mongoose"],
      links: { 
        live: "https://payslip-gen-app.vercel.app", 
        github: "https://github.com/aswanth-kt/Payslip-Model-Machine-task" 
      },
      bullets: [
        "Developed a payroll application that stores employee records and generates monthly payslips with print support, automating salary calculations for HRA, DA, allowances, ESI, PF, and leave deductions based on a configurable base salary.",
      ],
    },
    {
      name: "Movie Management App",
      stack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "TMDB API"],
      links: { 
        live: "https://movie-app-box.vercel.app",
        github: "https://github.com/aswanth-kt/Movie-App" 
      },
      bullets: [
        "Architected a REST API-backed movie catalog managing 250+ records with JWT authentication, role-based access control (admin/user), TMDB API bulk import, and server-side search, multi-field sorting, and pagination for performance at scale.",
      ],
    },
    {
      name: "CodeMate AI: Code Explanation App",
      stack: ["React.js", "Node.js", "Express.js", "AI API"],
      links: { 
        live: "https://codemate-ai-frontend.netlify.app", 
        github: "https://github.com/aswanth-kt/CodeMate-Ai" 
      },
      bullets: [
        "Built a full-stack AI-powered code explanation tool that accepts any code snippet and returns plain-English explanations via an AI API integration. Deployed frontend on Netlify and backend on Render.",
      ],
    },
  ],
  education: [
    {
      title: "MERN Stack Development Bootcamp (Full-Time)",
      org: "Brototype",
      period: "Sep 2024 - Present",
      note: "Full-stack MERN training with real project development, AWS deployment, payment gateway integration, and REST API development.",
    },
    { title: "ITI in Fitter Technology (NCVT)", org: "", period: "2018" },
    { title: "Higher Secondary Education", org: "Kerala State Board", period: "2016" },
  ],
  additional: {
    languages: ["Malayalam (Native)", "Hindi (Fluent)", "English (Conversational)"],
    availability: "Immediately available for full-time roles",
  },
  links: {
    resume: "https://drive.google.com/file/d/1O3gbc0TACTu_2hFDFM82lhTaD99rui0I/view?usp=sharing",
    linkedin: "https://www.linkedin.com/in/aswanth-kt",
    github: "https://github.com/aswanth-kt",
    whatsapp: `https://wa.me/917560990989?text=${encodeURIComponent(wa_msg)}`,
  },
};


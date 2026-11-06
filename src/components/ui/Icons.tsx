import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 18): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export const ArrowUpRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);
export const ArrowDown = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);
export const ArrowUp = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 19V5M6 11l6-6 6 6" />
  </svg>
);
export const Copy = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" />
  </svg>
);
export const Mail = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);
export const Phone = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
  </svg>
);
export const FileText = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);
export const Search = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const Hash = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" />
  </svg>
);
export const Command = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3z" />
  </svg>
);
export const Check = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);
export const Send = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M21 3 10 14M21 3l-7 18-4-7-7-4z" />
  </svg>
);
export const Terminal = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m5 8 4 4-4 4M12 17h7" />
  </svg>
);

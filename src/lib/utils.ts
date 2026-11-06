export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const pad = (n: number, size = 2) => String(n).padStart(size, "0");

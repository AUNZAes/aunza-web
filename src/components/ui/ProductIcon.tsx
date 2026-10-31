// Line icons in the style of the brand board's icon set.
const PATHS = {
  box: "M24 5 42 14v20L24 43 6 34V14L24 5ZM6 14l18 9 18-9M24 23v20",
  tee: "M17 6 6 12l3 9 6-2v23h18V19l6 2 3-9-11-6c-1 4-3.5 6-7 6s-6-2-7-6Z",
  cup: "M11 12h26l-3 30H14L11 12ZM9 12V7h30v5M12.5 24h23",
  leaf: "M41 7C24 7 9 13 9 28c0 8 6 13 13 13 15 0 19-17 19-34ZM7 43c6-10 13-17 23-23",
  gift: "M7 17h34v8H7zM10 25v18h28V25M24 17v26M24 17c-3-9-13-11-14-5s8 5 14 5Zm0 0c3-9 13-11 14-5s-8 5-14 5Z",
  bag: "M10 16h28l3 27H7l3-27ZM17 21v-9a7 7 0 0 1 14 0v9",
  pen: "M9 39l3-10L33 8l7 7-21 21-10 3ZM29 12l7 7",
  bottle: "M19 5h10v7h-10zM19 12c0 4-4 5-4 11v20h18V23c0-6-4-7-4-11M15 24h18",
  book: "M10 5h27a2 2 0 0 1 2 2v34a2 2 0 0 1-2 2H10V5ZM16 5v38M23 14h10",
} as const;

export type IconName = keyof typeof PATHS;

export function ProductIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round" className={className} aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  );
}

export function Arrow({ className = "w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden>
      <path d="M0 6h22M17 1l5 5-5 5" />
    </svg>
  );
}

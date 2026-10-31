import { MARK_PATH, WORDMARK_PATH, WORDMARK_STROKE, WORDMARK_VIEWBOX } from "@/lib/logo";

type LogoProps = {
  className?: string;
  /** Pass a label when the logo stands alone as a link or heading. */
  title?: string;
};

/** Primary wordmark. Inherits `currentColor`, so dark and light versions are just text colours. */
export function Wordmark({ className, title }: LogoProps) {
  return (
    <svg
      viewBox={`0 0 ${WORDMARK_VIEWBOX.width} ${WORDMARK_VIEWBOX.height}`}
      className={className}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={WORDMARK_STROKE}
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={WORDMARK_PATH} />
    </svg>
  );
}

/** Compact version: the mark alone. */
export function Mark({ className, title }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={MARK_PATH} />
    </svg>
  );
}

/** App-icon lockup from the board: the mark in a rounded square. */
export function MarkTile({ className, title }: LogoProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <rect width="100" height="100" rx="24" fill="currentColor" />
      <path d={MARK_PATH} fill="var(--tile-ink, #f8f7f3)" stroke="var(--tile-ink, #f8f7f3)" strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

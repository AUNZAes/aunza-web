import type { CSSProperties, ElementType } from "react";

/**
 * Headline split into masked lines. Page titles (h1) animate with CSS alone, on first paint,
 * so they never wait for JavaScript; the rest use the `data-reveal="lines"` scroll entrance.
 */
export function Lines({ lines, as: Tag = "h2", className, delay = 0 }: { lines: string[]; as?: ElementType; className?: string; delay?: number }) {
  const entrance = Tag === "h1" ? { "data-load": "lines" } : { "data-reveal": "lines" };
  return (
    <Tag {...entrance} className={className} style={{ "--d": delay } as CSSProperties}>
      {lines.map((line, i) => (
        <span key={line} className="ln">
          <span style={{ "--l": i * 1.4 } as CSSProperties}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Text whose words brighten as it scrolls past (`data-scrub-words`). */
export function ScrubWords({ text, as: Tag = "h2", className }: { text: string; as?: ElementType; className?: string }) {
  return (
    <Tag data-scrub-words className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="w inline-block" aria-hidden>
          {word}&nbsp;
        </span>
      ))}
    </Tag>
  );
}

export function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p data-reveal className={`label ${className}`}>
      {children}
    </p>
  );
}

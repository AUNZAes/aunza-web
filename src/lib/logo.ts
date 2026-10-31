/**
 * AUNZA wordmark, traced by hand from the brand board. Single source of truth
 * for the React logo, the favicon, Open Graph and the WebGL product textures.
 * A thin round-joined stroke softens the corners the way the original does.
 */
export const WORDMARK_VIEWBOX = { width: 1328, height: 243 };
export const WORDMARK_STROKE = 7;

const A = (x: number) =>
  `M${x + 122} 4 L${x + 3} 224 H${x + 44} L${x + 129} 62 L${x + 216} 224 H${x + 256} L${x + 136} 4 Z`;

export const WORDMARK_PATH = [
  A(0),
  // U
  "M303 4 H337 V121 A78 78 0 0 0 493 121 V4 H529 V121 A113 113 0 0 1 303 121 Z",
  // N
  "M590 4 H622 L775 170 V4 H809 V224 H778 L625 58 V224 H590 Z",
  // Z
  "M881 4 H1052 V32 L922 190 H1037 V224 H865 V195 L999 38 H881 Z",
  A(1064),
].join(" ");

/** The compact mark: the crossbar-less A on its own, in a 100x100 box. */
export const MARK_PATH = "M50 22 L14 80 H27 L50 42 L73 80 H86 Z";

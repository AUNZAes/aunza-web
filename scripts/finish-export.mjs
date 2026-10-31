// GitHub Pages answers unknown addresses with /404.html. It has to be one file, so visitors under /en go to the English version.

import { readFileSync, rmSync, writeFileSync } from "node:fs";

const redirect = `<script>if(/^\\/en(\\/|$)/.test(location.pathname))location.replace("/en/404-page/")</script>`;
const page = readFileSync("out/404-page/index.html", "utf8");
writeFileSync("out/404.html", page.replace("<head>", `<head>${redirect}`));
rmSync("out/404", { recursive: true, force: true }); // Next's unstyled default.
console.log("[export] 404.html written.");

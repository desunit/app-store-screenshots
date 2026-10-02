import type { FontFace, ProjectState } from "./types";

/** The font stack for one locale: exact code, then its language, then the project font. */
export function fontForLocale(state: Pick<ProjectState, "localeFonts">, locale: string, fallback: string): string {
  const map = state.localeFonts || {};
  return map[locale] || map[locale.split(/[-_]/)[0]] || fallback;
}

/** CSS for the project's extra font files. */
export function fontFaceCss(faces: FontFace[] | undefined): string {
  return (faces || [])
    .filter((f) => f && typeof f.family === "string" && typeof f.src === "string")
    .map((f) => `@font-face { font-family: "${f.family}"; src: url("${f.src}"); font-weight: ${f.weight || "400"}; font-display: block; }`)
    .join("\n");
}

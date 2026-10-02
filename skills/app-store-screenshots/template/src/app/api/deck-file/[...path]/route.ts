import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { deckDir } from "@/lib/deck-dir";

// Serves <DECK_DIR>/public/<path> when the editor runs on a deck outside its own folder
// (next.config.mjs rewrites unmatched paths here). The editor's own public/ wins.
const TYPES: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp",
  svg: "image/svg+xml", ttf: "font/ttf", otf: "font/otf", woff: "font/woff", woff2: "font/woff2",
  json: "application/json", txt: "text/plain; charset=utf-8",
};

export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const parts = (await ctx.params).path || [];
  const root = path.join(deckDir(), "public");
  const file = path.resolve(root, ...parts.map((p) => decodeURIComponent(p)));
  if (!file.startsWith(root + path.sep)) return new NextResponse(null, { status: 404 });
  const type = TYPES[path.extname(file).slice(1).toLowerCase()];
  if (!type) return new NextResponse(null, { status: 404 });
  try {
    const bytes = await fs.readFile(file);
    return new NextResponse(new Uint8Array(bytes), {
      headers: { "Content-Type": type, "Content-Length": String(bytes.length), "Cache-Control": "no-cache" },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // Next 16.3+ otherwise writes AGENTS.md / CLAUDE.md into every scaffolded
  // project on first `dev`, leaving a dirty tree before anything is edited.
  agentRules: false,
  // One build folder per deck, so two apps' editors can run at once (scripts/deck).
  distDir: process.env.DECK_DIST || ".next",
  async rewrites() {
    if (!process.env.DECK_DIR) return [];
    // Files the editor does not have come from the deck's public/ folder.
    return { fallback: [{ source: "/:path*", destination: "/api/deck-file/:path*" }] };
  },
};

export default nextConfig;

import { spawnSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

type Developer = {
  name: string;
  avatar: string;
  tools: string[];
};

const width = 1200;
const height = 630;
const root = fileURLToPath(new URL("..", import.meta.url));
const publicPath = join(root, "frontend/public");
const developersPath = join(root, "frontend/src/data/developers.json");
const svgPath = join(publicPath, "og.svg");
const outputPath = join(publicPath, "og.png");
const developers = JSON.parse(readFileSync(developersPath, "utf8"))
  .developers as Developer[];
const primaryDeveloper = developers[0];
const toolTags = unique(primaryDeveloper.tools).slice(0, 3);

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

function escapeXML(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function imageBase64(path: string): string {
  return readFileSync(path).toString("base64");
}

function imageMimeType(path: string): string {
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  return "image/png";
}

function primaryAvatar(): string {
  const avatarPath = join(publicPath, primaryDeveloper.avatar);
  return `data:${imageMimeType(avatarPath)};base64,${imageBase64(avatarPath)}`;
}

const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fff7ed"/>
      <stop offset="0.54" stop-color="#f8fafc"/>
      <stop offset="1" stop-color="#d1fae5"/>
    </linearGradient>
    <linearGradient id="accent" x1="72" y1="78" x2="1070" y2="568" gradientUnits="userSpaceOnUse">
      <stop stop-color="#f97316"/>
      <stop offset="0.52" stop-color="#14b8a6"/>
      <stop offset="1" stop-color="#111827"/>
    </linearGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M42 0H0V42" stroke="#111827" stroke-opacity="0.055"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <path d="M-76 532C110 426 230 498 386 318C535 146 736 124 896 199C1048 271 1063 141 1272 82" stroke="url(#accent)" stroke-width="82" stroke-linecap="round" stroke-opacity="0.13"/>
  <path d="M-68 555C138 444 258 504 412 352C560 206 732 187 889 249C1045 311 1104 213 1268 170" stroke="url(#accent)" stroke-width="3" stroke-linecap="round" stroke-opacity="0.46"/>
  <g transform="translate(74 67)">
    <rect width="260" height="48" rx="24" fill="#111827"/>
    <circle cx="30" cy="24" r="8" fill="#f97316"/>
    <circle cx="48" cy="24" r="8" fill="#14b8a6"/>
    <text x="72" y="31" fill="#f9fafb" font-family="Space Grotesk, Avenir Next, sans-serif" font-size="22" font-weight="800">IndieDevUse.com</text>
  </g>
  <text x="76" y="198" fill="#111827" font-family="Space Grotesk, Avenir Next, sans-serif" font-size="78" font-weight="900">Which tools are</text>
  <text x="76" y="282" fill="#111827" font-family="Space Grotesk, Avenir Next, sans-serif" font-size="78" font-weight="900">indie devs using?</text>
  <g transform="translate(76 342)">
    <rect width="804" height="92" rx="46" fill="#ffffff" stroke="#111827" stroke-width="4"/>
    <circle cx="50" cy="46" r="16" stroke="#111827" stroke-width="6"/>
    <path d="M62 58l20 20" stroke="#111827" stroke-width="6" stroke-linecap="round"/>
    <rect x="624" y="14" width="160" height="64" rx="32" fill="#111827"/>
    <text x="704" y="55" text-anchor="middle" fill="#f9fafb" font-family="Space Grotesk, Avenir Next, sans-serif" font-size="24" font-weight="900">Search</text>
  </g>
  <g opacity="0.86" transform="translate(618 462)">
    <rect width="430" height="102" rx="22" fill="#ffffff" stroke="#e5e7eb"/>
    <clipPath id="primary-avatar"><circle cx="48" cy="46" r="30"/></clipPath>
    <image href="${primaryAvatar()}" x="18" y="16" width="60" height="60" clip-path="url(#primary-avatar)" preserveAspectRatio="xMidYMid slice"/>
    <text x="96" y="43" fill="#111827" font-family="Space Grotesk, Avenir Next, sans-serif" font-size="22" font-weight="900">${escapeXML(primaryDeveloper.name)}</text>
    <text x="96" y="72" fill="#6b7280" font-family="Space Grotesk, Avenir Next, sans-serif" font-size="18" font-weight="800">${escapeXML(toolTags.join(" + "))}</text>
  </g>
</svg>`;

writeFileSync(svgPath, svg);

const proc = spawnSync("magick", [svgPath, outputPath], { encoding: "utf8" });

rmSync(svgPath);

if (proc.status !== 0) {
  throw new Error(proc.stderr || "Failed to generate OG image");
}

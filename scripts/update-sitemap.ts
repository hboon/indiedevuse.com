#!/usr/bin/env bun

import fs from "fs";
import path from "path";

const projectRoot = path.resolve(__dirname, "..");
const sitemapPath = path.join(projectRoot, "frontend/public/sitemap.xml");
const developersPath = path.join(
  projectRoot,
  "frontend/src/data/developers.json",
);

const SITE = "https://indiedevuse.com";
const START_MARKER = "<!-- GENERATED_DEVELOPER_ROUTES_START -->";
const END_MARKER = "<!-- GENERATED_DEVELOPER_ROUTES_END -->";
const INDEXABLE_STATIC_ROUTES = [
  { path: "/indie-developer-tech-stacks", priority: "0.8" },
  { path: "/saas-tech-stack-generator", priority: "0.8" },
];

function getExistingLocs(sitemapContent: string): Set<string> {
  const locs = new Set<string>();
  const locRegex = /<loc>([^<]+)<\/loc>/g;
  let match;
  while ((match = locRegex.exec(sitemapContent)) !== null) {
    locs.add(match[1]);
  }
  return locs;
}

function run() {
  const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
  const developersData = JSON.parse(fs.readFileSync(developersPath, "utf-8"));
  const today = new Date().toISOString().split("T")[0];

  const startIndex = sitemapContent.indexOf(START_MARKER);
  const endIndex = sitemapContent.indexOf(END_MARKER);
  if (startIndex === -1 || endIndex === -1) {
    console.error("❌ Could not find start/end markers in sitemap.xml");
    process.exit(1);
  }

  const originalBeforeGenerated = sitemapContent.substring(
    0,
    startIndex + START_MARKER.length,
  );
  const afterGenerated = sitemapContent.substring(endIndex);
  const outsideGenerated =
    originalBeforeGenerated.substring(0, startIndex) +
    sitemapContent.substring(endIndex + END_MARKER.length);
  const existingLocs = getExistingLocs(outsideGenerated);
  const staticEntries = INDEXABLE_STATIC_ROUTES.filter(
    (route) => !existingLocs.has(`${SITE}${route.path}`),
  ).map((route) =>
    [
      `  <url>`,
      `    <loc>${SITE}${route.path}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <priority>${route.priority}</priority>`,
      `  </url>`,
    ].join("\n"),
  );
  const beforeGenerated =
    staticEntries.length > 0
      ? originalBeforeGenerated.replace(
          `\n  ${START_MARKER}`,
          `\n${staticEntries.join("\n")}\n  ${START_MARKER}`,
        )
      : originalBeforeGenerated;

  const developerEntries: string[] = [];
  let skippedCount = 0;

  for (const dev of developersData.developers) {
    const loc = `${SITE}/developer/${dev.id}`;
    if (existingLocs.has(loc)) {
      skippedCount++;
      continue;
    }
    developerEntries.push(
      [
        `  <url>`,
        `    <loc>${loc}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <priority>0.7</priority>`,
        `  </url>`,
      ].join("\n"),
    );
  }

  const generatedBlock =
    developerEntries.length > 0
      ? "\n" + developerEntries.join("\n") + "\n  "
      : "\n  ";
  const updatedSitemap = beforeGenerated + generatedBlock + afterGenerated;

  fs.writeFileSync(sitemapPath, updatedSitemap, "utf-8");
  console.log(
    `✅ Sitemap updated: ${staticEntries.length} static routes added, ${developerEntries.length} developer routes added, ${skippedCount} duplicates skipped`,
  );
}

run();

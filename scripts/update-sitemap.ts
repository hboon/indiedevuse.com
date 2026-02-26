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

  const startIndex = sitemapContent.indexOf(START_MARKER);
  const endIndex = sitemapContent.indexOf(END_MARKER);
  if (startIndex === -1 || endIndex === -1) {
    console.error("❌ Could not find start/end markers in sitemap.xml");
    process.exit(1);
  }

  const beforeGenerated = sitemapContent.substring(
    0,
    startIndex + START_MARKER.length,
  );
  const afterGenerated = sitemapContent.substring(endIndex);
  const outsideGenerated =
    beforeGenerated.substring(0, startIndex) +
    sitemapContent.substring(endIndex + END_MARKER.length);
  const existingLocs = getExistingLocs(outsideGenerated);

  const today = new Date().toISOString().split("T")[0];
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
    `✅ Sitemap updated: ${developerEntries.length} developer routes added, ${skippedCount} duplicates skipped`,
  );
}

run();

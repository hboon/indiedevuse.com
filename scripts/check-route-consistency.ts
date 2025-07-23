#!/usr/bin/env bun

import fs from "fs";
import path from "path";
import { parse } from "yaml";

const projectRoot = path.resolve(__dirname, "..");
const viteConfigPath = path.join(projectRoot, "frontend/vite.config.ts");
const renderYamlPath = path.join(projectRoot, "render.yaml");

interface RenderRoute {
  type: string;
  source: string;
  destination: string;
}

interface RenderService {
  type: string;
  name: string;
  runtime: string;
  routes?: RenderRoute[];
}

interface RenderConfig {
  services: RenderService[];
}

function extractRoutesFromViteConfig(content: string): string[] {
  const routesMatch = content.match(/routes:\s*\[(.*?)\]/s);
  if (!routesMatch) {
    throw new Error("Could not find routes array in vite.config.ts");
  }
  const routesString = routesMatch[1];
  const routes =
    routesString.match(/"([^"]+)"/g)?.map((r) => r.replace(/"/g, "")) || [];
  return routes;
}

function extractRollupInputsFromViteConfig(content: string): Set<string> {
  const inputMatch = content.match(/input:\s*{([^}]+)}/s);
  if (!inputMatch) {
    return new Set<string>();
  }
  const inputsString = inputMatch[1];
  const inputs = new Set<string>();
  const lines = inputsString.split("\n").filter((line) => line.trim());
  for (const line of lines) {
    const fileMatch = line.match(/"([^"]+\.html)"/);
    if (fileMatch) {
      inputs.add(fileMatch[1]);
    }
  }
  return inputs;
}

function extractRoutesFromRenderYaml(content: string): RenderRoute[] {
  const config: RenderConfig = parse(content);
  const webService = config.services.find(
    (s) => s.type === "web" && s.runtime === "static",
  );
  if (!webService) {
    throw new Error("Could not find static web service in render.yaml");
  }
  if (!webService.routes) {
    throw new Error("No routes found in static web service");
  }
  return webService.routes.filter(
    (r) => r.type === "rewrite" && r.source !== "/*",
  );
}

function getExpectedInputHtmlFile(route: string): string {
  if (route === "/") {
    return "index.html";
  }
  const routeName = route.substring(1);
  return `index-${routeName}.html`;
}

function getExpectedDestination(route: string): string {
  if (route === "/") {
    return "/index-root.html";
  }
  const routeName = route.substring(1).replace(/\//g, "-");
  return `/index-${routeName}.html`;
}

function checkRouteConsistency(): boolean {
  let hasErrors = false;
  const unnecessaryRollupInputs: Array<{ route: string; file: string }> = [];
  const missingRenderRoutes: Array<{ route: string; destination: string }> = [];
  const incorrectDestinations: Array<{
    route: string;
    expected: string;
    actual: string;
  }> = [];

  const viteConfigContent = fs.readFileSync(viteConfigPath, "utf-8");
  const renderYamlContent = fs.readFileSync(renderYamlPath, "utf-8");

  const viteRoutes = extractRoutesFromViteConfig(viteConfigContent);
  const rollupInputs = extractRollupInputsFromViteConfig(viteConfigContent);
  const renderRoutes = extractRoutesFromRenderYaml(renderYamlContent);

  for (const route of viteRoutes) {
    const expectedInputFile = getExpectedInputHtmlFile(route);

    if (
      expectedInputFile !== "index.html" &&
      rollupInputs.has(expectedInputFile)
    ) {
      console.error(
        `❌ Route "${route}" has HTML file "${expectedInputFile}" in rollupOptions.input but it should not be there (all routes should use index.html)`,
      );
      unnecessaryRollupInputs.push({ route, file: expectedInputFile });
      hasErrors = true;
    }

    const renderRoute = renderRoutes.find((r) => r.source === route);
    if (!renderRoute) {
      console.error(
        `❌ Route "${route}" is in prerender.routes but missing from render.yaml routes`,
      );
      const expectedDestination = getExpectedDestination(route);
      missingRenderRoutes.push({ route, destination: expectedDestination });
      hasErrors = true;
    } else {
      const expectedDestination = getExpectedDestination(route);
      if (renderRoute.destination !== expectedDestination) {
        console.error(
          `❌ Route "${route}" has incorrect destination in render.yaml. Expected: "${expectedDestination}", Got: "${renderRoute.destination}"`,
        );
        incorrectDestinations.push({
          route,
          expected: expectedDestination,
          actual: renderRoute.destination,
        });
        hasErrors = true;
      }
    }
  }

  for (const renderRoute of renderRoutes) {
    if (!viteRoutes.includes(renderRoute.source)) {
      console.error(
        `❌ Route "${renderRoute.source}" is in render.yaml but missing from vite.config.ts prerender.routes`,
      );
      hasErrors = true;
    }
  }

  if (!hasErrors) {
    //console.log(
    //"✅ All routes are consistent between vite.config.ts and render.yaml",
    //);
  } else {
    if (unnecessaryRollupInputs.length > 0) {
      console.log(
        "\n📋 Remove these entries from vite.config.ts rollupOptions.input:",
      );
      unnecessaryRollupInputs.forEach(({ route, file }) => {
        const key =
          route === "/" ? "root" : route.substring(1).replace(/-/g, "_");
        console.log(`   ${key}: path.resolve(__dirname, "${file}")`);
      });
    }

    if (missingRenderRoutes.length > 0) {
      console.log("\n📋 Add to render.yaml routes:");
      missingRenderRoutes.forEach(({ route, destination }) => {
        console.log(`      - type: rewrite`);
        console.log(`        source: ${route}`);
        console.log(`        destination: ${destination}`);
      });
    }

    if (incorrectDestinations.length > 0) {
      console.log("\n📋 Fix these destinations in render.yaml:");
      incorrectDestinations.forEach(({ route, expected, actual }) => {
        console.log(`   Route: ${route}`);
        console.log(`   Change: ${actual} → ${expected}`);
        console.log("");
      });
    }
  }

  return !hasErrors;
}

if (require.main === module) {
  const isConsistent = checkRouteConsistency();
  process.exit(isConsistent ? 0 : 1);
}

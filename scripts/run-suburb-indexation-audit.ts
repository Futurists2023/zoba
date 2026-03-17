import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  MIDRAND_LAST_UPDATED_AT,
  midrandSchoolSeeds,
  midrandSuburbs,
  schoolCoverage,
} from "@/lib/affordable-schools/catalog";
import { createClaudeCompletion } from "@/lib/claude";

type PromptConfig = {
  name: string;
  version: string;
  purpose: string;
  platform_context?: unknown;
  objective?: string;
  policy_alignment?: unknown;
  model_role?: string;
  required_inputs?: unknown;
  audit_tasks?: unknown;
  page_family_scoring_framework?: unknown;
  suburb_decision_rules?: unknown;
  required_output_schema?: unknown;
  mandatory_instructions?: unknown;
  prompt_text: string;
  success_criteria?: unknown;
};

type RouteKind = "page" | "api" | "metadata";

type RouteEntry = {
  relativePath: string;
  route: string;
  kind: RouteKind;
  indexability: "potentially_indexable" | "non_indexable" | "redirect" | "non_page_asset";
  signals: string[];
};

type FileContext = {
  relativePath: string;
  content: string;
};

const repoRoot = process.cwd();
const defaultPromptPath = "a:\\BACKUP\\Downloads\\swe_suburb_indexation_audit_prompt.json";
const defaultOutputPath = path.join(
  repoRoot,
  "research",
  "suburb-indexation-audit-opus-4-6.md",
);
const auditModel = process.env.ANTHROPIC_AUDIT_MODEL ?? "claude-opus-4-6";

const supplementalContextFiles = [
  "app/layout.tsx",
  "public/robots.txt",
  "components/affordable-schools/landing-page.tsx",
  "components/affordable-schools/live-discovery.tsx",
  "components/affordable-schools/results-list.tsx",
  "components/affordable-schools/filter-panel.tsx",
  "components/affordable-schools/search-wizard.tsx",
  "lib/site.ts",
  "lib/db/server.ts",
  "lib/affordable-schools/engine.ts",
  "lib/affordable-schools/query.ts",
  "lib/affordable-schools/shared.ts",
  "lib/affordable-schools/types.ts",
] as const;

const linkSummaryFiles = [
  "app/page.tsx",
  "components/affordable-schools/live-discovery.tsx",
  "components/affordable-schools/results-list.tsx",
  "components/affordable-schools/search-wizard.tsx",
  "app/affordable-schools/midrand/compare/page.tsx",
  "app/affordable-schools/midrand/shortlist/page.tsx",
  "app/affordable-schools/midrand/schools/[slug]/page.tsx",
] as const;

async function readJsonFile<T>(filePath: string) {
  const file = await readFile(filePath, "utf8");
  return JSON.parse(file) as T;
}

async function walkFiles(directoryPath: string): Promise<string[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const absolutePath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        return walkFiles(absolutePath);
      }

      if (entry.isFile()) {
        return [path.relative(repoRoot, absolutePath)];
      }

      return [];
    }),
  );

  return files.flat();
}

function toPosix(filePath: string) {
  return filePath.replaceAll("\\", "/");
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function getInfoString(relativePath: string) {
  if (relativePath.endsWith(".tsx")) {
    return "tsx";
  }

  if (relativePath.endsWith(".ts")) {
    return "ts";
  }

  if (relativePath.endsWith(".txt")) {
    return "txt";
  }

  return "";
}

function extractCaptureGroup(content: string, pattern: RegExp, groupIndex = 1) {
  return unique(
    [...content.matchAll(pattern)]
      .map((match) => match[groupIndex]?.trim() ?? "")
      .filter(Boolean),
  );
}

function isAppRouteFile(relativePath: string) {
  const posixPath = toPosix(relativePath);
  return (
    posixPath === "app/page.tsx" ||
    posixPath === "app/sitemap.ts" ||
    posixPath.endsWith("/page.tsx") ||
    posixPath.endsWith("/route.ts")
  );
}

function getRouteKind(relativePath: string): RouteKind {
  const posixPath = toPosix(relativePath);

  if (posixPath === "app/sitemap.ts") {
    return "metadata";
  }

  if (posixPath.includes("/api/")) {
    return "api";
  }

  return "page";
}

function getRouteFromFile(relativePath: string) {
  const posixPath = toPosix(relativePath);

  if (posixPath === "app/page.tsx") {
    return "/";
  }

  if (posixPath === "app/sitemap.ts") {
    return "/sitemap.xml";
  }

  if (posixPath.endsWith("/route.ts")) {
    return `/${posixPath.slice("app/".length, -"/route.ts".length)}`;
  }

  if (posixPath.endsWith("/page.tsx")) {
    return `/${posixPath.slice("app/".length, -"/page.tsx".length)}`;
  }

  throw new Error(`Unsupported app route file: ${relativePath}`);
}

function collectRouteSignals(relativePath: string, content: string) {
  const signals: string[] = [];
  const canonicalValues = extractCaptureGroup(content, /canonical:\s*"([^"]+)"/g);
  const redirectTargets = extractCaptureGroup(
    content,
    /redirect\((["'`])([^"'`]+)\1/g,
    2,
  );
  const fetchTargets = extractCaptureGroup(content, /fetch\((["'`])([^"'`]+)\1/g, 2);

  for (const canonicalValue of canonicalValues) {
    signals.push(`canonical ${canonicalValue}`);
  }

  if (/robots:\s*{[\s\S]*index:\s*false/.test(content)) {
    signals.push(/follow:\s*false/.test(content) ? "robots noindex,nofollow" : "robots noindex");
  } else if (/robots:\s*{[\s\S]*index:\s*true/.test(content)) {
    signals.push("robots index,follow");
  }

  for (const redirectTarget of redirectTargets) {
    signals.push(`redirect ${redirectTarget}`);
  }

  for (const fetchTarget of fetchTargets) {
    signals.push(`fetch ${fetchTarget}`);
  }

  if (content.includes("generateMetadata")) {
    signals.push("dynamic metadata");
  }

  return unique(signals);
}

function getIndexability(kind: RouteKind, signals: string[]): RouteEntry["indexability"] {
  if (kind !== "page") {
    return "non_page_asset";
  }

  if (signals.some((signal) => signal.startsWith("redirect "))) {
    return "redirect";
  }

  if (signals.some((signal) => signal.includes("noindex"))) {
    return "non_indexable";
  }

  return "potentially_indexable";
}

async function readContextFile(relativePath: string) {
  const absolutePath = path.join(repoRoot, relativePath);
  const content = await readFile(absolutePath, "utf8");

  return {
    relativePath,
    content,
  } satisfies FileContext;
}

async function loadRouteEntries() {
  const appFiles = (await walkFiles(path.join(repoRoot, "app")))
    .filter(isAppRouteFile)
    .sort((left, right) => toPosix(left).localeCompare(toPosix(right)));
  const routeContexts = await Promise.all(appFiles.map(readContextFile));

  return routeContexts
    .map<RouteEntry>(({ relativePath, content }) => {
      const kind = getRouteKind(relativePath);
      const signals = collectRouteSignals(relativePath, content);

      return {
        relativePath,
        route: getRouteFromFile(relativePath),
        kind,
        indexability: getIndexability(kind, signals),
        signals,
      };
    })
    .sort((left, right) => left.route.localeCompare(right.route));
}

async function loadFileContexts(relativePaths: readonly string[]) {
  return Promise.all(relativePaths.map(readContextFile));
}

function buildRouteInventory(routeEntries: RouteEntry[]) {
  const lines = routeEntries.map((entry) => {
    const detail = [
      entry.kind,
      entry.indexability.replaceAll("_", " "),
      ...entry.signals,
      `source ${entry.relativePath}`,
    ];

    return `- ${entry.route} [${detail.join("; ")}]`;
  });

  lines.push(
    "- /robots.txt [static asset; allow all; sitemap http://localhost:3000/sitemap.xml; source public/robots.txt]",
  );

  return lines.join("\n");
}

function getExpectedPageFamilies(config: PromptConfig) {
  const platformContext = config.platform_context;

  if (
    platformContext &&
    typeof platformContext === "object" &&
    !Array.isArray(platformContext)
  ) {
    const currentFamilies = (
      platformContext as {
        current_indexable_page_families?: unknown;
      }
    ).current_indexable_page_families;

    if (Array.isArray(currentFamilies)) {
      return currentFamilies.filter((family): family is string => typeof family === "string");
    }
  }

  return [
    "/affordable-schools/[suburb]",
    "/affordable-primary-schools/[suburb]",
    "/affordable-high-schools/[suburb]",
  ];
}

function buildPageFamilyCoverageNotes(config: PromptConfig) {
  const expectedFamilies = getExpectedPageFamilies(config);

  return expectedFamilies
    .map((family) => {
      switch (family) {
        case "/affordable-schools/[suburb]":
          return "- `/affordable-schools/[suburb]`: only prototyped as the static `/affordable-schools/midrand` route. There is no dynamic `[suburb]` segment or national-scale route implementation yet.";
        case "/affordable-primary-schools/[suburb]":
          return "- `/affordable-primary-schools/[suburb]`: only prototyped as the static `/affordable-primary-schools/midrand` route. There is no dynamic `[suburb]` segment yet.";
        case "/affordable-high-schools/[suburb]":
          return "- `/affordable-high-schools/[suburb]`: absent from the app router, sitemap, and data model.";
        default:
          return `- \`${family}\`: not matched to a concrete route-family implementation in the current app snapshot.`;
      }
    })
    .join("\n");
}

function buildDataCoverageSummary() {
  const schoolTypeCounts = Object.entries(
    midrandSchoolSeeds.reduce<Record<string, number>>((counts, seed) => {
      counts[seed.schoolType] = (counts[seed.schoolType] ?? 0) + 1;
      return counts;
    }, {}),
  ).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));

  const suburbCounts = Object.entries(
    midrandSchoolSeeds.reduce<Record<string, number>>((counts, seed) => {
      counts[seed.suburbSlug] = (counts[seed.suburbSlug] ?? 0) + 1;
      return counts;
    }, {}),
  )
    .map(([slug, count]) => {
      const suburbName = midrandSuburbs.find((suburb) => suburb.slug === slug)?.name ?? slug;
      return `${suburbName}=${count}`;
    })
    .sort((left, right) => left.localeCompare(right));

  return [
    `- Geographic coverage: ${midrandSuburbs.length} Midrand suburbs only.`,
    `- School inventory: ${midrandSchoolSeeds.length} schools across the prototype catalog.`,
    `- Stage coverage: ${schoolCoverage.gradesFrom} to ${schoolCoverage.gradesTo} only; there is no high-school inventory in the current seed model.`,
    `- School-type mix: ${schoolTypeCounts.map(([schoolType, count]) => `${schoolType}=${count}`).join(", ")}.`,
    `- Schools per suburb: ${suburbCounts.join(", ")}.`,
    `- Freshness marker: ${MIDRAND_LAST_UPDATED_AT}.`,
    '- Trust/data label: the matching engine marks all records and reviews as simulated via `confidenceLevel: "simulated"` and `isSimulated: true`.',
  ].join("\n");
}

function buildRenderedSurfaceSummary() {
  return [
    "- `/affordable-schools/midrand`: hero, Midrand guide copy, live filter panel, and live school-card results rendered through `LandingPage -> LiveDiscovery`.",
    "- `/affordable-primary-schools/midrand`: the same `LandingPage -> LiveDiscovery` module stack with primary-specific hero and guide copy only.",
    "- `/affordable-schools/midrand/results`: noindexed utility page that renders current filters plus the same `ResultsList` cards.",
    "- `/affordable-schools/midrand/shortlist`: noindexed shortlist review with summary highlight cards and a comparison table.",
    "- `/affordable-schools/midrand/schools/[slug]`: noindexed school detail with fee cards, quick facts, simulated reviews, and similar-school links.",
  ].join("\n");
}

function buildMetadataAndCrawlNotes(fileContents: Map<string, string>) {
  const layoutContent = fileContents.get("app/layout.tsx") ?? "";
  const sitemapContent = fileContents.get("app/sitemap.ts") ?? "";
  const robotsContent = fileContents.get("public/robots.txt") ?? "";
  const siteContent = fileContents.get("lib/site.ts") ?? "";

  const sitemapUrlCount = extractCaptureGroup(sitemapContent, /url:\s*`?\$\{siteUrl\}([^`\n]+)`?/g);
  const notes = [
    "- `app/layout.tsx` sets a global canonical and Open Graph URL to `/affordable-schools/midrand`, with layout-level robots set to index/follow true.",
    "- `/affordable-schools/midrand` and `/affordable-primary-schools/midrand` each declare their own canonical URL and remain indexable by default.",
    "- `/affordable-schools/midrand/results`, `/compare`, `/shortlist`, and `/schools/[slug]` all explicitly set `robots: { index: false, follow: false }`.",
    "- `app/page.tsx` redirects `/` to `/affordable-schools/midrand`.",
    `- \`app/sitemap.ts\` emits ${sitemapUrlCount.length} concrete URLs: ${sitemapUrlCount.map((suffix) => suffix.replace(/^\//, "/")).join(", ")}.`,
    `- \`public/robots.txt\` currently resolves to: ${robotsContent.trim().replaceAll("\r\n", " | ").replaceAll("\n", " | ")}.`,
    siteContent.includes('return "http://localhost:3000";')
      ? '- `lib/site.ts` falls back to `http://localhost:3000` when `NEXT_PUBLIC_SITE_URL` is unset.'
      : "- `lib/site.ts` does not expose a localhost fallback.",
    layoutContent.includes('canonical: "/affordable-schools/midrand"')
      ? "- The root layout hardcodes the hub canonical, so pages without a page-level canonical inherit a Midrand-biased default."
      : "- The root layout does not hardcode a hub canonical.",
  ];

  return notes.join("\n");
}

function extractLinkTargets(content: string) {
  return unique([
    ...extractCaptureGroup(content, /href=\{?(["'`])([^"'`]+)\1\}?/g, 2),
    ...extractCaptureGroup(content, /router\.push\((["'`])([^"'`]+)\1/g, 2),
    ...extractCaptureGroup(content, /redirect\((["'`])([^"'`]+)\1/g, 2),
    ...extractCaptureGroup(content, /fetch\((["'`])([^"'`]+)\1/g, 2),
  ]);
}

function buildInternalLinkSummary(fileContents: Map<string, string>) {
  const summaryLines = linkSummaryFiles.flatMap((relativePath) => {
    const content = fileContents.get(relativePath);

    if (!content) {
      return [];
    }

    const targets = extractLinkTargets(content);

    if (targets.length === 0) {
      return [];
    }

    return [`- \`${relativePath}\`: ${targets.join("; ")}`];
  });
  const allTargets = summaryLines.join("\n");

  if (!allTargets.includes("/affordable-primary-schools/")) {
    summaryLines.push(
      "- No audited UX file links users from the broad Midrand page to the primary-leaf page, or vice versa; the two indexable pages are siblings without an in-product cross-link path.",
    );
  }

  if (allTargets.includes("/affordable-schools/midrand/schools/")) {
    summaryLines.push(
      "- The shared school-card and detail flows always resolve into the `/affordable-schools/midrand/...` namespace, even when the user starts on `/affordable-primary-schools/midrand`.",
    );
  }

  return summaryLines.join("\n");
}

function buildFilterAndParameterSummary(fileContents: Map<string, string>) {
  const queryContent = fileContents.get("lib/affordable-schools/query.ts") ?? "";
  const parsedKeys = extractCaptureGroup(queryContent, /getValue\("([^"]+)"\)/g);
  const serializedKeys = extractCaptureGroup(queryContent, /params\.set\("([^"]+)"\)/g);
  const searchWizardImportedElsewhere = [...fileContents.entries()].some(
    ([relativePath, content]) =>
      relativePath !== "components/affordable-schools/search-wizard.tsx" &&
      content.includes("SearchWizard"),
  );

  return [
    `- Parsed filter keys: ${parsedKeys.join(", ")}.`,
    `- Serialized filter keys: ${serializedKeys.join(", ")}.`,
    "- `components/affordable-schools/live-discovery.tsx` refreshes matches with a POST request to `/api/affordable-schools/midrand/match`, so the indexable landing page does not expose live filter permutations as crawlable query URLs.",
    "- `components/affordable-schools/results-list.tsx` appends a `schools` parameter when sending users into the noindexed shortlist flow.",
    searchWizardImportedElsewhere
      ? "- `components/affordable-schools/search-wizard.tsx` is imported elsewhere, so `/affordable-schools/midrand/results?...` can be reached through a UI path."
      : "- `components/affordable-schools/search-wizard.tsx` exists but is not imported elsewhere in the audited app snapshot, so the query-string results page appears to be a dormant utility flow rather than the primary landing experience.",
  ].join("\n");
}

function buildTemplateSimilarityNotes(fileContents: Map<string, string>) {
  const broadPage = fileContents.get("app/affordable-schools/midrand/page.tsx") ?? "";
  const primaryPage = fileContents.get("app/affordable-primary-schools/midrand/page.tsx") ?? "";
  const liveDiscovery = fileContents.get("components/affordable-schools/live-discovery.tsx") ?? "";
  const landingPage = fileContents.get("components/affordable-schools/landing-page.tsx") ?? "";

  const broadUsesLandingPage = broadPage.includes("<LandingPage variant=\"hub\" />");
  const primaryUsesLandingPage = primaryPage.includes("<LandingPage variant=\"primary\" />");
  const variantSwitchCount = (liveDiscovery.match(/isHub \?/g) ?? []).length;
  const defaultMatchPayloadShared =
    landingPage.includes("matchSchools(filters)") &&
    landingPage.includes("getDefaultFilters()");

  return [
    broadUsesLandingPage && primaryUsesLandingPage
      ? "- Both indexable Midrand pages import the same `LandingPage` component and differ only by a `variant` prop plus page-level metadata."
      : "- The broad and primary Midrand pages do not clearly share the same landing template.",
    defaultMatchPayloadShared
      ? "- `LandingPage` always calls `matchSchools(getDefaultFilters())`, so both indexable pages hydrate the same default ranking payload before any user interaction."
      : "- `LandingPage` does not appear to hydrate the same default ranking payload for both variants.",
    `- \`LiveDiscovery\` branches on the \`variant\` flag ${variantSwitchCount} times, and those branches are copy-level changes rather than different data, filters, or card modules.`,
    "- `ResultsList` routes detail and shortlist actions into the broad `/affordable-schools/midrand/...` subtree, which weakens the separateness of the primary-leaf page.",
    "- The underlying catalog and engine model only Grade R to Grade 7 schools, so the broad suburb page is effectively serving primary-only inventory under a broader URL.",
  ].join("\n");
}

function buildSchemaNotes(fileContents: Map<string, string>) {
  const schemaHits = [...fileContents.entries()]
    .filter(([, content]) => /application\/ld\+json|jsonLd|schema markup|schema\.org/i.test(content))
    .map(([relativePath]) => relativePath);

  if (schemaHits.length === 0) {
    return "- No JSON-LD or schema-markup strings were found in the audited route, component, and library files.";
  }

  return `- Schema-related strings were found in: ${schemaHits.join(", ")}.`;
}

function buildImplementationNotes() {
  return [
    "- The prototype is static to the `midrand` slug today; there is no `[suburb]` dynamic route or national route-generation layer yet.",
    "- `matchSchools` scores budget, distance, must-haves, nice-to-haves, school-type preference, and ratings into one ranked list shared by both indexable templates.",
    "- The matching layer reads from Supabase only when `SUPABASE_DB_URL` is configured, otherwise it serves the local Midrand seed dataset.",
    "- School details, shortlist review, compare redirect, and results pages are explicitly utility flows rather than index targets.",
  ].join("\n");
}

function formatFileContext({ relativePath, content }: FileContext) {
  const infoString = getInfoString(relativePath);
  return `FILE: ${relativePath}\n\`\`\`${infoString}\n${content}\n\`\`\``;
}

function buildSystemPrompt(config: PromptConfig) {
  return [
    config.model_role ??
      "You are a Staff-level SEO, information architecture, product, and technical quality auditor.",
    "You are auditing a real Next.js codebase snapshot rather than a hypothetical architecture.",
    "Use only the supplied evidence and treat missing route families or missing schema as explicit findings.",
    "Be decisive, concrete, and implementation-oriented.",
    "Return Markdown with clear sections that map to the required output schema.",
    "Quote concrete routes, files, and behaviors from the provided context whenever they materially support a conclusion.",
  ].join("\n");
}

function buildUserPrompt(
  config: PromptConfig,
  routeEntries: RouteEntry[],
  fileContexts: FileContext[],
  fileContents: Map<string, string>,
) {
  return [
    `PROMPT CONFIG (${config.name} v${config.version})`,
    "```json",
    JSON.stringify(config, null, 2),
    "```",
    "",
    "ROUTE INVENTORY",
    buildRouteInventory(routeEntries),
    "",
    "EXPECTED PAGE FAMILY COVERAGE",
    buildPageFamilyCoverageNotes(config),
    "",
    "DATA COVERAGE SNAPSHOT",
    buildDataCoverageSummary(),
    "",
    "RENDERED SURFACE SNAPSHOT",
    buildRenderedSurfaceSummary(),
    "",
    "METADATA AND CRAWL SIGNALS",
    buildMetadataAndCrawlNotes(fileContents),
    "",
    "INTERNAL LINKING STRUCTURE",
    buildInternalLinkSummary(fileContents),
    "",
    "FILTER AND PARAMETER BEHAVIOR",
    buildFilterAndParameterSummary(fileContents),
    "",
    "TEMPLATE OVERLAP AND UNIQUENESS NOTES",
    buildTemplateSimilarityNotes(fileContents),
    "",
    "SCHEMA MARKUP NOTES",
    buildSchemaNotes(fileContents),
    "",
    "IMPLEMENTATION NOTES",
    buildImplementationNotes(),
    "",
    "CODEBASE CONTEXT",
    fileContexts.map(formatFileContext).join("\n\n"),
    "",
    "DELIVERY INSTRUCTIONS",
    "- Produce the final answer as the definitive internal architecture blueprint for this product team.",
    "- Explicitly decide the fate of each current or proposed suburb page family.",
    "- Include hard thresholds for index, conditional index, noindex, and merge/delete.",
    "- Include a crawl-control plan, launch gate checklist, and implementation roadmap.",
    "- Treat static `midrand` routes, simulated data labels, and the missing high-school family as first-order findings rather than implementation trivia.",
  ].join("\n");
}

function getPacketPath(outputPath: string) {
  const parsed = path.parse(outputPath);
  return path.join(parsed.dir, `${parsed.name}.packet.md`);
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function runWithRetries<T>(operation: () => Promise<T>, attempts: number) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      const isRetryable =
        message.includes("Internal server error") ||
        message.includes("overloaded_error") ||
        message.includes("529");

      if (!isRetryable || attempt === attempts) {
        throw error;
      }

      await sleep(attempt * 4000);
    }
  }

  throw lastError;
}

async function main() {
  const promptPath = process.argv[2] ?? defaultPromptPath;
  const outputPath = process.argv[3] ?? defaultOutputPath;
  const packetPath = getPacketPath(outputPath);

  const promptConfig = await readJsonFile<PromptConfig>(promptPath);
  const routeEntries = await loadRouteEntries();
  const contextFiles = unique(
    [...routeEntries.map((entry) => entry.relativePath), ...supplementalContextFiles],
  ).sort((left, right) => toPosix(left).localeCompare(toPosix(right)));
  const fileContexts = await loadFileContexts(contextFiles);
  const fileContents = new Map(fileContexts.map((context) => [context.relativePath, context.content]));
  const systemPrompt = buildSystemPrompt(promptConfig);
  const userPrompt = buildUserPrompt(promptConfig, routeEntries, fileContexts, fileContents);

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(
    packetPath,
    [
      "# System Prompt",
      "",
      "```txt",
      systemPrompt,
      "```",
      "",
      "# User Prompt",
      "",
      "```md",
      userPrompt,
      "```",
      "",
    ].join("\n"),
    "utf8",
  );

  const { text } = await runWithRetries(
    () =>
      createClaudeCompletion({
        model: auditModel,
        system: systemPrompt,
        prompt: userPrompt,
        maxTokens: 8192,
        temperature: 0.2,
      }),
    4,
  );

  await writeFile(outputPath, text, "utf8");

  console.log(`Model: ${auditModel}`);
  console.log(`Prompt: ${promptPath}`);
  console.log(`Packet: ${packetPath}`);
  console.log(`Report: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

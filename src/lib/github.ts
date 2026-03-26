import { cacheLife } from "next/cache";
import {
  CAPABILITY_SUMMARIES,
  CONTACT_LINKS,
  CURATED_REPOS,
  FEATURED_REPO_ORDER,
  GITHUB_OWNER,
  SNAPSHOT_PORTFOLIO,
  type CapabilityLane,
  type GitHubProfile,
  type GitHubRepoSummary,
  type PortfolioData,
  type ProjectDossier,
} from "@/lib/site-data";

type GitHubUserResponse = {
  name: string | null;
  bio: string | null;
  blog: string | null;
  location: string | null;
  html_url: string;
};

type GitHubRepoResponse = {
  name: string;
  description: string | null;
  language: string | null;
  homepage: string | null;
  html_url: string;
  updated_at: string;
};

type GitHubReadmeResponse = {
  html_url: string;
  download_url: string | null;
};

type GroqChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
};

type GroqRepoNarrative = {
  slug: string;
  lane: CapabilityLane;
  framing: string;
  note: string;
};

const FEATURED_REPO_COUNT = 6;
const EDITORIAL_PRIORITY = new Map<string, number>(
  FEATURED_REPO_ORDER.map((slug, index) => [slug, index]),
);
const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";

async function fetchGitHubJson<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      ...(process.env.GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
        : {}),
      "User-Agent": "rohith-build-ledger",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed for ${path}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function fetchReadme(slug: string): Promise<{
  readmeExcerpt: string | null;
  readmeUrl: string | null;
}> {
  try {
    const metadata = await fetchGitHubJson<GitHubReadmeResponse>(
      `/repos/${GITHUB_OWNER}/${slug}/readme`,
    );

    if (!metadata.download_url) {
      return { readmeExcerpt: null, readmeUrl: metadata.html_url ?? null };
    }

    const markdown = await fetch(metadata.download_url, {
      headers: {
        Accept: "text/plain",
        "User-Agent": "rohith-build-ledger",
      },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`README fetch failed for ${slug}`);
      }

      return response.text();
    });

    return {
      readmeExcerpt: extractReadmeExcerpt(markdown),
      readmeUrl: metadata.html_url ?? `${metadata.download_url}#readme`,
    };
  } catch {
    const snapshot = findSnapshotRepo(slug);

    return {
      readmeExcerpt: snapshot?.readmeExcerpt ?? null,
      readmeUrl:
        snapshot?.readmeUrl ?? `https://github.com/${GITHUB_OWNER}/${slug}#readme`,
    };
  }
}

function cleanNarrativeText(value: string, maxLength: number): string | null {
  const cleaned = value.replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return null;
  }

  return cleaned.length > maxLength
    ? `${cleaned.slice(0, maxLength - 3).trimEnd()}...`
    : cleaned;
}

function isCapabilityLane(value: string): value is CapabilityLane {
  return (
    value === "Product Engineering" ||
    value === "AI Systems" ||
    value === "Practical Tools"
  );
}

async function fetchGroqNarratives(
  repos: GitHubRepoSummary[],
): Promise<Map<string, GroqRepoNarrative>> {
  if (!process.env.GROQ_API_KEY) {
    return new Map();
  }

  const candidates = repos.filter(
    (repo) =>
      !CURATED_REPOS[repo.slug] && (repo.description || repo.readmeExcerpt),
  );

  if (candidates.length === 0) {
    return new Map();
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        max_completion_tokens: 2200,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You write brutally concise project framing for a public portfolio. Output valid JSON only. Never invent features, users, deployments, or metrics. Use only the repo metadata provided. Lanes must be one of: Product Engineering, AI Systems, Practical Tools.",
          },
          {
            role: "user",
            content: JSON.stringify({
              task: "For each repository, produce one lane, one short framing sentence, and one short note explaining why it belongs on the site. Keep framing under 115 characters and note under 180 characters.",
              output_schema: {
                repos: [
                  {
                    slug: "string",
                    lane: "Product Engineering | AI Systems | Practical Tools",
                    framing: "string",
                    note: "string",
                  },
                ],
              },
              repos: candidates.map((repo) => ({
                slug: repo.slug,
                name: repo.name,
                description: repo.description,
                language: repo.language,
                homepage: repo.homepage,
                readmeExcerpt: repo.readmeExcerpt,
                updatedAt: repo.updatedAt,
              })),
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq request failed: ${response.status}`);
    }

    const completion =
      (await response.json()) as GroqChatCompletionResponse;
    const content = completion.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Groq returned an empty response.");
    }

    const parsed = JSON.parse(content) as { repos?: unknown[] };
    const validSlugs = new Set(candidates.map((repo) => repo.slug));
    const narratives = new Map<string, GroqRepoNarrative>();

    for (const item of parsed.repos ?? []) {
      if (!item || typeof item !== "object") {
        continue;
      }

      const candidate = item as Partial<GroqRepoNarrative>;
      const slug = typeof candidate.slug === "string" ? candidate.slug : null;
      const lane = typeof candidate.lane === "string" ? candidate.lane : null;
      const framing =
        typeof candidate.framing === "string"
          ? cleanNarrativeText(candidate.framing, 115)
          : null;
      const note =
        typeof candidate.note === "string"
          ? cleanNarrativeText(candidate.note, 180)
          : null;

      if (
        !slug ||
        !validSlugs.has(slug) ||
        !lane ||
        !isCapabilityLane(lane) ||
        !framing ||
        !note
      ) {
        continue;
      }

      narratives.set(slug, { slug, lane, framing, note });
    }

    return narratives;
  } catch {
    return new Map();
  }
}

function extractReadmeExcerpt(markdown: string): string | null {
  const cleanedLines = markdown
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/`{1,3}/g, "")
    .split(/\r?\n/)
    .map((line) =>
      line
        .replace(/^#+\s*/, "")
        .replace(/^>\s*/, "")
        .replace(/[*_]/g, "")
        .trim(),
    )
    .filter(Boolean)
    .filter((line) => !/^[|:-]+$/.test(line))
    .filter((line) => !line.startsWith("http"));

  const candidate =
    cleanedLines.find((line) => line.length >= 60 && !line.endsWith("|")) ??
    cleanedLines.find((line) => line.length >= 28) ??
    null;

  if (!candidate) {
    return null;
  }

  return candidate.length > 220 ? `${candidate.slice(0, 217)}...` : candidate;
}

function findSnapshotRepo(slug: string) {
  return [...SNAPSHOT_PORTFOLIO.featured, ...SNAPSHOT_PORTFOLIO.archive].find(
    (repo) => repo.slug === slug,
  );
}

function buildProof(
  repo: GitHubRepoSummary,
  readmeExcerpt: string | null,
): string[] {
  const proof = new Set<string>();

  if (repo.language) {
    proof.add(repo.language);
  }

  if (repo.homepage) {
    proof.add("Live demo");
  }

  if (readmeExcerpt) {
    proof.add("README-backed");
  }

  proof.add(`Updated ${formatMonthYear(repo.updatedAt)}`);

  return Array.from(proof);
}

function toProfile(user: GitHubUserResponse): GitHubProfile {
  return {
    name: user.name ?? SNAPSHOT_PORTFOLIO.profile.name,
    bio: user.bio ?? SNAPSHOT_PORTFOLIO.profile.bio,
    location: user.location ?? SNAPSHOT_PORTFOLIO.profile.location,
    blogUrl: user.blog || SNAPSHOT_PORTFOLIO.profile.blogUrl,
    githubUrl: user.html_url,
    readmeUrl: SNAPSHOT_PORTFOLIO.profile.readmeUrl,
  };
}

function toRepoSummary(repo: GitHubRepoResponse): GitHubRepoSummary {
  return {
    name: repo.name,
    slug: repo.name,
    description: repo.description,
    language: repo.language,
    homepage: repo.homepage || null,
    repoUrl: repo.html_url,
    readmeUrl: null,
    updatedAt: repo.updated_at,
    readmeExcerpt: null,
  };
}

async function enrichRepo(repo: GitHubRepoSummary): Promise<GitHubRepoSummary> {
  const readme = await fetchReadme(repo.slug);

  return {
    ...repo,
    readmeExcerpt: readme.readmeExcerpt ?? repo.readmeExcerpt,
    readmeUrl: readme.readmeUrl ?? repo.readmeUrl,
  };
}

async function enrichRepoNarratives(
  repos: GitHubRepoSummary[],
): Promise<GitHubRepoSummary[]> {
  const groqNarratives = await fetchGroqNarratives(repos);

  return repos.map((repo) => {
    const narrative = groqNarratives.get(repo.slug);

    if (!narrative) {
      return repo;
    }

    return {
      ...repo,
      automatedLane: narrative.lane,
      automatedFraming: narrative.framing,
      automatedNote: narrative.note,
    };
  });
}

function buildArchive(
  repos: GitHubRepoSummary[],
  featured: ProjectDossier[],
): GitHubRepoSummary[] {
  const featuredSet = new Set(featured.map((repo) => repo.slug));

  return repos
    .filter((repo) => !featuredSet.has(repo.slug))
    .sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
    );
}

function inferLane(repo: GitHubRepoSummary): CapabilityLane {
  const signal = [
    repo.name,
    repo.description ?? "",
    repo.readmeExcerpt ?? "",
    repo.language ?? "",
  ]
    .join(" ")
    .toLowerCase();

  if (
    /\b(ai|ml|llm|rag|model|prediction|predict|recommend|agent|assistant|neural|sepsis|intelligent)\b/.test(
      signal,
    )
  ) {
    return "AI Systems";
  }

  if (
    /\b(qr|generator|tool|utility|cli|calculator|converter|automation|script)\b/.test(
      signal,
    )
  ) {
    return "Practical Tools";
  }

  if (
    repo.homepage ||
    /\b(app|dashboard|canvas|management|workflow|feedback|platform|frontend|full-stack|website)\b/.test(
      signal,
    )
  ) {
    return "Product Engineering";
  }

  return repo.language === "Python" ? "AI Systems" : "Practical Tools";
}

function buildAutomatedFraming(repo: GitHubRepoSummary) {
  if (repo.automatedFraming) {
    return repo.automatedFraming;
  }

  const source =
    repo.description ??
    repo.readmeExcerpt ??
    "Public repository with limited descriptive signal.";

  return source.length > 110 ? `${source.slice(0, 107)}...` : source;
}

function buildAutomatedNote(repo: GitHubRepoSummary) {
  if (repo.automatedNote) {
    return repo.automatedNote;
  }

  if (repo.homepage && repo.readmeExcerpt) {
    return "I am including this because the repo has both a readable README trail and a public live build.";
  }

  if (repo.readmeExcerpt) {
    return "I am including this because the README gives enough signal to explain what I built without extra filler.";
  }

  if (repo.description) {
    return "I am including this because the repository has recent public activity and a usable project description.";
  }

  return "I am keeping this visible because the repository is public, even if the documentation is still thin.";
}

function toDossier(repo: GitHubRepoSummary): ProjectDossier {
  const curated = CURATED_REPOS[repo.slug];

  return {
    ...repo,
    lane: curated?.lane ?? repo.automatedLane ?? inferLane(repo),
    framing: curated?.framing ?? buildAutomatedFraming(repo),
    note: curated?.note ?? buildAutomatedNote(repo),
    proof: buildProof(repo, repo.readmeExcerpt),
  };
}

function getFeaturedScore(repo: GitHubRepoSummary) {
  let score = 0;

  if (repo.readmeExcerpt) {
    score += 24;
  }

  if (repo.homepage) {
    score += 14;
  }

  if (repo.description) {
    score += 10;
  }

  if (repo.language) {
    score += 4;
  }

  if (CURATED_REPOS[repo.slug]) {
    score += 12;
  }

  const ageInDays =
    (Date.now() - new Date(repo.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
  score += Math.max(0, 18 - Math.min(ageInDays / 7, 18));

  return score;
}

function compareFeaturedRepos(left: GitHubRepoSummary, right: GitHubRepoSummary) {
  const scoreDifference = getFeaturedScore(right) - getFeaturedScore(left);

  if (scoreDifference !== 0) {
    return scoreDifference;
  }

  const leftPriority = EDITORIAL_PRIORITY.get(left.slug) ?? Number.POSITIVE_INFINITY;
  const rightPriority = EDITORIAL_PRIORITY.get(right.slug) ?? Number.POSITIVE_INFINITY;

  if (leftPriority !== rightPriority) {
    return leftPriority - rightPriority;
  }

  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}

function buildFeatured(repos: GitHubRepoSummary[]): ProjectDossier[] {
  return repos
    .slice()
    .sort(compareFeaturedRepos)
    .slice(0, FEATURED_REPO_COUNT)
    .map(toDossier);
}

function formatMonthYear(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export async function getPortfolioData(): Promise<PortfolioData> {
  "use cache";
  cacheLife("hours");

  try {
    const [user, repos] = await Promise.all([
      fetchGitHubJson<GitHubUserResponse>(`/users/${GITHUB_OWNER}`),
      fetchGitHubJson<GitHubRepoResponse[]>(
        `/users/${GITHUB_OWNER}/repos?per_page=100&sort=updated`,
      ),
    ]);

    const enrichedRepos = await Promise.all(
      repos.map((repo) => enrichRepo(toRepoSummary(repo))),
    );
    const reposWithNarratives = await enrichRepoNarratives(enrichedRepos);
    const featured = buildFeatured(reposWithNarratives);
    const archive = buildArchive(reposWithNarratives, featured);

    return {
      source: "live",
      profile: toProfile(user),
      featured,
      archive,
      repoCount: repos.length,
      recentUpdatedAt:
        repos[0]?.updated_at ?? SNAPSHOT_PORTFOLIO.recentUpdatedAt,
      contactLinks: CONTACT_LINKS,
      capabilitySummaries: CAPABILITY_SUMMARIES,
    };
  } catch {
    return SNAPSHOT_PORTFOLIO;
  }
}

export async function getProjectDossier(
  slug: string,
): Promise<ProjectDossier | null> {
  "use cache";
  cacheLife("hours");

  const portfolio = await getPortfolioData();

  const featured = portfolio.featured.find((repo) => repo.slug === slug);

  if (featured) {
    return featured;
  }

  const archiveRepo = portfolio.archive.find((repo) => repo.slug === slug);

  if (archiveRepo) {
    return toDossier(archiveRepo);
  }

  return null;
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioData, getProjectDossier } from "@/lib/github";
import { type CapabilityLane } from "@/lib/site-data";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const portfolio = await getPortfolioData();

  return [...portfolio.featured, ...portfolio.archive].map((repo) => ({
    slug: repo.slug,
  }));
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const dossier = await getProjectDossier(slug);

  if (!dossier) {
    return {
      title: "Project not found",
    };
  }

  return {
    title: `${dossier.name} project`,
    description: dossier.readmeExcerpt ?? dossier.framing,
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const [dossier, portfolio] = await Promise.all([
    getProjectDossier(slug),
    getPortfolioData(),
  ]);

  if (!dossier) {
    notFound();
  }

  const related = portfolio.featured.filter((repo) => repo.slug !== dossier.slug);

  return (
    <main className="flex-1">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <header className="paper-panel rounded-[2.25rem] px-6 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="section-label">Project Page</p>
                <span className={laneBadgeClass(dossier.lane)}>{dossier.lane}</span>
                <span className="rounded-full border border-white/45 bg-white/55 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted backdrop-blur-xl">
                  {formatShortDate(dossier.updatedAt)}
                </span>
              </div>
              <div className="mt-5 max-w-4xl">
                <h1 className="font-serif text-4xl leading-[0.95] tracking-tight [overflow-wrap:anywhere] sm:text-5xl lg:text-6xl">
                  {dossier.name}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-muted sm:text-lg">
                  {dossier.framing}
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-white/45 bg-white/55 px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:bg-white/72"
                  href="/"
                >
                  Back Home
                </Link>
                <a
                  className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  href={dossier.repoUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open Repository
                </a>
                {dossier.homepage ? (
                  <a
                    className="inline-flex items-center justify-center rounded-full border border-white/45 bg-white/55 px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:bg-white/72"
                    href={dossier.homepage}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Live Link
                  </a>
                ) : null}
              </div>
            </div>

            <div className="rounded-[2rem] focus-surface-strong p-5">
              <p className="section-label">What You Can Verify</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight">
                Everything here is publicly checkable.
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted">
                {dossier.homepage
                  ? "This dossier has repository access, a readable README trail, and a live build link."
                  : "This dossier is anchored to the repository and README because no public live build is linked."}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <SignalCard
                  detail="Source and commit trail are visible."
                  label="Repository"
                  value="Public"
                />
                <SignalCard
                  detail={
                    dossier.readmeExcerpt
                      ? "There is enough README signal to frame the work."
                      : "Public narrative is thin."
                  }
                  label="README"
                  value={dossier.readmeExcerpt ? "Readable" : "Limited"}
                />
                <SignalCard
                  detail={
                    dossier.homepage
                      ? "A public deployment is linked."
                      : "No live deployment is attached."
                  }
                  label="Live Build"
                  value={dossier.homepage ? "Linked" : "None"}
                />
              </div>
            </div>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1.85fr)]">
          <article className="paper-panel rounded-[2rem] px-6 py-6">
            <p className="section-label">Repository Snapshot</p>
            <dl className="mt-6 grid gap-4">
              <DataPoint label="Primary language" value={dossier.language ?? "Not set"} />
              <DataPoint label="Last public update" value={formatLongDate(dossier.updatedAt)} />
              <DataPoint
                label="Render source"
                value={
                  portfolio.source === "live"
                    ? "Live GitHub response"
                    : "Snapshot fallback"
                }
              />
              <DataPoint
                label="README status"
                value={dossier.readmeExcerpt ? "Readable public signal" : "No excerpt available"}
              />
            </dl>
          </article>

          <article className="paper-panel rounded-[2rem] px-6 py-6">
            <p className="section-label">README Signal</p>
            <p className="mt-5 rounded-[1.5rem] border border-line bg-paper-soft/75 px-4 py-4 text-sm leading-8 text-muted sm:text-base">
              {getReadableSignal(
                dossier.readmeExcerpt,
                "This repo does not expose enough README language for a stronger excerpt right now.",
                280,
              )}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {dossier.proof.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-medium text-muted"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
          <article className="paper-panel rounded-[2rem] px-6 py-6">
            <p className="section-label">Why I Included This</p>
            <p className="mt-4 text-base leading-8 text-muted">{dossier.note}</p>
          </article>

          <article className="paper-panel rounded-[2rem] px-6 py-6">
            <p className="section-label">Public Links</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <LinkTile
                href={dossier.repoUrl}
                label="Repository"
                body="Read the source, commit history, and README trail yourself."
              />
              {dossier.readmeUrl ? (
                <LinkTile
                  href={dossier.readmeUrl}
                  label="README"
                  body="Open the README I used to frame this project."
                />
              ) : null}
              {dossier.homepage ? (
                <LinkTile
                  href={dossier.homepage}
                  label="Live link"
                  body="Inspect the public-facing build attached to the repo."
                />
              ) : null}
              <LinkTile
                href={portfolio.profile.githubUrl}
                label="Profile"
                body="Go back to my full public GitHub profile."
              />
            </div>
          </article>
        </section>

        <section className="paper-panel rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">More Projects</p>
              <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
                More work from this portfolio.
              </h2>
            </div>
            <Link
              className="text-sm font-medium text-accent underline decoration-line underline-offset-4"
              href="/"
            >
              Back to home
            </Link>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {related.map((repo) => (
              <Link
                key={repo.slug}
                className="min-w-0 rounded-[1.5rem] border border-line bg-white/60 p-4 transition-colors hover:border-accent"
                href={`/work/${repo.slug}`}
              >
                <span className={laneBadgeClass(repo.lane)}>{repo.lane}</span>
                <h3 className="mt-4 text-lg font-semibold leading-snug [overflow-wrap:anywhere]">
                  {repo.name}
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {repo.framing}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function DataPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] focus-surface p-4">
      <dt className="section-label">{label}</dt>
      <dd className="mt-3 text-sm font-medium leading-7 text-foreground">
        {value}
      </dd>
    </div>
  );
}

function LinkTile({
  href,
  label,
  body,
}: {
  href: string;
  label: string;
  body: string;
}) {
  return (
    <a
      className="rounded-[1.5rem] focus-surface p-4 transition-colors hover:border-accent"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      <p className="section-label">{label}</p>
      <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
    </a>
  );
}

function SignalCard({
  detail,
  label,
  value,
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.5rem] focus-surface p-4">
      <p className="section-label">{label}</p>
      <p className="mt-3 text-lg font-semibold leading-none text-foreground">
        {value}
      </p>
      <p className="mt-3 text-sm leading-7 text-muted">{detail}</p>
    </div>
  );
}

function laneBadgeClass(lane: CapabilityLane) {
  const shared =
    "inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em]";

  switch (lane) {
    case "Product Engineering":
      return `${shared} border-accent/30 bg-accent-soft/70 text-accent`;
    case "AI Systems":
      return `${shared} border-[rgba(138,36,31,0.22)] bg-[rgba(138,36,31,0.1)] text-[rgb(127,31,27)]`;
    case "Practical Tools":
      return `${shared} border-[rgba(167,120,36,0.26)] bg-[rgba(247,223,173,0.58)] text-[rgb(136,95,20)]`;
  }
}

function formatLongDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getReadableSignal(
  value: string | null | undefined,
  fallback: string,
  maxLength = 280,
) {
  const cleaned = sanitizeProjectText(value);

  if (!cleaned) {
    return fallback;
  }

  return cleaned.length > maxLength
    ? `${cleaned.slice(0, maxLength - 3).trimEnd()}...`
    : cleaned;
}

function sanitizeProjectText(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const cleaned = value
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/\b(?:src|width|height|align|style|class|id|target|rel)\s*=\s*"[^"]*"/gi, " ")
    .replace(/\b(?:src|width|height|align|style|class|id|target|rel)\s*=\s*'[^']*'/gi, " ")
    .replace(/<[^>\n]*>/g, " ")
    .replace(/`{1,3}/g, "")
    .replace(/[<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned || /^(img|src|width|height|align|style|class|id)\b/i.test(cleaned)) {
    return null;
  }

  return cleaned;
}

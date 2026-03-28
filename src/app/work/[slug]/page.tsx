import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioData, getProjectDossier } from "@/lib/github";
import { type CapabilityLane, type ProjectDossier } from "@/lib/site-data";

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

  const description = getProjectMetaDescription(dossier);
  const socialImage = dossier.visual?.src ?? "/opengraph-image";

  return {
    title: dossier.name,
    description,
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: {
      title: `${dossier.name} | Rohith B`,
      description,
      type: "article",
      url: `/work/${slug}`,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${dossier.name} | Rohith B`,
      description,
      images: [socialImage],
    },
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

  const related = portfolio.featured
    .filter((repo) => repo.slug !== dossier.slug)
    .slice(0, 3);
  const problem =
    dossier.problem ??
    getReadableSignal(
      dossier.readmeExcerpt,
      "Public repository with limited written problem framing.",
      260,
    );
  const built =
    dossier.built ??
    getReadableSignal(
      dossier.readmeExcerpt,
      "Public repository with inspectable code and limited structured narrative.",
      260,
    );

  return (
    <main className="flex-1">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <header className="paper-panel rounded-[2.25rem] px-6 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="section-label">Project</p>
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

            <div>
              <ProjectVisualPanel dossier={dossier} priority />
              <p className="mt-4 text-sm leading-7 text-muted">{dossier.note}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <SignalCard
              detail="Source code, commits, and issue trail are public."
              label="Repository"
              value="Public"
            />
            <SignalCard
              detail={
                dossier.readmeExcerpt
                  ? "Readable public context is available."
                  : "Written context is limited."
              }
              label="README"
              value={dossier.readmeExcerpt ? "Available" : "Thin"}
            />
            <SignalCard
              detail={
                dossier.homepage
                  ? "Public deployment linked from the repository."
                  : "No live deployment linked."
              }
              label="Live Build"
              value={dossier.homepage ? "Linked" : "None"}
            />
          </div>

          {portfolio.source === "snapshot" ? (
            <div className="mt-5 rounded-[1.5rem] border border-line bg-white/70 px-4 py-3 text-sm leading-7 text-muted">
              Showing snapshot data because GitHub did not return a live response.
            </div>
          ) : null}
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <NarrativeCard label="Problem" body={problem} />
          <NarrativeCard label="Built" body={built} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <article className="paper-panel rounded-[2rem] px-6 py-6">
            <p className="section-label">
              {dossier.readmeExcerpt ? "README Summary" : "Repository Note"}
            </p>
            <p className="mt-5 rounded-[1.5rem] border border-line bg-paper-soft/75 px-4 py-4 text-sm leading-8 text-muted sm:text-base">
              {getReadableSignal(
                dossier.readmeExcerpt,
                getLeanProjectNote(dossier),
                320,
              )}
            </p>
          </article>

          <article className="paper-panel rounded-[2rem] px-6 py-6">
            <p className="section-label">Quick Facts</p>
            <dl className="mt-6 grid gap-4">
              <DataPoint label="Primary language" value={dossier.language ?? "Not set"} />
              <DataPoint label="Last public update" value={formatLongDate(dossier.updatedAt)} />
              <DataPoint
                label="README status"
                value={dossier.readmeExcerpt ? "Readable public signal" : "Limited or missing"}
              />
              <DataPoint
                label="Live build"
                value={dossier.homepage ? "Linked" : "No deployment linked"}
              />
            </dl>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <LinkTile
                href={dossier.repoUrl}
                label="Repository"
                body="Read the code, commits, and README."
              />
              {dossier.readmeUrl ? (
                <LinkTile
                  href={dossier.readmeUrl}
                  label="README"
                  body="Open the public documentation for this repo."
                />
              ) : null}
              {dossier.homepage ? (
                <LinkTile
                  href={dossier.homepage}
                  label="Live link"
                  body="Open the public build attached to the repo."
                />
              ) : null}
              <LinkTile
                href={portfolio.profile.githubUrl}
                label="Profile"
                body="Return to the wider GitHub profile."
              />
            </div>
          </article>
        </section>

        {related.length > 0 ? (
          <section className="paper-panel rounded-[2rem] px-6 py-7 sm:px-8 sm:py-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-label">Projects</p>
                <h2 className="mt-3 font-serif text-4xl leading-tight tracking-tight">
                  Other featured projects.
                </h2>
              </div>
              <Link
                className="text-sm font-medium text-accent underline decoration-line underline-offset-4"
                href="/"
              >
                Back to home
              </Link>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {related.map((repo) => (
                <Link
                  key={repo.slug}
                  className="min-w-0 rounded-[1.5rem] border border-line bg-white/60 p-4 transition-colors hover:border-accent"
                  href={`/work/${repo.slug}`}
                >
                  <ProjectVisualPanel dossier={repo} className="aspect-[4/3] rounded-[1.25rem]" />
                  <span className={`mt-4 ${laneBadgeClass(repo.lane)}`}>{repo.lane}</span>
                  <h3 className="mt-4 text-lg font-semibold leading-snug [overflow-wrap:anywhere]">
                    {repo.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{repo.framing}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function ProjectVisualPanel({
  dossier,
  priority = false,
  className = "aspect-[16/10] rounded-[2rem]",
}: {
  dossier: ProjectDossier;
  priority?: boolean;
  className?: string;
}) {
  if (!dossier.visual) {
    return (
      <div
        className={`${className} relative overflow-hidden border border-line bg-paper-soft`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(191,106,63,0.22),transparent_58%)]" />
      </div>
    );
  }

  return (
    <div
      className={`${className} relative overflow-hidden border border-line bg-paper-soft`}
    >
      <Image
        alt={dossier.visual.alt}
        className="object-cover object-top"
        fill
        priority={priority}
        sizes="(min-width: 1024px) 52vw, 100vw"
        src={dossier.visual.src}
      />
    </div>
  );
}

function NarrativeCard({ label, body }: { label: string; body: string }) {
  return (
    <article className="paper-panel rounded-[2rem] px-6 py-6">
      <p className="section-label">{label}</p>
      <p className="mt-4 text-base leading-8 text-muted">{body}</p>
    </article>
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

function getProjectMetaDescription(dossier: ProjectDossier) {
  return (
    dossier.problem ??
    dossier.framing ??
    getReadableSignal(
      dossier.readmeExcerpt,
      "Public project page for repository, README, and live build inspection.",
      180,
    )
  );
}

function getLeanProjectNote(dossier: ProjectDossier) {
  if (dossier.homepage && dossier.readmeExcerpt) {
    return "Public repo with a linked live build and readable README.";
  }

  if (dossier.readmeExcerpt) {
    return "Public repo with readable documentation and inspectable code.";
  }

  return "Public repo with limited written documentation.";
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
    .replace(
      /\b(?:src|width|height|align|style|class|id|target|rel)\s*=\s*"[^"]*"/gi,
      " ",
    )
    .replace(
      /\b(?:src|width|height|align|style|class|id|target|rel)\s*=\s*'[^']*'/gi,
      " ",
    )
    .replace(/<[^>\n]*>/g, " ")
    .replace(/`{1,3}/g, "")
    .replace(/[<>]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (
    !cleaned ||
    /^(img|src|width|height|align|style|class|id)\b/i.test(cleaned)
  ) {
    return null;
  }

  return cleaned;
}

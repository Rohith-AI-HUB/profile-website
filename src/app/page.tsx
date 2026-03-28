import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/logo-mark";
import { getPortfolioData } from "@/lib/github";
import type {
  CapabilityLane,
  ContactLink,
  GitHubRepoSummary,
  ProjectDossier,
} from "@/lib/site-data";

type PortfolioProject = GitHubRepoSummary | ProjectDossier;

export default async function Home() {
  const portfolio = await getPortfolioData();
  const primaryFeatured = portfolio.featured.slice(0, 3);
  const supportingRepos = [...portfolio.featured.slice(3), ...portfolio.archive].slice(
    0,
    8,
  );

  return (
    <main className="flex-1">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-6 sm:px-8 lg:px-10">
        <header className="paper-panel fade-rise rounded-4xl px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <LogoMark className="h-16 w-16 shrink-0" />
              <div>
                <p className="section-label">Build Ledger</p>
                <p className="mt-2 text-sm text-muted">
                  Projects, AI workflows, and tools I have built.
                </p>
              </div>
            </div>
            <nav
              aria-label="Section navigation"
              className="flex flex-wrap gap-2 text-sm text-muted"
            >
              {[
                ["Projects", "#selected"],
                ["More Work", "#archive"],
                ["Contact", "#contact"],
              ].map(([label, href]) => (
                <a
                  key={label}
                  className="rounded-full border border-line bg-white/55 px-4 py-2 transition-colors hover:border-accent hover:text-foreground"
                  href={href}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <div className="paper-panel fade-rise rounded-[2.25rem] px-6 py-7 sm:px-8 sm:py-9">
            <p className="section-label">Rohith B</p>
            <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[0.95] tracking-tight text-balance sm:text-6xl">
              I build full-stack web apps, AI workflows, and useful tools.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted sm:text-lg">
              {normalizeProfileBio(portfolio.profile.bio)}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper-soft shadow-[0_18px_32px_-24px_rgba(191,106,63,0.9)] transition-transform hover:-translate-y-0.5"
                href="#selected"
              >
                View Projects
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-line bg-white/60 px-6 py-3 text-sm font-medium transition-colors hover:border-accent hover:bg-accent-soft/50"
                href={portfolio.profile.githubUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open GitHub Profile
              </a>
            </div>
          </div>

          <aside className="grid gap-4">
            {primaryFeatured.map((repo) => (
              <FeaturedPreviewCard key={repo.slug} repo={repo} />
            ))}
            {portfolio.source === "snapshot" ? (
              <div className="rounded-3xl border border-line bg-white/60 px-4 py-3 text-sm leading-7 text-muted">
                Showing snapshot data because GitHub did not return a live response.
              </div>
            ) : null}
          </aside>
        </section>

        <section
          id="selected"
          className="paper-panel fade-rise rounded-4xl px-6 py-7 sm:px-8 sm:py-9"
        >
          <SectionIntro
            label="Projects"
            title="Featured work."
            body="Public repos, live builds, and project pages."
          />
          <div className="mt-8 grid gap-5 xl:grid-cols-3">
            {primaryFeatured.map((repo) => (
              <FeaturedProjectCard key={repo.slug} repo={repo} />
            ))}
          </div>
        </section>

        <section
          id="archive"
          className="paper-panel fade-rise rounded-4xl px-6 py-7 sm:px-8 sm:py-9"
        >
          <SectionIntro
            label="More Work"
            title="More public repositories."
            body="Recent and supporting repos outside the top featured set."
          />
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {supportingRepos.map((repo) => (
              <CompactRepoLink key={repo.slug} repo={repo} />
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="paper-panel fade-rise rounded-4xl px-6 py-7 sm:px-8 sm:py-9"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <SectionIntro
              label="Contact"
              title="GitHub for code. Email or LinkedIn for contact."
              body="The repository trail is public. These are the direct contact channels."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {portfolio.contactLinks.map((link) => (
                <ContactCard key={link.label} link={link} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionIntro({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="min-w-0 max-w-3xl">
      <p className="section-label">{label}</p>
      <h2 className="mt-4 font-serif text-[clamp(2.35rem,8vw,3rem)] leading-[0.98] tracking-tight sm:text-5xl">
        {title}
      </h2>
      {body ? (
        <p className="mt-4 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          {body}
        </p>
      ) : null}
    </div>
  );
}

function FeaturedPreviewCard({ repo }: { repo: ProjectDossier }) {
  return (
    <Link
      className="group relative overflow-hidden rounded-[2rem] border border-line bg-paper-soft"
      href={`/work/${repo.slug}`}
    >
      <ProjectVisualFrame
        priority
        repo={repo}
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="aspect-[16/10]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(28,20,14,0.78)] via-[rgba(28,20,14,0.18)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <span className={laneBadgeClass(repo.lane)}>{repo.lane}</span>
        <h2 className="mt-3 font-serif text-3xl leading-tight text-white [overflow-wrap:anywhere]">
          {repo.name}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-white/82 sm:text-base">
          {repo.framing}
        </p>
      </div>
    </Link>
  );
}

function FeaturedProjectCard({ repo }: { repo: ProjectDossier }) {
  return (
    <article className="min-w-0 rounded-[1.75rem] border border-line bg-white/60 p-5 transition-transform hover:-translate-y-1">
      <ProjectVisualFrame
        priority
        repo={repo}
        sizes="(min-width: 1280px) 30vw, (min-width: 768px) 46vw, 100vw"
        className="aspect-[4/3] rounded-[1.5rem]"
      />

      <p className="mt-3 text-sm leading-7 text-muted">{repo.note}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <span className={laneBadgeClass(repo.lane)}>{repo.lane}</span>
        <span className="rounded-full border border-line bg-white/75 px-3 py-1 text-xs font-medium text-muted">
          {formatMonthYear(repo.updatedAt)}
        </span>
      </div>

      <h3 className="mt-4 font-serif text-3xl leading-tight [overflow-wrap:anywhere]">
        {repo.name}
      </h3>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
        {repo.framing}
      </p>

      <div className="mt-5 grid gap-3">
        <ProjectFact
          label="Problem"
          value={repo.problem ?? getReadableSignal(repo.readmeExcerpt, repo.note, 180)}
        />
        <ProjectFact
          label="Built"
          value={
            repo.built ??
            getReadableSignal(
              repo.readmeExcerpt,
              "Public repository with limited narrative signal.",
              180,
            )
          }
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {repo.proof.map((item) => (
          <span
            key={item}
            className="rounded-full border border-line bg-white/75 px-3 py-1 text-xs font-medium text-muted"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          className="inline-flex min-w-40 items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          href={`/work/${repo.slug}`}
        >
          Open Project
        </Link>
        <a
          className="inline-flex min-w-40 items-center justify-center rounded-full border border-line bg-white/70 px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:bg-accent-soft/45"
          href={repo.repoUrl}
          rel="noreferrer"
          target="_blank"
        >
          Repository
        </a>
        {repo.homepage ? (
          <a
            className="inline-flex items-center justify-center rounded-full border border-line bg-white/70 px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:bg-accent-soft/45"
            href={repo.homepage}
            rel="noreferrer"
            target="_blank"
          >
            Live Link
          </a>
        ) : null}
      </div>
    </article>
  );
}

function ProjectVisualFrame({
  repo,
  className,
  sizes,
  priority = false,
}: {
  repo: ProjectDossier;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  if (!repo.visual) {
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
        alt={repo.visual.alt}
        className="object-cover object-top"
        fill
        priority={priority}
        sizes={sizes}
        src={repo.visual.src}
      />
    </div>
  );
}

function ProjectFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-line bg-paper-soft/75 px-4 py-4">
      <p className="section-label">{label}</p>
      <p className="mt-3 text-sm leading-7 text-muted">{value}</p>
    </div>
  );
}

function laneBadgeClass(lane: CapabilityLane) {
  const shared =
    "inline-flex shrink-0 items-center self-start rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em]";

  switch (lane) {
    case "Product Engineering":
      return `${shared} border-accent/30 bg-accent-soft/70 text-accent`;
    case "AI Systems":
      return `${shared} border-[rgba(138,36,31,0.22)] bg-[rgba(138,36,31,0.1)] text-[rgb(127,31,27)]`;
    case "Practical Tools":
      return `${shared} border-[rgba(167,120,36,0.26)] bg-[rgba(247,223,173,0.58)] text-[rgb(136,95,20)]`;
  }
}

function isProjectDossier(repo: PortfolioProject): repo is ProjectDossier {
  return "lane" in repo;
}

function getProjectSummary(repo: PortfolioProject) {
  const source = isProjectDossier(repo)
    ? repo.framing
    : repo.automatedFraming ?? repo.description ?? repo.readmeExcerpt;

  return getReadableSignal(
    source,
    "Public repository with limited narrative signal.",
    170,
  );
}

function getReadableSignal(
  value: string | null | undefined,
  fallback: string,
  maxLength = 220,
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

function CompactRepoLink({ repo }: { repo: PortfolioProject }) {
  return (
    <Link
      className="rounded-[1.5rem] focus-surface p-4 transition-colors hover:border-accent"
      href={`/work/${repo.slug}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug [overflow-wrap:anywhere]">
          {repo.name}
        </h3>
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
          {formatMonthYear(repo.updatedAt)}
        </span>
      </div>
      <p className="mt-2 text-sm leading-7 text-muted">{getProjectSummary(repo)}</p>
    </Link>
  );
}

function ContactCard({ link }: { link: ContactLink }) {
  return (
    <a
      className="rounded-3xl focus-surface p-5 transition-transform hover:-translate-y-1"
      href={link.href}
      rel="noreferrer"
      target={link.href.startsWith("mailto:") ? undefined : "_blank"}
    >
      <p className="section-label">Channel</p>
      <h3 className="mt-3 text-2xl font-semibold">{link.label}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{link.note}</p>
      <span className="mt-5 inline-flex text-sm font-medium text-accent">
        Open
      </span>
    </a>
  );
}

function normalizeProfileBio(bio: string) {
  const cleaned = bio.replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return "I build software and use this site to show what I can do through public work.";
  }

  return cleaned;
}

function formatMonthYear(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

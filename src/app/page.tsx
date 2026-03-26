import Link from "next/link";
import { getPortfolioData } from "@/lib/github";
import type {
  CapabilityLane,
  ContactLink,
  GitHubProfile,
  GitHubRepoSummary,
  ProjectDossier,
} from "@/lib/site-data";

export default async function Home() {
  const portfolio = await getPortfolioData();
  const allRepos = [...portfolio.featured, ...portfolio.archive];
  const liveDemoCount = allRepos.filter((repo) => repo.homepage).length;
  const featuredSlugs = new Set(portfolio.featured.map((repo) => repo.slug));
  const laneGroups = portfolio.capabilitySummaries.map((lane) => ({
    ...lane,
    repos: portfolio.featured.filter((repo) => repo.lane === lane.name),
  }));
  const currentProjects = [...allRepos]
    .sort(sortByUpdatedAt)
    .slice(0, 4)
    .map((repo) => ({
      isFeatured: featuredSlugs.has(repo.slug),
      repo,
    }));
  const topLanguages = getTopLanguages(allRepos, 4);
  const activeLanes = laneGroups.filter((lane) => lane.repos.length > 0);
  const roleTitle = deriveRoleTitle(portfolio.profile);

  return (
    <main className="flex-1">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-6 sm:px-8 lg:px-10">
        <header className="paper-panel fade-rise rounded-4xl px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="stamp-ring flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-paper-soft text-lg font-semibold tracking-[0.3em] text-accent">
                RB
              </div>
              <div>
                <p className="section-label">Build Ledger</p>
                <p className="mt-2 text-sm text-muted">
                  My public portfolio of products, AI workflows, and tools.
                </p>
              </div>
            </div>
            <nav
              aria-label="Section navigation"
              className="flex flex-wrap gap-2 text-sm text-muted"
            >
              {[
                ["About", "#about"],
                ["Qualifications", "#qualification"],
                ["Current", "#current"],
                ["Projects", "#ledger"],
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

        <section
          id="about"
          className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]"
        >
          <div className="paper-panel fade-rise rounded-[2.25rem] px-6 py-7 sm:px-8 sm:py-9">
            <p className="section-label">About Me</p>
            <h1 className="mt-4 max-w-xl font-serif text-5xl leading-[0.95] tracking-tight text-balance sm:text-6xl">
              I build full-stack products, AI-assisted workflows, and useful tools.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-muted sm:text-lg">
              {normalizeProfileBio(portfolio.profile.bio)}
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted sm:text-lg">
              I made this website to show what I can actually build, not just
              describe it. The projects below are backed by repositories,
              README trails, live demos where they exist, and recent public
              activity.
            </p>
            <div className="mt-8 grid gap-3">
              <IntroNote
                title="What I Build"
                body="I keep returning to product-style interfaces, AI-backed systems, and smaller tools with a clear purpose."
              />
              <IntroNote
                title="How I Work"
                body="I prefer usable interfaces, clear project scope, and code that someone else can inspect without guesswork."
              />
              <IntroNote
                title="What This Proves"
                body="This portfolio is meant to show capability, consistency, and shipping discipline through public work."
              />
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper-soft shadow-[0_18px_32px_-24px_rgba(191,106,63,0.9)] transition-transform hover:-translate-y-0.5"
                href="#ledger"
              >
                See My Projects
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

          <div className="paper-panel ambient-stage fade-rise rounded-[2.25rem] px-5 py-5 sm:px-6 sm:py-6">
            <div className="focus-surface-strong rounded-4xl p-6">
              <p className="section-label">How To Use This Site</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
                Start with the featured work, then inspect the code.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                I built this portfolio so a recruiter, collaborator, or client
                can understand my work quickly and verify it without chasing
                private documents.
              </p>
            </div>

            <div className="mt-6 rounded-[1.75rem] focus-surface p-5">
              <p className="section-label">What You Will Find</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                Featured projects first, recent public activity second, then
                the rest of my GitHub surface. The goal is clarity, not noise.
              </p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <MetricCard
                label="Base"
                value={portfolio.profile.location}
                detail="Where I am based right now."
              />
              <MetricCard
                label="Latest update"
                value={formatMonthYear(portfolio.recentUpdatedAt)}
                detail="How recent my public activity is."
              />
              <MetricCard
                label="Public repos"
                value={portfolio.repoCount.toString()}
                detail="Public repositories I can be evaluated through."
              />
              <MetricCard
                label="Live demos"
                value={liveDemoCount.toString()}
                detail="Projects with a public live link attached."
              />
            </div>
            <div className="mt-6 rounded-[1.75rem] focus-surface p-5">
              <p className="section-label">What I Want This To Show</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                I can take an idea, shape it into a working product or system,
                and leave a public trail that explains the build.
              </p>
            </div>
            {portfolio.source === "snapshot" ? (
              <div className="mt-4 rounded-3xl focus-surface px-4 py-3 text-sm leading-7 text-muted">
                GitHub did not respond cleanly, so this page is rendering from a
                local snapshot instead of failing hard.
              </div>
            ) : null}
          </div>
        </section>

        <section
          id="qualification"
          className="paper-panel fade-rise rounded-4xl px-6 py-7 sm:px-8 sm:py-9"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <SectionIntro
              label="Qualification Snapshot"
              title="What I can bring to a team or client."
              body="I am not using this section for vague self-praise. It is a compact read of the capability already visible in my public work."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <QualificationCard
                label="Role"
                value={roleTitle}
                detail={normalizeProfileBio(portfolio.profile.bio)}
              />
              <QualificationCard
                label="Core stack"
                value={formatList(topLanguages)}
                detail="These languages show up most often across my public projects."
              />
              <QualificationCard
                label="Focus areas"
                value={formatList(activeLanes.map((lane) => lane.name))}
                detail="This is where my strongest public project surface is concentrated."
              />
              <QualificationCard
                label="Public proof"
                value={`${portfolio.repoCount} repos / ${liveDemoCount} demos`}
                detail={`Recent public activity is still visible as of ${formatMonthYear(portfolio.recentUpdatedAt)}.`}
              />
            </div>
          </div>
        </section>

        <section
          id="current"
          className="paper-panel fade-rise rounded-4xl px-6 py-7 sm:px-8 sm:py-9"
        >
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="flex flex-col justify-between gap-6">
              <SectionIntro
                label="Current Workbench"
                title="Projects with the freshest public activity."
                body="This is the closest public signal of what I am touching right now. It is inferred from visible GitHub updates, not a private task tracker."
              />
              <div className="rounded-[1.75rem] focus-surface p-5">
                <p className="section-label">How To Read This</p>
                <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
                  A repo shows up here because I touched it more recently than
                  the rest of the public surface. Every item can open into a
                  project page, but this section is mainly about present-tense
                  momentum.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {currentProjects.length > 0 ? (
                <>
                  <CurrentProjectCard
                    isFeatured={currentProjects[0].isFeatured}
                    repo={currentProjects[0].repo}
                    variant="lead"
                  />
                  <div className="grid gap-4 md:grid-cols-3">
                    {currentProjects.slice(1).map((project) => (
                      <CurrentProjectCard
                        key={project.repo.slug}
                        isFeatured={project.isFeatured}
                        repo={project.repo}
                        variant="compact"
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-[1.75rem] focus-surface p-5 text-sm leading-7 text-muted">
                  No public activity signal is available right now.
                </div>
              )}
            </div>
          </div>
        </section>

        <section
          id="ledger"
          className="paper-panel fade-rise rounded-4xl px-6 py-7 sm:px-8 sm:py-9"
        >
          <SectionIntro
            label="Project Ledger"
            title="Six projects I would ask you to open first."
            body="If you want the shortest read on what I can build, start here. Each project is backed by public code and documentation."
          />
          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            {portfolio.featured.map((repo, index) => (
              <article
                key={repo.slug}
                className="min-w-0 rounded-[1.75rem] border border-line bg-white/60 p-5 transition-transform hover:-translate-y-1"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                    Project {String(index + 1).padStart(2, "0")}
                  </p>
                  <span className={laneBadgeClass(repo.lane)}>{repo.lane}</span>
                </div>
                <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-tight wrap-anywhere">
                  {repo.name}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted sm:text-base">
                  {repo.framing}
                </p>

                <p className="mt-5 rounded-3xl border border-line bg-paper-soft/75 px-4 py-3 text-sm leading-7 text-muted">
                  {repo.readmeExcerpt ?? "README excerpt unavailable in the current source."}
                </p>

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
                    className="inline-flex min-w-42 items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                    href={`/work/${repo.slug}`}
                  >
                    Open Project
                  </Link>
                  <a
                    className="inline-flex min-w-42 items-center justify-center rounded-full border border-line bg-white/70 px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:bg-accent-soft/45"
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
            ))}
          </div>
        </section>

        <section
          id="capability"
          className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,2.05fr)]"
        >
          <div className="paper-panel fade-rise rounded-4xl px-6 py-7 sm:px-8 sm:py-9">
            <SectionIntro
              label="What I Do"
              title="I group my work by the kind of systems I build."
              body="This is closer to how I think than listing every framework I have touched."
            />
          </div>

          <div className="grid gap-5">
            {laneGroups.map((lane) => (
              <article
                key={lane.name}
                className="paper-panel fade-rise rounded-4xl px-6 py-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="section-label">{lane.name}</p>
                    <h3 className="mt-3 font-serif text-3xl leading-tight">
                      {lane.summary}
                    </h3>
                  </div>
                  <span className={laneBadgeClass(lane.name)}>
                    {lane.repos.length} featured projects
                  </span>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {lane.repos.map((repo) => (
                    <Link
                      key={repo.slug}
                      className="min-w-0 rounded-3xl border border-line bg-white/60 p-4 transition-colors hover:border-accent"
                      href={`/work/${repo.slug}`}
                    >
                      <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted">
                        {formatMonthYear(repo.updatedAt)}
                      </p>
                      <h4 className="mt-3 text-lg font-semibold leading-snug wrap-anywhere">
                        {repo.name}
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-muted">
                        {repo.framing}
                      </p>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="archive"
          className="paper-panel fade-rise rounded-4xl px-6 py-7 sm:px-8 sm:py-9"
        >
          <SectionIntro
            label="Archive"
            title="The rest of my public work stays visible."
            body="I keep older or thinner repos here instead of pretending every project deserves the front page. They still get a project page."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {portfolio.archive.slice(0, 12).map((repo) => (
              <ArchiveCard key={repo.slug} repo={repo} />
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="paper-panel fade-rise rounded-4xl px-6 py-7 sm:px-8 sm:py-9"
        >
          <SectionIntro
            label="Contact Rail"
            title="If you want to reach me, use these."
            body="No embedded form here. I would rather keep the contact path simple and public."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {portfolio.contactLinks.map((link) => (
              <ContactCard key={link.label} link={link} />
            ))}
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
  body: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="section-label">{label}</p>
      <h2 className="mt-4 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{body}</p>
    </div>
  );
}

type PortfolioProject = GitHubRepoSummary | ProjectDossier;

function CurrentProjectCard({
  isFeatured,
  repo,
  variant,
}: {
  isFeatured: boolean;
  repo: PortfolioProject;
  variant: "compact" | "lead";
}) {
  const summary = getProjectSummary(repo);
  const updatedLabel = formatActivityDate(repo.updatedAt);
  const lane = isProjectDossier(repo) ? repo.lane : repo.automatedLane ?? null;
  const shellClass =
    variant === "lead"
      ? "rounded-[1.75rem] focus-surface-strong p-5 sm:p-6"
      : "min-w-0 rounded-[1.5rem] focus-surface p-4";
  const titleClass =
    variant === "lead"
      ? "mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl"
      : "mt-3 text-lg font-semibold leading-snug [overflow-wrap:anywhere]";

  return (
    <article className={shellClass}>
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="rounded-full border border-white/50 bg-white/52 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          {isFeatured ? "Featured project" : "Current project"}
        </span>
        {lane ? <span className={laneBadgeClass(lane)}>{lane}</span> : null}
        <span className="rounded-full border border-white/50 bg-white/52 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
          {updatedLabel}
        </span>
      </div>

      <h3 className={titleClass}>{repo.name}</h3>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-base">
        {summary}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {repo.language ? (
          <span className="rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-medium text-muted">
            {repo.language}
          </span>
        ) : null}
        {repo.homepage ? (
          <span className="rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-medium text-muted">
            Live link available
          </span>
        ) : null}
        {repo.readmeExcerpt ? (
          <span className="rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-medium text-muted">
            README signal
          </span>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          href={`/work/${repo.slug}`}
        >
          Open Project
        </Link>
        <a
          className="inline-flex items-center justify-center rounded-full border border-line bg-white/70 px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:bg-accent-soft/45"
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

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-3xl focus-surface p-5">
      <p className="section-label">{label}</p>
      <p className="mt-4 font-serif text-4xl leading-none tracking-tight sm:text-5xl">
        {value}
      </p>
      <p className="mt-4 text-sm leading-7 text-muted">{detail}</p>
    </div>
  );
}

function QualificationCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-3xl focus-surface p-5">
      <p className="section-label">{label}</p>
      <h3 className="mt-4 font-serif text-2xl leading-tight tracking-tight text-balance sm:text-3xl">
        {value}
      </h3>
      <p className="mt-4 text-sm leading-7 text-muted">{detail}</p>
    </article>
  );
}

function IntroNote({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-3xl focus-surface p-4">
      <p className="section-label">{title}</p>
      <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
    </article>
  );
}

function ArchiveCard({ repo }: { repo: GitHubRepoSummary }) {
  const summary = getProjectSummary(repo);

  return (
    <article className="min-w-0 rounded-3xl focus-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-snug wrap-anywhere">
            {repo.name}
          </h3>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-muted">
            {repo.language ?? "Language not set"}
          </p>
        </div>
        <span className="rounded-full border border-white/50 bg-white/52 px-3 py-1 text-xs font-medium text-muted">
          {formatMonthYear(repo.updatedAt)}
        </span>
      </div>
      <p className="mt-4 text-sm leading-7 text-muted">
        {summary}
      </p>
      <p className="mt-3 text-sm leading-7 text-muted">
        I am keeping this visible, but it is not one of the first projects I
        would lead with yet.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          className="text-sm font-medium text-accent underline decoration-line underline-offset-4"
          href={`/work/${repo.slug}`}
        >
          Open Project
        </Link>
        <a
          className="text-sm font-medium text-foreground underline decoration-line underline-offset-4"
          href={repo.repoUrl}
          rel="noreferrer"
          target="_blank"
        >
          Repository
        </a>
        {repo.homepage ? (
          <a
            className="text-sm font-medium text-foreground underline decoration-line underline-offset-4"
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
  if (isProjectDossier(repo)) {
    return repo.framing;
  }

  return (
    repo.automatedFraming ??
    repo.description ??
    repo.readmeExcerpt ??
    "Public repository with recent GitHub activity but limited narrative signal."
  );
}

function deriveRoleTitle(profile: GitHubProfile) {
  const bio = normalizeProfileBio(profile.bio);
  const match = bio.match(/^i(?:'m| am) an? ([^.,]+)/i);

  if (match?.[1]) {
    return capitalize(match[1].split(" passionate")[0].trim());
  }

  return "Full-stack developer";
}

function normalizeProfileBio(bio: string) {
  const cleaned = bio.replace(/\s+/g, " ").trim();

  if (!cleaned) {
    return "I build software and use this site to show what I can do through public work.";
  }

  return cleaned;
}

function getTopLanguages(repos: PortfolioProject[], limit: number) {
  const counts = new Map<string, number>();

  for (const repo of repos) {
    if (!repo.language) {
      continue;
    }

    counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([language]) => language);
}

function formatList(values: string[]) {
  if (values.length === 0) {
    return "Public portfolio";
  }

  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function sortByUpdatedAt(left: PortfolioProject, right: PortfolioProject) {
  return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
}

function formatActivityDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatMonthYear(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

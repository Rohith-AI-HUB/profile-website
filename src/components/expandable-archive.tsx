"use client";

import Link from "next/link";
import type { GitHubRepoSummary } from "@/lib/site-data";

type Props = {
  repos: GitHubRepoSummary[];
};

const INITIAL_VISIBLE = 8;

function getProjectSummary(repo: GitHubRepoSummary) {
  return repo.automatedFraming ?? repo.description ?? repo.readmeExcerpt ?? "Public repository";
}

function formatMonthYear(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function CompactRepoLink({ repo }: { repo: GitHubRepoSummary }) {
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

export function ExpandableArchive({ repos }: Props) {
  const hasMore = repos.length > INITIAL_VISIBLE;

  return (
    <>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        {repos.slice(0, INITIAL_VISIBLE).map((repo) => (
          <CompactRepoLink key={repo.slug} repo={repo} />
        ))}
      </div>
      {hasMore && (
        <ExpandButton repos={repos} />
      )}
    </>
  );
}

function ExpandButton({ repos }: { repos: GitHubRepoSummary[] }) {
  return (
    <details className="group mt-4">
      <summary className="cursor-pointer list-none text-center">
        <span className="inline-flex items-center justify-center rounded-full border border-line bg-white/60 px-6 py-3 text-sm font-medium transition-colors hover:border-accent hover:bg-accent-soft/50">
          More Repos ({repos.length - INITIAL_VISIBLE} more)
        </span>
      </summary>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {repos.slice(INITIAL_VISIBLE).map((repo) => (
          <CompactRepoLink key={repo.slug} repo={repo} />
        ))}
      </div>
    </details>
  );
}
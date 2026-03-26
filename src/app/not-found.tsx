import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
      <div className="paper-panel max-w-2xl rounded-[2rem] px-8 py-10 text-center">
        <p className="section-label">Project Missing</p>
        <h1 className="mt-4 font-serif text-5xl leading-tight tracking-tight">
          That project is not part of the current GitHub surface.
        </h1>
        <p className="mt-5 text-base leading-8 text-muted">
          This page now auto-generates project pages from public repository data.
          If a repo still fails here, it usually means the slug does not exist
          in the current GitHub response or GitHub did not return usable data.
        </p>
        <Link
          className="mt-8 inline-flex rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          href="/"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

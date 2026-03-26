export default function Loading() {
  return (
    <main className="flex-1">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10">
        <div className="paper-panel rounded-[2rem] px-6 py-6">
          <div className="h-6 w-32 rounded-full bg-paper-strong" />
          <div className="mt-5 h-16 max-w-3xl rounded-[1.5rem] bg-paper-strong" />
          <div className="mt-4 h-24 max-w-4xl rounded-[1.5rem] bg-paper-strong" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="paper-panel rounded-[2rem] px-6 py-6"
            >
              <div className="h-5 w-28 rounded-full bg-paper-strong" />
              <div className="mt-5 h-40 rounded-[1.5rem] bg-paper-strong" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function ReaderLoading() {
  return (
    <div className="fixed inset-0 z-[100] bg-foreground/45" role="status" aria-label="Loading article">
      <div className="absolute inset-0 mx-auto h-[100dvh] w-full max-w-[1360px] overflow-hidden bg-background sm:inset-y-6 sm:h-auto sm:rounded-[8px]">
        <div className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
          <div className="h-7 w-44 animate-pulse rounded bg-muted motion-reduce:animate-none" />
          <div className="h-9 w-9 animate-pulse rounded bg-muted motion-reduce:animate-none" />
        </div>
        <div className="mx-auto max-w-[760px] space-y-5 px-5 py-8 sm:px-8 sm:py-12">
          <div className="aspect-[16/9] w-full animate-pulse rounded-[4px] bg-muted motion-reduce:animate-none" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted motion-reduce:animate-none" />
          <div className="h-10 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
          <div className="h-10 w-4/5 animate-pulse rounded bg-muted motion-reduce:animate-none" />
          <div className="space-y-3 pt-4">
            <div className="h-4 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
            <div className="h-4 w-full animate-pulse rounded bg-muted motion-reduce:animate-none" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted motion-reduce:animate-none" />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading the complete article</span>
    </div>
  );
}

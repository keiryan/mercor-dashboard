export function SkeletonCard() {
  return (
    <div className="rounded-lg bg-card p-6 shadow-[0_4px_12px_0_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_0_rgba(0,0,0,0.5)] dark:border dark:border-border/50">
      <div className="h-[400px] animate-pulse bg-muted rounded-md"></div>
    </div>
  );
}
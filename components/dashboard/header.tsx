import { ThemeToggle } from '../theme-toggle';

export function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-2xl font-bold">Task Dashboard</h1>
        <ThemeToggle />
      </div>
    </header>
  );
}
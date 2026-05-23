import Link from "next/link";
import { Button } from "@/components/ui/button";

const checks = [
  "Next.js App Router + TypeScript",
  "Prisma + PostgreSQL",
  "Generated OpenAPI from Zod",
  "Vitest + Playwright quality gates",
  "Agent-first documentation",
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-12">
      <section className="rounded-2xl border bg-[var(--card)] p-8 shadow-sm">
        <p className="mb-3 text-sm font-medium text-[var(--muted-foreground)]">
          Agentic Next PWA Template
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          A small production starter for humans and agents.
        </h1>
        <p className="mt-4 text-lg text-[var(--muted-foreground)]">
          Use this as a clean base for projects that need repeatable setup,
          strong checks, Dockerized dependencies, and explicit agent rules.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/docs">Open API Docs</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/api/health">Health JSON</Link>
          </Button>
        </div>
      </section>

      <ul className="grid gap-3 sm:grid-cols-2">
        {checks.map((check) => (
          <li
            className="rounded-xl border bg-[var(--card)] px-4 py-3 text-sm"
            key={check}
          >
            {check}
          </li>
        ))}
      </ul>
    </main>
  );
}

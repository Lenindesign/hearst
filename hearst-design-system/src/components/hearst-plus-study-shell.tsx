import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ProductFooter, ProductHeader } from "@/components/product-story-shell";

export function HearstPlusStudyShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <ThemeProvider defaultBrandSlug="hearst-all">
      <div className="hearst-plus-theme hearst-plus-strategy-document min-h-screen overflow-x-clip bg-background text-foreground">
        <ProductHeader current="reference" appearance="navy" />
        <main>
          <header className="bg-[var(--hp-utility-bar)] text-primary-foreground">
            <div className="mx-auto max-w-[1200px] px-5 py-12 md:px-10 md:py-16">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-primary-foreground/75">{eyebrow}</p>
              <h1 className="mt-5 max-w-5xl font-serif text-5xl leading-[1.02] tracking-[-.025em] md:text-7xl">{title}</h1>
              <p className="mt-6 max-w-4xl text-base leading-7 text-primary-foreground/80 md:text-lg">{description}</p>
              <Link href="/hearst-plus-brief/" className="mt-7 inline-flex min-h-11 items-center font-semibold text-primary-foreground underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground">Back to the executive brief</Link>
            </div>
          </header>
          <div className="mx-auto max-w-[1200px] space-y-14 px-5 py-10 md:space-y-16 md:px-10 md:py-14">{children}</div>
        </main>
        <ProductFooter />
      </div>
    </ThemeProvider>
  );
}

export function StudySection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t-2 border-primary pt-5">
      <p className="text-xs font-bold uppercase tracking-[.15em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 max-w-4xl font-serif text-3xl leading-tight md:text-4xl">{title}</h2>
      <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground md:text-base">{children}</div>
    </section>
  );
}

export function StudySource({
  href,
  title,
  children,
}: {
  href: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="grid gap-2 py-4 md:grid-cols-[.7fr_1.3fr] md:gap-8">
      <a className="font-semibold text-foreground underline underline-offset-4" href={href} target="_blank" rel="noreferrer">{title}</a>
      <p className="text-sm leading-6 text-muted-foreground">{children}</p>
    </li>
  );
}

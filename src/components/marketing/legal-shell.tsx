import { TriangleAlert } from "lucide-react";
import { Container } from "@/components/ui/container";
import type { LegalDoc } from "@/lib/legal";

export function LegalShell({ doc }: { doc: LegalDoc }) {
  return (
    <>
      {/* Header */}
      <section className="border-b border-border bg-surface/30">
        <Container className="py-12 sm:py-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Legal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {doc.title}
          </h1>
          <p className="mt-2 text-sm text-muted-2">Last updated: {doc.updated}</p>
          <p className="mt-5 max-w-3xl text-pretty leading-relaxed text-muted">{doc.intro}</p>
        </Container>
      </section>

      {/* Body */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[230px_1fr] lg:gap-14">
            {/* TOC */}
            <aside className="hidden lg:block">
              <nav className="sticky top-28">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-2">
                  On this page
                </p>
                <ul className="space-y-1.5 border-l border-border">
                  {doc.sections.map((s) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="-ml-px block border-l border-transparent pl-3 text-sm text-muted transition-colors hover:border-primary hover:text-foreground"
                      >
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Sections */}
            <div className="max-w-3xl">
              <div className="mb-8 flex items-start gap-2.5 rounded-xl border border-border bg-danger-soft/40 p-4">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                <p className="text-xs leading-relaxed text-muted">
                  This document is a general template provided for transparency. It
                  is not legal advice and should be reviewed by a qualified lawyer
                  for your jurisdiction.
                </p>
              </div>

              <div className="space-y-10">
                {doc.sections.map((s) => (
                  <section key={s.id} id={s.id} className="scroll-mt-28">
                    <h2 className="text-xl font-semibold text-foreground">{s.title}</h2>
                    <div className="mt-3 space-y-3">
                      {s.blocks.map((block, i) =>
                        typeof block === "string" ? (
                          <p key={i} className="leading-relaxed text-muted">
                            {block}
                          </p>
                        ) : (
                          <ul key={i} className="space-y-2">
                            {block.list.map((item) => (
                              <li
                                key={item}
                                className="flex gap-2.5 leading-relaxed text-muted"
                              >
                                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        ),
                      )}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

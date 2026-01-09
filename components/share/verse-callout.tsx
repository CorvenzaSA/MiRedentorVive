import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CALLING_VERSES, pickRandomVerse } from "@/models/verses";

export function VerseCallout() {
  // Server Component: se ejecuta en el servidor en cada request
  const verse = pickRandomVerse(CALLING_VERSES);

  return (
    <section className="border-t bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-6 py-14 md:py-16">
        <div className="mx-auto max-w-4xl rounded-2xl border bg-card/60 p-8 md:p-10 shadow-sm">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg md:text-2xl italic leading-relaxed">
              “{verse.text}”
            </p>

            <p className="mt-4 text-sm md:text-base text-muted-foreground">
              {verse.ref}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild variant="outline">
                <Link href="/Information">Misión y visión</Link>
              </Button>

              {verse.ctaHref && verse.ctaLabel ? (
                <Button asChild>
                  <Link href={verse.ctaHref}>{verse.ctaLabel}</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

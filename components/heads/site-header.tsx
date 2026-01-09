import Link from "next/link";
import { NAV_ITEMS } from "@/models/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/75 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight">
            Mi Redentor Vive
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/Contact">Pedir oración</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/lives">Ver en vivo</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/lives">En vivo</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button size="sm" variant="secondary" aria-label="Abrir menú">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[320px]">
              <SheetHeader className="mb-6">
                <SheetTitle>Mi Redentor Vive</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item.href}
                    asChild
                    variant="ghost"
                    className="justify-start"
                  >
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                ))}
              </div>

              <div className="mt-6 grid gap-2">
                <Button asChild variant="outline">
                  <Link href="/Contact">Pedir oración</Link>
                </Button>
                <Button asChild>
                  <Link href="/lives">Ver en vivo</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

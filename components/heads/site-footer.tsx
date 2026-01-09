import Link from "next/link";
import { FOOTER_INFO, FOOTER_LINKS } from "@/models/footer";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">

          {/* Brand / Iglesia */}
          <div>
            <h3 className="text-sm font-semibold tracking-tight">
              {FOOTER_INFO.name}
            </h3>

            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {FOOTER_INFO.slogan}
            </p>

            <div className="mt-5">
              <Button asChild size="sm" variant="outline">
                <Link href="/Contact">Pedir oración</Link>
              </Button>
            </div>
          </div>

          {/* Navegación */}
          <div>
            <h4 className="text-sm font-medium">Navegación</h4>

            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Información adicional */}
          <div>
            <h4 className="text-sm font-medium">Reuniones</h4>

            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Domingos – Servicio general</li>
              <li>Entre semana – Reuniones y discipulados</li>
              <li>Transmisiones en vivo y grabaciones</li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {FOOTER_INFO.name}.{" "}
            {FOOTER_INFO.copyright}
          </p>

          <p className="italic">
            “Porque el Hijo del Hombre vino a buscar y a salvar lo que se había perdido.”
            — Lucas 19:10
          </p>
        </div>
      </div>
    </footer>
  );
}

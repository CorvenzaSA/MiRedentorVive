export default function HomePage() {
  return (
    <main className="min-h-screen text-white px-6 py-12 flex items-center justify-center
      bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(79,70,229,0.35),transparent_60%),radial-gradient(900px_500px_at_90%_20%,rgba(14,165,233,0.25),transparent_55%),radial-gradient(800px_500px_at_10%_30%,rgba(239,68,68,0.18),transparent_55%),linear-gradient(180deg,#0B1220,#070A12)]">
      <section className="w-full max-w-5xl">
        {/* Shell / Card principal */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_30px_120px_rgba(0,0,0,0.60)] overflow-hidden">
          {/* Top bar sutil */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-white/80">En vivo 24/7</span>
            </div>

            <span className="text-xs text-white/50">
              Radio • Guatemala
            </span>
          </div>


          <div className="px-6 md:px-10 py-10">
            {/* Header */}
            <header className="text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                Radio Redentor Vive
              </h1>

              <p className="mt-3 text-base md:text-lg text-white/75">
                Transmitiendo esperanza <span className="text-white/90 font-medium">24/7</span> desde Guatemala
              </p>
            </header>

            {/* Player Card con borde degradado */}
            <div className="mt-10 relative">
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500/35 via-white/10 to-red-500/30 blur-[2px]" />
              <div className="relative rounded-2xl border border-white/10 bg-[#0B1220]/70 backdrop-blur shadow-[0_20px_80px_rgba(0,0,0,0.55)] overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">Reproduciendo ahora</p>
                    <p className="font-semibold text-white">Radio Redentor Vive</p>
                  </div>
                  <span className="text-xs text-white/60">ZenoFM Player</span>
                </div>

                <div className="w-full h-[200px]">
                  <iframe
                    src="https://listen.zeno.fm/player/radio-redentor-vive"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    frameBorder="0"
                    scrolling="no"
                    height="100%"
                    width="100%"
                    loading="lazy"
                    title="ZenoFM Player - Radio Redentor Vive"
                  />
                </div>
              </div>
            </div>

            {/* CTAs más “premium” */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://www.facebook.com/profile.php?id=61586628570614"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl px-6 py-5 text-center font-semibold
                  bg-[#1877F2] shadow-lg shadow-blue-500/20
                  hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  👍 <span>Síguenos en Facebook</span>
                </span>
                <span className="block text-sm font-normal text-white/90 mt-1">
                  Noticias, cultos y contenido diario
                </span>
              </a>

              <a
                href="https://zeno.fm"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl px-6 py-5 text-center font-semibold
                  bg-[#E10600] shadow-lg shadow-red-500/20
                  hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 transition"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  📻 <span>Descargar ZenoFM</span>
                </span>
                <span className="block text-sm font-normal text-white/90 mt-1">
                  Busca “Radio Redentor Vive”
                </span>
              </a>
            </div>

            {/* Beneficios (simple pero sube percepción) */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Música Cristiana", desc: "Alabanza, adoración y mensajes de fe." },
                { title: "Disponible 24/7", desc: "Siempre al aire para acompañarte." },
                { title: "Desde Guatemala", desc: "Una voz de esperanza para las naciones." },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5"
                >
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-white/70">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* App instructions */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-center">
              <h2 className="text-xl md:text-2xl font-semibold">
                📱 Escúchanos desde la App
              </h2>
              <p className="mt-2 text-white/80">
                Descarga la aplicación de ZenoFM y busca:
              </p>
              <p className="mt-3 text-2xl md:text-3xl font-bold text-amber-300">
                Radio Redentor Vive
              </p>
            </div>

            {/* Footer */}
            <footer className="mt-10 text-center text-sm text-white/45">
              © {new Date().getFullYear()} Radio Redentor Vive. Todos los derechos reservados.
            </footer>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from 'next/link'

const QUICK_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/partidos', label: 'Partidos' },
  { href: '/torneos', label: 'Torneos' },

]

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-brand-950">
      <div className="mx-auto max-w-7xl px-6 py-16 grid grid-cols-2 gap-10 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="mb-4 flex items-center gap-2.5">
            <span className="text-[10px] font-black tracking-[0.2em] text-white border border-brand-400/60 rounded px-1.5 py-0.5">
              DATA
            </span>
            <span className="text-base font-bold text-white">Escuela Patriota Sport Bacatá</span>
          </div>
          <p className="text-sm leading-relaxed text-white/60">
            La pasión por el fútbol vive aquí. Formando campeones desde 2010.
          </p>
          <p className="mt-4 text-xs text-white/40">
            Powered by DataGoal — Sistema integral de gestión deportiva
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-300">
            Enlaces Rápidos
          </h3>
          <div className="flex flex-col gap-2.5">
            {QUICK_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-300">
            Contacto
          </h3>
          <div className="flex flex-col gap-2 text-sm text-white/60">
            <p>Parque Timiza</p>
            <p>Kennedy, Bogotá, Colombia</p>
            <p>Tel: +57 (1) 234-5678</p>
            <p>info@escuelapatriotasport.com</p>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-brand-300">
            Síguenos
          </h3>
          <div className="flex flex-col gap-2 text-sm text-white/60">
            <p>Facebook — @EscuelaPatriotaSport</p>
            <p>Instagram — @escuelapatriotasport</p>
            <p>YouTube — Escuela Patriota Sport Bacatá</p>
            <p>TikTok — @escuelapatriotasport</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-white/40 md:flex-row">
          <p>© {new Date().getFullYear()} Escuela Patriota Sport Bacatá. Todos los derechos reservados.</p>
          <p>Bogotá, Colombia</p>
        </div>
      </div>
    </footer>
  )
}

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-10">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black tracking-widest text-red-600 border border-red-600 px-1.5 py-0.5">DATA</span>
            <span className="font-bold text-gray-800">Escuela Patriota Sport Bacatá</span>
          </div>
          <p className="text-xs text-gray-500">La pasión por el fútbol vive aquí. Formando campeones desde 2010.</p>
          <p className="text-xs text-gray-400 mt-3">Powered by DataGoal — Sistema integral de gestión deportiva</p>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Enlaces Rápidos</h3>
          {[
            { href: '/categorias',     label: 'Categorías'     },
            { href: '/partidos',       label: 'Partidos'       },
            { href: '/entrenamientos', label: 'Entrenamientos' },
            { href: '/estadisticas',   label: 'Estadísticas'   },
            { href: '/torneos',        label: 'Torneos'        },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="block text-xs text-gray-500 mb-1.5 hover:text-red-600 transition-colors">
              {label}
            </Link>
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Contacto</h3>
          <p className="text-xs text-gray-500 mb-1">Parque Timiza</p>
          <p className="text-xs text-gray-500 mb-1">Kennedy, Bogotá, Colombia</p>
          <p className="text-xs text-gray-500 mb-1">Tel: +57 (1) 234-5678</p>
          <p className="text-xs text-gray-500">Email: info@escuelapatriotasport.com</p>
        </div>

        <div>
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Síguenos</h3>
          <p className="text-xs text-gray-500 mb-1">Facebook: @EscuelaPatriotaSport</p>
          <p className="text-xs text-gray-500 mb-1">Instagram: @escuelapatriotasport</p>
          <p className="text-xs text-gray-500 mb-1">YouTube: Escuela Patriota Sport Bacatá</p>
          <p className="text-xs text-gray-500">TikTok: @escuelapatriotasport</p>
        </div>

      </div>
    </footer>
  )
}
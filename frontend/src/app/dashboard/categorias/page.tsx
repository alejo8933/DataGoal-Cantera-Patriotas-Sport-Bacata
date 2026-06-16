import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Users, MapPin, Calendar, Star } from 'lucide-react'
import CategoriaSelector from './CategoriaSelector'

const INFO_CLUB = [
  { label: 'Fundación',  valor: '2010 — Boyacá, Colombia' },
  { label: 'Sede',       valor: 'Bogotá, Colombia'         },
  { label: 'Títulos',    valor: '12 en diferentes categorías' },
]

export default async function CategoriasPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const selectedCategoria = typeof searchParams.categoria === 'string' ? searchParams.categoria : null;
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  let query = supabase.from('rendimiento_equipos').select('*').eq('activo', true)
  if (selectedCategoria) {
    query = query.eq('categoria', selectedCategoria)
  }
  const { data: equiposFiltrados } = await query

  // Obtener todas las categorías para el filtro
  const { data: todos } = await supabase.from('rendimiento_equipos').select('categoria').eq('activo', true)
  const categoriasUnicas = Array.from(new Set((todos || []).map(e => e.categoria).filter(Boolean)))

  return (
    <div className="bg-white min-h-screen rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Nuestras Categorías</h1>
          <p className="text-base text-gray-500 mt-2">
            Descubre todas las categorías que forman parte de la familia Escuela Patriota Sport Bacatá,
            desde nuestras divisiones juveniles hasta las infantiles de formación.
          </p>
        </div>

        {/* Info del Club */}
        <div className="grid grid-cols-3 gap-5 mb-8">
          {INFO_CLUB.map((item) => (
            <div key={item.label} className="rounded-lg border border-gray-200 p-7 text-center">
              <p className="text-sm text-gray-400 mb-1">{item.label}</p>
              <p className="font-bold text-gray-900 text-base">{item.valor}</p>
            </div>
          ))}
        </div>

        {/* Filtro de Categorías */}
        {categoriasUnicas.length > 0 && (
          <div className="mb-8 flex items-center">
            <CategoriaSelector categorias={categoriasUnicas} selected={selectedCategoria} />
          </div>
        )}

        {/* Grid de equipos */}
        <div className="grid md:grid-cols-2 gap-6">
          {equiposFiltrados?.map((equipo) => (
            <div
              key={equipo.id}
              className="rounded-lg border border-gray-200 overflow-hidden flex flex-col transition-shadow hover:shadow-md"
            >
               {/* Banner Image */}
               <div className="relative h-48 w-full bg-gray-900">
                  <Image 
                    src={equipo.imagen_url || "https://images.unsplash.com/photo-1518605363189-9a67a840c497?q=80&w=1200&auto=format&fit=crop"}
                    alt={`Equipo ${equipo.equipo}`}
                    fill
                    className="object-cover opacity-80"
                  />
                  <div className="absolute top-4 left-4">
                     <span className="bg-white text-gray-900 rounded-full text-xs font-bold px-3 py-1 shadow">
                        {equipo.categoria}
                     </span>
                  </div>
               </div>

              <div className="p-7 flex flex-col gap-4 flex-grow">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Escuela Patriota Sport {equipo.categoria}</h3>
                    <p className="text-sm text-gray-500 font-medium">({equipo.equipo})</p>
                  </div>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-2">
                  <p className="text-sm text-gray-500 flex items-center gap-2 font-bold text-red-600">
                    <Users size={16} /> {equipo.genero || 'Mixto'}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" /> Edades {equipo.edades || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 col-span-2">
                    <MapPin size={16} className="text-gray-400 shrink-0" /> {equipo.sede || 'Sede Principal'}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-2 col-span-2 italic">
                    <Calendar size={16} className="text-gray-400 shrink-0" /> {equipo.horario || 'Horario por definir'}
                  </p>
                </div>

                {/* DT */}
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-500">DT: {equipo.tecnico || 'Por asignar'}</span>
                </div>

                {/* Logros */}
                {equipo.logros && equipo.logros.length > 0 && (
                  <div className="rounded-lg bg-gray-50 px-4 py-3 mt-2">
                    <p className="text-xs text-yellow-600 font-medium mb-2 flex items-center gap-1.5">
                      <Star size={14} /> Logros Recientes:
                    </p>
                    <ul className="space-y-1.5">
                      {equipo.logros.map((logro: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-gray-400 mt-0.5">•</span> {logro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Botón Ver Plantilla */}
                <div className="mt-auto pt-5">
                  <Link
                    href={`/dashboard/categorias/${equipo.categoria}`}
                    className="flex justify-center w-full rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium py-2.5 hover:bg-gray-50 transition-colors"
                  >
                    Ver Plantilla
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {(!equiposFiltrados || equiposFiltrados.length === 0) && (
             <div className="col-span-full py-12 text-center text-gray-500">
                No hay categorías registradas actualmente.
             </div>
          )}
        </div>

      </div>
    </div>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { Edit2, X, Loader2 } from 'lucide-react'
import { editarJugador } from '@/services/actions/jugadores'
import { createClient } from '@/lib/supabase/client'

interface ModalEditarJugadorProps {
  jugador: {
    id: string
    nombre: string
    apellido: string
    categoria_id: string | null
    equipo_id: string | null
    categoria: string | null // Legacy support
    posicion: string | null
    numero_camiseta: number | null
    goles: number | null
  }
}

export default function ModalEditarJugador({ jugador }: ModalEditarJugadorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categoriasMaestras, setCategoriasMaestras] = useState<{ id: string, nombre: string }[]>([])
  const [equipos, setEquipos] = useState<{ id: string, equipo: string, categoria_id: string }[]>([])
  const [selectedCategoria, setSelectedCategoria] = useState<string>(jugador.categoria_id || '')
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoadingData(true)
        const supabase = createClient()
        const { data: catData } = await supabase.from('categorias_maestras').select('id, nombre').eq('activo', true)
        const { data: eqData } = await supabase.from('rendimiento_equipos').select('id, equipo, categoria_id').eq('activo', true)
        if (catData) setCategoriasMaestras(catData)
        if (eqData) setEquipos(eqData)
        setLoadingData(false)
      }
      fetchData()
    }
  }, [isOpen])

  const equiposFiltrados = equipos.filter(eq => eq.categoria_id === selectedCategoria)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.append('id', jugador.id)
    
    const result = await editarJugador(formData)
    
    if (result?.success) {
      setIsOpen(false)
    } else {
      setError(result?.message || 'Error al actualizar.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
        title="Editar Jugador"
      >
        <Edit2 size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Editar Jugador</h2>
              <button 
                onClick={() => !isLoading && setIsOpen(false)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <X size={20} />
              </button>
            </div>
            
            <form ref={formRef} onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre <span className="text-red-500">*</span></label>
                    <input 
                      required 
                      type="text" 
                      id="nombre" 
                      name="nombre" 
                      defaultValue={jugador.nombre} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" 
                      pattern="[A-Za-zÀ-ÿ\s]+" 
                      title="Solo letras"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="apellido" className="text-sm font-medium text-gray-700">Apellido <span className="text-red-500">*</span></label>
                    <input 
                      required 
                      type="text" 
                      id="apellido" 
                      name="apellido" 
                      defaultValue={jugador.apellido} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition" 
                      placeholder="Ej: García" 
                      pattern="[A-Za-zÀ-ÿ\s]+" 
                      title="Solo letras"
                    />
                  </div>
                </div>

                {/* Nivel 1: Categoría Maestra */}
                <div className="space-y-1.5">
                  <label htmlFor="categoria_id" className="text-sm font-medium text-gray-700">Categoría Maestra <span className="text-red-500">*</span></label>
                  <select 
                    required 
                    id="categoria_id" 
                    name="categoria_id" 
                    value={selectedCategoria}
                    onChange={(e) => setSelectedCategoria(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white text-gray-900"
                  >
                    <option value="">{loadingData ? 'Cargando...' : 'Selecciona categoría maestra...'}</option>
                    {categoriasMaestras.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Nivel 2: Equipo (Filtrado) */}
                <div className="space-y-1.5">
                  <label htmlFor="equipo_id" className="text-sm font-medium text-gray-700">Equipo Específico (Opcional)</label>
                  <select 
                    id="equipo_id" 
                    name="equipo_id" 
                    defaultValue={jugador.equipo_id || ''}
                    disabled={!selectedCategoria}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white text-gray-900 disabled:bg-gray-50"
                  >
                    <option value="">{selectedCategoria ? 'Sin equipo (Solo categoría)' : 'Selecciona categoría primero...'}</option>
                    {equiposFiltrados.map((eq) => (
                      <option key={eq.id} value={eq.id}>{eq.equipo}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="posicion" className="text-sm font-medium text-gray-700">Posición</label>
                    <select id="posicion" name="posicion" defaultValue={jugador.posicion || ''} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition bg-white text-gray-900">
                      <option value="">Sin definir...</option>
                      <option value="Portero">Portero</option>
                      <option value="Defensa">Defensa</option>
                      <option value="Mediocampista">Mediocampista</option>
                      <option value="Delantero">Delantero</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="numero_camiseta" className="text-sm font-medium text-gray-700">N° Camiseta</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="99" 
                      id="numero_camiseta" 
                      name="numero_camiseta" 
                      defaultValue={jugador.numero_camiseta || ''} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="goles" className="text-sm font-medium text-gray-700">Goles Totales</label>
                    <input 
                      type="number" 
                      min="0" 
                      id="goles" 
                      name="goles" 
                      defaultValue={jugador.goles || 0} 
                      className="w-full px-3 py-2 border border-blue-200 bg-blue-50/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition font-bold text-blue-700" 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="px-4 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  Cerrar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center min-w-[120px] disabled:opacity-70"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

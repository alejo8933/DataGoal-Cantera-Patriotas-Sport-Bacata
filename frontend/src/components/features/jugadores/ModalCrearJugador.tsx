'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { crearJugador } from '@/services/actions/jugadores'
import { createClient } from '@/lib/supabase/client'

export default function ModalCrearJugador() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categoriasMaestras, setCategoriasMaestras] = useState<{ id: string, nombre: string }[]>([])
  const [equipos, setEquipos] = useState<{ id: string, equipo: string, categoria_id: string }[]>([])
  const [selectedCategoria, setSelectedCategoria] = useState<string>('')
  const [loadingData, setLoadingData] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)

  // Cargar datos reales desde la DB
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoadingData(true)
        const supabase = createClient()
        
        // Cargar Categorías Maestras
        const { data: catData } = await supabase
          .from('categorias_maestras')
          .select('id, nombre')
          .eq('activo', true)
          .order('nombre')
        
        // Cargar Equipos
        const { data: eqData } = await supabase
          .from('rendimiento_equipos')
          .select('id, equipo, categoria_id')
          .eq('activo', true)
        
        if (catData) setCategoriasMaestras(catData)
        if (eqData) setEquipos(eqData)
        setLoadingData(false)
      }
      fetchData()
    }
  }, [isOpen])

  // Filtrar equipos según la categoría seleccionada
  const equiposFiltrados = equipos.filter(eq => eq.categoria_id === selectedCategoria)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    // Invocamos nuestro Server Action
    const result = await crearJugador(formData)
    
    if (result?.success) {
      // Éxito: Cerramos el modal limpiamente y reiniciamos ref
      formRef.current?.reset()
      setIsOpen(false)
    } else {
      // Fallo: Mostramos error robusto al administrador
      setError(result?.message || 'Error desconocido.')
    }
    
    setIsLoading(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition shadow-sm flex items-center gap-2"
      >
        <Plus size={18} />
        Registrar Jugador
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Registrar Nuevo Jugador</h2>
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
                    <input required type="text" id="nombre" name="nombre" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition" placeholder="Ej: Falcao" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="apellido" className="text-sm font-medium text-gray-700">Apellido <span className="text-red-500">*</span></label>
                    <input required type="text" id="apellido" name="apellido" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition" placeholder="Ej: García" pattern="[A-Za-zÀ-ÿ\s]+" title="Solo se permiten letras" />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition bg-white text-gray-900"
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
                    disabled={!selectedCategoria}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition bg-white text-gray-900 disabled:bg-gray-50"
                  >
                    <option value="">{selectedCategoria ? 'Sin equipo (Solo categoría)' : 'Selecciona categoría primero...'}</option>
                    {equiposFiltrados.map((eq) => (
                      <option key={eq.id} value={eq.id}>{eq.equipo}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="posicion" className="text-sm font-medium text-gray-700">Posición de Juego</label>
                    <select id="posicion" name="posicion" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition bg-white">
                      <option value="">Sin definir...</option>
                      <option value="Portero">Portero</option>
                      <option value="Defensa">Defensa</option>
                      <option value="Mediocampista">Mediocampista</option>
                      <option value="Delantero">Delantero</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="numero_camiseta" className="text-sm font-medium text-gray-700">N° Camiseta</label>
                    <input type="number" min="1" max="99" id="numero_camiseta" name="numero_camiseta" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition" placeholder="Ej: 9" />
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
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition flex items-center justify-center min-w-[120px] disabled:opacity-70"
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Jugador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useState, useRef } from 'react'
import { Edit3, X, Loader2, Trophy } from 'lucide-react'
import { editarPartido } from '@/services/actions/partidos'

interface ModalEditarPartidoProps {
  partido: {
    id: string
    equipo_local: string
    equipo_visitante: string
    fecha: string
    hora: string | null
    lugar: string | null
    categoria: string | null
    goles_local: number | null
    goles_visitante: number | null
    estado: string | null
  }
  soloResultado?: boolean
}

export default function ModalEditarPartido({ partido, soloResultado = false }: ModalEditarPartidoProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    formData.append('id', partido.id)
    
    // Si es solo resultado, nos aseguramos de que los campos base se envíen igual para no borrarlos
    if (soloResultado) {
      if (!formData.get('equipo_local')) formData.append('equipo_local', partido.equipo_local)
      if (!formData.get('equipo_visitante')) formData.append('equipo_visitante', partido.equipo_visitante)
      if (!formData.get('fecha')) formData.append('fecha', partido.fecha || '')
    }

    const result = await editarPartido(formData)
    
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
        className={soloResultado 
          ? "text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium" 
          : "text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition font-medium text-gray-700"
        }
      >
        {soloResultado ? 'Actualizar Resultado' : 'Editar'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`p-6 border-b border-gray-100 flex items-center justify-between ${soloResultado ? 'bg-blue-600 text-white' : ''}`}>
              <h2 className="text-xl font-bold flex items-center gap-2">
                {soloResultado ? <Trophy size={20} /> : <Edit3 size={20} />}
                {soloResultado ? 'Marcador Final' : 'Editar Partido'}
              </h2>
              <button 
                onClick={() => !isLoading && setIsOpen(false)}
                className={soloResultado ? "text-blue-100 hover:text-white" : "text-gray-400 hover:text-gray-700"}
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
              
              <div className="space-y-6">
                {!soloResultado && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Equipo Local</label>
                        <input name="equipo_local" defaultValue={partido.equipo_local} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Equipo Visitante</label>
                        <input name="equipo_visitante" defaultValue={partido.equipo_visitante} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Fecha</label>
                        <input required type="date" id="fecha" name="fecha" min="2024-01-01" defaultValue={partido.fecha} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition text-gray-700" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Hora</label>
                        <input type="time" name="hora" defaultValue={partido.hora || ''} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                    </div>
                  </>
                )}

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                  <h3 className="text-center font-bold text-gray-900 uppercase tracking-widest text-xs">Resultado y Estado</h3>
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center space-y-2">
                       <p className="text-[10px] font-bold text-gray-500 truncate w-24 uppercase">{partido.equipo_local}</p>
                       <input type="number" name="goles_local" min="0" placeholder="0" defaultValue={partido.goles_local ?? ''} className="w-16 h-16 text-3xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-0" />
                    </div>
                    <span className="text-2xl font-bold text-gray-300">:</span>
                    <div className="text-center space-y-2">
                       <p className="text-[10px] font-bold text-gray-500 truncate w-24 uppercase">{partido.equipo_visitante}</p>
                       <input type="number" name="goles_visitante" min="0" placeholder="0" defaultValue={partido.goles_visitante ?? ''} className="w-16 h-16 text-3xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:ring-0" />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <label className="text-sm font-medium text-gray-700 block mb-2">Estado del Encuentro</label>
                    <select name="estado" defaultValue={partido.estado || 'Programado'} className="w-full px-3 py-2 border rounded-lg bg-white">
                      <option value="Programado">📅 Programado</option>
                      <option value="Finalizado">✅ Finalizado</option>
                      <option value="Postergado">🕝 Postergado</option>
                      <option value="Cancelado">❌ Cancelado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition"
                >
                  Cerrar
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`px-6 py-2 text-white font-bold rounded-lg transition flex items-center justify-center min-w-[140px] shadow-lg ${soloResultado ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-black'}`}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

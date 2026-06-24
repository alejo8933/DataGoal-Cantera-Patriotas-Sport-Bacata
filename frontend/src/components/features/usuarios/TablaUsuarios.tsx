'use client'

import { useState } from 'react'
import { Search, Edit2 } from 'lucide-react'
import ModalEditarUsuario from './ModalEditarUsuario'
import ModalEliminar from '@/components/features/ui/ModalEliminar'
import type { UsuarioResponseDTO } from '@backend/modules/usuarios/dtos/UsuarioResponseDTO'

interface TablaUsuariosProps {
  usuarios: UsuarioResponseDTO[]
}

export default function TablaUsuarios({ usuarios }: TablaUsuariosProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsuarios = usuarios.filter((u) => {
    const searchString = `${u.nombre} ${u.apellido} ${u.email} ${u.rol}`.toLowerCase()
    return searchString.includes(searchTerm.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* SEARCH BAR */}
      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
        </div>
        <input 
          type="text"
          placeholder="Buscar por nombre, email o rol..."
          className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4 text-center">Roles</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Último Acceso</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <p>No se encontraron resultados para tu búsqueda.</p>
                  </td>
                </tr>
              ) : (
                filteredUsuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          u.activo ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400'
                        }`}>
                          {u.nombre ? u.nombre[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm leading-none mb-1">
                            {u.nombre ? `${u.nombre} ${u.apellido || ''}` : 'Usuario sin Registro'}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">
                            {u.email || (u.nombre ? `${u.nombre.toLowerCase().split(' ')[0]}@datagoal.com` : 'Correo no disponible')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-tight uppercase border ${
                        u.rol === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : 
                        u.rol === 'entrenador' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {u.rol === 'admin' ? 'Administrador' : u.rol === 'entrenador' ? 'Entrenador' : 'Jugador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {u.activo ? (
                           <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-[11px] font-bold border border-red-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                              Activo
                           </span>
                        ) : (
                           <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-400 rounded-full text-[11px] font-bold border border-gray-100">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                              Inactivo
                           </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-sm font-medium text-gray-700">—</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ModalEditarUsuario usuario={{
                          id: u.id,
                          nombre: u.nombre,
                          apellido: u.apellido,
                          email: u.email,
                          rol: u.rol,
                          telefono: u.telefono,
                          fecha_nacimiento: u.fechaNacimiento,
                          posicion: u.posicion,
                          categoria: u.categoria,
                        }} />
                        <ModalEliminar 
                          tabla="perfiles" 
                          idRegistro={u.id} 
                          pathRevalidacion="/dashboard/admin/usuarios"
                          modo="inactivo"
                          etiqueta={u.activo ? "Deshabilitar" : "Inhabilitar"}
                          esIcono={true}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { ArrowLeft, User, Star, Trophy, Target, Award, ShieldAlert, GraduationCap } from 'lucide-react'
import Link from 'next/link'

interface Equipo {
  id: string
  equipo: string
  categoria: string | null
  sede: string | null
  tecnico?: string
}

interface Jugador {
  id: string
  nombre: string
  apellido: string
  numero_camiseta: number | null
  posicion: string | null
  categoria: string | null
  goles: number
  asistencias: number
  tarjetas_amarillas: number
  tarjetas_rojas: number
  foto_url?: string
}

const FILTROS = ['Todos', 'Portero', 'Defensa', 'Mediocampista', 'Delantero']

export default function PlantillaView({ 
  equipo, 
  jugadores 
}: { 
  equipo: Equipo, 
  jugadores: Jugador[] 
}) {
  const [filtro, setFiltro] = useState('Todos')

  const jugadoresFiltrados = filtro === 'Todos'
    ? jugadores
    : jugadores.filter(j => j.posicion === filtro)

  // Stats calculadas
  const promedioGoles = jugadores.length > 0 
    ? (jugadores.reduce((acc, j) => acc + (j.goles || 0), 0) / jugadores.length).toFixed(1)
    : 0

  const stats = [
    { label: 'Jugadores', valor: jugadores.length, sub: 'Inscritos', icon: User, color: 'text-blue-600' },
    { label: 'Goles Equipo', valor: jugadores.reduce((acc, j) => acc + (j.goles || 0), 0), sub: 'Temporada', icon: Target, color: 'text-red-600' },
    { label: 'Prom. Goles', valor: promedioGoles, sub: 'Por jugador', icon: Star, color: 'text-yellow-600' },
    { label: 'Disciplina', valor: jugadores.reduce((acc, j) => acc + (j.tarjetas_amarillas || 0), 0), sub: 'Amarillas', icon: ShieldAlert, color: 'text-orange-600' },
  ]

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* NAVEGACIÓN Y TÍTULO */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard/admin/categorias"
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-600 transition-colors uppercase tracking-widest w-fit"
        >
          <ArrowLeft size={16} /> Volver a Categorías
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Plantilla: <span className="text-red-600">{equipo.equipo}</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1 uppercase tracking-wider text-xs flex items-center gap-2">
              <Award size={14} className="text-red-500" />
              Categoría {equipo.categoria || 'Sin definir'} | Sede: {equipo.sede || 'Principal'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI DASHBOARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-2xl bg-gray-50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.valor}</p>
              <p className="text-[9px] font-bold text-gray-400 uppercase">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FILTROS DE POSICIÓN */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 w-fit rounded-2xl">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filtro === f 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* GRID DE JUGADORES */}
      {!jugadoresFiltrados.length ? (
        <div className="p-20 text-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-100">
          <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
             <User size={32} className="text-gray-200" />
          </div>
          <p className="font-bold text-lg text-gray-400 italic">No hay jugadores en esta demarcación.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jugadoresFiltrados.map((j) => (
            <div key={j.id} className="group bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden relative">
              
              {/* Decoración de fondo */}
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-gray-50 rounded-full group-hover:bg-red-50 transition-colors duration-500" />
              
              {/* Header Jugador */}
              <div className="relative z-10 flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-gray-900/10 overflow-hidden">
                    {j.foto_url ? (
                      <img src={j.foto_url} alt={j.nombre} className="w-full h-full object-cover" />
                    ) : (
                      j.nombre.charAt(0) + (j.apellido?.charAt(0) || '')
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight">
                      {j.nombre}<br/>{j.apellido}
                    </h3>
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                      {j.posicion || 'Sin Posición'}
                    </span>
                  </div>
                </div>
                <div className="text-4xl font-black text-gray-100 group-hover:text-red-100 transition-colors">
                  #{j.numero_camiseta || '??'}
                </div>
              </div>

              {/* Stats Jugador */}
              <div className="grid grid-cols-3 gap-4 relative z-10 pt-6 border-t border-gray-50">
                <div className="text-center">
                  <p className="text-xl font-black text-gray-900">{j.goles}</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Goles</p>
                </div>
                <div className="text-center border-x border-gray-50">
                  <p className="text-xl font-black text-gray-900">{j.asistencias}</p>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Asist.</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                     <div className="w-3 h-4 bg-yellow-400 rounded-sm" title="Tarjetas Amarillas" />
                     <span className="text-sm font-black text-gray-900">{j.tarjetas_amarillas}</span>
                  </div>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Disciplina</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

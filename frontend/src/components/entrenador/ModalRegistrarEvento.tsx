"use client";
import { useState, useTransition } from "react";
import { X, Loader2, Save } from "lucide-react";
import { registrarEventoPartido } from "@/lib/actions/partidos.actions";

interface Jugador {
  id: string;
  nombre: string;
  apellido: string;
  numero_camiseta: number | null;
  posicion: string | null;
}

interface Props {
  partidoId: string;
  minuto: string;
  jugadores: Jugador[];
  onClose: () => void;
}

export default function ModalRegistrarEvento({ partidoId, minuto, jugadores, onClose }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // Agregamos el partidoId de forma programatica
    fd.append("partido_id", partidoId);
    
    startTransition(async () => {
      await registrarEventoPartido(fd);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            ⚽ Registrar Evento
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {/* Fila Dividida Minuto y Equipo */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Minuto *</label>
              <input 
                name="minuto" 
                type="number" 
                required 
                defaultValue={minuto}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 font-bold bg-white text-gray-700 text-sm" 
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Equipo *</label>
              <select name="equipo" required defaultValue="local" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 bg-white text-sm">
                <option value="local">Local</option>
                <option value="visitante">Visitante</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Tipo de Evento *</label>
            <select name="tipo" required defaultValue="" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 bg-white text-sm">
              <option value="" disabled>Seleccionar evento...</option>
              <option value="gol">Gol ⚽</option>
              <option value="tarjeta_amarilla">Tarjeta Amarilla 🟨</option>
              <option value="tarjeta_roja">Tarjeta Roja 🟥</option>
              <option value="cambio">Sustitución 🔄</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Jugador Involucrado (Opcional)</label>
            <select 
              name="jugador_id" 
              defaultValue=""
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 bg-white text-sm"
            >
              <option value="">Seleccione jugador...</option>
              {jugadores.map(j => (
                <option key={j.id} value={j.id}>#{j.numero_camiseta} {j.nombre} {j.apellido}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Descripción Corta</label>
            <input 
              name="descripcion" 
              type="text" 
              placeholder="Ej: Gol de cabeza tras centro..." 
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 bg-white text-sm" 
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4"/>}
              Guardar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

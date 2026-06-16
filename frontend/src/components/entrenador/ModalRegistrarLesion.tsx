"use client";
import { useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import { registrarLesion } from "@/lib/entrenador/lesiones";

interface Jugador {
  id: string;
  nombre: string;
  apellido: string;
  numero_camiseta: number | null;
  posicion: string | null;
}

interface Props {
  jugadores: Jugador[];
  onClose: () => void;
}

export default function ModalRegistrarLesion({ jugadores, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const [selectedJugador, setSelectedJugador] = useState("");
  
  const selected = jugadores.find(j => j.id === selectedJugador);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    startTransition(async () => {
      await registrarLesion(fd);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Nueva Lesión</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh] scrollbar-thin flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Jugador *</label>
            <select 
              name="jugador_id" 
              required
              value={selectedJugador}
              onChange={e => setSelectedJugador(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white text-sm"
            >
              <option value="" disabled>Seleccione un jugador...</option>
              {jugadores.map(j => (
                <option key={j.id} value={j.id}>{j.nombre} {j.apellido}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Número</label>
              <input 
                type="text" 
                disabled 
                value={selected?.numero_camiseta ?? "#"} 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50 text-gray-400 font-medium text-sm"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Posición</label>
              <input 
                type="text" 
                disabled 
                value={selected?.posicion ?? "Posición"} 
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none bg-gray-50 text-gray-400 font-medium text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Tipo de Lesión *</label>
              <select name="tipo_lesion" required defaultValue="" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white text-sm">
                <option value="" disabled>Seleccionar</option>
                <option value="Esguince">Esguince</option>
                <option value="Sobrecarga muscular">Sobrecarga muscular</option>
                <option value="Contusión">Contusión</option>
                <option value="Rotura fibrilar">Rotura fibrilar</option>
                <option value="Fractura">Fractura</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Zona Afectada *</label>
              <select name="zona_afectada" required defaultValue="" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white text-sm">
                <option value="" disabled>Seleccionar</option>
                <option value="Tobillo">Tobillo</option>
                <option value="Rodilla">Rodilla</option>
                <option value="Isquiotibiales">Isquiotibiales</option>
                <option value="Muslo">Muslo</option>
                <option value="Hombro">Hombro</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Gravedad *</label>
            <select name="gravedad" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white text-sm">
              <option value="Leve">Leve (1-7 días)</option>
              <option value="Moderada">Moderada (1-4 semanas)</option>
              <option value="Grave">Grave (+1 mes)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Fecha de Lesión *</label>
              <input name="fecha_lesion" type="date" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 bg-white text-gray-700 text-sm" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">Retorno Estimado *</label>
              <input name="retorno_estimado" type="date" required className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 bg-white text-gray-700 text-sm" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Mecanismo de Lesión</label>
            <input name="mecanismo" type="text" placeholder="¿Cómo ocurrió?" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 bg-white text-sm" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Tratamiento</label>
            <textarea name="tratamiento" placeholder="Protocolo de recuperación..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 bg-white h-20 resize-none text-sm"></textarea>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Notas Médicas</label>
            <textarea name="notas" placeholder="Observaciones adicionales..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 bg-white h-20 resize-none text-sm"></textarea>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-gray-700">Restricciones (separadas por coma)</label>
            <input name="restricciones" type="text" placeholder="Sin contacto, Sin correr..." className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-red-500 bg-white text-sm" />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Registrar Lesión
            </button>
            <button 
              type="button" 
              onClick={onClose}
              disabled={isPending}
              className="px-6 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

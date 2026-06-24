"use client";
import { useState, useTransition } from "react";
import { X, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { crearEntrenamiento } from "@/lib/actions/entrenamientos.actions";

interface Props {
  onClose: () => void;
}

export default function ModalNuevoEntrenamiento({ onClose }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    startTransition(async () => {
      await crearEntrenamiento(fd);
      onClose();
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Encabezado del Modal */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <button onClick={onClose} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Volver a Entrenamientos
            </button>
            <h2 className="text-2xl font-bold text-gray-900">Nuevo Entrenamiento</h2>
            <p className="text-sm text-gray-400">Programa una nueva sesión de entrenamiento</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario principal */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
          
          <div className="p-6 border border-gray-100 rounded-2xl bg-gray-50/30">
             <h3 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-red-500" />
                Información del Entrenamiento
             </h3>
             
             {/* Fila 1 */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Fecha *</label>
                   <input required name="fecha" type="date" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-red-500 outline-none text-sm font-medium" />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Hora *</label>
                   <input required name="hora" type="time" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-red-500 outline-none text-sm font-medium" />
                </div>
             </div>

             {/* Fila 2 */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Tipo de Entrenamiento *</label>
                   <select required name="tipo" defaultValue="" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-red-500 outline-none text-sm font-medium">
                      <option value="" disabled>Selecciona el tipo</option>
                      <option value="Táctico">Táctico</option>
                      <option value="Físico">Físico</option>
                      <option value="Técnico">Técnico</option>
                   </select>
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Duración (minutos) *</label>
                   <input required name="duracion" type="number" defaultValue="90" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-red-500 outline-none text-sm font-medium" />
                </div>
             </div>

             {/* Fila 3 */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Ubicación *</label>
                   <input required name="lugar" type="text" placeholder="Ej: Campo Principal" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-red-500 outline-none text-sm font-medium" />
                </div>
                <div className="flex flex-col gap-2">
                   <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Equipo / Categoría *</label>
                   <select required name="equipo" defaultValue="" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-red-500 outline-none text-sm font-medium">
                      <option value="" disabled>Selecciona el equipo</option>
                      <option value="Sub-15">Sub-15</option>
                      <option value="Sub-17">Sub-17</option>
                      <option value="Sub-20">Sub-20</option>
                      <option value="Primera División">Primera División</option>
                   </select>
                </div>
             </div>

             {/* Fila 4: Objetivos */}
             <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Objetivos del Entrenamiento</label>
                <textarea 
                  name="objetivos" 
                  placeholder="Lista los objetivos principales del entrenamiento..." 
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 bg-white focus:border-red-500 outline-none text-sm font-medium h-32 resize-none" 
                ></textarea>
             </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              type="submit" 
              disabled={isPending}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wider shadow-sm"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Crear Entrenamiento
            </button>
            <button 
              type="button" 
              onClick={onClose}
              disabled={isPending}
              className="px-8 py-3.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors text-sm uppercase tracking-wider"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

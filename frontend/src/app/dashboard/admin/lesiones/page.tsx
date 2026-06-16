import { getLesiones, getJugadoresParaLesiones } from "@/lib/entrenador/lesiones";
import LesionesPanel from "@/components/entrenador/LesionesPanel";

export default async function AdminLesionesPage() {
  const [lesiones, jugadores] = await Promise.all([
    getLesiones(),
    getJugadoresParaLesiones()
  ]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <LesionesPanel 
        lesiones={lesiones as any} 
        jugadores={jugadores as any} 
      />
    </div>
  );
}

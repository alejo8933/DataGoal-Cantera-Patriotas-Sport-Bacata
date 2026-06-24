import { Shield, ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'
import MatrixCard from '@/components/security/MatrixCard'
import { obtenerMatrizUsuario } from '@/lib/actions/usuarios.actions'

export default async function SeguridadPage() {
  const matrixResult = await obtenerMatrizUsuario()
  const initialMatrix = matrixResult.success ? matrixResult.matrix : undefined

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/admin/perfil"
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium group"
        >
          <div className="p-2 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20">
            <ArrowLeft size={20} />
          </div>
          Volver al Perfil
        </Link>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Seguridad Avanzada</h1>
              <p className="text-indigo-100 font-medium">Gestione su tarjeta de coordenadas de segundo factor</p>
            </div>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MatrixCard initialMatrix={initialMatrix} />
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4 text-indigo-600 dark:text-indigo-400">
              <Lock size={20} />
              <h3 className="font-bold">¿Cómo funciona?</h3>
            </div>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                Esta tarjeta contiene coordenadas únicas asignadas específicamente a su perfil.
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                Al realizar acciones sensibles, el sistema le pedirá el valor de 3 coordenadas aleatorias.
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-[10px] font-black">3</span>
                Puede regenerar su tarjeta en cualquier momento, pero la anterior quedará invalidada inmediatamente.
              </li>
            </ul>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2">Consejo de Seguridad</h3>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
              Descargue su tarjeta en formato PDF y guárdela en un gestor de contraseñas seguro o imprímala y guárdela en un lugar físico bajo llave.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

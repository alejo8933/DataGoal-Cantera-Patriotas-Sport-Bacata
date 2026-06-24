import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sparkles, ArrowLeft, Target, Plus, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import OKRList from '@/components/admin/okr/OKRList'

export default async function OKRGestionPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-6">
      
      {/* Cabecera de Gestión */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/admin"
            className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Gestión Estratégica</h1>
            <p className="text-slate-500 font-medium">Panel de control de OKRs y KPIs del club</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar objetivos..."
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-indigo-500 transition-all text-sm"
            />
          </div>
          <button className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar de Estados */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Target size={18} className="text-indigo-500" />
              Filtrar por Nivel
            </h3>
            <div className="space-y-2">
              {['Todos', 'Club', 'Categoría', 'Personal'].map((tab) => (
                <button 
                  key={tab}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all
                    ${tab === 'Todos' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-lg overflow-hidden relative">
            <div className="relative z-10">
              <h4 className="font-bold mb-2">Consejo Estratégico</h4>
              <p className="text-xs text-indigo-100 leading-relaxed">
                Los OKRs efectivos deben ser ambiciosos pero medibles. Vincula cada KR a un KPI automático para ver el progreso real.
              </p>
            </div>
            <Sparkles className="absolute -bottom-4 -right-4 text-white/10" size={80} />
          </div>
        </div>

        {/* Lista de OKRs Principal */}
        <div className="lg:col-span-3">
          <OKRList />
        </div>
      </div>
    </div>
  )
}

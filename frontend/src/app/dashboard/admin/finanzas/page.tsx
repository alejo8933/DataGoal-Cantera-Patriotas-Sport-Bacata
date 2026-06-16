import { createClient } from '@/lib/supabase/server'
import { Wallet, TrendingUp, TrendingDown, DollarSign, Receipt, Archive } from 'lucide-react'
import ModalRegistrarPago from '@/components/features/finanzas/ModalRegistrarPago'
import ModalAnadirGasto from '@/components/features/finanzas/ModalAnadirGasto'
import ModalEditarFactura from '@/components/features/finanzas/ModalEditarFactura'
import ModalEditarGasto from '@/components/features/finanzas/ModalEditarGasto'
import ModalEliminar from '@/components/features/ui/ModalEliminar'
import ExportarReporte from '@/components/admin/ExportarReporte'

export default async function AdminFinanzasPage() {
  const supabase = await createClient()

  // Intentamos obtener facturas asumiendo que están en 'public' o fallará y mostraremos el fallback.
  const [
    { data: facturasData },
    { data: gastosData }
  ] = await Promise.all([
    supabase.from('facturas').select('*').order('fecha', { ascending: false }),
    supabase.from('gastos').select('*').order('fecha', { ascending: false })
  ])

  const facturas = facturasData || []
  const gastos = gastosData || []

  // Cálculo dinámico real
  const ingresosTotal = facturas
    .filter(f => f.estado === 'Pagado')
    .reduce((acc, curr) => acc + (curr.monto || 0), 0)
    
  const gastosTotal = gastos
    .reduce((acc, curr) => acc + (curr.monto || 0), 0)
    
  const balance = ingresosTotal - gastosTotal

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 p-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Wallet className="text-red-600" size={28} />
            Finanzas y Administración
          </h1>
          <p className="text-gray-500 mt-1">Controla los ingresos por mensualidades y los gastos operativos del club.</p>
        </div>
      </div>

      {/* KPI DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute -right-4 -top-4 text-red-50 group-hover:scale-110 transition-transform duration-500">
            <DollarSign size={100} />
          </div>
          <div className="relative z-10">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-2">Balance Actual</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">${balance.toLocaleString()} </h2>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">
              <TrendingUp size={14} />
              <span>+12% este mes</span>
            </div>
          </div>
        </div>

        {/* Ingresos */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:rotate-12 transition-transform">
              <TrendingUp size={24} />
            </div>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Total Ingresos</p>
            <h3 className="text-3xl font-black text-gray-900">${ingresosTotal.toLocaleString()}</h3>
          </div>
        </div>

        {/* Egresos */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:-rotate-12 transition-transform">
              <TrendingDown size={24} />
            </div>
          </div>
          <div>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mb-1">Gastos Operativos</p>
            <h3 className="text-3xl font-black text-gray-900">${gastosTotal.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* MENSUALIDADES (INGRESOS) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <Receipt size={22} className="text-emerald-600" />
              Estado de Mensualidades
            </h3>
            <div className="flex items-center gap-2">
               <ExportarReporte 
                 filas={(facturas || []).map((f: any) => [f.jugador, f.fecha, `$${f.monto.toLocaleString()}`, f.estado])}
                 titulo="ESTADO DE MENSUALIDADES - DATAGOAL"
                 nombreArchivo="finanzas_mensualidades"
                 columnas={["Jugador", "Fecha", "Monto", "Estado"]}
               />
               <ModalRegistrarPago />
            </div>
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Jugador</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4 text-right">Monto</th>
                  <th className="px-6 py-4 text-center">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {facturas.map((fac) => (
                  <tr key={fac.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-900">{fac.jugador}</td>
                    <td className="px-6 py-4 text-gray-500">{fac.fecha}</td>
                    <td className="px-6 py-4 text-right font-mono text-gray-900">${fac.monto.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                        fac.estado === 'Pagado' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        fac.estado === 'Pendiente' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                        'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {fac.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ModalEditarFactura factura={fac} />
                         <ModalEliminar 
                            tabla="facturas" 
                            idRegistro={fac.id} 
                            pathRevalidacion="/dashboard/admin/finanzas"
                            modo="hard"
                            esIcono={true}
                         />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
            <button className="text-xs text-emerald-600 font-bold uppercase tracking-widest hover:underline px-4 py-2">Ver todas las facturas</button>
          </div>
        </div>

        {/* GASTOS (EGRESOS) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <TrendingDown size={22} className="text-red-600" />
              Gastos del Club
            </h3>
            <ModalAnadirGasto />
          </div>
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4">Concepto</th>
                  <th className="px-6 py-4 text-center">Categoría</th>
                  <th className="px-6 py-4 text-right">Monto</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {gastos.map((gasto) => (
                  <tr key={gasto.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-gray-900 truncate max-w-[150px]">{gasto.concepto}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                        {gasto.categoria}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-red-600 font-bold">-${gasto.monto.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ModalEditarGasto gasto={gasto} />
                         <ModalEliminar 
                            tabla="gastos" 
                            idRegistro={gasto.id} 
                            pathRevalidacion="/dashboard/admin/finanzas"
                            modo="hard"
                            esIcono={true}
                         />
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
            <button className="text-xs text-red-600 font-bold uppercase tracking-widest hover:underline px-4 py-2">Ver historial de gastos</button>
          </div>
        </div>
      </div>
    </div>
  )
}

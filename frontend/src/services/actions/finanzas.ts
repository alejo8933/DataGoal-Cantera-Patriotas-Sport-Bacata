'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { notificarActividadAdmin } from '@/lib/entrenador/notificaciones'

export async function registrarPago(formData: FormData) {
  const supabase = await createClient()

  const jugador = formData.get('jugador')?.toString().trim()
  const monto = formData.get('monto')?.toString().trim()
  const fecha = formData.get('fecha')?.toString().trim()

  if (!jugador || !monto || !fecha) {
    return {
      success: false,
      message: 'Todos los campos son obligatorios para asentar un pago.',
    }
  }

  const montoNum = parseFloat(monto)
  if (isNaN(montoNum) || montoNum <= 0) {
    return {
      success: false,
      message: 'El monto debe ser un valor numérico superior a cero.',
    }
  }

  // Insertar en la tabla de facturas/pagos (Asumimos public.facturas para este prototipo)
  const { data, error } = await supabase
    .from('facturas')
    .insert([
      {
        jugador,
        monto: parseFloat(monto),
        fecha,
        estado: 'Pagado'
      },
    ])
    .select()

  if (error) {
    console.error('Error procesando pago:', error)
    return {
      success: false,
      message: 'No pudimos registrar este pago. Quizá la tabla no esté lista.',
      error: error.message,
    }
  }

  await notificarActividadAdmin({
    titulo: 'Nuevo Pago Recibido',
    descripcion: `Se ha registrado un pago de $${montoNum.toLocaleString()} por parte de ${jugador}.`,
    tipo: 'finanzas'
  });

  revalidatePath('/dashboard/admin/finanzas')

  return {
    success: true,
    message: 'Pago registrado y contabilizado.',
  }
}

export async function anadirGasto(formData: FormData) {
  const supabase = await createClient()

  const concepto = formData.get('concepto')?.toString().trim()
  const categoria = formData.get('categoria')?.toString().trim()
  const monto = formData.get('monto')?.toString().trim()
  const fecha = formData.get('fecha')?.toString().trim()

  if (!concepto || !monto || !fecha) {
    return {
      success: false,
      message: 'El Concepto, el Monto y la Fecha son obligatorios.',
    }
  }

  const montoNum = parseFloat(monto)
  if (isNaN(montoNum) || montoNum <= 0) {
    return {
      success: false,
      message: 'El monto del gasto debe ser un valor numérico superior a cero.',
    }
  }

  // Intentamos guardar en la tabla pública de 'gastos'
  const { data, error } = await supabase
    .from('gastos')
    .insert([
      {
        concepto,
        categoria: categoria || 'General',
        monto: parseFloat(monto),
        fecha
      },
    ])
    .select()

  if (error) {
    console.error('Error insertando gasto:', error)
    return {
      success: false,
      message: 'Error al reportar el gasto. Comprueba si la tabla `gastos` existe en la base de datos.',
      error: error.message,
    }
  }

  await notificarActividadAdmin({
    titulo: 'Gasto Reportado',
    descripcion: `Se ha registrado un gasto de $${montoNum.toLocaleString()} por concepto de: ${concepto}.`,
    tipo: 'finanzas',
    prioridad: 'media'
  });

  revalidatePath('/dashboard/admin/finanzas')

  return {
    success: true,
    message: 'Gasto reportado y restado del balance exitosamente.',
  }
}

export async function actualizarPago(id: string, formData: FormData) {
  const supabase = await createClient()

  const jugador = formData.get('jugador')?.toString().trim()
  const monto = formData.get('monto')?.toString().trim()
  const fecha = formData.get('fecha')?.toString().trim()
  const estado = formData.get('estado')?.toString().trim()

  if (!jugador || !monto || !fecha) {
    return { success: false, message: 'Faltan campos obligatorios.' }
  }

  const { error } = await supabase
    .from('facturas')
    .update({
      jugador,
      monto: parseFloat(monto),
      fecha,
      estado: estado || 'Pagado'
    })
    .eq('id', id)

  if (error) return { success: false, message: error.message }
  
  revalidatePath('/dashboard/admin/finanzas')
  return { success: true, message: 'Pago actualizado.' }
}

export async function actualizarGasto(id: string, formData: FormData) {
  const supabase = await createClient()

  const concepto = formData.get('concepto')?.toString().trim()
  const categoria = formData.get('categoria')?.toString().trim()
  const monto = formData.get('monto')?.toString().trim()
  const fecha = formData.get('fecha')?.toString().trim()

  if (!concepto || !monto || !fecha) {
    return { success: false, message: 'Faltan campos obligatorios.' }
  }

  const { error } = await supabase
    .from('gastos')
    .update({
      concepto,
      categoria: categoria || 'General',
      monto: parseFloat(monto),
      fecha
    })
    .eq('id', id)

  if (error) return { success: false, message: error.message }

  revalidatePath('/dashboard/admin/finanzas')
  return { success: true, message: 'Gasto actualizado.' }
}

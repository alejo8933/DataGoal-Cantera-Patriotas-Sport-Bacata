import Link from 'next/link'

export default function NoAutorizadoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso no autorizado</h1>
        <p className="text-gray-500 mb-6">
          No tienes permisos para ver esta página. Contacta al administrador si crees que es un error.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}
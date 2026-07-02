import PlayerList from '@/components/features/players/PlayerList'

export const metadata = { title: 'Plantilla | DataGoal' }

export default function PlantillaPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600 mb-2">Nuestro equipo</p>
      <h1 className="text-3xl font-black tracking-tight text-carbon-900 mb-6">Plantilla</h1>
      <PlayerList />
    </main>
  )
}
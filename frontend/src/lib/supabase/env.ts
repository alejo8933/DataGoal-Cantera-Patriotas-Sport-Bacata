function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Falta la variable de entorno "${name}". Configúrala en Vercel (Project Settings → Environment Variables) para los entornos Production, Preview y Development.`
    )
  }
  return value
}

export function getSupabasePublicEnv(): { url: string; anonKey: string } {
  return {
    url: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  }
}

export function getSupabaseServiceRoleKey(): string {
  return requireEnv('SUPABASE_SERVICE_ROLE_KEY')
}

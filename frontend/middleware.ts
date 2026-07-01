import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSupabasePublicEnv } from '@/lib/supabase/env'

export async function middleware(request: NextRequest) {
  // TODO(debug): quitar este bloque una vez identificada la causa del
  // MIDDLEWARE_INVOCATION_FAILED. Ver Vercel → Deployments → Runtime Logs.
  console.log('MIDDLEWARE START', request.nextUrl.pathname)
  console.log('ENV CHECK:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 20),
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10),
  })

  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const { pathname } = request.nextUrl

  const redirectWithCookies = (url: URL) => {
    const redirectResponse = NextResponse.redirect(url)
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })
    return redirectResponse
  }

  // El middleware corre en Edge para casi cualquier ruta (ver `matcher`).
  // Si Supabase falla (env vars ausentes en este entorno de Vercel, o un
  // problema de red transitorio), no debe tumbar el sitio entero: se
  // registra el error y, para rutas protegidas, se falla cerrado
  // redirigiendo a /login en vez de dejar pasar una sesión sin validar.
  try {
    const { url, anonKey } = getSupabasePublicEnv()
    console.log('MIDDLEWARE: env validated, creating Supabase client')

    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })

          response = NextResponse.next({
            request: { headers: request.headers },
          })

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()
    console.log('MIDDLEWARE: getUser resolved, user present:', !!user)

    if (pathname.startsWith('/dashboard') && !user) {
      return redirectWithCookies(new URL('/login', request.url))
    }

    // Edge infrastructure only refreshes the Supabase Auth session. Role
    // authorization stays in dashboard layouts through the Usuarios use cases.
    if ((pathname === '/login' || pathname === '/registro') && user) {
      return redirectWithCookies(new URL('/dashboard', request.url))
    }

    return response
  } catch (error) {
    console.error('[middleware] Supabase auth check failed:', error)
    console.error(
      '[middleware] error name/message:',
      error instanceof Error ? error.name : typeof error,
      error instanceof Error ? error.message : String(error)
    )

    if (pathname.startsWith('/dashboard')) {
      return redirectWithCookies(new URL('/login', request.url))
    }

    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

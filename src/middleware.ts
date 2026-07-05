import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login']
const PROTECTED_PREFIXES = ['/dashboard', '/doctors', '/hospitals', '/reports', '/settings', '/support', '/seed']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicPath = PUBLIC_PATHS.includes(pathname) || pathname === '/favicon.ico'
  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))

  if (!isPublicPath && isProtectedPath) {
    const authCookie = request.cookies.get('quickcheck-auth')

    if (!authCookie) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      url.search = ''
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|assets|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)).*)']
}

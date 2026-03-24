import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/auth'

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login' || path === '/register' || path === '/'

  if (!isPublicPath && !path.startsWith('/_')) {
    const session = await getSession()
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    // Check admin paths
    if (path.startsWith('/admin') && session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // If going to login/register while authenticated, redirect to home
  if (isPublicPath && path !== '/') {
    const session = await getSession()
    if (session) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
}

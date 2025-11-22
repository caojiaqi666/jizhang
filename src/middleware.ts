import { type NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production'
const secret = new TextEncoder().encode(JWT_SECRET)

// Public routes that don't require authentication
const publicRoutes = ['/login', '/admin/login', '/login/forgot-password']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if it's an admin route
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      // Allow access to admin login page
      return NextResponse.next()
    }
    
    // Verify admin session
    const adminToken = request.cookies.get('fm_admin_session')?.value
    
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    try {
      await jwtVerify(adminToken, secret)
      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Verify user session
  const token = request.cookies.get('fm_session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - API routes
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js)$).*)',
  ],
}

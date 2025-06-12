import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { NextRequestWithAuth } from "next-auth/middleware"

export default async function middleware(request: NextRequestWithAuth) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  // console.log("isAuthenticated : ", isAuthenticated)

  // Define public paths that don't require authentication
  const publicPaths = ['/auth/signin', '/auth/register', '/api/auth']
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path) || request.nextUrl.pathname === '/')

  // If the user is not authenticated and trying to access a protected route
  if (!isAuthenticated && !isPublicPath) {
    const signInUrl = new URL('/', request.url)
    signInUrl.searchParams.set('callbackUrl', request.url)
    return NextResponse.redirect(signInUrl)
  }

  // If the user is authenticated and trying to access auth pages, redirect to /home
  if (isAuthenticated && (request.nextUrl.pathname === '/auth/signin' || request.nextUrl.pathname === '/auth/register')) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api/auth (auth API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/|api/auth|auth/|$).*)',
  ],
} 



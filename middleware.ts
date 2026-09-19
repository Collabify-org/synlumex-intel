import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: new Headers(request.headers)
    }
  });

  // Pass pathname through headers for layout to read
  response.headers.set('x-pathname', request.nextUrl.pathname);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: {
              headers: new Headers(request.headers)
            }
          });
          response.headers.set('x-pathname', request.nextUrl.pathname);
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/admin/login');
  const isPublic =
    path.startsWith('/_next') ||
    path.startsWith('/favicon') ||
    path.startsWith('/api');

  if (isPublic) return response;

  // Admin routes: allow /admin/login, protect everything else under /admin
  if (path.startsWith('/admin')) {
    if (path.startsWith('/admin/login')) {
      // If already logged in as super admin, redirect to /admin
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_super_admin')
          .eq('id', user.id)
          .single();
        if (profile?.is_super_admin) {
          const url = request.nextUrl.clone();
          url.pathname = '/admin';
          return NextResponse.redirect(url);
        }
      }
      return response;
    }
    // Other /admin/* routes — layout handles auth
    return response;
  }

  // Client routes
  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};

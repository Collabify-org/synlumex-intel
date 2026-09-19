import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Allow /admin/login to render without auth check
  const headersList = headers();
  const pathname = headersList.get('x-pathname') || '';
  if (pathname.startsWith('/admin/login')) {
    return <>{children}</>;
  }

  if (!user) redirect('/admin/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_super_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_super_admin) {
    await supabase.auth.signOut();
    redirect('/admin/login');
  }

  return <>{children}</>;
}

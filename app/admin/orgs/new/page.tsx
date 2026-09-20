import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { NewOrgForm } from './new-org-form';

export const dynamic = 'force-dynamic';

export default async function NewOrgPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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

  const { data: plans } = await supabase
    .from('plans')
    .select('id, name, price_monthly')
    .eq('is_active', true)
    .order('sort_order');

  return <NewOrgForm plans={plans ?? []} />;
}

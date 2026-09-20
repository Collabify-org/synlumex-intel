import { Badge } from '@/components/ui/badge';
import { shortDate } from '@/lib/format';

type Member = {
  id: string;
  role: string;
  joined_at: string;
  user_id: string;
  profiles: {
    id: string;
    email: string;
    full_name: string;
  } | null;
};

export function OrgUsers({ members }: { members: Member[] }) {
  if (members.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-muted-foreground">
        No users in this organization yet.
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/30">
        <tr className="text-[10px] font-mono tracking-widest text-muted-foreground">
          <th className="text-left p-3 font-normal">NAME</th>
          <th className="text-left p-3 font-normal">EMAIL</th>
          <th className="text-left p-3 font-normal">ROLE</th>
          <th className="text-right p-3 font-normal">JOINED</th>
        </tr>
      </thead>
      <tbody>
        {members.map((m) => {
          const profile = m.profiles;
          return (
            <tr key={m.id} className="border-t border-border">
              <td className="p-3">{profile?.full_name ?? '—'}</td>
              <td className="p-3 font-mono text-xs text-muted-foreground">
                {profile?.email ?? '—'}
              </td>
              <td className="p-3">
                <Badge
                  variant={m.role === 'owner' ? 'green' : 'secondary'}
                  className="capitalize text-[10px]"
                >
                  {m.role}
                </Badge>
              </td>
              <td className="p-3 text-right text-xs text-muted-foreground font-mono">
                {shortDate(m.joined_at)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

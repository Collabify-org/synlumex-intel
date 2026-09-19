import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="p-6 text-center py-24">
      <h2 className="text-xl font-semibold mb-2">Project not found</h2>
      <p className="text-sm text-muted-foreground mb-4">
        The project doesn&apos;t exist or you don&apos;t have access.
      </p>
      <Link href="/projects" className="text-brand text-sm hover:underline">← Back to Projects</Link>
    </div>
  );
}

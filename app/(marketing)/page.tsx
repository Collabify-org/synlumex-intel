import Link from 'next/link';
import { HomeSections } from './home-sections';
import { ShieldCheck, MessageCircle } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ============ NAVBAR ============ */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg brand-gradient flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight">SYNLUMEX</span>
              <span className="text-[10px] font-mono text-muted-foreground tracking-widest">INTEL</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#industries" className="text-muted-foreground hover:text-foreground transition-colors">Industries</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <a
              href="https://wa.me/919999999999?text=Hi%2C%20I%27d%20like%20a%20SYNLUMEX%20demo"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md brand-gradient text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Book a demo
            </a>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />

      {/* All sections rendered by client component */}
      <HomeSections />
    </div>
  );
}

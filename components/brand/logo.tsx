'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

type LogoProps = {
  /** Size in pixels (height). Width scales proportionally. Default 32. */
  size?: number;
  /** Enable glow + scale on hover/touch */
  interactive?: boolean;
  /** Subtle floating animation (up/down) */
  floating?: boolean;
  className?: string;
  priority?: boolean;
};

export function Logo({
  size = 32,
  interactive = false,
  floating = false,
  className,
  priority = false
}: LogoProps) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center select-none',
        interactive && 'transition-all duration-300 hover:scale-105',
        floating && 'animate-float',
        className
      )}
      style={{ height: size }}
    >
      <Image
        src="/logo.png"
        alt="SYNLUMEX"
        width={size * 4}
        height={size}
        priority={priority}
        className={cn(
          'h-full w-auto object-contain transition-all duration-300',
          interactive && 'group-hover:brightness-110'
        )}
        style={{ height: size }}
      />
      {/* Glow ring on hover */}
      {interactive && (
        <span
          className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: '0 0 24px 4px rgba(14, 165, 233, 0.4)',
            borderRadius: 8
          }}
          aria-hidden
        />
      )}
    </div>
  );
}

/** Logo mark only — useful when you just want the "S" (future use) */
export function LogoMark({
  size = 32,
  className,
  priority = false
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt="SYNLUMEX"
      width={size * 4}
      height={size}
      priority={priority}
      className={cn('object-contain', className)}
      style={{ height: size, width: 'auto' }}
    />
  );
}

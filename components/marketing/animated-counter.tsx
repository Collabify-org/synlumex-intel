'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
};

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1600,
  className = ''
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState('0');
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setHasStarted(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const start = performance.now();
    const from = 0;
    const to = value;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplay(to.toFixed(decimals));
      }
    }

    requestAnimationFrame(tick);
  }, [hasStarted, value, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

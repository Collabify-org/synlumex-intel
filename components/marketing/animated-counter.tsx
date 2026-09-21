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
  const [display, setDisplay] = useState(decimals > 0 ? '0.0' : '0');
  const startedRef = useRef(false);

  function runCountUp() {
    if (startedRef.current) return;
    startedRef.current = true;
    const start = performance.now();
    const to = value;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * to;
      setDisplay(current.toFixed(decimals));
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(to.toFixed(decimals));
    }
    requestAnimationFrame(tick);
  }

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // If value is 0, nothing to animate
    if (value === 0) {
      setDisplay((0).toFixed(decimals));
      return;
    }

    // Fallback: if IntersectionObserver isn't supported, just run it
    if (typeof IntersectionObserver === 'undefined') {
      runCountUp();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountUp();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);

    // Safety net: if not triggered within 1.5s, just run it
    const safetyTimeout = setTimeout(() => {
      runCountUp();
      observer.disconnect();
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

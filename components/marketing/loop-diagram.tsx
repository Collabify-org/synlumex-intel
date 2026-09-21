'use client';

import { useEffect, useRef, useState } from 'react';
import { LayoutGrid, RefreshCw, AlertTriangle, Bell, ScrollText } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Anyone updates', detail: 'Progress, billing, or stage', icon: LayoutGrid },
  { id: 2, label: 'System recomputes', detail: 'Health recalculated against rules', icon: RefreshCw },
  { id: 3, label: 'Exceptions created', detail: 'Delayed, overrun, missing evidence', icon: AlertTriangle },
  { id: 4, label: 'Owners notified', detail: 'Reminder to accountable person', icon: Bell },
  { id: 5, label: 'Audit logged', detail: 'Immutable record of every action', icon: ScrollText }
];

export function LoopDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full flex flex-col lg:flex-row items-center justify-center gap-12">
      {/* SVG Circle Diagram */}
      <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] shrink-0">
        {/* Rotating background rings */}
        <svg
          viewBox="0 0 400 400"
          className={`absolute inset-0 w-full h-full ${visible ? 'animate-rotate-slow' : ''}`}
        >
          <circle
            cx="200"
            cy="200"
            r="160"
            fill="none"
            stroke="hsl(199 89% 48% / 0.15)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />
        </svg>
        <svg
          viewBox="0 0 400 400"
          className={`absolute inset-0 w-full h-full ${visible ? 'animate-rotate-reverse' : ''}`}
        >
          <circle
            cx="200"
            cy="200"
            r="140"
            fill="none"
            stroke="hsl(199 89% 48% / 0.1)"
            strokeWidth="1"
          />
        </svg>

        {/* Main connector circle */}
        <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="loopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>

          {/* Outer connector ring */}
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke="url(#loopGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="754"
            strokeDashoffset={visible ? 0 : 754}
            style={{
              transition: 'stroke-dashoffset 2000ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />

          {/* Inner pulsing ring */}
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke="hsl(199 89% 48% / 0.3)"
            strokeWidth="8"
            opacity={visible ? 0.4 : 0}
            style={{ transition: 'opacity 1500ms ease 1000ms' }}
          >
            {visible && (
              <animate
                attributeName="r"
                values="120;135;120"
                dur="4s"
                repeatCount="indefinite"
              />
            )}
          </circle>

          {/* Traveling dot on the ring */}
          {visible && (
            <circle r="6" fill="#22d3ee">
              <animateMotion
                dur="8s"
                repeatCount="indefinite"
                path="M 200,80 A 120,120 0 1,1 199,80 Z"
              />
              <animate
                attributeName="opacity"
                values="1;0.4;1"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </circle>
          )}
        </svg>

        {/* Center brand mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-20 w-20 rounded-2xl brand-gradient brand-glow flex items-center justify-center">
            <span className="text-2xl font-bold text-white tracking-tight">S</span>
          </div>
        </div>

        {/* 5 Node buttons around the circle */}
        {STEPS.map((step, i) => {
          const angle = (i * 72 - 90) * (Math.PI / 180);
          const radius = 120;
          const x = 50 + (radius / 200) * 50 * Math.cos(angle);
          const y = 50 + (radius / 200) * 50 * Math.sin(angle);
          return (
            <div
              key={step.id}
              className="absolute h-12 w-12 rounded-full border-2 border-brand-cyan/50 bg-card flex items-center justify-center shadow-lg hover:scale-110 hover:border-brand-cyan transition-transform duration-300 group cursor-default"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                opacity: visible ? 1 : 0,
                transition: `opacity 500ms ease ${i * 120 + 400}ms, transform 300ms ease`
              }}
            >
              <step.icon className="h-5 w-5 text-brand-cyan" />
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-popover px-3 py-1 text-[10px] font-mono tracking-wider text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {step.id}. {step.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right-side list */}
      <div className="space-y-3 w-full max-w-md">
        {STEPS.map((step, i) => (
          <div
            key={step.id}
            className="flex items-start gap-3 rounded-lg border border-border bg-card/50 p-3 hover-lift"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(20px)',
              transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 100 + 300}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 100 + 300}ms`
            }}
          >
            <div className="h-8 w-8 rounded-md border border-brand-cyan/40 bg-brand/10 flex items-center justify-center shrink-0">
              <span className="text-xs font-mono font-semibold text-brand-cyan">
                0{step.id}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground">{step.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-snug">
                {step.detail}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

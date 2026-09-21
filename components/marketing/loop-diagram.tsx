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

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);

    const safetyTimeout = setTimeout(() => setVisible(true), 2000);

    return () => {
      observer.disconnect();
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Circle geometry: 5 nodes at 72° intervals, starting at top (-90°)
  const SIZE = 400;
  const CENTER = SIZE / 2;
  const RADIUS = 140;
  const nodes = STEPS.map((step, i) => {
    const angle = (i * 72 - 90) * (Math.PI / 180);
    return {
      ...step,
      x: CENTER + RADIUS * Math.cos(angle),
      y: CENTER + RADIUS * Math.sin(angle)
    };
  });

  return (
    <div ref={ref} className="w-full flex flex-col lg:flex-row items-center justify-center gap-12">
      {/* SVG Circle Diagram */}
      <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] shrink-0">
        {/* Rotating background rings */}
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className={`absolute inset-0 w-full h-full ${visible ? 'animate-rotate-slow' : ''}`}
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r={185}
            fill="none"
            stroke="hsl(199 89% 48% / 0.15)"
            strokeWidth="1"
            strokeDasharray="3 10"
          />
        </svg>

        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className={`absolute inset-0 w-full h-full ${visible ? 'animate-rotate-reverse' : ''}`}
        >
          <circle
            cx={CENTER}
            cy={CENTER}
            r={165}
            fill="none"
            stroke="hsl(199 89% 48% / 0.08)"
            strokeWidth="1"
          />
        </svg>

        {/* Main SVG diagram */}
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 w-full h-full">
          <defs>
            <linearGradient id="loopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>

          {/* Main connecting ring */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke="url(#loopGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="879.6"
            strokeDashoffset={visible ? 0 : 879.6}
            style={{
              transition: 'stroke-dashoffset 2000ms cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />

          {/* Pulse ring */}
          {visible && (
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="hsl(199 89% 48% / 0.4)"
              strokeWidth="2"
            >
              <animate
                attributeName="r"
                values={`${RADIUS};${RADIUS + 12};${RADIUS}`}
                dur="3s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.4;0;0.4"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
          )}

          {/* Traveling dot */}
          {visible && (
            <g style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}>
              <circle cx={CENTER + RADIUS} cy={CENTER} r="5" fill="#22d3ee">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from={`0 ${CENTER} ${CENTER}`}
                  to={`360 ${CENTER} ${CENTER}`}
                  dur="8s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )}

          {/* Small connector ticks at each node */}
          {nodes.map((node, i) => (
            <circle
              key={i}
              cx={node.x}
              cy={node.y}
              r="3"
              fill="hsl(199 89% 48%)"
              opacity={visible ? 0.6 : 0}
              style={{
                transition: `opacity 500ms ease ${i * 120 + 400}ms`
              }}
            />
          ))}
        </svg>

        {/* Center brand mark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="h-20 w-20 rounded-2xl brand-gradient brand-glow flex items-center justify-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'scale(1)' : 'scale(0.6)',
              transition: 'opacity 600ms ease 300ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 300ms'
            }}
          >
            <span className="text-2xl font-bold text-white tracking-tight">S</span>
          </div>
        </div>

        {/* 5 Icon nodes rendered as absolute-positioned HTML for better touch/hover */}
        {nodes.map((node, i) => {
          const xPct = (node.x / SIZE) * 100;
          const yPct = (node.y / SIZE) * 100;
          return (
            <div
              key={node.id}
              className="absolute h-11 w-11 rounded-full border-2 border-brand-cyan/50 bg-card flex items-center justify-center shadow-lg hover:scale-110 hover:border-brand-cyan transition-transform duration-300 group cursor-default"
              style={{
                left: `${xPct}%`,
                top: `${yPct}%`,
                transform: 'translate(-50%, -50%)',
                opacity: visible ? 1 : 0,
                transition: `opacity 500ms ease ${i * 120 + 400}ms, transform 300ms ease`
              }}
            >
              <node.icon className="h-5 w-5 text-brand-cyan" />
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-popover px-3 py-1 text-[10px] font-mono tracking-wider text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {node.id}. {node.label}
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

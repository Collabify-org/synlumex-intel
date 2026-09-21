import { ImageResponse } from 'next/og';

export const alt = 'SYNLUMEX INTEL — Owner-side Project Operating System';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          background: '#0a0e1a',
          padding: 80,
          fontFamily: 'system-ui, sans-serif'
        }}
      >
        {/* Top: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              width: 64,
              height: 64,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%)',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 36,
              fontWeight: 800
            }}
          >
            S
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              color: 'white',
              lineHeight: 1
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
              SYNLUMEX
            </div>
            <div
              style={{
                fontSize: 12,
                letterSpacing: 4,
                color: '#64748b',
                marginTop: 4,
                fontFamily: 'monospace'
              }}
            >
              INTEL
            </div>
          </div>
        </div>

        {/* Middle: Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <span>Run every EPC project</span>
            <span
              style={{
                background: 'linear-gradient(135deg, #60a5fa 0%, #22d3ee 100%)',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              from intake to closeout
            </span>
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#94a3b8',
              maxWidth: 900,
              lineHeight: 1.4
            }}
          >
            Owner-side project operating system. Connect execution, billing, and compliance in
            one closed loop.
          </div>
        </div>

        {/* Bottom: URL */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#64748b',
            fontSize: 16,
            fontFamily: 'monospace'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 8,
              height: 8,
              borderRadius: 4,
              background: '#22d3ee'
            }}
          />
          synlumex-intel.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}

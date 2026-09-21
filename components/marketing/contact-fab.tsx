'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Mail, X } from 'lucide-react';

const WHATSAPP_NUMBER = '919390785041';
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi, I'd like to know more about SYNLUMEX INTEL"
);
const EMAIL = 'abdul@synlumexai.com';
const EMAIL_SUBJECT = encodeURIComponent('SYNLUMEX INTEL — Inquiry');

export function ContactFab() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div
      ref={ref}
      className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Expanded options */}
      {open && (
        <>
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-option flex items-center gap-3 rounded-full bg-[#25D366] text-white pl-4 pr-5 py-2.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            style={{
              animation: 'slideInRight 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards'
            }}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium whitespace-nowrap">WhatsApp us</span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${EMAIL}?subject=${EMAIL_SUBJECT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-option flex items-center gap-3 rounded-full bg-[#0ea5e9] text-white pl-4 pr-5 py-2.5 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            style={{
              animation: 'slideInRight 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
              animationDelay: '60ms',
              opacity: 0
            }}
          >
            <Mail className="h-5 w-5" />
            <span className="text-sm font-medium whitespace-nowrap">Email us</span>
          </a>
        </>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close contact menu' : 'Open contact menu'}
        className="contact-fab h-14 w-14 rounded-full flex items-center justify-center text-white shadow-2xl brand-gradient-animated relative overflow-hidden"
      >
        <div className="relative h-6 w-6">
          <MessageCircle
            className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
              open ? 'opacity-0 rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100'
            }`}
          />
          <X
            className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
              open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-75'
            }`}
          />
        </div>
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full brand-gradient animate-ping opacity-30" />
        )}
      </button>
    </div>
  );
}

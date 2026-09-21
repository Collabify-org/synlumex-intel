'use client';

import { MessageCircle, Mail } from 'lucide-react';

const WHATSAPP_NUMBER = '919390785041';
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi, I'd like to know more about SYNLUMEX INTEL"
);
const EMAIL = 'abdul@synlumexai.com';
const EMAIL_SUBJECT = encodeURIComponent('SYNLUMEX INTEL — Inquiry');

export function ContactFab() {
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2.5"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* WhatsApp */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group flex items-center gap-2.5 rounded-full bg-[#25D366] text-white pl-4 pr-5 py-2.5 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
      >
        <MessageCircle className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium whitespace-nowrap">WhatsApp us</span>
      </a>

      {/* Email */}
      <a
        href={`mailto:${EMAIL}?subject=${EMAIL_SUBJECT}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Email us"
        className="group flex items-center gap-2.5 rounded-full bg-[#0ea5e9] text-white pl-4 pr-5 py-2.5 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
      >
        <Mail className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium whitespace-nowrap">Email us</span>
      </a>
    </div>
  );
}

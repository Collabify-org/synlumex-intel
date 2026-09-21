'use client';

import { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, Loader2, MessageCircle } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const WHATSAPP_URL =
  'https://wa.me/919390785041?text=Hi%2C%20Intel%20AI%20told%20me%20to%20reach%20out';

const SUGGESTIONS = [
  'What is SYNLUMEX?',
  'How much does it cost?',
  'Which industries do you serve?',
  'Is my data safe?'
];

export function IntelAI() {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi, I'm Intel AI. Ask me anything about SYNLUMEX — pricing, features, industries, or how it works."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Show greeting bubble after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed && !open) setShowBubble(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [dismissed, open]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setShowBubble(false);
    }
  }, [open]);

  async function send(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const nextMessages: Message[] = [...messages, { role: 'user', content }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/website-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: nextMessages.slice(-6)
        })
      });

      const data = await res.json();
      const reply =
        data.reply ??
        "I'm having trouble right now. Please reach us on WhatsApp and our team will help.";

      setMessages([...nextMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content:
            "I'm having trouble right now. Please reach us on WhatsApp and our team will help."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    send();
  }

  function openPanel() {
    setOpen(true);
    setShowBubble(false);
  }

  function closePanel() {
    setOpen(false);
    setDismissed(true);
  }

  return (
    <>
      {/* Greeting bubble */}
      {showBubble && !open && !dismissed && (
        <div
          className="fixed bottom-6 left-6 z-[100] max-w-xs animate-[slideInRight_500ms_cubic-bezier(0.16,1,0.3,1)]"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="relative glass-card rounded-2xl rounded-bl-md p-4 shadow-2xl border border-brand-cyan/30 bg-white">
            <button
              onClick={() => {
                setShowBubble(false);
                setDismissed(true);
              }}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl brand-gradient flex items-center justify-center shrink-0 shadow-md">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-mono tracking-widest text-brand-cyan uppercase mb-1">
                  INTEL AI
                </div>
                <p className="text-sm text-foreground leading-snug pr-4">
                  Hi, I&apos;m Intel AI. Ask me anything about SYNLUMEX.
                </p>
                <button
                  onClick={openPanel}
                  className="mt-2 text-xs text-brand-cyan font-medium hover:underline"
                >
                  Start chatting →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-6 left-6 z-[101] w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl shadow-2xl overflow-hidden border border-border bg-white flex flex-col"
          style={{
            height: 'min(560px, calc(100vh - 3rem))',
            paddingBottom: 'env(safe-area-inset-bottom)'
          }}
        >
          {/* Header */}
          <div className="relative shrink-0 p-4 brand-gradient text-white overflow-hidden">
            <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
            <div className="relative flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold">Intel AI</div>
                <div className="text-[10px] font-mono tracking-wider opacity-80 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  ONLINE · SYNLUMEX ASSISTANT
                </div>
              </div>
              <button
                onClick={closePanel}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-secondary/30">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'brand-gradient text-white rounded-br-sm'
                      : 'bg-white border border-border text-foreground rounded-bl-sm shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions — only before user sends first message */}
            {messages.length === 1 && !loading && (
              <div className="pt-2 space-y-1.5">
                <div className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
                  Try asking
                </div>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full text-left text-xs rounded-lg border border-border bg-white hover:border-brand-cyan/50 hover:bg-brand-cyan/5 transition-colors px-3 py-2"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={onSubmit}
            className="shrink-0 border-t border-border p-3 bg-white"
          >
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background focus-within:border-brand-cyan/50 transition-colors pl-3 pr-1.5 py-1.5">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about SYNLUMEX…"
                disabled={loading}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="h-8 w-8 rounded-lg brand-gradient text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                aria-label="Send"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
              <span>Powered by SYNLUMEX AI</span>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <MessageCircle className="h-3 w-3" /> Talk to human
              </a>
            </div>
          </form>
        </div>
      )}

      {/* FAB — opens panel */}
      {!open && (
        <button
          onClick={openPanel}
          aria-label="Open Intel AI"
          className="fixed bottom-6 left-6 z-[99] h-14 w-14 rounded-full brand-gradient-animated text-white shadow-2xl hover:scale-105 transition-transform flex items-center justify-center relative"
          style={{
            paddingBottom: 'env(safe-area-inset-bottom)',
            display: showBubble && !dismissed ? 'none' : 'flex'
          }}
        >
          <Sparkles className="h-6 w-6" />
          {!dismissed && (
            <span className="absolute inset-0 rounded-full brand-gradient animate-ping opacity-25" />
          )}
        </button>
      )}
    </>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { fetchJson } from '@/lib/utils';
import { Btn, LoadingDots, ErrorBanner } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function CopilotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m **ZestAI** - your copilot for Zing & Zest. Ask about forecasts, personas, competitors, IMC, recovery strategy, or navigate the platform.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const quickPrompts = ['What is our Year-1 forecast?', 'Explain our personas', 'Recovery strategy?', 'IMC budget breakdown'];

  const send = async (text?: string) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;
    setInput('');
    setError('');
    setMessages((m) => [...m, { role: 'user', content: userMsg }]);
    setLoading(true);
    try {
      const history = messages.filter((m) => m.role === 'user' || m.role === 'assistant').slice(-8);
      const data = await fetchJson<{ reply: string; source?: string }>('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history, mode: 'copilot' }),
      });
      setMessages((m) => [...m, { role: 'assistant', content: data.reply + (data.source === 'offline' ? '\n\n_ℹ️ Offline mode - add HF_TOKEN for live LLM._' : '') }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Chat failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fab-button fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white"
        aria-label="Open AI Copilot"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="copilot-shell fixed bottom-24 right-4 z-50 flex h-[min(520px,70vh)] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-2 border-b border-[var(--border-medium)] bg-gradient-to-r from-[var(--brand-orange-soft)] to-[var(--brand-teal-soft)] px-4 py-3">
              <Sparkles className="h-4 w-4 accent-orange" />
              <div>
                <p className="text-sm font-bold">ZestAI Copilot</p>
                <p className="text-[0.65rem] text-muted">Powered by Hugging Face</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                      m.role === 'user' ? 'highlight-orange' : 'glass text-secondary',
                    )}
                    dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }}
                  />
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="glass rounded-2xl px-4 py-2"><LoadingDots /></div>
                </div>
              )}
              {error && <ErrorBanner message={error} onRetry={() => setError('')} />}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-[var(--border-medium)] p-3">
              <div className="mb-2 flex flex-wrap gap-1">
                {quickPrompts.map((q) => (
                  <button key={q} onClick={() => send(q)} disabled={loading} className="rounded-full border border-[var(--border-medium)] px-2 py-0.5 text-[0.62rem] text-muted hover:border-[var(--border-accent)] hover:text-accent">
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder="Ask about forecasts, personas..."
                  className="flex-1 rounded-xl border border-[var(--border-medium)] bg-[var(--bg-card)] px-3 py-2 text-sm outline-none focus:border-[var(--border-accent)]"
                />
                <Btn onClick={() => send()} disabled={loading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Btn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

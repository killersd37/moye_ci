import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, X, User, Sparkles, Brain } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onSend: (text: string) => void;
  welcomeMessage: string;
  quickMode?: boolean;
  onQuickModeChange?: (value: boolean) => void;
  /** Question en attente : affiche le bouton "Réflexion Profonde" pour basculer sur Ollama */
  pendingOllamaQuestion?: string | null;
  /** Appelé quand l'utilisateur clique sur Réflexion Profonde (envoi de la question à Ollama) */
  onRequestOllama?: () => void;
}

export function ChatWindow({
  isOpen,
  onClose,
  messages,
  isLoading,
  error,
  onSend,
  welcomeMessage,
  quickMode = true,
  onQuickModeChange,
  pendingOllamaQuestion,
  onRequestOllama,
}: ChatWindowProps) {
  const [input, setInput] = React.useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    onSend(text);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-36 right-4 z-50 flex h-[420px] w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border shadow-2xl md:right-6 md:h-[480px]"
        style={{
          background: 'linear-gradient(180deg, #FDF8F0 0%, #F5E6C8 50%, #EDD28F 100%)',
          borderColor: 'rgba(139,105,20,0.25)',
          boxShadow: '0 0 0 1px rgba(200,150,12,0.15), 0 20px 50px rgba(0,0,0,0.2)',
        }}
      >
        <header
          className="flex shrink-0 items-center justify-between gap-3 px-4 py-3"
          style={{
            background: 'linear-gradient(135deg, rgba(139,105,20,0.9) 0%, rgba(160,120,30,0.95) 100%)',
            borderBottom: '1px solid rgba(200,150,12,0.3)',
          }}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDF3DC]/20">
              <Sparkles className="h-5 w-5 text-[#FDF3DC]" />
            </div>
            <div>
              <h2 className="font-philosopher text-base font-bold text-[#FDF3DC]">La Lumière Moyé</h2>
              <p className="text-[10px] text-[#FDF3DC]/80">Gardien du patrimoine ivoirien</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-2 text-[#FDF3DC]/90 transition-colors hover:bg-[#FDF3DC]/20 hover:text-[#FDF3DC]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {onQuickModeChange && (
          <div className="shrink-0 flex items-center justify-between gap-2 px-4 py-2 border-b border-[#C8960C]/15 bg-[#FDF3DC]/30">
            <span className="text-[11px] font-medium text-[#5C4A2A]">Réponse rapide</span>
            <button
              type="button"
              role="switch"
              aria-checked={quickMode}
              onClick={() => onQuickModeChange(!quickMode)}
              className={cn(
                'relative h-6 w-11 shrink-0 rounded-full transition-colors',
                quickMode ? 'bg-[#8B6914]' : 'bg-[#C8960C]/40'
              )}
            >
              <span
                className={cn(
                  'absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all',
                  quickMode ? 'left-6' : 'left-1'
                )}
              />
            </button>
          </div>
        )}

        {/* Volet optionnel Réflexion Profonde : basculer sur Ollama quand la réponse locale n'existe pas */}
        {pendingOllamaQuestion && onRequestOllama && (
          <div className="shrink-0 flex items-center gap-2 px-4 py-2 border-b border-[#C8960C]/15 bg-[#8B6914]/10">
            <Brain className="h-4 w-4 text-[#8B6914]" />
            <span className="text-[11px] font-medium text-[#5C4A2A] flex-1">Réponse plus détaillée avec Ollama</span>
            <button
              type="button"
              onClick={onRequestOllama}
              disabled={isLoading}
              className="shrink-0 rounded-lg bg-[#8B6914] px-3 py-1.5 text-[11px] font-medium text-[#FDF3DC] transition-colors hover:bg-[#A07820] disabled:opacity-50"
            >
              Réflexion Profonde
            </button>
          </div>
        )}

        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-3">
            {messages.length === 0 && !isLoading && !error && (
              <div className="rounded-xl px-4 py-3 text-sm leading-relaxed" style={{ color: '#5C4A2A' }}>
                {welcomeMessage}
              </div>
            )}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'mb-3 flex gap-2',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8B6914]/20">
                    <Sparkles className="h-4 w-4 text-[#8B6914]" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-[#8B6914] text-[#FDF3DC]'
                      : 'bg-white/90 text-[#1A1008] border border-[#C8960C]/20'
                  )}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8B6914]/30">
                    <User className="h-4 w-4 text-[#8B6914]" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="mb-3 flex gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8B6914]/20">
                  <Sparkles className="h-4 w-4 text-[#8B6914]" />
                </div>
                <div className="flex items-center gap-2 rounded-2xl border border-[#C8960C]/20 bg-white/90 px-4 py-2.5">
                  <Loader2 className="h-4 w-4 animate-spin text-[#8B6914]" />
                  <span className="text-[13px] text-[#5C4A2A]">
                  {quickMode ? 'Réponse rapide…' : 'Réflexion… (Ollama local, 1 à 2 min possible)'}
                </span>
                </div>
              </div>
            )}
            {error && (
              <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-[13px] text-amber-800">
                {error}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="shrink-0 border-t border-[#C8960C]/20 p-3">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Posez une question sur une ethnie, une tradition..."
                rows={1}
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-[#C8960C]/30 bg-white/90 px-4 py-2.5 text-[13px] text-[#1A1008] placeholder:text-[#8B6914]/50 focus:border-[#8B6914] focus:outline-none focus:ring-2 focus:ring-[#8B6914]/20"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl bg-[#8B6914] text-[#FDF3DC] transition-colors hover:bg-[#A07820] disabled:opacity-40 disabled:hover:bg-[#8B6914]"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

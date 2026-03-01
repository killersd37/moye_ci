import React, { useCallback, useState } from 'react';
import { FloatingButton } from './FloatingButton';
import { ChatWindow, type ChatMessage } from './ChatWindow';
import {
  findLocalAnswer,
  NO_MATCH_SUGGESTION,
} from '../../services/localChatSimulation';

const WELCOME_MESSAGE = `Akwaba 👋
Je suis la Lumière Moyé.
Gardien numérique du patrimoine ivoirien.
Pose-moi une question sur une ethnie, une tradition ou un site touristique.`;

const MOYE_API = import.meta.env.VITE_MOYE_API_URL ?? '';
const MOYE_CHAT_URL = `${MOYE_API}/api/v1/moye`;

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Options pour l'envoi : useOllama = true envoie directement à Ollama (Réflexion Profonde) */
export type SendOptions = { useOllama?: boolean };

export function MoyéAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quickMode, setQuickMode] = useState(true);
  /** Question en attente pour le bouton "Réflexion Profonde" (réponse locale non trouvée) */
  const [pendingOllamaQuestion, setPendingOllamaQuestion] = useState<string | null>(null);

  const sendToOllama = useCallback(async (question: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(MOYE_CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, quick: false }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || 'Erreur de connexion. Vérifiez que le backend et Ollama sont démarrés.');
        return;
      }

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.message ?? 'Aucune réponse.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError('Impossible de joindre La Lumière Moyé. Vérifiez votre connexion et le backend.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendMessage = useCallback(
    async (text: string, options?: SendOptions) => {
      const useOllama = options?.useOllama === true;
      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setError(null);
      setPendingOllamaQuestion(null);

      // Réflexion Profonde : envoi direct à Ollama (sans simulation locale)
      if (useOllama) {
        await sendToOllama(text);
        return;
      }

      // 1) Simulation locale : chercher une correspondance dans la base JSON
      setIsLoading(true);
      try {
        const result = await findLocalAnswer(text);
        if (result.found) {
          const assistantMsg: ChatMessage = {
            id: generateId(),
            role: 'assistant',
            content: result.answer,
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
          setIsLoading(false);
          return;
        }

        // 2) Aucune correspondance : proposer de basculer sur Ollama
        const suggestionMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: NO_MATCH_SUGGESTION,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, suggestionMsg]);
        setPendingOllamaQuestion(text);
      } catch (err) {
        setError('Erreur lors de la recherche locale. Réessayez ou utilisez Réflexion Profonde.');
      } finally {
        setIsLoading(false);
      }
    },
    [sendToOllama]
  );

  const handleRequestOllama = useCallback(() => {
    if (pendingOllamaQuestion) {
      sendMessage(pendingOllamaQuestion, { useOllama: true });
      setPendingOllamaQuestion(null);
    }
  }, [pendingOllamaQuestion, sendMessage]);

  return (
    <>
      <FloatingButton isOpen={isOpen} onClick={() => setIsOpen((o) => !o)} />
      <ChatWindow
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isLoading={isLoading}
        error={error}
        onSend={sendMessage}
        welcomeMessage={WELCOME_MESSAGE}
        quickMode={quickMode}
        onQuickModeChange={setQuickMode}
        pendingOllamaQuestion={pendingOllamaQuestion}
        onRequestOllama={handleRequestOllama}
      />
    </>
  );
}

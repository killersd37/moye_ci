export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

export interface ChatRequest {
  question: string;
  conversationId?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream: false;
  options?: {
    temperature?: number;
    top_p?: number;
    num_predict?: number;
  };
}

export interface OllamaGenerateResponse {
  model: string;
  response: string;
  done: boolean;
  done_reason?: string;
}

export interface RAGContext {
  ethnies: string;
  langues: string;
  academie: string;
  sitesTouristiques: string;
}

export const EMPTY_STRUCTURED_TEMPLATE = {
  ETHNIE: null as { nom?: string; description?: string; region?: string } | null,
  LANGUE: null as { nom?: string; code?: string; famille?: string } | null,
  ACADEMIE: null as { niveau?: string; lecon?: string; contenu?: string } | null,
  SITE_TOURISTIQUE: null as { nom?: string; region?: string; description?: string } | null,
};

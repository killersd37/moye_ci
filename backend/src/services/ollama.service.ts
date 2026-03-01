import { logger } from '../utils/logger';
import type { OllamaGenerateRequest, OllamaGenerateResponse } from '../types/chat.types';

const OLLAMA_DEFAULT_URL = 'http://localhost:11434';
const OLLAMA_MODEL = 'llama3:8b';

function getOllamaBaseUrl(): string {
  return process.env.OLLAMA_URL ?? process.env.OLLAMA_HOST ?? OLLAMA_DEFAULT_URL;
}

export async function generateCompletion(prompt: string): Promise<string> {
  const baseUrl = getOllamaBaseUrl().replace(/\/$/, '');
  const url = `${baseUrl}/api/generate`;

  const body: OllamaGenerateRequest = {
    model: process.env.OLLAMA_MODEL ?? OLLAMA_MODEL,
    prompt,
    stream: false,
    options: {
      temperature: 0.3,
      num_predict: 1024,
    },
  };

  logger.info('Ollama generate request', { url: baseUrl, model: body.model });

  const controller = new AbortController();
  const timeoutMs = 300_000;
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text();
      logger.error('Ollama non-OK response', { status: res.status, body: text });
      throw new Error(`Ollama error: ${res.status} ${text}`);
    }

    const data = (await res.json()) as OllamaGenerateResponse;
    return data.response ?? '';
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error) {
      logger.error('Ollama request failed', { message: err.message });
      throw err;
    }
    throw new Error('Ollama request failed');
  }
}

export async function healthCheck(): Promise<boolean> {
  const baseUrl = getOllamaBaseUrl().replace(/\/$/, '');
  try {
    const res = await fetch(`${baseUrl}/api/tags`, { method: 'GET' });
    return res.ok;
  } catch {
    return false;
  }
}

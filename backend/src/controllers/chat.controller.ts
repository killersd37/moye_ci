/*
 * MEMORY-READY: Accept conversationId in body for future conversation persistence.
 * When session/memory is implemented, inject last N turns into RAG or system prompt here.
 */
import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { buildContextFromQuery, buildPromptForOllama, formatQuickResponse } from '../services/rag.service';
import { generateCompletion } from '../services/ollama.service';

export async function postChat(req: Request, res: Response): Promise<void> {
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  const quick = Boolean(req.body?.quick);

  if (!question) {
    res.status(400).json({ success: false, error: 'question requise' });
    return;
  }

  logger.info('Moyé chat request', { questionLength: question.length, quick });

  try {
    const context = await buildContextFromQuery(question);

    if (quick) {
      const message = formatQuickResponse(context);
      res.json({ success: true, message });
      return;
    }

    const fullPrompt = buildPromptForOllama(context, question);
    const response = await generateCompletion(fullPrompt);

    res.json({ success: true, message: response.trim() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error('Moyé chat error', { error: msg });
    const isDb = /prisma|database|connect|5432|P1001/i.test(msg);
    res.status(500).json({
      success: false,
      error: isDb
        ? 'Base de données indisponible. Démarrez PostgreSQL (port 5432) pour le contexte culturel.'
        : 'La Lumière Moyé est temporairement indisponible. Vérifiez qu\'Ollama est démarré (ollama run llama3:8b).',
    });
  }
}

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const { healthCheck } = await import('../services/ollama.service');
  const ok = await healthCheck();
  res.json({ success: true, ollama: ok });
}

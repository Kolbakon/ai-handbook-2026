/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TokenEstimate {
  estimatedTokens: number;
  multiplierVsEnglish: number;
  isRussianDominant: boolean;
  costEstimateUsd: {
    geminiFlashInput: number;
    geminiProInput: number;
  };
}

/**
 * Calculates estimated tokens and comparative cost for Russian vs English text.
 * Rule: Russian is usually 1.5 - 2.0x more expensive in tokens per word/character.
 */
export function estimateTokens(text: string): TokenEstimate {
  if (!text || text.trim().length === 0) {
    return {
      estimatedTokens: 0,
      multiplierVsEnglish: 1.0,
      isRussianDominant: false,
      costEstimateUsd: {
        geminiFlashInput: 0,
        geminiProInput: 0,
      },
    };
  }

  const cyrillicMatches = text.match(/[а-яА-ЯёЁ]/g) || [];
  const latinMatches = text.match(/[a-zA-Z]/g) || [];
  const isRussianDominant = cyrillicMatches.length >= latinMatches.length;

  let estimatedTokens: number;
  if (isRussianDominant) {
    // In Russian, ~1 token is about 1.8-2.2 characters
    estimatedTokens = Math.max(1, Math.round(text.length / 2.0));
  } else {
    // In English, ~1 token is about 3.8-4.0 characters
    estimatedTokens = Math.max(1, Math.round(text.length / 3.8));
  }

  const multiplierVsEnglish = isRussianDominant ? 1.8 : 1.0;

  // Gemini 3 Flash: $0.50 per 1M input tokens
  // Gemini 3 Pro: $2.00 per 1M input tokens
  const geminiFlashInput = (estimatedTokens / 1_000_000) * 0.50;
  const geminiProInput = (estimatedTokens / 1_000_000) * 2.00;

  return {
    estimatedTokens,
    multiplierVsEnglish,
    isRussianDominant,
    costEstimateUsd: {
      geminiFlashInput,
      geminiProInput,
    },
  };
}

export function clampSlideIndex(index: number, total: number): number {
  if (total <= 0) return 0;
  if (index < 0) return 0;
  if (index >= total) return total - 1;
  return index;
}

export function calculateChecklistProgress(checkedIds: string[], totalCount: number): number {
  if (totalCount <= 0) return 0;
  const validChecked = Math.min(checkedIds.length, totalCount);
  return Math.round((validChecked / totalCount) * 100);
}

export interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  slideIndex: number;
  snippet: string;
}

export function searchMagazineContent(
  query: string,
  items: Array<{ id: string; title: string; category: string; slideIndex: number; text: string }>
): SearchResultItem[] {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  return items
    .filter(item => 
      item.title.toLowerCase().includes(cleanQuery) ||
      item.text.toLowerCase().includes(cleanQuery) ||
      item.category.toLowerCase().includes(cleanQuery)
    )
    .map(item => {
      const lower = item.text.toLowerCase();
      const idx = lower.indexOf(cleanQuery);
      let snippet = item.text;
      if (idx !== -1) {
        const start = Math.max(0, idx - 40);
        const end = Math.min(item.text.length, idx + cleanQuery.length + 60);
        snippet = (start > 0 ? '...' : '') + item.text.substring(start, end) + (end < item.text.length ? '...' : '');
      } else {
        snippet = item.text.substring(0, 100) + '...';
      }
      return {
        id: item.id,
        title: item.title,
        category: item.category,
        slideIndex: item.slideIndex,
        snippet,
      };
    })
    .slice(0, 10);
}

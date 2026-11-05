/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { searchMagazineContent } from '../utils/magazine-logic';
import { MAGAZINE_SLIDES } from '../data/magazine-data';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSlide: (index: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectSlide }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Flatten slides into searchable items
  const searchableItems = MAGAZINE_SLIDES.map((slide, idx) => {
    const textPool = [
      slide.title,
      slide.subtitle || '',
      slide.mainTakeaway || '',
      slide.dropCapParagraph || '',
      ...(slide.secondaryParagraphs || []),
      ...(slide.bulletPoints?.map(b => `${b.label} ${b.text}`) || []),
      ...(slide.callouts?.map(c => `${c.title} ${c.text}`) || []),
      slide.prompt?.template || '',
      slide.marginNote || '',
    ].join(' ');

    return {
      id: slide.id,
      title: slide.title,
      category: slide.partTitle,
      slideIndex: idx,
      text: textPool,
    };
  });

  const results = searchMagazineContent(query, searchableItems);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-16 sm:pt-24">
      <div className="w-full max-w-2xl bg-[#F5EFE2] border-2 border-[#1E3B34] shadow-none flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#1E3B34]/20 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#FF2E88]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по 11 главам, тарифам, терминам и промптам..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-[#1E3B34] focus:outline-none placeholder-[#1E3B34]/50"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              type="button"
              className="text-xs text-[#1E3B34]/60 hover:text-[#1E3B34]"
            >
              Очистить
            </button>
          )}
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-[#1E3B34] hover:text-[#FF2E88] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Tags */}
        <div className="px-4 py-2 bg-[#1E3B34]/5 border-b border-[#1E3B34]/10 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-[#1E3B34]/60 mr-1 text-[10px] font-bold uppercase tracking-wider">Частые темы:</span>
          {['Токены', 'Тарифы Claude', 'NotebookLM', 'Stitch', '152-ФЗ', 'RAG', 'Промпты', 'План 8 недель'].map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              type="button"
              className="px-2 py-0.5 bg-white border border-[#1E3B34]/15 hover:border-[#FF2E88] text-[#1E3B34] whitespace-nowrap cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {query.trim().length === 0 ? (
            <div className="text-center py-12 text-xs text-[#1E3B34]/60">
              Введите ключевое слово для поиска по всем 56 слайдам и приложениям книги.
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 text-xs text-[#1E3B34]/60">
              По запросу «{query}» ничего не найдено. Попробуйте сформулировать иначе.
            </div>
          ) : (
            results.map((res) => (
              <button
                key={res.id}
                onClick={() => {
                  onSelectSlide(res.slideIndex);
                  onClose();
                }}
                type="button"
                className="w-full text-left p-3 bg-white border border-[#1E3B34]/15 hover:border-[#FF2E88] transition-colors cursor-pointer block"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF2E88]">
                    {res.category} · Стр. {res.slideIndex + 1}
                  </span>
                  <CornerDownLeft className="w-3.5 h-3.5 text-[#1E3B34]/40" />
                </div>
                <h4 className="font-serif text-sm font-bold text-[#1E3B34]">
                  {res.title}
                </h4>
                <p className="text-xs text-[#1E3B34]/80 mt-1 line-clamp-2">
                  {res.snippet}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

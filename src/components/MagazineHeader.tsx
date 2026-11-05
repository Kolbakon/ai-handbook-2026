/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MAGAZINE_PARTS } from '../data/magazine-data';
import {
  BookOpen,
  Volume2,
  VolumeX,
  Search,
  Maximize2,
  Grid,
  X,
  ArrowRight,
  Share2
} from 'lucide-react';

interface MagazineHeaderProps {
  currentSlide: number;
  totalSlides: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onNavigateSlide: (index: number) => void;
  onOpenSearch: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  viewMode: 'spread' | 'continuous';
  onToggleViewMode: () => void;
  onOpenShare: () => void;
}

export const MagazineHeader: React.FC<MagazineHeaderProps> = ({
  currentSlide,
  totalSlides,
  isMuted,
  onToggleSound,
  onNavigateSlide,
  onOpenSearch,
  isFullscreen,
  onToggleFullscreen,
  viewMode,
  onToggleViewMode,
  onOpenShare,
}) => {
  const [isTocOpen, setIsTocOpen] = useState(false);
  const progressPercent = Math.round(((currentSlide + 1) / totalSlides) * 100);

  return (
    <>
      {/* Top Bar strictly obeying the 3-zone contract */}
      <header className="sticky top-0 z-40 bg-[#F5EFE2] border-b border-[#1E3B34]/20 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark (Single text element) */}
          <button
            onClick={() => onNavigateSlide(0)}
            type="button"
            className="text-base sm:text-lg font-serif font-bold tracking-tight text-[#1E3B34] whitespace-nowrap shrink-0 hover:text-[#FF2E88] transition-colors cursor-pointer text-left"
          >
            ИИ с нуля <span className="font-sans text-xs font-normal opacity-60">· Осень 2026</span>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-[#1E3B34]/80">
            <button
              onClick={() => onNavigateSlide(1)}
              type="button"
              className="hover:text-[#FF2E88] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Оглавление
            </button>
            <button
              onClick={() => setIsTocOpen(true)}
              type="button"
              className="hover:text-[#FF2E88] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>11 Частей</span>
              <span className="text-[10px] text-[#FF2E88] font-mono">▾</span>
            </button>
            <button
              onClick={() => onNavigateSlide(44)}
              type="button"
              className="hover:text-[#FF2E88] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              План на 8 недель
            </button>
            <button
              onClick={() => onNavigateSlide(52)}
              type="button"
              className="hover:text-[#FF2E88] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Словарь
            </button>
            <button
              onClick={() => onNavigateSlide(55)}
              type="button"
              className="hover:text-[#FF2E88] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Источники
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action group */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Share / Export Button */}
            <button
              onClick={onOpenShare}
              type="button"
              title="Поделиться книгой / Экспорт"
              aria-label="Поделиться книгой"
              className="px-2.5 py-1 text-[11px] font-bold border border-[#FF2E88] text-[#FF2E88] hover:bg-[#FF2E88] hover:text-white transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Поделиться</span>
            </button>

            {/* View Mode Toggle */}
            <button
              onClick={onToggleViewMode}
              type="button"
              title="Переключить режим: разворот / непрерывная лента"
              className="px-2.5 py-1 text-[11px] font-bold border border-[#1E3B34]/30 text-[#1E3B34] hover:bg-[#1E3B34] hover:text-[#F5EFE2] transition-colors whitespace-nowrap hidden sm:flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{viewMode === 'spread' ? 'Лента' : 'Разворот'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              type="button"
              title={isMuted ? 'Включить звук перелистывания' : 'Выключить звук'}
              aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
              className="p-1.5 text-[#1E3B34] hover:text-[#FF2E88] transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-[#1E3B34]/50" /> : <Volume2 className="w-4 h-4 text-[#FF2E88]" />}
            </button>

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              type="button"
              title="Поиск по книге (Ctrl+K)"
              aria-label="Поиск по книге"
              className="p-1.5 text-[#1E3B34] hover:text-[#FF2E88] transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={onToggleFullscreen}
              type="button"
              title="На весь экран"
              aria-label="Режим презентации на весь экран"
              className="p-1.5 text-[#1E3B34] hover:text-[#FF2E88] transition-colors cursor-pointer hidden sm:block"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Chapter Navigator button */}
            <button
              onClick={() => setIsTocOpen(true)}
              type="button"
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#1E3B34] hover:bg-[#FF2E88] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Разделы</span>
              <span className="sm:hidden font-mono">{currentSlide + 1}/{totalSlides}</span>
            </button>
          </div>
        </div>

        {/* Continuous Reading Progress Indicator Line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E3B34]/10">
          <div
            className="h-full bg-[#FF2E88] transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Chapters & Table of Contents Drawer Modal */}
      {isTocOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-[#F5EFE2] h-full overflow-y-auto p-6 flex flex-col justify-between border-l-2 border-[#1E3B34]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#1E3B34]/20 mb-4">
                <div>
                  <span className="kicker text-[#FF2E88] text-[9px] block">НАВИГАЦИЯ ПО КНИГЕ</span>
                  <h3 className="font-serif text-xl font-bold text-[#1E3B34]">Оглавление разделов</h3>
                </div>
                <button
                  onClick={() => setIsTocOpen(false)}
                  type="button"
                  aria-label="Закрыть оглавление"
                  className="p-2 text-[#1E3B34] hover:text-[#FF2E88] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Special Entry Points */}
              <div className="space-y-1 mb-4 pb-4 border-b border-[#1E3B34]/15">
                <button
                  onClick={() => { onNavigateSlide(0); setIsTocOpen(false); }}
                  type="button"
                  className="w-full text-left p-2.5 hover:bg-[#1E3B34]/5 text-xs font-bold text-[#1E3B34] flex items-center justify-between cursor-pointer"
                >
                  <span>00. Обложка издания</span>
                  <span className="text-[10px] font-mono opacity-60">Стр. 1</span>
                </button>
                <button
                  onClick={() => { onNavigateSlide(1); setIsTocOpen(false); }}
                  type="button"
                  className="w-full text-left p-2.5 hover:bg-[#1E3B34]/5 text-xs font-bold text-[#1E3B34] flex items-center justify-between cursor-pointer"
                >
                  <span>Введение & Колонка редактора</span>
                  <span className="text-[10px] font-mono opacity-60">Стр. 2</span>
                </button>
              </div>

              {/* 11 Main Parts */}
              <div className="space-y-2">
                <span className="kicker text-[9px] text-[#1E3B34]/60 block mb-1">ОСНОВНЫЕ РАЗДЕЛЫ</span>
                {MAGAZINE_PARTS.map((part) => {
                  const isCurrent = currentSlide >= part.slideStartIndex &&
                    (part.number === 11 ? currentSlide <= 54 : currentSlide < MAGAZINE_PARTS[part.number]?.slideStartIndex);

                  return (
                    <button
                      key={part.id}
                      onClick={() => {
                        onNavigateSlide(part.slideStartIndex);
                        setIsTocOpen(false);
                      }}
                      type="button"
                      className={`w-full text-left p-2.5 border transition-colors cursor-pointer flex items-start gap-2.5 ${
                        isCurrent
                          ? 'bg-[#1E3B34] text-[#F5EFE2] border-[#1E3B34]'
                          : 'bg-white border-[#1E3B34]/15 hover:border-[#FF2E88] text-[#1E3B34]'
                      }`}
                    >
                      <span className={`font-mono text-xs font-bold px-1.5 py-0.5 shrink-0 ${
                        isCurrent ? 'bg-[#FF2E88] text-white' : 'bg-[#1E3B34]/10 text-[#1E3B34]'
                      }`}>
                        {String(part.number).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <div className="text-xs font-bold leading-tight">
                          {part.title}
                        </div>
                        <p className={`text-[10px] mt-0.5 line-clamp-1 ${isCurrent ? 'text-[#F5EFE2]/75' : 'text-[#1E3B34]/60'}`}>
                          {part.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Final Appendices */}
              <div className="mt-4 pt-4 border-t border-[#1E3B34]/15 space-y-1">
                <button
                  onClick={() => { onNavigateSlide(55); setIsTocOpen(false); }}
                  type="button"
                  className="w-full text-left p-2.5 hover:bg-[#1E3B34]/5 text-xs font-bold text-[#1E3B34] flex items-center justify-between cursor-pointer"
                >
                  <span>Источники данных & Редакция</span>
                  <span className="text-[10px] font-mono opacity-60">Стр. 56</span>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1E3B34]/15 text-[10px] text-[#1E3B34]/60">
              Совет: для перехода между страницами можно использовать клавиши со стрелками ← и → на клавиатуре.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

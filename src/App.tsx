/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MAGAZINE_SLIDES, MAGAZINE_PARTS } from './data/magazine-data';
import { SlideRenderer } from './components/SlideRenderer';
import { MagazineHeader } from './components/MagazineHeader';
import { SearchModal } from './components/SearchModal';
import { ShareModal } from './components/ShareModal';
import { playPageFlipSound } from './utils/audio';
import { clampSlideIndex } from './utils/magazine-logic';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowUp,
  LayoutList,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(() => {
    // Check URL query / hash on mount
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return 1;
    }
    const hash = window.location.hash.replace('#slide-', '');
    const num = parseInt(hash, 10);
    return !isNaN(num) ? clampSlideIndex(num, MAGAZINE_SLIDES.length) : 0;
  });

  const [viewMode, setViewMode] = useState<'spread' | 'continuous'>('spread');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const totalSlides = MAGAZINE_SLIDES.length;
  const continuousRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Listen for hashchange events (browser forward/back and hash links)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#slide-', '');
      const num = parseInt(hash, 10);
      if (!isNaN(num)) {
        const clamped = clampSlideIndex(num, MAGAZINE_SLIDES.length);
        setCurrentSlideIndex(clamped);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigation handler with audio and bounds checking
  const goToSlide = useCallback((index: number) => {
    const target = clampSlideIndex(index, totalSlides);
    setCurrentSlideIndex(target);
    playPageFlipSound(isMuted);
    window.location.hash = `slide-${target}`;

    if (viewMode === 'continuous') {
      const element = continuousRefs.current[target];
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [totalSlides, isMuted, viewMode]);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < totalSlides - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  }, [currentSlideIndex, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }, [currentSlideIndex, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          setIsMuted(m => !m);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, goToSlide, totalSlides]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handlePrintPdf = () => {
    setIsShareOpen(false);
    setViewMode('continuous');
    setTimeout(() => {
      window.print();
    }, 450);
  };

  const currentSlide = MAGAZINE_SLIDES[currentSlideIndex];

  return (
    <div className="min-h-screen bg-[#F5EFE2] text-[#1E3B34] flex flex-col selection:bg-[#FF2E88] selection:text-white">
      {/* Top Bar Header */}
      <MagazineHeader
        currentSlide={currentSlideIndex}
        totalSlides={totalSlides}
        isMuted={isMuted}
        onToggleSound={() => setIsMuted(m => !m)}
        onNavigateSlide={goToSlide}
        onOpenSearch={() => setIsSearchOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode(v => v === 'spread' ? 'continuous' : 'spread')}
        onOpenShare={() => setIsShareOpen(true)}
      />

      {/* Main Reading Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-6 lg:p-8 flex flex-col justify-center">
        {viewMode === 'spread' ? (
          /* SPREAD MODE: Slide-by-slide magazine spread */
          <div className="relative">
            {/* The Slide Container with subtle magazine page border */}
            <div className="border border-[#1E3B34]/25 shadow-none bg-[#F5EFE2]">
              <SlideRenderer
                slide={currentSlide}
                slideIndex={currentSlideIndex}
                totalSlides={totalSlides}
                onNavigateSlide={goToSlide}
              />
            </div>

            {/* Floating Side Arrow Controls for easy desktop navigation */}
            {currentSlideIndex > 0 && (
              <button
                onClick={prevSlide}
                type="button"
                aria-label="Предыдущая страница"
                title="Предыдущая страница (←)"
                className="hidden xl:flex absolute -left-12 top-1/2 -translate-y-1/2 w-9 h-14 bg-[#1E3B34] text-[#F5EFE2] hover:bg-[#FF2E88] items-center justify-center transition-colors cursor-pointer border border-[#F5EFE2]"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {currentSlideIndex < totalSlides - 1 && (
              <button
                onClick={nextSlide}
                type="button"
                aria-label="Следующая страница"
                title="Следующая страница (→)"
                className="hidden xl:flex absolute -right-12 top-1/2 -translate-y-1/2 w-9 h-14 bg-[#1E3B34] text-[#F5EFE2] hover:bg-[#FF2E88] items-center justify-center transition-colors cursor-pointer border border-[#F5EFE2]"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        ) : (
          /* CONTINUOUS MODE: All slides in a seamless editorial flow */
          <div className="space-y-8">
            <div className="bg-[#1E3B34] text-[#F5EFE2] p-4 text-xs flex items-center justify-between">
              <span className="font-bold">
                Режим непрерывного чтения: все 56 слайдов подряд
              </span>
              <button
                onClick={() => setViewMode('spread')}
                type="button"
                className="px-3 py-1 bg-[#FF2E88] text-white font-bold uppercase tracking-wider hover:bg-white hover:text-[#1E3B34] transition-colors"
              >
                Вернуться к разворотам
              </button>
            </div>

            {MAGAZINE_SLIDES.map((s, idx) => (
              <div
                key={s.id}
                ref={(el) => { continuousRefs.current[idx] = el; }}
                className="border border-[#1E3B34]/25 shadow-none print-page"
              >
                <SlideRenderer
                  slide={s}
                  slideIndex={idx}
                  totalSlides={totalSlides}
                  onNavigateSlide={goToSlide}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Bottom Navigator Ribbon for mobile and quick jumping */}
      {viewMode === 'spread' && (
        <div className="sticky bottom-0 z-30 bg-[#F5EFE2]/95 backdrop-blur-xs border-t border-[#1E3B34]/20 py-2.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
                type="button"
                aria-label="Предыдущий слайд"
                className="px-3 py-1.5 border border-[#1E3B34]/30 text-xs font-bold disabled:opacity-30 disabled:pointer-events-none hover:bg-[#1E3B34] hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Назад</span>
              </button>

              <button
                onClick={nextSlide}
                disabled={currentSlideIndex === totalSlides - 1}
                type="button"
                aria-label="Следующий слайд"
                className="px-3 py-1.5 bg-[#1E3B34] text-[#F5EFE2] text-xs font-bold disabled:opacity-30 disabled:pointer-events-none hover:bg-[#FF2E88] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="hidden sm:inline">Вперёд</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Slider Scrubbing */}
            <div className="flex-1 max-w-xs sm:max-w-md flex items-center gap-2">
              <span className="text-[10px] font-mono opacity-60">1</span>
              <input
                type="range"
                min={0}
                max={totalSlides - 1}
                value={currentSlideIndex}
                onChange={(e) => goToSlide(Number(e.target.value))}
                aria-label="Полоса перелистывания страниц"
                className="w-full accent-[#FF2E88] cursor-pointer h-1.5 bg-[#1E3B34]/20 rounded-none"
              />
              <span className="text-[10px] font-mono opacity-60">{totalSlides}</span>
            </div>

            {/* Current Position and Part Indicator */}
            <div className="text-right text-xs">
              <span className="font-mono font-bold text-[#FF2E88] mr-1.5">
                {currentSlideIndex + 1}
              </span>
              <span className="text-[#1E3B34]/60 font-mono text-[11px]">
                / {totalSlides}
              </span>
              <span className="hidden md:inline ml-2 text-[10px] uppercase font-bold text-[#1E3B34]/70">
                ({currentSlide.partTitle})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Dialog Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSlide={goToSlide}
      />

      {/* Share and Export Dialog Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onPrintPdf={handlePrintPdf}
      />
    </div>
  );
}

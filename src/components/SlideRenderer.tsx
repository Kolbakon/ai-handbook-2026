/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SlideData } from '../types/magazine';
import { CalloutBox } from './CalloutBox';
import { PromptCard } from './PromptCard';
import {
  TokenCalculatorWidget,
  PlanTrackerWidget,
  GlossarySearchWidget,
  AuditChecklistWidget
} from './InteractiveWidgets';
import { ArrowRight, BookOpen, Bookmark, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface SlideRendererProps {
  slide: SlideData;
  slideIndex: number;
  totalSlides: number;
  onNavigateSlide: (index: number) => void;
}

export const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  slideIndex,
  totalSlides,
  onNavigateSlide,
}) => {
  // 1. DIVIDER SPREAD (Разворот-разделитель)
  if (slide.slideType === 'divider') {
    const schemeStyles = {
      'scheme-B': {
        bg: 'bg-[#1E3B34]',
        text: 'text-[#F5EFE2]',
        accent: 'text-[#FF2E88]',
        border: 'border-[#FF2E88]',
        badgeBg: 'bg-[#FF2E88]',
        transitionBar: 'bg-[#F5EFE2]',
        numberColor: 'text-[#FF2E88]/20',
      },
      'scheme-A': {
        bg: 'bg-[#14213D]',
        text: 'text-[#EFE6D2]',
        accent: 'text-[#D7FF3A]',
        border: 'border-[#D7FF3A]',
        badgeBg: 'bg-[#D7FF3A]',
        transitionBar: 'bg-[#EFE6D2]',
        numberColor: 'text-[#D7FF3A]/20',
      },
      'scheme-C': {
        bg: 'bg-[#B8512F]',
        text: 'text-[#F6DCC8]',
        accent: 'text-[#2B3BFF]',
        border: 'border-[#2B3BFF]',
        badgeBg: 'bg-[#2B3BFF]',
        transitionBar: 'bg-[#F6DCC8]',
        numberColor: 'text-[#2B3BFF]/25',
      },
      'scheme-D': {
        bg: 'bg-[#5A1A2B]',
        text: 'text-[#F2D7D9]',
        accent: 'text-[#00C9A7]',
        border: 'border-[#00C9A7]',
        badgeBg: 'bg-[#00C9A7]',
        transitionBar: 'bg-[#F2D7D9]',
        numberColor: 'text-[#00C9A7]/20',
      },
    }[slide.scheme];

    const formattedPartNumber = slide.partNumber ? String(slide.partNumber).padStart(2, '0') : '00';

    return (
      <div className={`relative min-h-[580px] lg:min-h-[640px] w-full ${schemeStyles.bg} ${schemeStyles.text} p-6 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden`}>
        {/* Giant Cropped Part Number at Top-Right */}
        <div
          className={`absolute -top-12 -right-8 text-[120px] sm:text-[180px] lg:text-[240px] font-serif font-black select-none pointer-events-none leading-none ${schemeStyles.numberColor}`}
          aria-hidden="true"
        >
          {formattedPartNumber}
        </div>

        {/* Top Header Information */}
        <div className="relative z-10 flex items-center justify-between border-b border-current/15 pb-4">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase text-black ${schemeStyles.badgeBg}`}>
              РАЗВОРОТ
            </span>
            <span className="kicker text-xs font-bold">
              ЧАСТЬ {formattedPartNumber} · {slide.partTitle}
            </span>
          </div>
          <span className="text-xs font-mono opacity-60">
            Стр. {slideIndex + 1} / {totalSlides}
          </span>
        </div>

        {/* Central Core Thesis */}
        <div className="relative z-10 my-auto py-8 max-w-4xl">
          <span className="kicker block text-xs tracking-[0.24em] mb-4 opacity-75">
            {slide.kicker}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-tight">
            {slide.title.split(' ').map((word, idx) => {
              const isHighlight = slide.titleItalicWord && word.toLowerCase().includes(slide.titleItalicWord.toLowerCase());
              return isHighlight ? (
                <em key={idx} className={`italic font-serif font-semibold mr-2 ${schemeStyles.accent}`}>
                  {word}{' '}
                </em>
              ) : (
                <span key={idx} className="mr-2">{word} </span>
              );
            })}
          </h2>

          {slide.subtitle && (
            <p className="mt-6 text-sm sm:text-base lg:text-lg opacity-90 max-w-2xl font-normal leading-relaxed">
              {slide.subtitle}
            </p>
          )}

          {slide.mainTakeaway && (
            <div className={`mt-6 pl-4 border-l-2 ${schemeStyles.border} max-w-xl`}>
              <span className="text-[10px] font-extrabold tracking-widest uppercase block mb-1 opacity-70">
                ГЛАВНЫЙ ВЫВОД РАЗДЕЛА
              </span>
              <p className="text-xs sm:text-sm font-medium">
                {slide.mainTakeaway}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Bar: Action to Start Part & Transition Neutral Strip */}
        <div className="relative z-10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-current/15">
          <div className="text-xs opacity-75">
            Читайте далее: подробный разбор, сравнительные таблицы и практическое задание.
          </div>
          <button
            onClick={() => onNavigateSlide(slideIndex + 1)}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F5EFE2] text-[#1E3B34] text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
          >
            <span>Перейти к материалу</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Transition hairline strip at bottom */}
        <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${schemeStyles.transitionBar}`} />
      </div>
    );
  }

  // 2. COVER SLIDE (Обложка книги-журнала)
  if (slide.slideType === 'cover') {
    return (
      <div className="relative min-h-[580px] lg:min-h-[640px] w-full bg-[#F5EFE2] text-[#1E3B34] p-6 sm:p-12 lg:p-16 flex flex-col justify-between border-8 border-[#1E3B34] overflow-hidden">
        {/* Accent color flecks at the top border (Rules: Scheme B with brief accents from A, C, D) */}
        <div className="absolute top-0 left-0 right-0 h-2 flex">
          <div className="w-1/4 bg-[#FF2E88]" />
          <div className="w-1/4 bg-[#D7FF3A]" />
          <div className="w-1/4 bg-[#2B3BFF]" />
          <div className="w-1/4 bg-[#00C9A7]" />
        </div>

        {/* Magazine Masthead */}
        <div className="pt-2 border-b-2 border-[#1E3B34] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="kicker text-[11px] text-[#FF2E88] font-black block">
              КОРПОРАТИВНОЕ ИЗДАНИЕ ДЛЯ СОТРУДНИКОВ
            </span>
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#1E3B34]">
              ТЕХНОЛОГИЧЕСКИЙ РЕВЮ · ВЫПУСК 11 / 2026
            </span>
          </div>
          <div className="text-right text-xs font-mono text-[#1E3B34]/70">
            Срез данных: ноябрь 2026 · 11 разделов · Без хайпа
          </div>
        </div>

        {/* Main Cover Typography */}
        <div className="my-auto py-8 max-w-4xl">
          <span className="inline-block px-3 py-1 bg-[#1E3B34] text-[#F5EFE2] text-[10px] font-extrabold tracking-[0.24em] uppercase mb-6">
            ПРАКТИЧЕСКОЕ РУКОВОДСТВО
          </span>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.0] text-[#1E3B34] tracking-tight">
            ИИ с нуля: <br className="hidden sm:inline" />
            <span className="italic font-normal text-[#FF2E88]">настольная книга</span> для сотрудника
          </h1>

          <p className="mt-6 text-base sm:text-xl text-[#1E3B34]/85 max-w-2xl font-normal leading-relaxed">
            {slide.subtitle}
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-b border-[#1E3B34]/20 py-4">
            <div>
              <span className="block text-[9px] font-extrabold uppercase tracking-widest text-[#FF2E88]">Части 01–02</span>
              <span className="text-xs font-bold text-[#1E3B34]">Основы и Ассистенты</span>
            </div>
            <div>
              <span className="block text-[9px] font-extrabold uppercase tracking-widest text-[#2B3BFF]">Части 03–04</span>
              <span className="text-xs font-bold text-[#1E3B34]">Деньги, Лимиты и Настройки</span>
            </div>
            <div>
              <span className="block text-[9px] font-extrabold uppercase tracking-widest text-[#00C9A7]">Части 05–07</span>
              <span className="text-xs font-bold text-[#1E3B34]">Google Labs, Агенты и ИБ</span>
            </div>
            <div>
              <span className="block text-[9px] font-extrabold uppercase tracking-widest text-[#1E3B34]">Части 08–11</span>
              <span className="text-xs font-bold text-[#1E3B34]">Промпты, План и Словарь</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Quick Action */}
        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-[#1E3B34]/20">
          <div className="text-xs text-[#1E3B34]/70 max-w-md">
            {slide.marginNote}
          </div>
          <button
            onClick={() => onNavigateSlide(1)}
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF2E88] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1E3B34] transition-colors cursor-pointer shadow-none"
          >
            <span>Открыть оглавление</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // 3. WORKING CONTENT, ACTION, TOC, PLAN, GLOSSARY & SOURCES SLIDES (Scheme B)
  const formattedPartNumber = slide.partNumber ? String(slide.partNumber).padStart(2, '0') : null;

  return (
    <div className="relative min-h-[580px] lg:min-h-[640px] w-full bg-[#F5EFE2] text-[#1E3B34] p-5 sm:p-10 lg:p-14 flex flex-col justify-between overflow-hidden">
      {/* Corner Part Number Badge (Journalistic layout requirement: huge number cropped by edge) */}
      {formattedPartNumber && (
        <div
          className="absolute -top-6 -right-4 text-[70px] sm:text-[100px] lg:text-[130px] font-serif font-black select-none pointer-events-none leading-none text-[#1E3B34]/5"
          aria-hidden="true"
        >
          {formattedPartNumber}
        </div>
      )}

      {/* Running Top Navigation Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-[#1E3B34]/15 pb-3 mb-6">
        <div className="flex items-center gap-3">
          {formattedPartNumber ? (
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-[#1E3B34] text-[#F5EFE2]">
              ЧАСТЬ {formattedPartNumber}
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-[#FF2E88] text-white">
              СПРАВОЧНИК
            </span>
          )}
          <span className="kicker text-[10px] text-[#1E3B34]/80 hidden sm:inline">
            {slide.partTitle}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-[#1E3B34]/60">
          <span>Стр. {slideIndex + 1} / {totalSlides}</span>
        </div>
      </div>

      {/* Main Magazine Layout: 12-column Grid (8 columns text/content + 4 columns margins/callouts) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-auto">
        {/* Left Column (8 Columns): Title, Dropcap, Prose, Tables, Interactive content */}
        <div className="lg:col-span-8">
          {slide.kicker && (
            <span className="kicker text-[10px] text-[#FF2E88] block mb-2">
              {slide.kicker}
            </span>
          )}

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.08] text-[#1E3B34] tracking-tight mb-4">
            {slide.title.split(' ').map((word, idx) => {
              const isHighlight = slide.titleItalicWord && word.toLowerCase().includes(slide.titleItalicWord.toLowerCase());
              return isHighlight ? (
                <em key={idx} className="italic font-serif font-semibold text-[#FF2E88] mr-1.5">
                  {word}{' '}
                </em>
              ) : (
                <span key={idx} className="mr-1.5">{word} </span>
              );
            })}
          </h2>

          {/* Opening Paragraph with Drop Cap (Буквица) */}
          {slide.dropCapParagraph && (
            <p className="editorial-dropcap text-sm sm:text-[15px] leading-[1.65] text-[#1E3B34] mb-4">
              {slide.dropCapParagraph}
            </p>
          )}

          {/* Secondary Prose Paragraphs */}
          {slide.secondaryParagraphs?.map((para, idx) => (
            <p key={idx} className="text-xs sm:text-sm leading-[1.6] text-[#1E3B34]/90 mb-3">
              {para}
            </p>
          ))}

          {/* Bullet Points */}
          {slide.bulletPoints && slide.bulletPoints.length > 0 && (
            <div className="space-y-2.5 my-4">
              {slide.bulletPoints.map((bp, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF2E88] mt-2 shrink-0" />
                  <div>
                    <strong className="font-bold text-[#1E3B34] mr-1">{bp.label}:</strong>
                    <span className="text-[#1E3B34]/85 leading-relaxed">{bp.text}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Infographic Table */}
          {slide.tableData && (
            <div className="my-4 border border-[#1E3B34]/20 bg-white overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1E3B34] text-[#F5EFE2]">
                    {slide.tableData.headers.map((h, i) => (
                      <th key={i} className="p-2.5 font-bold uppercase tracking-wider text-[10px]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3B34]/15">
                  {slide.tableData.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-[#F5EFE2]/60 transition-colors">
                      <td className="p-2.5 font-bold text-[#1E3B34] whitespace-nowrap">
                        {row.label}
                      </td>
                      {row.values.map((v, vi) => (
                        <td key={vi} className="p-2.5 text-[#1E3B34]/85">
                          {v}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Interactive Embeds */}
          {slide.interactiveType === 'token-calculator' && <TokenCalculatorWidget />}
          {slide.interactiveType === 'plan-tracker' && <PlanTrackerWidget />}
          {slide.interactiveType === 'glossary-search' && <GlossarySearchWidget />}
          {slide.interactiveType === 'audit-checklist' && <AuditChecklistWidget />}

          {/* Prompt card if available */}
          {slide.prompt && <PromptCard prompt={slide.prompt} />}
        </div>

        {/* Right Column (4 Columns): Margin Notes, Pull Quotes, Callouts */}
        <div className="lg:col-span-4 space-y-4">
          {/* Pull Quote breaking the grid */}
          {slide.pullQuote && (
            <div className="p-4 border-l-2 border-[#FF2E88] bg-[#1E3B34]/5 my-2">
              <p className="font-serif italic text-base text-[#1E3B34] leading-snug">
                «{slide.pullQuote.text}»
              </p>
              {slide.pullQuote.author && (
                <span className="block mt-2 text-[10px] uppercase font-bold tracking-widest text-[#FF2E88]">
                  — {slide.pullQuote.author}
                </span>
              )}
            </div>
          )}

          {/* Callouts */}
          {slide.callouts?.map((c, i) => (
            <CalloutBox key={i} callout={c} scheme={slide.scheme} />
          ))}

          {/* Margin Note */}
          {slide.marginNote && (
            <div className="p-3 bg-white/70 border border-[#1E3B34]/15 text-[11px] text-[#1E3B34]/80 leading-relaxed">
              <span className="kicker block text-[9px] text-[#1E3B34] mb-1">
                ЗАМЕТКА НА ПОЛЯХ
              </span>
              {slide.marginNote}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Pager & Controls */}
      <div className="relative z-10 pt-4 mt-6 border-t border-[#1E3B34]/15 flex items-center justify-between text-xs">
        <div className="text-[11px] text-[#1E3B34]/70 hidden sm:block">
          ИИ с нуля: практическое руководство · Осень 2026
        </div>

        <div className="flex items-center gap-2">
          {slideIndex > 0 && (
            <button
              onClick={() => onNavigateSlide(slideIndex - 1)}
              type="button"
              className="px-3 py-1.5 border border-[#1E3B34]/30 hover:bg-[#1E3B34] hover:text-[#F5EFE2] transition-colors cursor-pointer text-xs font-bold"
            >
              ← Назад
            </button>
          )}

          {slideIndex < totalSlides - 1 && (
            <button
              onClick={() => onNavigateSlide(slideIndex + 1)}
              type="button"
              className="px-4 py-1.5 bg-[#1E3B34] text-[#F5EFE2] hover:bg-[#FF2E88] transition-colors cursor-pointer text-xs font-bold flex items-center gap-1.5"
            >
              <span>Далее</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

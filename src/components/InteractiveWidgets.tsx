/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { estimateTokens, calculateChecklistProgress } from '../utils/magazine-logic';
import { EIGHT_WEEK_PLAN, GLOSSARY_TERMS } from '../data/magazine-data';
import { Calculator, CheckSquare, Search, Sparkles, Check, ArrowRight } from 'lucide-react';

export const TokenCalculatorWidget: React.FC = () => {
  const [sampleText, setSampleText] = useState(
    'Пожалуйста, проанализируй финансовый отчёт за третий квартал 2026 года и подготовь краткую справку для руководства.'
  );

  const estimate = estimateTokens(sampleText);

  return (
    <div className="border border-[#1E3B34]/20 bg-[#F5EFE2] p-4 my-4">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1E3B34]/15">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-[#FF2E88]" />
          <span className="kicker text-[#1E3B34] text-[10px]">
            ИНТЕРАКТИВНЫЙ КАЛЬКУЛЯТОР ТОКЕНОВ
          </span>
        </div>
        <span className="text-[10px] text-[#1E3B34]/70 font-mono">
          Тарифы API: Gemini 3 Flash ($0.50/M) vs Pro ($2.00/M)
        </span>
      </div>

      <div className="mb-3">
        <label htmlFor="token-input" className="block text-xs font-bold text-[#1E3B34] mb-1">
          Введите или вставьте фрагмент текста для оценки:
        </label>
        <textarea
          id="token-input"
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          rows={3}
          className="w-full text-xs font-mono p-2.5 bg-white border border-[#1E3B34]/20 text-[#1E3B34] focus:outline-none focus:border-[#FF2E88]"
          placeholder="Вставьте текст на русском или английском языке..."
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="p-2 border border-[#1E3B34]/15 bg-white">
          <span className="block text-[9px] uppercase tracking-wider text-[#1E3B34]/70">Символов</span>
          <span className="font-mono text-base font-bold text-[#1E3B34]">{sampleText.length}</span>
        </div>
        <div className="p-2 border border-[#FF2E88]/40 bg-[#FF2E88]/5">
          <span className="block text-[9px] uppercase tracking-wider text-[#FF2E88] font-bold">Оценка токенов</span>
          <span className="font-mono text-base font-bold text-[#FF2E88]">{estimate.estimatedTokens}</span>
        </div>
        <div className="p-2 border border-[#1E3B34]/15 bg-white">
          <span className="block text-[9px] uppercase tracking-wider text-[#1E3B34]/70">Коэффициент языка</span>
          <span className="font-mono text-base font-bold text-[#1E3B34]">
            {estimate.isRussianDominant ? 'x1.8 (RU)' : 'x1.0 (EN)'}
          </span>
        </div>
        <div className="p-2 border border-[#1E3B34]/15 bg-white">
          <span className="block text-[9px] uppercase tracking-wider text-[#1E3B34]/70">Flash vs Pro</span>
          <span className="font-mono text-xs font-bold text-[#1E3B34] mt-1 block">
            ${(estimate.costEstimateUsd.geminiFlashInput * 1000).toFixed(4)}k / ${(estimate.costEstimateUsd.geminiProInput * 1000).toFixed(4)}k
          </span>
        </div>
      </div>
      <p className="text-[10px] text-[#1E3B34]/70 mt-2 italic">
        Русский язык расходует в 1,5–2 раза больше токенов на тот же объём информации, что напрямую влияет на заполнение контекстного окна.
      </p>
    </div>
  );
};

export const PlanTrackerWidget: React.FC = () => {
  const [activeWeek, setActiveWeek] = useState(1);
  const [completedDays, setCompletedDays] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('magazine_completed_plan_days');
      return saved ? JSON.parse(saved) : ['w1-d1'];
    } catch {
      return ['w1-d1'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('magazine_completed_plan_days', JSON.stringify(completedDays));
    } catch {
      // Ignore
    }
  }, [completedDays]);

  const toggleDay = (dayKey: string) => {
    setCompletedDays(prev => 
      prev.includes(dayKey) ? prev.filter(k => k !== dayKey) : [...prev, dayKey]
    );
  };

  const totalDays = 40; // 8 weeks * 5 days
  const progressPercent = calculateChecklistProgress(completedDays, totalDays);
  const currentWeekData = EIGHT_WEEK_PLAN.find(w => w.weekNumber === activeWeek) || EIGHT_WEEK_PLAN[0];

  return (
    <div className="border border-[#1E3B34]/25 bg-white p-4 my-4">
      {/* Header and Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1E3B34]/15">
        <div>
          <span className="kicker text-[#FF2E88] text-[9px]">
            ИНТЕРАКТИВНЫЙ ТРЕКЕР ВНЕДРЕНИЯ
          </span>
          <h4 className="text-sm font-bold text-[#1E3B34]">
            Прогресс программы: {completedDays.length} из 40 дней ({progressPercent}%)
          </h4>
        </div>
        <div className="w-full sm:w-48 bg-[#F5EFE2] h-2.5 border border-[#1E3B34]/20">
          <div
            className="bg-[#FF2E88] h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 p-1 bg-[#F5EFE2] border border-[#1E3B34]/15">
        {EIGHT_WEEK_PLAN.map(w => {
          const isWeekActive = activeWeek === w.weekNumber;
          const weekDoneCount = w.days.filter(d => completedDays.includes(`w${w.weekNumber}-d${d.dayNumber}`)).length;
          return (
            <button
              key={w.weekNumber}
              onClick={() => setActiveWeek(w.weekNumber)}
              type="button"
              className={`px-2.5 py-1 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                isWeekActive
                  ? 'bg-[#1E3B34] text-[#F5EFE2]'
                  : 'text-[#1E3B34] hover:bg-[#1E3B34]/10'
              }`}
            >
              <span>Неделя {w.weekNumber}</span>
              {weekDoneCount === 5 && <Check className="w-3 h-3 text-[#FF2E88]" />}
            </button>
          );
        })}
      </div>

      {/* Active Week Details */}
      <div className="mb-4">
        <h5 className="font-serif text-base font-bold text-[#1E3B34] mb-0.5">
          Неделя {currentWeekData.weekNumber}: {currentWeekData.title}
        </h5>
        <p className="text-xs text-[#1E3B34]/80 mb-3">
          {currentWeekData.description}
        </p>

        <div className="space-y-2">
          {currentWeekData.days.map(d => {
            const dayKey = `w${currentWeekData.weekNumber}-d${d.dayNumber}`;
            const isDone = completedDays.includes(dayKey);

            return (
              <div
                key={dayKey}
                onClick={() => toggleDay(dayKey)}
                className={`p-3 border transition-colors cursor-pointer flex items-start gap-3 select-none ${
                  isDone
                    ? 'bg-[#1E3B34]/5 border-[#1E3B34]/40'
                    : 'bg-[#F5EFE2]/50 border-[#1E3B34]/15 hover:border-[#1E3B34]/30'
                }`}
              >
                <button
                  type="button"
                  aria-label={`Отметить день ${d.dayNumber}`}
                  className={`w-5 h-5 mt-0.5 flex items-center justify-center border shrink-0 transition-colors ${
                    isDone
                      ? 'bg-[#1E3B34] border-[#1E3B34] text-white'
                      : 'border-[#1E3B34]/40 bg-white'
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5" />}
                </button>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-bold ${isDone ? 'line-through text-[#1E3B34]/60' : 'text-[#1E3B34]'}`}>
                      День {d.dayNumber}: {d.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#1E3B34]/60 bg-[#1E3B34]/5 px-1.5 py-0.5">
                      {d.tool}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${isDone ? 'text-[#1E3B34]/50' : 'text-[#1E3B34]/80'}`}>
                    {d.task}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const GlossarySearchWidget: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'core' | 'tools' | 'economics' | 'security'>('all');

  const filtered = GLOSSARY_TERMS.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.analogy && item.analogy.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="my-4">
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#1E3B34]/50 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Найти термин (токен, RAG, агент, галлюцинация)..."
            className="w-full text-xs p-2.5 pl-9 bg-white border border-[#1E3B34]/20 text-[#1E3B34] focus:outline-none focus:border-[#FF2E88]"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#1E3B34]/5 p-1 border border-[#1E3B34]/15 overflow-x-auto">
          {[
            { id: 'all', label: 'Все' },
            { id: 'core', label: 'Основы' },
            { id: 'tools', label: 'Инструменты' },
            { id: 'economics', label: 'Деньги' },
            { id: 'security', label: 'Безопасность' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as typeof categoryFilter)}
              type="button"
              className={`px-2 py-1 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-[#1E3B34] text-[#F5EFE2]'
                  : 'text-[#1E3B34]/70 hover:text-[#1E3B34]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
        {filtered.map(item => (
          <div key={item.term} className="p-3.5 bg-white border border-[#1E3B34]/15">
            <div className="flex items-center justify-between mb-1">
              <h5 className="font-serif text-sm font-bold text-[#1E3B34]">
                {item.term}
              </h5>
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#FF2E88]">
                {item.category === 'core' ? 'Основы' : item.category === 'tools' ? 'Инструмент' : item.category === 'economics' ? 'Экономика' : 'Безопасность'}
              </span>
            </div>
            <p className="text-xs text-[#1E3B34]/90 mb-2 leading-relaxed">
              {item.definition}
            </p>
            {item.analogy && (
              <div className="text-[11px] text-[#1E3B34]/75 italic bg-[#F5EFE2] p-2 border-l-2 border-[#1E3B34]/30">
                <span className="font-bold not-italic text-[#1E3B34] mr-1">Бытовая аналогия:</span>
                {item.analogy}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-8 text-xs text-[#1E3B34]/60">
            Термин не найден. Попробуйте изменить поисковый запрос.
          </div>
        )}
      </div>
    </div>
  );
};

export const AuditChecklistWidget: React.FC = () => {
  const [items, setItems] = useState([
    { id: '1', title: 'Очистить историю старых длинных чатов', done: false },
    { id: '2', title: 'Проверить раздел Settings -> Usage на предмет расхода окна', done: false },
    { id: '3', title: 'Отключить неиспользуемые внешние коннекторы (Extensions)', done: false },
    { id: '4', title: 'Уточнить у системного администратора наличие корпоративных лицензий', done: false },
  ]);

  const toggle = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const doneCount = items.filter(i => i.done).length;

  return (
    <div className="border border-[#1E3B34]/20 bg-white p-4 my-4">
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1E3B34]/15">
        <span className="kicker text-[#FF2E88] text-[9px]">
          ЧЕК-ЛИСТ ФИНАНСОВОЙ ГИГИЕНЫ
        </span>
        <span className="text-xs font-bold text-[#1E3B34]">
          {doneCount} из {items.length} выполнено
        </span>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => toggle(item.id)}
            className="flex items-center gap-3 p-2 bg-[#F5EFE2] border border-[#1E3B34]/15 cursor-pointer select-none"
          >
            <div className={`w-4 h-4 border flex items-center justify-center shrink-0 ${item.done ? 'bg-[#1E3B34] border-[#1E3B34] text-white' : 'bg-white border-[#1E3B34]/30'}`}>
              {item.done && <Check className="w-3 h-3" />}
            </div>
            <span className={`text-xs ${item.done ? 'line-through text-[#1E3B34]/50' : 'text-[#1E3B34] font-medium'}`}>
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

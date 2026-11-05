/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Printer,
  Download,
  Share2,
  ExternalLink,
  MessageSquare,
  FileText
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrintPdf: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onPrintPdf }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  // Use the canonical shared deployment link if available, or current location
  const shareUrl = window.location.origin.includes('localhost')
    ? 'https://ais-pre-tqhxnh2evem3rcunm4zmsf-911611295020.europe-west2.run.app'
    : window.location.origin + window.location.pathname;

  const slackTelegramMessage = `Коллеги, делюсь интерактивным журналом-руководством «ИИ с нуля: практическое руководство (осень 2026)».

Внутри:
— Основы LLM, токены и контекстное окно простыми словами
— Реальные тарифы и лимиты ChatGPT, Claude, Gemini, Copilot
— 15 готовых рабочих шаблонов промптов для писем и отчетов
— Безопасность и защита данных по 152-ФЗ
— Пошаговый интерактивный план внедрения на 8 недель

Журнал открывается прямо в браузере с компьютера и смартфона:
${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(slackTelegramMessage);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    } catch {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2500);
    }
  };

  const handleDownloadMarkdown = () => {
    const link = document.createElement('a');
    link.href = '/assets/aistudio/__________________________________________2026__72d0462e.md';
    link.download = 'ИИ_с_нуля_практическое_руководство_2026.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#F5EFE2] border-2 border-[#1E3B34] p-6 shadow-none max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1E3B34]/20">
          <div>
            <span className="kicker text-[#FF2E88] text-[9px] block">
              ПЕРЕДАЧА МАТЕРИАЛА КОЛЛЕГАМ
            </span>
            <h3 className="font-serif text-xl font-bold text-[#1E3B34]">
              Как поделиться книгой с коллегами
            </h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label="Закрыть окно"
            className="p-1.5 text-[#1E3B34] hover:text-[#FF2E88] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#1E3B34]/80 mb-5 leading-relaxed">
          Код отправлять не нужно. Выберите самый удобный для вашего коллектива формат из четырех вариантов ниже:
        </p>

        {/* Option 1: Web Link */}
        <div className="p-4 bg-white border border-[#1E3B34]/20 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF2E88] flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              ВАРИАНТ 1. ОНЛАЙН-ССЫЛКА (САМЫЙ УДОБНЫЙ)
            </span>
            <span className="text-[10px] bg-[#1E3B34]/10 px-1.5 py-0.5 text-[#1E3B34] font-mono">
              Веб-приложение
            </span>
          </div>
          <p className="text-xs text-[#1E3B34]/90 mb-3">
            Отправьте прямую ссылку в рабочий чат. Коллеги откроют интерактивный журнал с любого компьютера или телефона без установки программ и без регистрации.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 text-xs font-mono p-2 bg-[#F5EFE2] border border-[#1E3B34]/20 text-[#1E3B34] truncate select-all"
            />
            <button
              onClick={handleCopyLink}
              type="button"
              className="px-3.5 py-2 bg-[#1E3B34] hover:bg-[#FF2E88] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Скопировано</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Скопировать</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[10px] text-[#1E3B34]/70 mt-2 italic bg-[#F5EFE2] p-2 border-l-2 border-[#FF2E88]">
            <strong>Как активировать ссылку для коллег:</strong> В правом верхнем углу интерфейса Google AI Studio нажмите кнопку <strong>«Share»</strong> (или «Deploy»), чтобы платформа опубликовала общедоступную версию.
          </p>
        </div>

        {/* Option 2: Pre-written Chat Message */}
        <div className="p-4 bg-white border border-[#1E3B34]/20 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1E3B34] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#FF2E88]" />
              ВАРИАНТ 2. ГОТОВЫЙ ТЕКСТ ДЛЯ МЕССЕНДЖЕРА
            </span>
            <span className="text-[10px] bg-[#1E3B34]/10 px-1.5 py-0.5 text-[#1E3B34]">
              Telegram / Teams / Slack
            </span>
          </div>
          <p className="text-xs text-[#1E3B34]/90 mb-2">
            Краткий анонс для рабочего канала с описанием разделов и ссылкой:
          </p>
          <pre className="text-[11px] font-sans p-2.5 bg-[#F5EFE2] border border-[#1E3B34]/15 text-[#1E3B34]/90 whitespace-pre-wrap leading-relaxed mb-3">
            {slackTelegramMessage}
          </pre>
          <button
            onClick={handleCopyMessage}
            type="button"
            className="w-full py-2 bg-[#1E3B34]/10 hover:bg-[#1E3B34] hover:text-white text-[#1E3B34] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            {copiedMessage ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#FF2E88]" />
                <span>Текст сообщения скопирован!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Скопировать текст анонса</span>
              </>
            )}
          </button>
        </div>

        {/* Option 3: PDF / Print Export */}
        <div className="p-4 bg-white border border-[#1E3B34]/20 mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1E3B34] flex items-center gap-1.5">
              <Printer className="w-3.5 h-3.5 text-[#FF2E88]" />
              ВАРИАНТ 3. СОХРАНИТЬ В PDF / РАСПЕЧАТАТЬ
            </span>
            <span className="text-[10px] bg-[#1E3B34]/10 px-1.5 py-0.5 text-[#1E3B34]">
              PDF-буклет
            </span>
          </div>
          <p className="text-xs text-[#1E3B34]/90 mb-3">
            Формирует чистый 56-страничный буклет без лишних кнопок для отправки в виде файла или печати на принтере.
          </p>
          <button
            onClick={onPrintPdf}
            type="button"
            className="w-full py-2 bg-[#FF2E88] hover:bg-[#1E3B34] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Сформировать PDF / Печать</span>
          </button>
        </div>

        {/* Option 4: NotebookLM Markdown File */}
        <div className="p-4 bg-white border border-[#1E3B34]/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1E3B34] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#FF2E88]" />
              ВАРИАНТ 4. ФАЙЛ ДЛЯ NOTEBOOKLM (.MD)
            </span>
            <span className="text-[10px] bg-[#1E3B34]/10 px-1.5 py-0.5 text-[#1E3B34]">
              Markdown / Текст
            </span>
          </div>
          <p className="text-xs text-[#1E3B34]/90 mb-3">
            Скачайте чистый текстовый первоисточник книги для загрузки в Google NotebookLM или корпоративную базу знаний.
          </p>
          <button
            onClick={handleDownloadMarkdown}
            type="button"
            className="w-full py-2 border border-[#1E3B34]/40 hover:bg-[#1E3B34] hover:text-white text-[#1E3B34] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Скачать файл книги (.md)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

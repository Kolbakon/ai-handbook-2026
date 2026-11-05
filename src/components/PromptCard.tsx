/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PromptTemplate } from '../types/magazine';
import { Copy, Check } from 'lucide-react';

interface PromptCardProps {
  prompt: PromptTemplate;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.template);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-4 border border-[#1E3B34]/30 bg-[#1E3B34]/5 p-4 relative">
      <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-[#1E3B34]/15">
        <div>
          <span className="kicker text-[#FF2E88] text-[9px] block">
            ГОТОВЫЙ ЗАПРОС · JETBRAINS MONO
          </span>
          <h4 className="text-xs font-bold text-[#1E3B34] mt-0.5">
            {prompt.title}
          </h4>
        </div>
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Скопировать промпт"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-[#1E3B34] text-[#F5EFE2] hover:bg-[#FF2E88] transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
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

      <pre className="font-mono text-[11px] leading-relaxed text-[#1E3B34] whitespace-pre-wrap select-all bg-[#F5EFE2] p-3 border border-[#1E3B34]/15 overflow-x-auto">
        {prompt.template}
      </pre>

      {prompt.contextNote && (
        <p className="text-[10px] text-[#1E3B34]/70 mt-2 italic font-sans">
          {prompt.contextNote}
        </p>
      )}
    </div>
  );
};

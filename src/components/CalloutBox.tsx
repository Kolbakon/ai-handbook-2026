/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalloutItem, SchemeType } from '../types/magazine';
import { Zap, AlertTriangle, Coins, ShieldCheck } from 'lucide-react';

interface CalloutBoxProps {
  callout: CalloutItem;
  scheme?: SchemeType;
}

export const CalloutBox: React.FC<CalloutBoxProps> = ({ callout, scheme = 'scheme-B' }) => {
  const getCalloutMeta = () => {
    switch (callout.type) {
      case 'action':
        return {
          label: 'ПОПРОБУЙТЕ',
          icon: Zap,
          borderClass: 'border-[#FF2E88]',
          badgeBg: 'bg-[#FF2E88]',
          badgeText: 'text-white',
        };
      case 'trap':
        return {
          label: 'ЛОВУШКА',
          icon: AlertTriangle,
          borderClass: 'border-[#B8512F]',
          badgeBg: 'bg-[#B8512F]',
          badgeText: 'text-white',
        };
      case 'price':
        return {
          label: 'ЦЕНА ВОПРОСА',
          icon: Coins,
          borderClass: 'border-[#1E3B34]',
          badgeBg: 'bg-[#1E3B34]',
          badgeText: 'text-[#F5EFE2]',
        };
      case 'security':
        return {
          label: 'БЕЗОПАСНОСТЬ',
          icon: ShieldCheck,
          borderClass: 'border-[#1E3B34]',
          badgeBg: 'bg-[#14213D]',
          badgeText: 'text-white',
        };
    }
  };

  const meta = getCalloutMeta();
  const IconComponent = meta.icon;

  // Background and text color according to scheme
  const boxBg = scheme === 'scheme-A' ? 'bg-[#EFE6D2]' : scheme === 'scheme-C' ? 'bg-[#F6DCC8]' : scheme === 'scheme-D' ? 'bg-[#F2D7D9]' : 'bg-[#F5EFE2]';
  const textColor = scheme === 'scheme-C' ? 'text-[#3B1D12]' : 'text-[#1E3B34]';

  return (
    <div className={`p-4 border border-[#1E3B34]/15 ${boxBg} relative my-3`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-extrabold tracking-[0.2em] uppercase ${meta.badgeBg} ${meta.badgeText}`}>
          <IconComponent className="w-3 h-3" />
          {meta.label}
        </span>
        <h4 className={`text-sm font-bold ${textColor}`}>
          {callout.title}
        </h4>
      </div>
      <p className={`text-xs leading-relaxed ${textColor}/90 font-normal`}>
        {callout.text}
      </p>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SchemeType = 'scheme-B' | 'scheme-A' | 'scheme-C' | 'scheme-D';

export interface CalloutItem {
  type: 'action' | 'trap' | 'price' | 'security';
  title: string;
  text: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  goal: string;
  template: string;
  contextNote?: string;
}

export interface SlideData {
  id: string;
  partNumber: number | null; // null for cover/intro/glossary/plan/sources
  partTitle: string;
  slideType: 'cover' | 'toc' | 'divider' | 'content' | 'action' | 'plan' | 'glossary' | 'sources';
  scheme: SchemeType; // for divider, specific scheme; for content, scheme-B; cover/finale, scheme-B with accents
  kicker?: string;
  title: string;
  titleItalicWord?: string;
  subtitle?: string;
  mainTakeaway?: string;
  dropCapParagraph?: string;
  secondaryParagraphs?: string[];
  bulletPoints?: Array<{ label: string; text: string }>;
  callouts?: CalloutItem[];
  prompt?: PromptTemplate;
  pullQuote?: {
    text: string;
    author?: string;
  };
  tableData?: {
    headers: string[];
    rows: Array<{ label: string; values: string[] }>;
  };
  interactiveType?: 'token-calculator' | 'model-matrix' | 'prompt-copy' | 'plan-tracker' | 'glossary-search' | 'audit-checklist';
  marginNote?: string;
}

export interface PartInfo {
  number: number;
  id: string;
  title: string;
  shortTitle: string;
  dividerScheme: SchemeType;
  slideStartIndex: number;
  description: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  analogy?: string;
  category: 'core' | 'tools' | 'economics' | 'security';
}

export interface WeekPlan {
  weekNumber: number;
  title: string;
  description: string;
  days: Array<{
    dayNumber: number;
    title: string;
    task: string;
    tool: string;
  }>;
}

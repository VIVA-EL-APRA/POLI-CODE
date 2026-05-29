/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'Python' | 'JavaScript';

export interface CodeExample {
  id: number;
  title: string;
  description: string;
  src: string;
  out: string;
}

export interface PipelineStep {
  id: number;
  label: string;
  icon: string; // lucide-react icon name identifier
  description: string;
}

export interface TranslationHistoryItem {
  id: string;
  timestamp: string;
  sourceText: string;
  translatedText: string;
  sourceLang: Language;
  targetLang: Language;
  confidence: number;
}

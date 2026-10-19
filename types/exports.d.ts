// Types of "pico-creator/exports" (revsis-app ADR 0036). It loads docx and pdfmake: import it when exporting.
import type {PicoDocument, PicoLanguage} from './editor';

export interface ExportOptions {
  format: 'pdf' | 'word' | 'markdown' | 'legacy';
  layout?: 'table' | 'sections';
  orientation?: 'landscape' | 'portrait';
  /** Markdown only: plain marks or HTML for colours and highlights. */
  styles?: 'clean' | 'html';
  /** Include the reviewer notes (default true). */
  notes?: boolean;
}

/** The exported file: PDF, Word (.docx), Markdown or current-RS JSON. */
export function exportBlob(document: PicoDocument, lang: PicoLanguage, options: ExportOptions): Promise<Blob>;
export function toWord(document: PicoDocument, lang?: PicoLanguage, options?: Omit<ExportOptions, 'format'>): Promise<Blob>;
export function toPdf(document: PicoDocument, lang?: PicoLanguage, options?: Omit<ExportOptions, 'format'>): Promise<Blob>;
export function pdfDefinition(document: PicoDocument, lang?: PicoLanguage, options?: Omit<ExportOptions, 'format'>): Record<string, any>;
/** File name such as PICO-3a.pdf for an extension such as ".pdf". */
export function fileName(document: PicoDocument, extension: string): string;

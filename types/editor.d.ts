// Types of "pico-creator/editor" (revsis-app ADR 0036). Hand-written; the contract is pico-document.schema.json.
import type {ReactElement, ReactNode, Ref} from 'react';

/** A pico-document (schema 1.1.0). See pico-document.schema.json for the full structure. */
export interface PicoDocument {
  format: 'pico-document';
  schema_version: string;
  text_format: 'richtext-v1';
  document_id: string;
  document_revision: number;
  created_at: string;
  updated_at: string;
  review_link: Record<string, unknown> | null;
  pico: Record<string, any>;
  import_review?: Record<string, any> | null;
}

export type PicoLanguage = 'en' | 'es';
export type PicoTemplate = 'intervention' | 'diagnostic' | 'prognosis' | 'other';

export interface PicoEditorHandle {
  /** Import a pico-variable-catalog into the open document (undoable). */
  importCatalogue(catalog: unknown, targetId?: string): void;
  undo(): void;
  redo(): void;
}

export interface PicoEditorProps {
  /** The document to show. A document different from the last one reported by onChange is adopted. */
  document: PicoDocument;
  /** Called with the whole document after every change, undo and redo. */
  onChange(document: PicoDocument): void;
  lang?: PicoLanguage;
  theme?: 'light' | 'dark';
  /** Rendered at the top of the workspace, above the document (for example a breadcrumb). */
  header?: ReactNode;
  /** Rendered at the bottom of the workspace, below the completeness warnings. */
  footer?: ReactNode;
  ref?: Ref<PicoEditorHandle>;
}

/** The editor. Render it with a new `key` to start a new editing session (clears undo history). */
export function PicoEditor(props: PicoEditorProps): ReactElement;

export function newDocument(template?: PicoTemplate): PicoDocument;
/** Errors that make the document invalid (empty list when valid). */
export function validateDocument(document: unknown): string[];
/** Translation keys of the completeness warnings (translate them with `translate`). */
export function warnings(document: PicoDocument): string[];
/** The current-RS JSON projection (components as text), as revsis-app derives it. */
export function legacy(document: PicoDocument, lang?: PicoLanguage): Record<string, any>;
/** Migrates 0.1.0, 0.2.0 and 1.0.0 documents to the current schema; other values are returned unchanged. */
export function migrateDocument<T>(document: T): T | PicoDocument;
export function isLegacyDocument(document: unknown): boolean;
export function previewHtml(document: PicoDocument, lang?: PicoLanguage, includeNotes?: boolean, layout?: 'table' | 'sections'): string;
export function toMarkdown(document: PicoDocument, lang?: PicoLanguage, options?: {layout?: 'table' | 'sections'; styles?: 'clean' | 'html'; notes?: boolean}): string;
export function translate(lang: PicoLanguage, key: string): string;
/** The fixed prompt for the importar-pico skill (Word or PDF import), with optional notes at the end. */
export function importPrompt(lang?: PicoLanguage, notes?: string): string;
/** The fixed prompt for the proponer-pico skill (create from a question): notes and number if given, the question last. */
export function proposePrompt(lang?: PicoLanguage, question?: string, notes?: string, number?: string): string;
/** Import marks still to review plus text not placed (0 when there is no import_review). */
export function pendingCount(document: PicoDocument): number;
export const VERSION: string;
export const SCHEMA_VERSION: string;
/** Language codes (ISO 639-2/B) offered by the editor, with their [English, Spanish] names. */
export const LANG_LABELS: Record<string, [string, string]>;

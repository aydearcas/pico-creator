# Validation / Verificación · 1.2.0

The read-only GitHub Actions workflow builds the standalone application and runs the complete automated test suite before distribution files are published.

Catalogue checks cover bilingual schema validation, clinical example structure, source cross-references, type-specific comparators, family/child selection, duplicate prevention, preservation of manual edits, canonical JSON save/load, migration of Spanish-keyed 0.1.0/0.2.0 documents and 0.1.0 catalogues to the English 1.0.0/0.2.0 schemas (compared against the migrated reference examples), template switching, safe input rejection, dropdown translation, visibility, undo and selected-only exports.

Real-browser visual layout, touch, native file picker, and Windows executable compilation remain manual checks. The catalogue is a non-exhaustive demonstration, with clinical limitations recorded in the file.

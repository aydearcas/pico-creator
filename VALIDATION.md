# Validation / Verificación · 1.4.1

The read-only GitHub Actions workflow builds the standalone application and runs the complete automated test suite before distribution files are published.

Catalogue checks cover bilingual schema validation, clinical example structure, source cross-references, type-specific comparators, family/child selection, duplicate prevention, preservation of manual edits, canonical JSON save/load, migration of Spanish-keyed 0.1.0/0.2.0 documents and 0.1.0 catalogues to the English 1.0.0/0.2.0 schemas (compared against the migrated reference examples), migration of 1.0.0 documents to 1.1.0, languages (schema rules, completeness warning, exports and the editor section), equality of the current-RS projection with revsis-app for its synthetic document, template switching, the compiled `PicoEditor` library mounted as a host would (whole documents on change, undo and redo, adopting another document, scoped styles, no Word/PDF libraries in the editor entry), safe input rejection, dropdown translation, visibility, undo and selected-only exports.

Real-browser visual layout, touch, native file picker, and Windows executable compilation remain manual checks. The catalogue is a non-exhaustive demonstration, with clinical limitations recorded in the file.

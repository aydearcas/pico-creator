import React, { useRef, createContext, useState, useEffect, useContext, useImperativeHandle } from "react";
import { Undo2, Redo2, Bold, Italic, Strikethrough, List, RemoveFormatting, Pencil, Eye, GripVertical, ArrowUp, ArrowDown, X, Plus, Highlighter, ChevronDown, Check, FileInput, Crosshair, Copy, Trash2, AlertCircle } from "lucide-react";
import { m as migrateCatalog, v as validateCatalog, c as copy, o as outcome, r as rich, a as comparator, f as freeItem, b as reorder, n as normalizeRich, L as LANGUAGE_CODE, t as translate, l as label, D as DESIGN_LABELS, P as PUB_LABELS, p as plain, C as COMP_LABELS, d as migrateDocument, e as labelsFor, w as warnings, g as previewHtml, h as DESIGN_CATALOGS, i as download, j as COMP_CATALOGS, k as remainder, q as LANG_LABELS, s as noN, u as design, x as typeCode, y as uid, z as publication } from "./chunks/present.js";
import { S, V, A, B, E, F, G } from "./chunks/present.js";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle, Color } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
const keys = { interventions: "interventions", comparators: "comparators", outcomes: "outcomes" };
const activeCatalog = (p) => p.variable_catalogs?.catalogs?.find((x) => x.catalog_id === p.variable_catalogs.active_id) || null;
const candidateText = (value, lang) => value?.[lang] ?? "";
function importCatalog(p, catalog) {
  catalog = migrateCatalog(catalog);
  const errors = validateCatalog(catalog);
  if (errors.length) throw Error(errors.join(", "));
  const state = p.variable_catalogs || { catalogs: [], active_id: null, visible: false };
  const index = state.catalogs.findIndex((x) => x.catalog_id === catalog.catalog_id);
  if (index < 0) {
    if (state.catalogs.length >= 20) throw Error("CATALOG_LIMIT");
    state.catalogs.push(copy(catalog));
  } else state.catalogs[index] = copy(catalog);
  state.active_id = catalog.catalog_id;
  state.visible = true;
  p.variable_catalogs = state;
}
function findCandidate(catalog, kind, id) {
  for (const parent of catalog[kind] || []) {
    if (parent.id === id) return { parent, item: parent, child: false };
    const item = parent.children?.find((x) => x.id === id);
    if (item) return { parent, item, child: true };
  }
  return null;
}
function same(item, catalog, id) {
  return item.catalog_origin?.catalog_id === catalog.catalog_id && item.catalog_origin.variable_id === id;
}
function allItems(list) {
  return list.flatMap((x) => [x, ...x.children || []]);
}
function canAddCandidate(p, kind, id) {
  const catalog = activeCatalog(p), key = keys[kind];
  if (!catalog || !key || catalog.question_type !== p.question_type.template) return false;
  const found = findCandidate(catalog, kind, id);
  if (!found) return false;
  const list = allItems(p[key]);
  const exists = (x) => list.some((y) => same(y, catalog, x.id));
  if (found.child || !found.item.children?.length) return !exists(found.item);
  return !exists(found.item) || found.item.children.some((x) => !exists(x));
}
const provenance = (catalog, item) => ({ catalog_id: catalog.catalog_id, variable_id: item.id });
const content = (item, lang) => rich(candidateText(item.label, lang) + (candidateText(item.description, lang) ? " — " + candidateText(item.description, lang) : ""));
function addCatalogVariable(p, kind, id, lang = "en") {
  if (!canAddCandidate(p, kind, id)) return false;
  const catalog = activeCatalog(p), key = keys[kind], found = findCandidate(catalog, kind, id);
  if (kind === "outcomes") {
    const item = outcome();
    item.name = rich(candidateText(found.item.label, lang));
    item.description = rich(candidateText(found.item.description, lang));
    item.catalog_origin = provenance(catalog, found.item);
    p.outcomes.push(item);
    return true;
  }
  let parent = p[key].find((x) => same(x, catalog, found.parent.id));
  if (!parent) {
    if (kind === "comparators") {
      parent = comparator(found.parent.controlled_code ? "CONTROLLED" : "FREE", found.parent.controlled_code || "");
      if (parent.mode === "CONTROLLED") parent.specification = rich(candidateText(found.parent.description, lang));
      else parent.text = content(found.parent, lang);
    } else {
      parent = freeItem();
      parent.text = content(found.parent, lang);
    }
    parent.catalog_origin = provenance(catalog, found.parent);
    p[key].push(parent);
  }
  const children = found.child ? [found.item] : found.parent.children || [];
  for (const source of children) {
    if (allItems(p[key]).some((x) => same(x, catalog, source.id))) continue;
    const child = freeItem();
    child.text = content(source, lang);
    child.catalog_origin = provenance(catalog, source);
    parent.children.push(child);
  }
  return true;
}
function CatalogBar({ pico, documentId, t, lang, onImport, onUpdate, onError, onQuestion, demo, onDownloadDemo }) {
  const input = useRef(null), catalog = activeCatalog(pico), state = pico.variable_catalogs;
  const mismatch = !!catalog && catalog.question_type !== pico.question_type.template;
  async function readFile(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const target = documentId;
    if (file.size > 2 * 1024 * 1024) {
      onError(t("catalogTooLarge"));
      return;
    }
    try {
      const data = JSON.parse(await file.text());
      const errors = validateCatalog(data);
      if (errors.length) throw Error(errors.join(", "));
      onImport(data, target);
    } catch (e) {
      onError(t("catalogInvalid") + " " + e.message);
    }
  }
  return /* @__PURE__ */ React.createElement("section", { className: "catalog-bar", "aria-label": t("preloadedVariables") }, /* @__PURE__ */ React.createElement("div", { className: "catalog-actions" }, /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".json,application/json", hidden: true, ref: input, onChange: readFile, "data-catalog-file": "true" }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => input.current.click() }, t("importCatalog")), /* @__PURE__ */ React.createElement("label", { className: "catalog-switch" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", role: "switch", "aria-label": t("showPreloaded"), checked: !!state?.visible, disabled: !catalog, onChange: (e) => onUpdate((p) => {
    p.variable_catalogs.visible = e.target.checked;
  }) }), /* @__PURE__ */ React.createElement("span", null, t("showPreloaded"))), /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-button", onClick: () => onImport(demo, documentId, { fillQuestionIfEmpty: true }) }, t("tryDermatomyositis")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-button", onClick: onDownloadDemo }, t("downloadCatalogExample"))), catalog && /* @__PURE__ */ React.createElement("div", { className: "catalog-context" }, state.catalogs.length > 1 ? /* @__PURE__ */ React.createElement("label", null, t("activeCatalog"), /* @__PURE__ */ React.createElement("select", { className: "active-catalog", "aria-label": t("activeCatalog"), value: state.active_id, onChange: (e) => onUpdate((p) => {
    p.variable_catalogs.active_id = e.target.value;
  }) }, state.catalogs.map((c) => /* @__PURE__ */ React.createElement("option", { key: c.catalog_id, value: c.catalog_id }, candidateText(c.title, lang))))) : /* @__PURE__ */ React.createElement("strong", null, candidateText(catalog.title, lang)), /* @__PURE__ */ React.createElement("span", { className: "catalog-status" }, t("catalogStatus_" + catalog.verification.status)), mismatch && /* @__PURE__ */ React.createElement("p", { role: "alert", className: "inline-warning" }, t("catalogTypeMismatch")), /* @__PURE__ */ React.createElement("details", { className: "catalog-details" }, /* @__PURE__ */ React.createElement("summary", null, t("catalogContextSources")), /* @__PURE__ */ React.createElement("p", null, candidateText(catalog.clinical_question, lang)), /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-button", onClick: () => onQuestion(candidateText(catalog.clinical_question, lang)) }, t("useCatalogQuestion")), /* @__PURE__ */ React.createElement("p", null, candidateText(catalog.population_notes, lang)), /* @__PURE__ */ React.createElement("p", null, candidateText(catalog.verification.limitations, lang)), /* @__PURE__ */ React.createElement("p", null, t("catalogSuggestionsOnly")), catalog.verification.checked_on && /* @__PURE__ */ React.createElement("p", null, t("catalogReviewedOn"), ": ", catalog.verification.checked_on), /* @__PURE__ */ React.createElement("ul", null, catalog.sources.map((source) => /* @__PURE__ */ React.createElement("li", { key: source.id }, source.url ? /* @__PURE__ */ React.createElement("a", { href: source.url, target: "_blank", rel: "noopener noreferrer" }, source.title) : source.title, source.locator && /* @__PURE__ */ React.createElement("span", null, " — ", source.locator)))))), !catalog && /* @__PURE__ */ React.createElement("p", { className: "catalog-empty" }, t("catalogImportHint")));
}
function CatalogPicker({ pico, kind, t, lang, onSelect }) {
  const catalog = activeCatalog(pico);
  if (!catalog || !pico.variable_catalogs?.visible || catalog.question_type !== pico.question_type.template) return null;
  const caption = t({ interventions: "pickIntervention", comparators: "pickComparator", outcomes: "pickOutcome" }[kind]);
  return /* @__PURE__ */ React.createElement("label", { className: "catalog-picker" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, caption), /* @__PURE__ */ React.createElement("select", { "aria-label": caption, value: "", onChange: (e) => {
    const id = e.target.value;
    if (id) onSelect(kind, id);
  } }, /* @__PURE__ */ React.createElement("option", { value: "" }, t("select")), catalog[kind].map((item) => {
    const option = (x) => /* @__PURE__ */ React.createElement("option", { key: x.id, value: x.id, disabled: !canAddCandidate(pico, kind, x.id) }, candidateText(x.label, lang), !canAddCandidate(pico, kind, x.id) ? " · " + t("catalogAdded") : "");
    return item.children?.length ? /* @__PURE__ */ React.createElement("optgroup", { key: item.id, label: candidateText(item.label, lang) }, /* @__PURE__ */ React.createElement("option", { value: item.id, disabled: !canAddCandidate(pico, kind, item.id) }, t("addWholeFamily"), ": ", candidateText(item.label, lang)), item.children.map(option)) : option(item);
  })));
}
const Context = createContext(null);
const useApp = () => useContext(Context);
function IconButton({ icon: Icon, label: caption, ...props }) {
  return /* @__PURE__ */ React.createElement("button", { type: "button", className: "icon-button", title: caption, "aria-label": caption, ...props }, /* @__PURE__ */ React.createElement(Icon, { size: 17 }));
}
function Rich({ value, onChange, id, placeholder = "", className = "" }) {
  const { activeRef, setActive, t, lang } = useApp();
  const callback = useRef(onChange);
  callback.current = onChange;
  const editor = useEditor({ extensions: [StarterKit.configure({ heading: false, blockquote: false, code: false, codeBlock: false, horizontalRule: false, orderedList: false, link: false, underline: false }), TextStyle, Color, Highlight.configure({ multicolor: true }), Placeholder.configure({ placeholder })], content: value, editorProps: { attributes: { "aria-label": placeholder || t("element"), class: "rich-text", "data-field": id } }, onUpdate: ({ editor: editor2 }) => callback.current(normalizeRich(editor2.getJSON())), onFocus: ({ editor: editor2 }) => {
    activeRef.current = editor2;
    setActive(id);
  }, immediatelyRender: true }, [id]);
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const extension = editor.extensionManager.extensions.find((x) => x.name === "placeholder");
    if (extension) extension.options.placeholder = placeholder;
    editor.setOptions({ editorProps: { attributes: { "aria-label": placeholder || t("element"), class: "rich-text", "data-field": id } } });
    editor.view.dispatch(editor.state.tr);
  }, [placeholder, editor, lang]);
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (JSON.stringify(editor.getJSON()) !== JSON.stringify(value)) {
      const pos = editor.state.selection;
      editor.commands.setContent(value, { emitUpdate: false });
      const max = editor.state.doc.content.size;
      editor.commands.setTextSelection({ from: Math.min(pos.from, max), to: Math.min(pos.to, max) });
    }
  }, [value, editor]);
  return /* @__PURE__ */ React.createElement("div", { className: "rich-wrap " + className }, /* @__PURE__ */ React.createElement(EditorContent, { editor }));
}
function ColorControl({ kind }) {
  const { t, activeRef, active, preview } = useApp();
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState(kind === "highlight" ? "#fff19c" : "#255ca8");
  const [custom, setCustom] = useState(last);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const esc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);
  const apply = (color) => {
    const ed = activeRef.current;
    if (!ed || ed.isDestroyed) return;
    const chain = ed.chain().focus();
    if (kind === "highlight") {
      color ? chain.setHighlight({ color }).run() : chain.unsetHighlight().run();
    } else {
      color ? chain.setColor(color).run() : chain.unsetColor().run();
    }
    if (color) {
      setLast(color);
      setCustom(color);
    }
    setOpen(false);
  };
  const palette = kind === "highlight" ? ["#fff19c", "#bde9b9", "#b6defa", "#e2c5f1", "#ffcfb6", "#ffc6d9", "#ffe150", "#9fe2cf", "#dce4ed", "#ffffff"] : ["#172033", "#59677d", "#255ca8", "#227143", "#b22838", "#7544a8", "#b86813", "#07818a", "#919aa9", "#ffffff"];
  return /* @__PURE__ */ React.createElement("div", { className: "colour-control", ref }, /* @__PURE__ */ React.createElement("button", { className: "colour-main", disabled: !active || preview, onMouseDown: (e) => e.preventDefault(), onClick: () => apply(last), title: t(kind === "highlight" ? "highlight" : "textColor"), "aria-label": t(kind === "highlight" ? "highlight" : "textColor") }, kind === "highlight" ? /* @__PURE__ */ React.createElement(Highlighter, { size: 17 }) : /* @__PURE__ */ React.createElement("span", { className: "text-a" }, "A"), /* @__PURE__ */ React.createElement("span", { className: "colour-line", style: { background: last } })), /* @__PURE__ */ React.createElement("button", { className: "colour-arrow", disabled: !active || preview, "aria-label": t(kind === "highlight" ? "highlight" : "textColor") + " " + t("select"), onMouseDown: (e) => e.preventDefault(), onClick: () => setOpen(!open) }, /* @__PURE__ */ React.createElement(ChevronDown, { size: 12 })), open && /* @__PURE__ */ React.createElement("div", { className: "palette", role: "dialog", "aria-label": t(kind === "highlight" ? "highlight" : "textColor") }, /* @__PURE__ */ React.createElement("div", { className: "palette-title" }, t(kind === "highlight" ? "highlight" : "textColor")), /* @__PURE__ */ React.createElement("div", { className: "swatches" }, palette.map((color) => /* @__PURE__ */ React.createElement("button", { key: color, "aria-label": color, title: color, style: { background: color }, onMouseDown: (e) => e.preventDefault(), onClick: () => apply(color) }, last === color && /* @__PURE__ */ React.createElement(Check, { size: 13, color: ["#172033", "#255ca8", "#227143", "#7544a8", "#b22838", "#07818a"].includes(color) ? "#fff" : "#172033" })))), /* @__PURE__ */ React.createElement("button", { className: "palette-clear", onMouseDown: (e) => e.preventDefault(), onClick: () => apply(null) }, t(kind === "highlight" ? "noHighlight" : "automatic")), /* @__PURE__ */ React.createElement("label", { className: "custom-colour" }, t("customColor"), /* @__PURE__ */ React.createElement("input", { type: "color", value: custom, onChange: (e) => setCustom(e.target.value) })), /* @__PURE__ */ React.createElement("button", { className: "small primary", onMouseDown: (e) => e.preventDefault(), onClick: () => apply(custom) }, t("apply"))));
}
function Toolbar() {
  const { t, activeRef, active, undo, redo, canUndo, canRedo, preview, setPreview } = useApp();
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const ed2 = activeRef.current;
    if (!ed2 || ed2.isDestroyed) return;
    const f = () => setRevision((x) => x + 1);
    ed2.on("selectionUpdate", f);
    ed2.on("transaction", f);
    return () => {
      ed2.off("selectionUpdate", f);
      ed2.off("transaction", f);
    };
  }, [active]);
  const ed = activeRef.current;
  const run = (fn) => {
    if (ed && !ed.isDestroyed) fn(ed.chain().focus()).run();
  };
  return /* @__PURE__ */ React.createElement("div", { className: "format-bar" }, /* @__PURE__ */ React.createElement("div", { className: "format-tools" }, /* @__PURE__ */ React.createElement(IconButton, { icon: Undo2, label: t("undo"), disabled: !canUndo, onMouseDown: (e) => e.preventDefault(), onClick: undo }), /* @__PURE__ */ React.createElement(IconButton, { icon: Redo2, label: t("redo"), disabled: !canRedo, onMouseDown: (e) => e.preventDefault(), onClick: redo }), /* @__PURE__ */ React.createElement("span", { className: "tool-separator" }), [[Bold, "bold", "toggleBold"], [Italic, "italic", "toggleItalic"], [Strikethrough, "strike", "toggleStrike"]].map(([Icon, name, command]) => /* @__PURE__ */ React.createElement(IconButton, { key: name, icon: Icon, label: t(name), "aria-pressed": !!(ed && !ed.isDestroyed && ed.isActive(name)), disabled: !active || preview, onMouseDown: (e) => e.preventDefault(), onClick: () => run((c) => c[command]()) })), /* @__PURE__ */ React.createElement("span", { className: "tool-separator" }), /* @__PURE__ */ React.createElement(ColorControl, { kind: "highlight" }), /* @__PURE__ */ React.createElement(ColorControl, { kind: "text" }), /* @__PURE__ */ React.createElement("span", { className: "tool-separator" }), /* @__PURE__ */ React.createElement(IconButton, { icon: List, label: t("bullets"), disabled: !active || preview, onMouseDown: (e) => e.preventDefault(), onClick: () => run((c) => c.toggleBulletList()) }), /* @__PURE__ */ React.createElement(IconButton, { icon: RemoveFormatting, label: t("clearFormat"), disabled: !active || preview, onMouseDown: (e) => e.preventDefault(), onClick: () => run((c) => c.unsetAllMarks()) })), /* @__PURE__ */ React.createElement("div", { className: "view-tabs" }, /* @__PURE__ */ React.createElement("button", { className: !preview ? "selected" : "", onClick: () => setPreview(false) }, /* @__PURE__ */ React.createElement(Pencil, { size: 14 }), t("edit")), /* @__PURE__ */ React.createElement("button", { className: preview ? "selected" : "", onClick: () => setPreview(true) }, /* @__PURE__ */ React.createElement(Eye, { size: 14 }), t("preview"))));
}
function Sortable({ children, list, index, group, onReorder, onRemove, className = "" }) {
  const { t, dragRef, itemBadges } = useApp();
  const [over, setOver] = useState(false);
  const item = list[index];
  const drop = (e) => {
    const from = dragRef.current;
    if (!from || from.group !== group) return;
    e.preventDefault();
    e.stopPropagation();
    setOver(false);
    const source = list.findIndex((x) => x.id === from.id);
    if (source >= 0 && source !== index) onReorder(reorder(list, source, index));
    dragRef.current = null;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "item-card " + className + (over ? " drop-target" : ""), "data-item-id": item.id, onDragOver: (e) => {
    if (dragRef.current?.group === group) {
      e.preventDefault();
      setOver(true);
    }
  }, onDragLeave: (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setOver(false);
  }, onDrop: drop }, /* @__PURE__ */ React.createElement("div", { className: "item-controls" }, /* @__PURE__ */ React.createElement("button", { className: "drag-handle", draggable: true, title: t("drag"), "aria-label": t("drag"), onDragStart: (e) => {
    dragRef.current = { group, id: item.id };
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("application/x-pico-item", JSON.stringify(dragRef.current));
  }, onDragEnd: () => {
    dragRef.current = null;
    setOver(false);
  } }, /* @__PURE__ */ React.createElement(GripVertical, { size: 16 })), /* @__PURE__ */ React.createElement("div", { className: "move-controls" }, /* @__PURE__ */ React.createElement(IconButton, { icon: ArrowUp, label: t("up"), disabled: index === 0, onClick: () => onReorder(reorder(list, index, index - 1)) }), /* @__PURE__ */ React.createElement(IconButton, { icon: ArrowDown, label: t("down"), disabled: index === list.length - 1, onClick: () => onReorder(reorder(list, index, index + 1)) }), /* @__PURE__ */ React.createElement(IconButton, { icon: X, label: t("remove"), onClick: onRemove }))), itemBadges?.(item.id), children);
}
function LanguageOther({ onAdd }) {
  const { t } = useApp();
  const [code, setCode] = useState("");
  const value = code.trim().toLowerCase();
  const invalid = !!value && !LANGUAGE_CODE.test(value);
  const add = () => {
    if (!value || invalid) return;
    onAdd(value);
    setCode("");
  };
  return /* @__PURE__ */ React.createElement("div", { className: "language-other" }, /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("otherLanguage")), /* @__PURE__ */ React.createElement("input", { value: code, maxLength: 3, placeholder: "swe", "aria-invalid": invalid, onChange: (e) => setCode(e.target.value), onKeyDown: (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  } })), /* @__PURE__ */ React.createElement("button", { type: "button", className: "add-button", disabled: !value || invalid, onClick: add }, /* @__PURE__ */ React.createElement(Plus, { size: 15 }), t("addLanguage")), invalid && /* @__PURE__ */ React.createElement("p", { className: "inline-warning" }, t("languageCodeInvalid")));
}
function AddButton({ children, onClick }) {
  return /* @__PURE__ */ React.createElement("button", { className: "add-button", onClick }, /* @__PURE__ */ React.createElement(Plus, { size: 15 }), children);
}
function Modal({ title: title2, children, onClose, wide = false }) {
  const { t } = useApp();
  const dialog = useRef(null);
  useEffect(() => {
    const el = dialog.current;
    const previous = document.activeElement;
    el?.focus();
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const items = [...el.querySelectorAll("button,input,select,textarea,a[href]")].filter((x) => !x.disabled);
        const first = items[0], last = items.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous?.focus?.();
    };
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: "modal-backdrop", onMouseDown: (e) => {
    if (e.target === e.currentTarget) onClose();
  } }, /* @__PURE__ */ React.createElement("div", { className: "modal " + (wide ? "wide" : ""), role: "dialog", "aria-modal": "true", "aria-label": title2, ref: dialog, tabIndex: -1 }, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("h2", null, title2), /* @__PURE__ */ React.createElement(IconButton, { icon: X, label: t("close"), onClick: onClose })), children));
}
const PENDING = ["REVIEW", "NOT_IMPORTED"];
const fmt = (text, vars = {}) => String(text).replace(/\{(\w+)\}/g, (m, k) => k in vars ? String(vars[k]) : m);
const review = (d) => d?.import_review || null;
const isPending = (m) => PENDING.includes(m.status);
const pendingMarks = (d) => (review(d)?.marks || []).filter(isPending);
const importedMarks = (d) => (review(d)?.marks || []).filter((m) => !isPending(m));
const unplaced = (d) => review(d)?.unplaced || [];
const pendingCount = (d) => pendingMarks(d).length + unplaced(d).length;
const marksFor = (d, field, itemId = null) => pendingMarks(d).filter((m) => itemId ? m.item_id === itemId : m.field === field && !m.item_id);
function resolveMark(d, id) {
  if (d.import_review) d.import_review.marks = d.import_review.marks.filter((m) => m.id !== id);
}
function discardFragment(d, id) {
  if (d.import_review) d.import_review.unplaced = d.import_review.unplaced.filter((u) => u.id !== id);
}
function itemLabel(p, id, lang = "en") {
  const text = (node) => plain(node).replace(/\s+/g, " ").trim();
  const free = (list) => {
    for (const x of list || []) {
      if (x.id === id) return text(x.text) || label(COMP_LABELS, x.code, lang) + " " + text(x.specification);
      for (const c of x.children || []) if (c.id === id) return text(c.text);
    }
    return null;
  };
  const found = [
    () => p.population.subpopulations.find((x) => x.id === id) && text(p.population.subpopulations.find((x) => x.id === id).text),
    () => free(p.interventions),
    () => free(p.comparators),
    () => {
      const o = p.outcomes.find((x) => x.id === id);
      return o ? text(o.name) : null;
    },
    () => {
      const s = [...p.study_designs.included, ...p.study_designs.excluded].find((x) => x.id === id);
      return s ? label(DESIGN_LABELS, s.code, lang) : null;
    },
    () => {
      const a = p.publication_types.additional.find((x) => x.id === id);
      return a ? label(PUB_LABELS, a.code, lang) : null;
    }
  ];
  for (const f of found) {
    const v = f();
    if (v != null) return v.trim().slice(0, 80);
  }
  return null;
}
function importPrompt(lang = "en", notes = "") {
  const t = (k) => translate(lang, k);
  const extra = String(notes || "").trim();
  return t("importPromptText") + (extra ? "\n\n" + t("importPromptNotes") + "\n" + extra : "");
}
function MarkDetail({ mark, t }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, mark.reason && /* @__PURE__ */ React.createElement("span", { className: "mark-reason" }, mark.reason), mark.quote && /* @__PURE__ */ React.createElement("q", { className: "mark-quote" }, mark.quote), mark.page != null && /* @__PURE__ */ React.createElement("span", { className: "mark-page" }, fmt(t("markPage"), { n: mark.page })));
}
function MarkBadges({ marks, onResolve }) {
  const { t } = useApp();
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null);
    };
    const esc = (e) => {
      if (e.key === "Escape") setOpen(null);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  if (!marks.length) return null;
  return /* @__PURE__ */ React.createElement("span", { className: "mark-badges", ref }, marks.map((m) => /* @__PURE__ */ React.createElement("span", { key: m.id, className: "mark-anchor" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "mark-badge mark-" + m.status, "aria-expanded": open === m.id, onClick: (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(open === m.id ? null : m.id);
  } }, t("mark_" + m.status)), open === m.id && /* @__PURE__ */ React.createElement("span", { className: "mark-popover", role: "dialog", "aria-label": t("mark_" + m.status) }, /* @__PURE__ */ React.createElement(MarkDetail, { mark: m, t }), /* @__PURE__ */ React.createElement("button", { type: "button", className: "small primary", onClick: (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(null);
    onResolve(m.id);
  } }, /* @__PURE__ */ React.createElement(Check, { size: 13 }), t("markReviewed"))))));
}
function ImportReviewPanel({ doc, fieldLabels, onResolve, onDiscard, onGo }) {
  const { t, lang } = useApp();
  const [copied, setCopied] = useState(null);
  const review2 = doc.import_review;
  if (!review2) return null;
  const pending = pendingMarks(doc), done = importedMarks(doc), fragments = unplaced(doc), count = pendingCount(doc);
  const src = review2.source;
  const date = new Date(src.imported_at);
  const target = (m) => {
    const name = fieldLabels[m.field] || m.field;
    if (!m.item_id) return name;
    const item = itemLabel(doc.pico, m.item_id, lang);
    return name + " · " + (item == null ? t("itemRemoved") : item || "—");
  };
  const copy2 = async (u) => {
    try {
      await navigator.clipboard.writeText(u.text);
      setCopied(u.id);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  };
  return /* @__PURE__ */ React.createElement("section", { className: "import-review" + (count ? "" : " import-review-done"), "aria-label": t("reviewTitle") }, /* @__PURE__ */ React.createElement("div", { className: "import-review-head" }, /* @__PURE__ */ React.createElement(FileInput, { size: 17 }), /* @__PURE__ */ React.createElement("h2", null, t("reviewTitle")), /* @__PURE__ */ React.createElement("span", { className: "import-review-count" }, count ? fmt(t("reviewPending"), { n: count }) : t("reviewDone"))), /* @__PURE__ */ React.createElement("p", { className: "section-tip" }, fmt(t("reviewFrom"), { file: src.file_name, date: Number.isFinite(date.getTime()) ? date.toLocaleDateString(lang === "es" ? "es-ES" : "en-GB") : src.imported_at, skill: src.skill, version: src.skill_version }), " ", count > 0 && t("reviewHelp")), pending.length > 0 && /* @__PURE__ */ React.createElement("ul", { className: "import-review-list" }, pending.map((m) => /* @__PURE__ */ React.createElement("li", { key: m.id }, /* @__PURE__ */ React.createElement("span", { className: "mark-badge mark-" + m.status }, t("mark_" + m.status)), /* @__PURE__ */ React.createElement("span", { className: "mark-target" }, target(m)), /* @__PURE__ */ React.createElement(MarkDetail, { mark: m, t }), /* @__PURE__ */ React.createElement("span", { className: "mark-actions" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-button", onClick: () => onGo(m) }, /* @__PURE__ */ React.createElement(Crosshair, { size: 13 }), t("goToField")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-button", onClick: () => onResolve(m.id) }, /* @__PURE__ */ React.createElement(Check, { size: 13 }), t("markReviewed")))))), fragments.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", null, fmt(t("unplacedTitle"), { n: fragments.length })), /* @__PURE__ */ React.createElement("ul", { className: "import-review-list" }, fragments.map((u) => /* @__PURE__ */ React.createElement("li", { key: u.id }, /* @__PURE__ */ React.createElement("span", { className: "mark-fragment" }, u.text), u.page != null && /* @__PURE__ */ React.createElement("span", { className: "mark-page" }, fmt(t("markPage"), { n: u.page })), /* @__PURE__ */ React.createElement("span", { className: "mark-actions" }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-button", onClick: () => copy2(u) }, /* @__PURE__ */ React.createElement(Copy, { size: 13 }), t(copied === u.id ? "copied" : "copyText")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-button", onClick: () => onDiscard(u.id) }, /* @__PURE__ */ React.createElement(Trash2, { size: 13 }), t("discardFragment"))))))), done.length > 0 && /* @__PURE__ */ React.createElement("details", { className: "import-review-imported" }, /* @__PURE__ */ React.createElement("summary", null, fmt(t("importedMarks"), { n: done.length })), /* @__PURE__ */ React.createElement("ul", { className: "import-review-list" }, done.map((m) => /* @__PURE__ */ React.createElement("li", { key: m.id }, /* @__PURE__ */ React.createElement("span", { className: "mark-badge mark-" + m.status }, t("mark_" + m.status)), /* @__PURE__ */ React.createElement("span", { className: "mark-target" }, target(m)), /* @__PURE__ */ React.createElement(MarkDetail, { mark: m, t }))))));
}
const format = "pico-variable-catalog";
const schema_version = "0.2.0";
const catalog_id = "dermatomyositis-immunosuppressants-demo";
const title = { "es": "Dermatomiositis: inmunosupresores", "en": "Dermatomyositis: immunosuppressants" };
const question_type = "intervention";
const clinical_question = { "es": "En pacientes con dermatomiositis, ¿cuál es el efecto (eficacia y seguridad) de los inmunosupresores sintéticos convencionales, sintéticos dirigidos y biológicos?", "en": "In patients with dermatomyositis, what are the efficacy and safety effects of conventional synthetic, targeted synthetic and biological immunosuppressants?" };
const population_notes = { "es": "La pregunta no concreta edad ni afectación orgánica. Los ejemplos proceden principalmente de adultos; RIM incluye dermatomiositis juvenil y otras miopatías. Revisar la aplicabilidad antes de fijar criterios.", "en": "The question does not specify age or organ involvement. Examples mainly concern adults; RIM includes juvenile dermatomyositis and other myopathies. Review applicability before finalising criteria." };
const verification = { "status": "partially_reviewed", "checked_on": "2026-10-17", "limitations": { "es": "Catálogo ilustrativo y no exhaustivo. Se han consultado una guía y publicaciones primarias, incluidos resúmenes accesibles. No es una búsqueda sistemática ni una verificación completa de todos los instrumentos o contextos. Incluir un fármaco no presupone beneficio demostrado. La edad, las combinaciones y la afectación orgánica quedan por definir.", "en": "Illustrative, non-exhaustive catalogue. A guideline and primary publications, including accessible abstracts, were consulted. This is not a systematic search or a complete check of all instruments and contexts. Listing a drug does not establish benefit. Age, combination treatment and organ involvement remain to be defined." } };
const sources = [{ "id": "bsr2022", "source_type": "public_source", "title": "Oldroyd et al. British Society for Rheumatology guideline on management of idiopathic inflammatory myopathy (2022).", "url": "https://discovery.ucl.ac.uk/10147490/8/Machado_keac115.pdf", "locator": "Recommendations (i), adult and paediatric distinctions; pp. 1762–1763.", "accessed_on": "2026-10-17" }, { "id": "stir", "source_type": "public_source", "title": "Paik et al. Study of Tofacitinib in Refractory Dermatomyositis: an open-label pilot study (2021).", "url": "https://acrjournals.onlinelibrary.wiley.com/doi/10.1002/art.41602", "locator": "Accessible abstract: Methods and secondary outcome measures.", "accessed_on": "2026-10-17" }, { "id": "rim", "source_type": "public_source", "title": "Oddis et al. Rituximab in refractory adult and juvenile dermatomyositis and adult polymyositis (2013).", "url": "https://acrjournals.onlinelibrary.wiley.com/doi/10.1002/art.37754", "locator": "Accessible abstract: population, placebo-phase design and response outcomes.", "accessed_on": "2026-10-17" }, { "id": "abatacept", "source_type": "public_source", "title": "Aggarwal et al. Subcutaneous abatacept plus standard treatment for active inflammatory myopathy: phase 3 trial (2025).", "url": "https://acrjournals.onlinelibrary.wiley.com/doi/10.1002/art.43066", "locator": "Primary publication, accessible study description; mixed myositis population.", "accessed_on": "2026-10-17" }, { "id": "valor-skin", "source_type": "public_source", "title": "Mangold et al. Skin-specific outcomes of brepocitinib in dermatomyositis: secondary analysis of VALOR (2026).", "url": "https://jamanetwork.com/journals/jamadermatology/fullarticle/2853078", "locator": "Abstract, outcome definitions and corticosteroid-reduction outcomes.", "accessed_on": "2026-10-17" }];
const interventions = [{ "id": "family-conventional", "label": { "es": "Sintéticos convencionales", "en": "Conventional synthetic" }, "description": { "es": "", "en": "" }, "source_ids": ["bsr2022"], "children": [{ "id": "drug-methotrexate", "label": { "es": "Metotrexato", "en": "Methotrexate" }, "description": { "es": "", "en": "" }, "source_ids": ["bsr2022"] }, { "id": "drug-azathioprine", "label": { "es": "Azatioprina", "en": "Azathioprine" }, "description": { "es": "", "en": "" }, "source_ids": ["bsr2022"] }, { "id": "drug-mycophenolate", "label": { "es": "Micofenolato mofetilo", "en": "Mycophenolate mofetil" }, "description": { "es": "", "en": "" }, "source_ids": ["bsr2022"] }, { "id": "drug-tacrolimus", "label": { "es": "Tacrolimus", "en": "Tacrolimus" }, "description": { "es": "", "en": "" }, "source_ids": ["bsr2022"] }, { "id": "drug-ciclosporin", "label": { "es": "Ciclosporina", "en": "Ciclosporin" }, "description": { "es": "", "en": "" }, "source_ids": ["bsr2022"] }, { "id": "drug-cyclophosphamide", "label": { "es": "Ciclofosfamida", "en": "Cyclophosphamide" }, "description": { "es": "", "en": "" }, "source_ids": ["bsr2022"] }] }, { "id": "family-targeted", "label": { "es": "Sintéticos dirigidos", "en": "Targeted synthetic" }, "description": { "es": "", "en": "" }, "source_ids": ["stir", "valor-skin"], "children": [{ "id": "drug-tofacitinib", "label": { "es": "Tofacitinib", "en": "Tofacitinib" }, "description": { "es": "Inhibidor de JAK; estudio exploratorio en enfermedad predominantemente cutánea.", "en": "JAK inhibitor; exploratory study in predominantly cutaneous disease." }, "source_ids": ["stir"] }, { "id": "drug-brepocitinib", "label": { "es": "Brepocitinib", "en": "Brepocitinib" }, "description": { "es": "Inhibidor de TYK2/JAK1 estudiado en adultos.", "en": "TYK2/JAK1 inhibitor studied in adults." }, "source_ids": ["valor-skin"] }] }, { "id": "family-biological", "label": { "es": "Biológicos", "en": "Biological" }, "description": { "es": "", "en": "" }, "source_ids": ["bsr2022", "rim", "abatacept"], "children": [{ "id": "drug-rituximab", "label": { "es": "Rituximab", "en": "Rituximab" }, "description": { "es": "Ensayo con población mixta adulta y juvenil; revisar resultados específicos de dermatomiositis.", "en": "Trial with mixed adult and juvenile populations; review dermatomyositis-specific results." }, "source_ids": ["rim"] }, { "id": "drug-abatacept", "label": { "es": "Abatacept", "en": "Abatacept" }, "description": { "es": "Estudiado en miopatías inflamatorias; comprobar el subgrupo de dermatomiositis.", "en": "Studied in inflammatory myopathies; check the dermatomyositis subgroup." }, "source_ids": ["abatacept", "bsr2022"] }] }];
const comparators = [{ "id": "comparison-placebo", "label": { "es": "Placebo", "en": "Placebo" }, "description": { "es": "Precisar tratamiento de base compartido y periodo de comparación.", "en": "Specify shared background treatment and comparison period." }, "source_ids": ["rim", "abatacept", "valor-skin"], "controlled_code": "PLACEBO", "children": [] }, { "id": "comparison-usual-care", "label": { "es": "Tratamiento habitual", "en": "Usual care" }, "description": { "es": "Definir fármacos de base y glucocorticoides permitidos.", "en": "Define background drugs and permitted glucocorticoids." }, "source_ids": ["bsr2022"], "controlled_code": "USUAL_CARE", "children": [] }, { "id": "comparison-active", "label": { "es": "Otro inmunosupresor activo", "en": "Another active immunosuppressant" }, "description": { "es": "Precisar el fármaco o combinación elegidos como comparador.", "en": "Specify the drug or combination chosen as comparator." }, "source_ids": ["bsr2022"], "controlled_code": "OTHER_PHARMACOLOGICAL", "children": [] }, { "id": "comparison-uncontrolled", "label": { "es": "Sin grupo comparador", "en": "No comparator group" }, "description": { "es": "Opción solo si se admiten diseños no comparativos; el cambio basal no prueba causalidad.", "en": "Only if non-comparative designs are eligible; baseline change does not establish causality." }, "source_ids": ["stir"], "controlled_code": "NO_COMPARISON", "children": [] }];
const outcomes = [{ "id": "outcome-global-response", "label": { "es": "Respuesta clínica global", "en": "Global clinical response" }, "description": { "es": "IMACS DOI o Total Improvement Score (TIS); concretar criterio y seguimiento.", "en": "IMACS DOI or Total Improvement Score (TIS); specify criterion and follow-up." }, "source_ids": ["stir", "rim"] }, { "id": "outcome-strength", "label": { "es": "Fuerza muscular", "en": "Muscle strength" }, "description": { "es": "Prueba muscular manual; concretar escala, por ejemplo MMT-8, y momento.", "en": "Manual muscle testing; specify scale, for example MMT-8, and timing." }, "source_ids": ["abatacept"] }, { "id": "outcome-skin", "label": { "es": "Actividad cutánea", "en": "Cutaneous disease activity" }, "description": { "es": "CDASI o CDASI-A; distinguir cambio continuo y respuesta categórica.", "en": "CDASI or CDASI-A; distinguish continuous change from categorical response." }, "source_ids": ["stir", "valor-skin"] }, { "id": "outcome-muscle-enzymes", "label": { "es": "Enzimas musculares", "en": "Muscle enzymes" }, "description": { "es": "CK y otras enzimas, si procede; desenlace bioquímico, no equivalente a beneficio clínico.", "en": "CK and other enzymes when relevant; a biochemical outcome, not equivalent to clinical benefit." }, "source_ids": ["stir"] }, { "id": "outcome-function", "label": { "es": "Función física y discapacidad", "en": "Physical function and disability" }, "description": { "es": "Definir instrumento y población; considerar HAQ-DI o su versión pediátrica si corresponde.", "en": "Define instrument and population; consider HAQ-DI or its paediatric version where appropriate." }, "source_ids": ["abatacept"] }, { "id": "outcome-steroids", "label": { "es": "Reducción de glucocorticoides", "en": "Glucocorticoid reduction" }, "description": { "es": "Dosis, suspensión o reducción manteniendo respuesta; concretar definición.", "en": "Dose, discontinuation or reduction with maintained response; specify definition." }, "source_ids": ["bsr2022", "valor-skin"] }, { "id": "outcome-itch", "label": { "es": "Prurito", "en": "Itch" }, "description": { "es": "Intensidad del prurito; por ejemplo PP-NRS.", "en": "Itch severity; for example PP-NRS." }, "source_ids": ["valor-skin"] }, { "id": "outcome-skin-qol", "label": { "es": "Calidad de vida relacionada con la piel", "en": "Skin-related quality of life" }, "description": { "es": "Por ejemplo Skindex-16; no confundir con calidad de vida general.", "en": "For example Skindex-16; distinguish from general quality of life." }, "source_ids": ["valor-skin"] }, { "id": "outcome-ae", "label": { "es": "Eventos adversos", "en": "Adverse events" }, "description": { "es": "Participantes con uno o más eventos; precisar periodo y definiciones.", "en": "Participants with one or more events; specify period and definitions." }, "source_ids": ["stir", "rim", "abatacept"] }, { "id": "outcome-sae", "label": { "es": "Eventos adversos graves", "en": "Serious adverse events" }, "description": { "es": "Separar gravedad regulatoria e intensidad; especificar definición.", "en": "Distinguish regulatory seriousness from severity; specify definition." }, "source_ids": ["rim", "abatacept"] }, { "id": "outcome-infection", "label": { "es": "Infecciones e infecciones graves", "en": "Infections and serious infections" }, "description": { "es": "Desglosar por gravedad y, si procede, por tipo de infección.", "en": "Separate by seriousness and, where relevant, infection type." }, "source_ids": ["valor-skin"] }, { "id": "outcome-withdrawal", "label": { "es": "Suspensión por eventos adversos", "en": "Discontinuation due to adverse events" }, "description": { "es": "Participantes que suspenden el tratamiento debido a eventos adversos.", "en": "Participants discontinuing treatment because of adverse events." }, "source_ids": ["abatacept"] }];
const dermatomyositisCatalog = {
  format,
  schema_version,
  catalog_id,
  title,
  question_type,
  clinical_question,
  population_notes,
  verification,
  sources,
  interventions,
  comparators,
  outcomes
};
function PicoEditor({ document: external, onChange, lang = "en", theme = "light", header = null, footer = null, ref }) {
  const t = (k) => translate(lang, k);
  const [doc, setDoc] = useState(() => migrateDocument(external));
  const docRef = useRef(doc);
  const emitted = useRef(external);
  const changeRef = useRef(onChange);
  changeRef.current = onChange;
  const rootRef = useRef(null);
  const [active, setActive] = useState(null);
  const activeRef = useRef(null);
  const dragRef = useRef(null);
  const [preview, setPreview] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [historyState, setHistoryState] = useState(0);
  const history = useRef({ past: [], future: [], time: 0 });
  const [exportOptions, setExportOptions] = useState({ layout: "table" });
  const restoreRef = useRef(null);
  useEffect(() => {
    if (external === emitted.current) return;
    emitted.current = external;
    const next = migrateDocument(external);
    const old = docRef.current;
    if (old && old.document_id === next.document_id && JSON.stringify(old.pico) !== JSON.stringify(next.pico)) {
      const h = history.current;
      h.past.push(copy(old));
      if (h.past.length > 60) h.past.shift();
      h.future = [];
      h.time = 0;
      setHistoryState((x) => x + 1);
    }
    docRef.current = next;
    setDoc(next);
  }, [external]);
  useEffect(() => {
    const key = (e) => {
      if (!(e.ctrlKey || e.metaKey) || !["z", "y"].includes(e.key.toLowerCase())) return;
      const target = e.target;
      if (target && target !== document.body && target !== document.documentElement && !rootRef.current?.contains(target)) return;
      e.preventDefault();
      e.stopPropagation();
      restoreRef.current?.(e.key.toLowerCase() === "y" || e.shiftKey ? "redo" : "undo");
    };
    window.addEventListener("keydown", key, true);
    return () => window.removeEventListener("keydown", key, true);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 5e3);
    return () => clearTimeout(timer);
  }, [toast]);
  const emit = (d) => {
    emitted.current = d;
    changeRef.current?.(d);
  };
  function update(fn, structural = false) {
    const old = docRef.current;
    if (!old) return;
    const next = copy(old);
    fn(next.pico, next);
    next.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    if (JSON.stringify([next.pico, next.import_review]) === JSON.stringify([old.pico, old.import_review])) return;
    const h = history.current;
    const now = Date.now();
    if (structural || now - h.time > 800) {
      h.past.push(copy(old));
      if (h.past.length > 60) h.past.shift();
    }
    h.time = now;
    h.future = [];
    setHistoryState((x) => x + 1);
    docRef.current = next;
    setDoc(next);
    emit(next);
  }
  restoreRef.current = restore;
  function restore(direction) {
    const h = history.current;
    const from = direction === "undo" ? h.past : h.future;
    const to = direction === "undo" ? h.future : h.past;
    if (!from.length) return;
    to.push(copy(docRef.current));
    const d = from.pop();
    docRef.current = d;
    setDoc(d);
    setHistoryState((x) => x + 1);
    emit(d);
  }
  function removeItem(list, apply, item) {
    const nonempty = Object.entries(item).some(([k, v]) => !["id", "mode", "role"].includes(k) && (typeof v === "string" ? !!v : v?.type === "doc" ? !!plain(v).trim() : Array.isArray(v) ? v.length > 0 : typeof v === "number" ? true : false));
    const action = () => apply(list.filter((x) => x.id !== item.id));
    if (nonempty) setModal({ type: "confirm", text: t("confirmDelete"), action });
    else action();
  }
  function importCatalogue(catalog, targetId, options = {}) {
    if (docRef.current?.document_id !== targetId) {
      setToast(t("catalogQuestionChanged"));
      return;
    }
    catalog = migrateCatalog(catalog);
    const errors = validateCatalog(catalog);
    if (errors.length) {
      setToast(t("catalogInvalid") + " " + errors.join(", "));
      return;
    }
    if (catalog.question_type !== docRef.current.pico.question_type.template) {
      setToast(t("catalogWrongType"));
      return;
    }
    try {
      const next = copy(docRef.current);
      importCatalog(next.pico, catalog);
      const fill = options.fillQuestionIfEmpty && !plain(next.pico.clinical_question).trim();
      if (fill) next.pico.clinical_question = rich(catalog.clinical_question[lang]);
      if (new Blob([JSON.stringify(next, null, 2)]).size > 9 * 1024 * 1024) {
        setToast(t("catalogDocumentLimit"));
        return;
      }
      update((p2) => {
        p2.variable_catalogs = next.pico.variable_catalogs;
        if (fill) p2.clinical_question = next.pico.clinical_question;
      }, true);
      setToast(t("catalogImported"));
    } catch (e) {
      setToast(t("catalogInvalid") + " " + e.message);
    }
  }
  function addCandidate(kind, id) {
    update((p2) => {
      addCatalogVariable(p2, kind, id, lang);
    }, true);
  }
  function useCatalogueQuestion(text) {
    const action = () => update((p2) => {
      p2.clinical_question = rich(text);
    }, true);
    if (plain(docRef.current.pico.clinical_question).trim() && plain(docRef.current.pico.clinical_question) !== text) setModal({ type: "confirm", text: t("catalogReplaceQuestion"), action });
    else action();
  }
  useImperativeHandle(ref, () => ({ importCatalogue: (catalog, targetId = docRef.current?.document_id) => importCatalogue(catalog, targetId), undo: () => restore("undo"), redo: () => restore("redo") }));
  const p = doc?.pico;
  const type = p?.question_type.template || "intervention";
  const lbl = labelsFor(type, t);
  const notices = doc ? warnings(doc) : [];
  const richField = (value, onChange2, id, placeholder, cls = "") => /* @__PURE__ */ React.createElement(Rich, { key: doc.document_id + "-" + id, id: doc.document_id + "-" + id, value, onChange: onChange2, placeholder, className: cls });
  const replaceList = (key, list) => update((p2) => {
    p2[key] = list;
  }, true);
  function clearList(action, allStudies = false) {
    setModal({ type: "confirm", text: t(allStudies ? "clearStudiesConfirm" : "clearAllConfirm"), action });
  }
  const clearButton = (list, action) => /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-button clear-list", disabled: !list.length, onClick: () => clearList(action) }, t("clearAll"));
  const badges = (field, itemId = null) => /* @__PURE__ */ React.createElement(MarkBadges, { marks: marksFor(doc, field, itemId), onResolve: (id) => update((p2, d) => resolveMark(d, id), true) });
  const fieldLabels = { number: t("number"), section: t("section"), clinical_question: t("clinicalQuestion"), question_type: t("questionType"), criteria_version: t("versionCriteria"), population: lbl.population, interventions: lbl.intervention, comparators: lbl.comparator, outcomes: lbl.outcome, study_designs: t("studyTypes"), publication_types: t("publications"), languages: t("languages"), reviewer_notes: t("reviewerNotes") };
  function goTo(mark) {
    const root = rootRef.current;
    const el = mark.item_id && root?.querySelector(`[data-item-id="${mark.item_id}"]`) || root?.querySelector(`[data-pico-field="${mark.field}"]`);
    if (!el) return;
    el.scrollIntoView?.({ block: "center", behavior: "smooth" });
    el.classList.add("mark-flash");
    setTimeout(() => el.classList.remove("mark-flash"), 1600);
  }
  const sectionHeading = (letter, title2, clear = null, field = null) => /* @__PURE__ */ React.createElement("div", { className: "column-title" }, /* @__PURE__ */ React.createElement("span", { className: "letter" }, letter), /* @__PURE__ */ React.createElement("h2", null, title2), field && badges(field), clear);
  function itemList(list, key, caption, subcaption) {
    const apply = (a) => replaceList(key, a);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, list.map((item, i) => /* @__PURE__ */ React.createElement(Sortable, { key: item.id, list, index: i, group: key, onReorder: apply, onRemove: () => removeItem(list, apply, item) }, /* @__PURE__ */ React.createElement("div", { className: "field-label" }, caption, " ", i + 1), richField(item.text, (v) => update((p2) => {
      p2[key][i].text = v;
    }), item.id, caption + "…", "card-rich category-rich"), /* @__PURE__ */ React.createElement("div", { className: "child-list" }, item.children.map((child, j) => {
      const applyChildren = (a) => update((p2) => {
        p2[key][i].children = a;
      }, true);
      return /* @__PURE__ */ React.createElement(Sortable, { key: child.id, list: item.children, index: j, group: item.id + "-children", className: "child-card", onReorder: applyChildren, onRemove: () => removeItem(item.children, applyChildren, child) }, richField(child.text, (v) => update((p2) => {
        p2[key][i].children[j].text = v;
      }), child.id, subcaption + "…", "card-rich"));
    })), /* @__PURE__ */ React.createElement(AddButton, { onClick: () => update((p2) => {
      p2[key][i].children.push(freeItem());
    }, true) }, subcaption))), /* @__PURE__ */ React.createElement(AddButton, { onClick: () => update((p2) => {
      p2[key].push(freeItem());
    }, true) }, caption));
  }
  function designList(key) {
    const list = p.study_designs[key];
    const apply = (a) => update((p2) => {
      p2.study_designs[key] = a;
    }, true);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, list.map((item, i) => /* @__PURE__ */ React.createElement(Sortable, { key: item.id, list, index: i, group: "design-" + key, onReorder: apply, onRemove: () => removeItem(list, apply, item), className: "design-card" }, /* @__PURE__ */ React.createElement("div", { className: "design-fields" }, /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("studyTypes")), /* @__PURE__ */ React.createElement("select", { value: item.code, onChange: (e) => {
      const code = e.target.value;
      const action = () => update((p2) => {
        const x = p2.study_designs[key][i];
        x.code = code;
        if (noN(code)) x.min_n = null;
      }, true);
      if (noN(code) && item.min_n != null) setModal({ type: "confirm", text: t("nDiscard"), action });
      else action();
    } }, /* @__PURE__ */ React.createElement("option", { value: "" }, t("select")), item.code && !DESIGN_CATALOGS[type].includes(item.code) && /* @__PURE__ */ React.createElement("option", { value: item.code }, label(DESIGN_LABELS, item.code, lang), " · ", t("incompatible")), DESIGN_CATALOGS[type].map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, label(DESIGN_LABELS, c, lang))))), !noN(item.code) && /* @__PURE__ */ React.createElement("label", { className: "minimum-n" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("minimumN")), /* @__PURE__ */ React.createElement("input", { type: "number", min: "1", step: "1", value: item.min_n ?? "", placeholder: "—", title: t("nHelp"), onChange: (e) => {
      const val = e.target.value;
      if (val === "" || /^[0-9]+$/.test(val) && Number(val) > 0) update((p2) => {
        p2.study_designs[key][i].min_n = val === "" ? null : Number(val);
      });
    } }))), item.code && !DESIGN_CATALOGS[type].includes(item.code) && /* @__PURE__ */ React.createElement("div", { className: "inline-warning" }, t("reviewType")), richField(item.conditions, (v) => update((p2) => {
      p2.study_designs[key][i].conditions = v;
    }), item.id + "-conditions", t("conditions"), "condition-rich"))), /* @__PURE__ */ React.createElement(AddButton, { onClick: () => update((p2) => {
      p2.study_designs[key].push(design());
    }, true) }, t("addDesign")));
  }
  const ctx = { t, lang, activeRef, setActive, active, dragRef, undo: () => restore("undo"), redo: () => restore("redo"), canUndo: history.current.past.length > 0, canRedo: history.current.future.length > 0, preview, setPreview, itemBadges: (id) => badges(null, id) };
  return /* @__PURE__ */ React.createElement(Context.Provider, { value: ctx }, /* @__PURE__ */ React.createElement("div", { className: "pico-root pico-editor", "data-theme": theme, lang, ref: rootRef }, /* @__PURE__ */ React.createElement(Toolbar, null), /* @__PURE__ */ React.createElement("main", { className: "workspace" }, header, preview ? /* @__PURE__ */ React.createElement("div", { className: "document-page preview-page" }, /* @__PURE__ */ React.createElement("div", { className: "preview-options" }, /* @__PURE__ */ React.createElement("select", { "aria-label": t("layout"), value: exportOptions.layout, onChange: (e) => setExportOptions({ ...exportOptions, layout: e.target.value }) }, /* @__PURE__ */ React.createElement("option", { value: "table" }, t("table")), /* @__PURE__ */ React.createElement("option", { value: "sections" }, t("sections")))), /* @__PURE__ */ React.createElement("div", { className: "print-document", dangerouslySetInnerHTML: { __html: previewHtml(doc, lang, true, exportOptions.layout) } })) : /* @__PURE__ */ React.createElement("div", { className: "document-page" }, doc.import_review && /* @__PURE__ */ React.createElement(ImportReviewPanel, { doc, fieldLabels, onResolve: (id) => update((p2, d) => resolveMark(d, id), true), onDiscard: (id) => update((p2, d) => discardFragment(d, id), true), onGo: goTo }), /* @__PURE__ */ React.createElement("section", { className: "identity-section" }, /* @__PURE__ */ React.createElement("div", { className: "identity-row" }, /* @__PURE__ */ React.createElement("label", { className: "question-number", "data-pico-field": "number" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("number"), badges("number")), /* @__PURE__ */ React.createElement("input", { value: p.number, placeholder: "3a", onChange: (e) => update((p2) => {
    p2.number = e.target.value.trim().toLowerCase();
  }) })), /* @__PURE__ */ React.createElement("div", { className: "section-field", "data-pico-field": "section" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("section"), badges("section")), richField(p.section, (v) => update((p2) => {
    p2.section = v;
  }), "section", t("sectionPlaceholder"), "single-rich")), /* @__PURE__ */ React.createElement("label", { className: "question-type", "data-pico-field": "question_type" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("questionType"), badges("question_type")), /* @__PURE__ */ React.createElement("select", { value: type, title: t("typeHelp"), onChange: (e) => {
    const val = e.target.value;
    update((p2) => {
      p2.question_type = { code: typeCode(val), template: val, template_version: "1.0" };
    }, true);
    setToast(t("typeChange"));
  } }, Object.keys(DESIGN_CATALOGS).map((k) => /* @__PURE__ */ React.createElement("option", { key: k, value: k }, t(k)))))), type === "other" && /* @__PURE__ */ React.createElement("div", { className: "other-type" }, /* @__PURE__ */ React.createElement("label", { className: "field-label" }, t("questionType"), /* @__PURE__ */ React.createElement("select", { value: p.question_type.code, onChange: (e) => update((p2) => {
    p2.question_type.code = e.target.value;
  }, true) }, ["OTHER", "SAFETY", "PREDICTION", "ETIOLOGY", "EXPOSURE", "PREVALENCE", "QUALITATIVE"].map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, { OTHER: ["Other", "Otra"], SAFETY: ["Safety", "Seguridad"], PREDICTION: ["Prediction", "Predicción"], ETIOLOGY: ["Aetiology", "Etiología"], EXPOSURE: ["Exposure", "Exposición"], PREVALENCE: ["Prevalence", "Prevalencia"], QUALITATIVE: ["Qualitative", "Cualitativa"] }[c][lang === "es" ? 1 : 0]))))), /* @__PURE__ */ React.createElement("div", { className: "question-box", "data-pico-field": "clinical_question" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("clinicalQuestion"), badges("clinical_question")), richField(p.clinical_question, (v) => update((p2) => {
    p2.clinical_question = v;
  }), "clinical", t("questionPlaceholder"), "question-rich"))), /* @__PURE__ */ React.createElement(CatalogBar, { pico: p, documentId: doc.document_id, t, lang, onImport: importCatalogue, onUpdate: (fn) => update(fn, true), onError: setToast, onQuestion: useCatalogueQuestion, demo: dermatomyositisCatalog, onDownloadDemo: () => download(new Blob([JSON.stringify(dermatomyositisCatalog, null, 2)], { type: "application/json" }), "dermatomyositis.pico-catalog.json") }), /* @__PURE__ */ React.createElement("div", { className: "pico-grid" }, /* @__PURE__ */ React.createElement("section", { className: "pico-column", "data-pico-field": "population" }, sectionHeading("P", lbl.population, null, "population"), /* @__PURE__ */ React.createElement("div", { className: "column-content" }, richField(p.population.text, (v) => update((p2) => {
    p2.population.text = v;
  }), "population", t("populationPlaceholder"), p.population.subpopulations.length ? "category-rich" : ""), /* @__PURE__ */ React.createElement("div", { className: "subpopulations" }, p.population.subpopulations.map((item, i) => {
    const list = p.population.subpopulations;
    const apply = (a) => update((p2) => {
      p2.population.subpopulations = a;
    }, true);
    return /* @__PURE__ */ React.createElement(Sortable, { key: item.id, list, index: i, group: "subpopulation", onReorder: apply, onRemove: () => removeItem(list, apply, item) }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("subpopulation"), " ", i + 1), richField(item.text, (v) => update((p2) => {
      p2.population.subpopulations[i].text = v;
    }), item.id, t("subpopulation") + "…"));
  })), /* @__PURE__ */ React.createElement(AddButton, { onClick: () => update((p2) => {
    p2.population.subpopulations.push({ id: uid(), text: rich() });
  }, true) }, t("addSubpopulation")))), /* @__PURE__ */ React.createElement("section", { className: "pico-column", "data-pico-field": "interventions" }, sectionHeading(type === "prognosis" ? "F" : "I", lbl.intervention, clearButton(p.interventions, () => replaceList("interventions", [])), "interventions"), /* @__PURE__ */ React.createElement("div", { className: "column-content" }, /* @__PURE__ */ React.createElement(CatalogPicker, { pico: p, kind: "interventions", t, lang, onSelect: addCandidate }), itemList(p.interventions, "interventions", lbl.item, lbl.sub))), /* @__PURE__ */ React.createElement("section", { className: "pico-column", "data-pico-field": "comparators" }, sectionHeading("C", lbl.comparator, clearButton(p.comparators, () => replaceList("comparators", [])), "comparators"), /* @__PURE__ */ React.createElement("div", { className: "column-content" }, /* @__PURE__ */ React.createElement(CatalogPicker, { pico: p, kind: "comparators", t, lang, onSelect: addCandidate }), p.comparators.map((item, i) => {
    const apply = (a) => replaceList("comparators", a);
    return /* @__PURE__ */ React.createElement(Sortable, { key: item.id, list: p.comparators, index: i, group: "comparators", onReorder: apply, onRemove: () => removeItem(p.comparators, apply, item) }, item.mode === "FREE" ? richField(item.text, (v) => update((p2) => {
      p2.comparators[i].text = v;
    }), item.id, t("comparator") + "…", "card-rich" + (item.children.length ? " category-rich" : "")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("controlled")), /* @__PURE__ */ React.createElement("select", { value: item.code, onChange: (e) => update((p2) => {
      p2.comparators[i].code = e.target.value;
      if (e.target.value === "REFERENCE_STANDARD") p2.comparators[i].role = "REFERENCE_STANDARD";
    }, true) }, /* @__PURE__ */ React.createElement("option", { value: "" }, t("select")), item.code && !COMP_CATALOGS[type].includes(item.code) && /* @__PURE__ */ React.createElement("option", { value: item.code }, label(COMP_LABELS, item.code, lang), " · ", t("incompatible")), COMP_CATALOGS[type].map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, label(COMP_LABELS, c, lang)))), item.code && !COMP_CATALOGS[type].includes(item.code) && /* @__PURE__ */ React.createElement("div", { className: "inline-warning" }, t("reviewType")), richField(item.specification, (v) => update((p2) => {
      p2.comparators[i].specification = v;
    }), item.id, t("specification"), "condition-rich")), type === "diagnostic" && /* @__PURE__ */ React.createElement("label", { className: "field-label role-field" }, t("referenceRole"), /* @__PURE__ */ React.createElement("select", { value: item.role, onChange: (e) => update((p2) => {
      p2.comparators[i].role = e.target.value;
    }, true) }, /* @__PURE__ */ React.createElement("option", { value: "REFERENCE_STANDARD" }, t("referenceStandard")), /* @__PURE__ */ React.createElement("option", { value: "COMPARATOR" }, t("comparatorTest")), /* @__PURE__ */ React.createElement("option", { value: "OTHER" }, t("otherRole")))), /* @__PURE__ */ React.createElement("div", { className: "child-list" }, item.children.map((child, j) => {
      const applyChildren = (a) => update((p2) => {
        p2.comparators[i].children = a;
      }, true);
      return /* @__PURE__ */ React.createElement(Sortable, { key: child.id, list: item.children, index: j, group: item.id + "children", className: "child-card", onReorder: applyChildren, onRemove: () => removeItem(item.children, applyChildren, child) }, richField(child.text, (v) => update((p2) => {
        p2.comparators[i].children[j].text = v;
      }), child.id, t("subcomparator") + "…", "card-rich"));
    })), /* @__PURE__ */ React.createElement(AddButton, { onClick: () => update((p2) => {
      p2.comparators[i].children.push(freeItem());
    }, true) }, t("subcomparator")));
  }), /* @__PURE__ */ React.createElement(AddButton, { onClick: () => update((p2) => {
    p2.comparators.push(comparator());
  }, true) }, t("freeComparator")), /* @__PURE__ */ React.createElement(AddButton, { onClick: () => update((p2) => {
    p2.comparators.push(comparator("CONTROLLED"));
  }, true) }, t("controlled")))), /* @__PURE__ */ React.createElement("section", { className: "pico-column outcome-column", "data-pico-field": "outcomes" }, sectionHeading("O", lbl.outcome, clearButton(p.outcomes, () => replaceList("outcomes", [])), "outcomes"), /* @__PURE__ */ React.createElement("div", { className: "column-content" }, /* @__PURE__ */ React.createElement(CatalogPicker, { pico: p, kind: "outcomes", t, lang, onSelect: addCandidate }), p.outcomes.map((item, i) => {
    const apply = (a) => replaceList("outcomes", a);
    return /* @__PURE__ */ React.createElement(Sortable, { key: item.id, list: p.outcomes, index: i, group: "outcomes", onReorder: apply, onRemove: () => removeItem(p.outcomes, apply, item) }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("outcome"), " ", i + 1), richField(item.name, (v) => update((p2) => {
      p2.outcomes[i].name = v;
    }), item.id + "name", t("outcomeName"), "outcome-name"), /* @__PURE__ */ React.createElement("span", { className: "field-label desc-label" }, t("description")), richField(item.description, (v) => update((p2) => {
      p2.outcomes[i].description = v;
    }), item.id + "description", t("descriptionPlaceholder"), "outcome-description"), /* @__PURE__ */ React.createElement("details", { className: "outcome-details" }, /* @__PURE__ */ React.createElement("summary", null, t("optionalDetails")), /* @__PURE__ */ React.createElement("div", { className: "details-grid" }, /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("importance")), /* @__PURE__ */ React.createElement("select", { value: item.details.importance || "", onChange: (e) => update((p2) => {
      const det = p2.outcomes[i].details;
      det.importance = e.target.value || null;
      det.score = null;
    }, true) }, /* @__PURE__ */ React.createElement("option", { value: "" }, t("notAssessed")), /* @__PURE__ */ React.createElement("option", { value: "CRITICAL" }, t("critical")), /* @__PURE__ */ React.createElement("option", { value: "IMPORTANT" }, t("important")), /* @__PURE__ */ React.createElement("option", { value: "NOT_IMPORTANT" }, t("notImportant")))), /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("score")), /* @__PURE__ */ React.createElement("input", { type: "number", min: "1", max: "9", value: item.details.score ?? "", onChange: (e) => {
      const n = Number(e.target.value);
      if (e.target.value === "" || Number.isInteger(n) && n >= 1 && n <= 9) update((p2) => {
        const det = p2.outcomes[i].details;
        det.score = e.target.value === "" ? null : n;
        if (det.score) det.importance = n >= 7 ? "CRITICAL" : n >= 4 ? "IMPORTANT" : "NOT_IMPORTANT";
      });
    } }))), [["timepoints", "moments"], ["instruments", "instruments"], ["thresholds", "thresholds"]].map(([key, title2]) => /* @__PURE__ */ React.createElement("label", { key }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t(title2)), /* @__PURE__ */ React.createElement("textarea", { value: (item.details[key] || []).join("\n"), onChange: (e) => update((p2) => {
      p2.outcomes[i].details[key] = e.target.value.split("\n");
    }) }))), /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("mid")), /* @__PURE__ */ React.createElement("input", { value: item.details.minimal_important_difference || "", onChange: (e) => update((p2) => {
      p2.outcomes[i].details.minimal_important_difference = e.target.value || null;
    }) }))));
  }), /* @__PURE__ */ React.createElement(AddButton, { onClick: () => update((p2) => {
    p2.outcomes.push(outcome());
  }, true) }, t("addOutcome"))))), /* @__PURE__ */ React.createElement("section", { className: "lower-section", "data-pico-field": "study_designs" }, /* @__PURE__ */ React.createElement("div", { className: "section-heading" }, /* @__PURE__ */ React.createElement("h2", null, t("studyTypes")), badges("study_designs"), /* @__PURE__ */ React.createElement("span", { className: "section-tip" }, t("nHelp")), /* @__PURE__ */ React.createElement("button", { type: "button", className: "text-button clear-list", disabled: !p.study_designs.included.length && !p.study_designs.excluded.length, onClick: () => clearList(() => update((p2) => {
    p2.study_designs.included = [];
    p2.study_designs.excluded = [];
    p2.study_designs.remainder_excluded = false;
  }, true), true) }, t("clearAll"))), /* @__PURE__ */ React.createElement("div", { className: "study-grid" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "list-title" }, /* @__PURE__ */ React.createElement("h3", null, t("included")), clearButton(p.study_designs.included, () => update((p2) => {
    p2.study_designs.included = [];
    p2.study_designs.remainder_excluded = false;
  }, true))), designList("included")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "list-title" }, /* @__PURE__ */ React.createElement("h3", null, t("excluded")), clearButton(p.study_designs.excluded, () => update((p2) => {
    p2.study_designs.excluded = [];
    p2.study_designs.remainder_excluded = false;
  }, true)), /* @__PURE__ */ React.createElement("button", { className: "text-button", onClick: () => {
    const remaining = remainder(type, p.study_designs.included, p.study_designs.excluded);
    if (!remaining.length) {
      setToast(t("restNone"));
      return;
    }
    setModal({ type: "confirm", text: t("restConfirm"), extra: remaining.map((x) => label(DESIGN_LABELS, x.code, lang)).join("\n"), action: () => update((p2) => {
      p2.study_designs.excluded.push(...remaining);
      p2.study_designs.remainder_excluded = true;
    }, true) });
  } }, t("excludeRest"))), designList("excluded")))), /* @__PURE__ */ React.createElement("section", { className: "lower-section publication-section", "data-pico-field": "publication_types" }, /* @__PURE__ */ React.createElement("div", { className: "section-heading" }, /* @__PURE__ */ React.createElement("h2", null, t("publications")), badges("publication_types")), /* @__PURE__ */ React.createElement("label", { className: "publication-scope" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("pubScope")), /* @__PURE__ */ React.createElement("select", { value: p.publication_types.mode || "", onChange: (e) => {
    const mode = e.target.value || null;
    const action = () => update((p2) => {
      p2.publication_types.mode = mode;
      if (mode !== "FULL_REPORTS_AND_OTHERS") p2.publication_types.additional = [];
    }, true);
    if (mode !== "FULL_REPORTS_AND_OTHERS" && p.publication_types.additional.length) setModal({ type: "confirm", text: t("pubDiscard"), action });
    else action();
  } }, /* @__PURE__ */ React.createElement("option", { value: "" }, t("select")), /* @__PURE__ */ React.createElement("option", { value: "FULL_REPORTS_ONLY" }, t("fullOnly")), /* @__PURE__ */ React.createElement("option", { value: "FULL_REPORTS_AND_OTHERS" }, t("fullOthers")))), p.publication_types.mode === "FULL_REPORTS_AND_OTHERS" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "section-tip pub-tip" }, t("pubHelp")), /* @__PURE__ */ React.createElement("div", { className: "publication-list" }, p.publication_types.additional.map((item, i) => {
    const list = p.publication_types.additional;
    const apply = (a) => update((p2) => {
      p2.publication_types.additional = a;
    }, true);
    return /* @__PURE__ */ React.createElement(Sortable, { key: item.id, list, index: i, group: "publications", onReorder: apply, onRemove: () => removeItem(list, apply, item) }, /* @__PURE__ */ React.createElement("select", { "aria-label": t("publications"), value: item.code, onChange: (e) => update((p2) => {
      p2.publication_types.additional[i].code = e.target.value;
    }, true) }, /* @__PURE__ */ React.createElement("option", { value: "" }, t("select")), Object.keys(PUB_LABELS).map((c) => /* @__PURE__ */ React.createElement("option", { key: c, value: c }, label(PUB_LABELS, c, lang)))), richField(item.clarification, (v) => update((p2) => {
      p2.publication_types.additional[i].clarification = v;
    }), item.id, t("conditions"), "condition-rich"));
  })), /* @__PURE__ */ React.createElement(AddButton, { onClick: () => update((p2) => {
    p2.publication_types.additional.push(publication());
  }, true) }, t("addPublication"))), richField(p.publication_types.conditions, (v) => update((p2) => {
    p2.publication_types.conditions = v;
  }), "publication-conditions", t("pubConditions"), "condition-rich")), /* @__PURE__ */ React.createElement("section", { className: "lower-section language-section", "data-pico-field": "languages" }, /* @__PURE__ */ React.createElement("div", { className: "section-heading" }, /* @__PURE__ */ React.createElement("h2", null, t("languages")), badges("languages")), /* @__PURE__ */ React.createElement("label", { className: "publication-scope" }, /* @__PURE__ */ React.createElement("span", { className: "field-label" }, t("languageScope")), /* @__PURE__ */ React.createElement("select", { value: p.languages.mode || "", onChange: (e) => {
    const mode = e.target.value || null;
    const action = () => update((p2) => {
      p2.languages.mode = mode;
      if (mode !== "RESTRICTED") p2.languages.included = [];
    }, true);
    if (mode !== "RESTRICTED" && p.languages.included.length) setModal({ type: "confirm", text: t("languageDiscard"), action });
    else action();
  } }, /* @__PURE__ */ React.createElement("option", { value: "" }, t("select")), /* @__PURE__ */ React.createElement("option", { value: "ANY" }, t("anyLanguage")), /* @__PURE__ */ React.createElement("option", { value: "RESTRICTED" }, t("restrictedLanguages")))), p.languages.mode === "RESTRICTED" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", { className: "section-tip pub-tip" }, t("languageHelp")), /* @__PURE__ */ React.createElement("div", { className: "language-grid", role: "group", "aria-label": t("languages") }, [...Object.keys(LANG_LABELS), ...p.languages.included.filter((c) => !LANG_LABELS[c])].map((c) => /* @__PURE__ */ React.createElement("label", { key: c, className: "checkbox-label language-option" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: p.languages.included.includes(c), onChange: (e) => {
    const on = e.target.checked;
    update((p2) => {
      const rest = p2.languages.included.filter((x) => x !== c);
      p2.languages.included = on ? [...rest, c] : rest;
    }, true);
  } }), /* @__PURE__ */ React.createElement("span", null, label(LANG_LABELS, c, lang)), /* @__PURE__ */ React.createElement("code", null, c)))), /* @__PURE__ */ React.createElement(LanguageOther, { onAdd: (c) => update((p2) => {
    if (!p2.languages.included.includes(c)) p2.languages.included.push(c);
  }, true) })), richField(p.languages.conditions, (v) => update((p2) => {
    p2.languages.conditions = v;
  }), "language-conditions", t("languageConditions"), "condition-rich")), /* @__PURE__ */ React.createElement("section", { className: "lower-section notes-section", "data-pico-field": "reviewer_notes" }, /* @__PURE__ */ React.createElement("h2", null, t("reviewerNotes"), badges("reviewer_notes")), richField(p.reviewer_notes, (v) => update((p2) => {
    p2.reviewer_notes = v;
  }), "notes", t("notesPlaceholder"), "notes-rich"), /* @__PURE__ */ React.createElement("div", { className: "criteria-version", "data-pico-field": "criteria_version" }, /* @__PURE__ */ React.createElement("label", null, t("versionCriteria"), badges("criteria_version"), /* @__PURE__ */ React.createElement("input", { value: p.criteria_version, onChange: (e) => update((p2) => {
    p2.criteria_version = e.target.value;
  }) }))))), notices.length > 0 && /* @__PURE__ */ React.createElement("details", { className: "validation-panel" }, /* @__PURE__ */ React.createElement("summary", null, /* @__PURE__ */ React.createElement(AlertCircle, { size: 16 }), t("completeWarnings"), " (", notices.length, ")"), /* @__PURE__ */ React.createElement("ul", null, notices.map((x) => /* @__PURE__ */ React.createElement("li", { key: x }, t(x))))), footer), toast && /* @__PURE__ */ React.createElement("div", { className: "toast", role: "status" }, toast, /* @__PURE__ */ React.createElement("button", { "aria-label": t("close"), onClick: () => setToast(null) }, /* @__PURE__ */ React.createElement(X, { size: 14 }))), modal?.type === "confirm" && /* @__PURE__ */ React.createElement(Modal, { title: t("criterionConflict"), onClose: () => setModal(null) }, /* @__PURE__ */ React.createElement("p", null, modal.text), modal.extra && /* @__PURE__ */ React.createElement("pre", { className: "confirmation-list" }, modal.extra), /* @__PURE__ */ React.createElement("div", { className: "modal-actions" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setModal(null) }, t("cancel")), /* @__PURE__ */ React.createElement("button", { className: "primary", onClick: () => {
    const action = modal.action;
    setModal(null);
    action();
  } }, t("apply"))))));
}
export {
  LANG_LABELS,
  PicoEditor,
  S as SCHEMA_VERSION,
  V as VERSION,
  importPrompt,
  A as isLegacyDocument,
  B as legacy,
  migrateDocument,
  E as newDocument,
  pendingCount,
  previewHtml,
  F as toMarkdown,
  translate,
  G as validateDocument,
  warnings
};

// ── SAYCAP shared config + data ───────────────────────────────────────────────
// Single source of truth for the backend contract and language/mode data.
// The backend (saycap-backend/app.py) accepts a multipart POST to /generate with:
//   file, fileName, sourceLanguage (e.g. "te-IN"), translationFormat, wordsPerCaption
// and returns a plain-text .srt. There is NO VTT — SRT only.

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.server.unikbiz.com";

// ── Languages ────────────────────────────────────────────────────────────────
export interface Lang {
  code: string;        // Sarvam language_code sent as `sourceLanguage`
  name: string;
  native: string;
  mix: string;         // friendly name for the code-mix mode (Tenglish, Hinglish…)
  scriptFonts: string[]; // Noto fonts that render this script (for the preview)
}

export const LANGS: Lang[] = [
  { code: "te-IN", name: "Telugu",       native: "తెలుగు",      mix: "Tenglish", scriptFonts: ["Noto Sans Telugu", "Noto Serif Telugu"] },
  { code: "hi-IN", name: "Hindi",        native: "हिन्दी",       mix: "Hinglish", scriptFonts: ["Noto Sans Devanagari", "Noto Serif Devanagari"] },
  { code: "ta-IN", name: "Tamil",        native: "தமிழ்",        mix: "Tanglish", scriptFonts: ["Noto Sans Tamil", "Noto Serif Tamil"] },
  { code: "kn-IN", name: "Kannada",      native: "ಕನ್ನಡ",        mix: "Kanglish", scriptFonts: ["Noto Sans Kannada", "Noto Serif Kannada"] },
  { code: "ml-IN", name: "Malayalam",    native: "മലയാളം",      mix: "Manglish", scriptFonts: ["Noto Sans Malayalam", "Noto Serif Malayalam"] },
  { code: "mr-IN", name: "Marathi",      native: "मराठी",        mix: "Minglish", scriptFonts: ["Noto Sans Devanagari", "Noto Serif Devanagari"] },
  { code: "bn-IN", name: "Bengali",      native: "বাংলা",        mix: "Benglish", scriptFonts: ["Noto Sans Bengali", "Noto Serif Bengali"] },
  { code: "gu-IN", name: "Gujarati",     native: "ગુજરાતી",      mix: "Gujlish",  scriptFonts: ["Noto Sans Gujarati", "Noto Serif Gujarati"] },
  { code: "pa-IN", name: "Punjabi",      native: "ਪੰਜਾਬੀ",       mix: "Punglish", scriptFonts: ["Noto Sans Gurmukhi"] },
  { code: "od-IN", name: "Odia",         native: "ଓଡ଼ିଆ",        mix: "Odlish",   scriptFonts: ["Noto Sans Oriya"] },
  { code: "en-IN", name: "English (IN)", native: "Indian accent", mix: "English (IN)", scriptFonts: [] },
];

export const LATIN_FONTS = ["Inter", "Poppins", "Montserrat", "Oswald", "Anton"];

// ── Output modes ───────────────────────────────────────────────────────────────
// `apiValue` is what the backend's translationFormat expects.
export interface Mode {
  id: string;
  apiValue: string;
  name: string;
  desc: string;
  ex: string;
  dot: string;
}

export const MODES: Mode[] = [
  { id: "phonetic", apiValue: "phonetic",   name: "Phonetic", desc: "Roman letters, sounds as spoken. Best for audiences who can't read native script.", ex: '"నమస్తే" → "Namaste"',           dot: "#C8C8C8" },
  { id: "native",   apiValue: "transcribe", name: "Native",   desc: "Original language script, properly formatted. Best for formal content.",              ex: '"Hello" → "హలో"',                dot: "#888" },
  { id: "codemix",  apiValue: "codemix",    name: "Codemix",  desc: "Native words in native script, English in English. Exactly how mixed speech is written.", ex: '"నేను recently వెళ్ళాను"',         dot: "#666" },
  { id: "english",  apiValue: "translate",  name: "English",  desc: "Full meaning-for-meaning translation to English. Best for global reach.",              ex: '"నేను కష్టపడ్డాను" → "I worked hard"', dot: "#444" },
];

// ── Caption density (wordsPerCaption) ────────────────────────────────────────────
export const DENSITIES: { val: number; label: string; short: string }[] = [
  { val: 0, label: "Natural (breaks at speech pauses)", short: "Natural" },
  { val: 1, label: "1 word per caption",  short: "1 word" },
  { val: 2, label: "2 words per caption", short: "2 words" },
  { val: 3, label: "3 words per caption", short: "3 words" },
];

// ── File types ─────────────────────────────────────────────────────────────────
export const AUDIO_EXTS = [".mp3", ".m4a"];
export const VIDEO_EXTS = [".mp4", ".mov", ".m4v"];
export const ACCEPT_ATTR =
  ".mp3,.m4a,.mp4,.mov,.m4v,audio/mpeg,audio/mp4,video/mp4,video/quicktime";

export function extOf(name: string): string {
  return "." + (name.split(".").pop() || "").toLowerCase();
}
export function isVideo(name: string): boolean {
  return VIDEO_EXTS.includes(extOf(name));
}
export function isSupported(name: string): boolean {
  return [...AUDIO_EXTS, ...VIDEO_EXTS].includes(extOf(name));
}

// ── SRT parsing (for the live video preview overlay) ─────────────────────────────
export interface Cue { start: number; end: number; text: string; }

function srtTimeToSec(t: string): number {
  const m = t.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!m) return 0;
  return +m[1] * 3600 + +m[2] * 60 + +m[3] + +m[4] / 1000;
}

export function parseSRT(srt: string): Cue[] {
  const cues: Cue[] = [];
  for (const block of srt.replace(/\r/g, "").trim().split(/\n\s*\n/)) {
    const lines = block.split("\n");
    const arrowIdx = lines.findIndex((l) => l.includes("-->"));
    if (arrowIdx === -1) continue;
    const [start, end] = lines[arrowIdx].split("-->");
    const text = lines.slice(arrowIdx + 1).join("\n").trim();
    if (!text) continue;
    cues.push({ start: srtTimeToSec(start), end: srtTimeToSec(end), text });
  }
  return cues;
}

// Lazily inject a Google font <link> once.
const loadedFonts = new Set<string>();
export function loadGoogleFont(name: string) {
  if (typeof document === "undefined" || loadedFonts.has(name)) return;
  loadedFonts.add(name);
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=" +
    name.replace(/ /g, "+") +
    ":wght@400;700&display=swap";
  document.head.appendChild(link);
}

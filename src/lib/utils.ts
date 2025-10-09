import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlightJsonString(rawText: string): string {
  const escaped = escapeHtml(rawText);
  const tokenRegex =
    /(\btrue\b|\bfalse\b|\bnull\b)|("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  return escaped.replace(tokenRegex, (_m, boolLit, strLit, maybeColon, numLit) => {
    if (boolLit) return `<span class="text-emerald-600">${boolLit}</span>`;
    if (numLit) return `<span class="text-purple-700">${numLit}</span>`;
    if (strLit) {
      if (maybeColon) {
        return `<span class="text-sky-700">${strLit}</span>${maybeColon}`;
      }
      return `<span class="text-rose-700">${strLit}</span>`;
    }
    return _m;
  });
}

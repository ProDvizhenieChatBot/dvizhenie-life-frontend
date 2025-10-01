import React, { useMemo, useRef, useCallback } from 'react';
import { highlightJsonString } from '@/lib/utils';

type JsonEditorProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  rows?: number;
  errorRanges?: Array<{ line: number; message: string }>;
};

const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  className,
  placeholder,
  rows = 14,
  errorRanges,
}) => {
  const highlighted = useMemo(() => highlightJsonString(value), [value]);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const lineErrors = useMemo(() => {
    const map = new Map<number, string[]>();
    errorRanges?.forEach((e) => {
      const arr = map.get(e.line) ?? [];
      arr.push(e.message);
      map.set(e.line, arr);
    });
    return map;
  }, [errorRanges]);

  const withLineBackgrounds = useMemo(() => {
    const lines = highlighted.split('\n');
    return lines
      .map((line, idx) => {
        const lineNo = idx + 1;
        const hasError = lineErrors?.has(lineNo);
        const marker = hasError ? ' bg-red-100/70' : '';
        const ln = `<span class="pr-3 text-xs text-muted-foreground select-none inline-block text-right tabular-nums" style="width:var(--ce-gutter);">${lineNo}</span>`;
        return `<div class="h-[1.25rem] leading-[1.25rem]${marker} tabular-nums">${ln}<span>${line || '&nbsp;'}</span></div>`;
      })
      .join('');
  }, [highlighted, lineErrors]);

  const handleScroll = useCallback(() => {
    if (overlayRef.current && textareaRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  return (
    <div
      className={`relative font-mono max-h-96 overflow-hidden ${className ?? ''}`}
      style={{ ['--ce-gutter' as unknown as string]: '2rem' }}
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none select-none whitespace-pre bg-muted/30 rounded-md p-3 text-sm overflow-auto"
        aria-hidden
        role="region"
        aria-label="JSON editor preview"
        dangerouslySetInnerHTML={{ __html: withLineBackgrounds }}
      />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const target = e.currentTarget;
            const start = target.selectionStart ?? 0;
            const end = target.selectionEnd ?? 0;
            const hasSelection = end > start;
            const currentValue = target.value;

            if (e.shiftKey) {
              const before = currentValue.slice(0, start);
              const after = currentValue.slice(end);
              const lineStart = before.lastIndexOf('\n') + 1;
              const fullSelStart = lineStart;
              const fullSelection = currentValue.slice(fullSelStart, end);
              const unindented = fullSelection.replace(/(^|\n)( {1,2})/g, '$1');
              const newValue = currentValue.slice(0, fullSelStart) + unindented + after;
              const delta = fullSelection.length - unindented.length;
              onChange(newValue);
              const newStart = Math.max(
                start -
                  Math.min(
                    2,
                    currentValue.slice(lineStart, start).match(/^ {1,2}/)?.[0]?.length ?? 0,
                  ),
                fullSelStart,
              );
              const newEnd = end - delta;
              requestAnimationFrame(() => {
                target.selectionStart = newStart;
                target.selectionEnd = newEnd;
              });
            } else if (hasSelection) {
              const before = currentValue.slice(0, start);
              const after = currentValue.slice(end);
              const lineStart = before.lastIndexOf('\n') + 1;
              const fullSelStart = lineStart;
              const fullSelection = currentValue.slice(fullSelStart, end);
              const indented = fullSelection.replace(/(^|\n)/g, '$1  ');
              const newValue = currentValue.slice(0, fullSelStart) + indented + after;
              onChange(newValue);
              const added = indented.length - fullSelection.length;
              requestAnimationFrame(() => {
                target.selectionStart = start + 2;
                target.selectionEnd = end + added;
              });
            } else {
              const newValue = currentValue.slice(0, start) + '  ' + currentValue.slice(end);
              onChange(newValue);
              requestAnimationFrame(() => {
                target.selectionStart = target.selectionEnd = start + 2;
              });
            }
          }
        }}
        onScroll={handleScroll}
        placeholder={placeholder}
        aria-label={placeholder || 'JSON editor'}
        rows={rows}
        className="relative z-10 block w-full h-full bg-transparent text-transparent caret-black dark:caret-white outline-none resize-none rounded-md p-3 text-sm leading-[1.25rem] whitespace-pre overflow-auto"
        spellCheck={false}
        style={{
          WebkitTextFillColor: 'transparent',
          paddingLeft: 'calc(0.75rem + var(--ce-gutter))',
          tabSize: 2 as unknown as string,
        }}
      />
    </div>
  );
};

export default JsonEditor;

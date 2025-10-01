import React from 'react';
import { highlightJsonString } from '@/lib/utils';

type JsonViewerProps = {
  value: unknown;
  className?: string;
};

const JsonViewer: React.FC<JsonViewerProps> = ({ value, className }) => {
  let formatted = '';
  try {
    formatted = JSON.stringify(value, null, 2);
  } catch {
    formatted = String(value);
  }

  const highlighted = highlightJsonString(formatted);

  return (
    <div
      className={`bg-muted/30 rounded-md flex-1 overflow-auto text-sm max-h-96 ${className ?? ''}`}
      role="region"
      aria-label="JSON viewer"
      style={{ ['--ce-gutter' as unknown as string]: '2rem' }}
    >
      <pre className="whitespace-pre overflow-auto p-3">
        <code
          dangerouslySetInnerHTML={{
            __html: highlighted
              .split('\n')
              .map((line, idx) => {
                const ln = `<span class="pr-3 text-xs text-muted-foreground select-none inline-block text-right tabular-nums" style="width:var(--ce-gutter);">${idx + 1}</span>`;
                return `${ln}<span>${line || '&nbsp;'}</span>`;
              })
              .join('\n'),
          }}
        />
      </pre>
    </div>
  );
};

export default JsonViewer;

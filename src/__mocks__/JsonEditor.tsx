import React from 'react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  rows?: number;
  errorRanges?: Array<{ line: number; message: string }>;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ value, onChange }) => {
  return (
    <textarea
      role="textbox"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid="json-editor"
    />
  );
};

export default JsonEditor;

'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: 'text' | 'select';
  options?: { value: string; label: string }[];
  className?: string;
}

export default function InlineEdit({
  value,
  onSave,
  type = 'text',
  options = [],
  className = '',
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (editValue === value) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error);
      setEditValue(value); // Revert on error
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <span
        onClick={() => setIsEditing(true)}
        className={`cursor-pointer hover:bg-gray-100 rounded px-2 py-1 transition-colors ${className}`}
        title="Click to edit"
      >
        {value}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {type === 'text' ? (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          disabled={saving}
          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        />
      ) : (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSave}
          disabled={saving}
          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="p-1 text-green-600 hover:bg-green-50 rounded"
        title="Save"
      >
        <Check className="w-4 h-4" />
      </button>

      <button
        onClick={handleCancel}
        disabled={saving}
        className="p-1 text-red-600 hover:bg-red-50 rounded"
        title="Cancel"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

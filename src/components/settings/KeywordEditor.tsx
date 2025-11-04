'use client';
import { useState } from 'react';
export default function KeywordEditor({
  keywords,
  onChange,
}: {
  keywords: string[];
  onChange: (kw: string[]) => void;
}) {
  const [value, setValue] = useState('');

  function add() {
    const v = value.trim();
    if (!v) return;
    onChange(Array.from(new Set([...(keywords || []), v])));
    setValue('');
  }

  function remove(k: string) {
    onChange((keywords || []).filter(x => x !== k));
  }

  return (
    <div className='grid gap-3'>
      <div className='grid grid-cols-[1fr_auto] gap-2'>
        <inputclassName='h-10 rounded-md border px-3'
          placeholder='أدخل كلمة طوارئ'
          value={value}
          onChange={(e) => setValue(e.target.value)} aria-label="أدخل كلمة طوارئ"
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <buttonclassName='h-10 rounded-md border px-3'
          onClick={add} onKeyDown={(e) = aria-label="Button"> { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); add } }}
          aria-label='Button'
        >
          إضافة
        </button>
      </div>
      <div className='flex flex-wrap gap-2'>
        {(keywords || []).map(k => (
          <span
            key={k}
            className='inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-800 px-3 h-8 text-sm'
          >
            {k}
            <buttonclassName='text-amber-900'
              onClick={() => { remove(k)} aria-label="Button" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); () aria-label="Button" remove(k) } }}
              aria-label='حذف الكلمة'
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

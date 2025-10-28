'use client';

import * as React from 'react';

export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span className='hs-tooltip inline-block'>
      <span className='hs-tooltip-toggle inline-block cursor-default'>
        {children}
      </span>
      <span className='hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 invisible transition px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-sm'>
        {label}
      </span>
    </span>
  );
}

export default Tooltip;

import React from "react";

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
}

export function __ScreenReaderOnly({ children }: ScreenReaderOnlyProps) {
  return <span className="sr-only">{children}</span>;
}

export default ScreenReaderOnly;

import * as L from "lucide-react";

export type IconName = keyof typeof L;

export default function Icon({ name, size = 18, className = "" }: { name: IconName; size?: number; className?: string }) {
  const Cmp = L[name] as unknown as React.ComponentType<{ size?: number; className?: string }>;
  if (!Cmp) return null as any;
  return <Cmp size={size} className={className} />;
}
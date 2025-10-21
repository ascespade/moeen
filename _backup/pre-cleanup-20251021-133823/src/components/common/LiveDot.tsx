export default function LiveDot({ color = '#16A34A' }: { color?: string }) {
  return (
    <span className='relative inline-flex h-2.5 w-2.5'>
      <span
        className='absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping'
        style={{ backgroundColor: color }}
      />
      <span
        className='relative inline-flex rounded-full h-2.5 w-2.5'
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

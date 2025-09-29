export default function Header() {
  return (
    <header className="h-14 border-b grid grid-cols-[1fr_auto] items-center px-4">
      <input className="h-9 w-full max-w-md rounded-md border px-3" placeholder="بحث عام" />
      <div className="flex items-center gap-2">
        <button className="h-9 rounded-md border px-3">محادثة جديدة</button>
        <div className="h-9 w-9 rounded-full bg-gray-200" />
      </div>
    </header>
  );
}


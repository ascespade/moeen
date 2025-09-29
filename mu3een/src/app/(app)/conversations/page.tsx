"use client";

import { useState } from "react";

type Message = { id: string; from: "customer" | "agent" | "ai"; text: string; ts: string };

type Conversation = { id: string; title: string; status: "open" | "pending" | "closed"; messages: Message[] };

const seed: Conversation[] = [
  {
    id: "c1",
    title: "سؤال عن المنتج",
    status: "open",
    messages: [
      { id: "m1", from: "customer", text: "مرحبا، لدي استفسار.", ts: new Date().toISOString() },
      { id: "m2", from: "agent", text: "أهلاً بك! كيف أستطيع المساعدة؟", ts: new Date().toISOString() },
    ],
  },
];

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>(seed);
  const [activeId, setActiveId] = useState<string>(seed[0]?.id || "");
  const [input, setInput] = useState("");

  const active = conversations.find((c) => c.id === activeId);

  function send() {
    if (!input.trim() || !active) return;
    const newMsg: Message = { id: Math.random().toString(36).slice(2), from: "agent", text: input.trim(), ts: new Date().toISOString() };
    setConversations((prev) => prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, newMsg] } : c)));
    setInput("");
  }

  async function aiReply() {
    const res = await fetch("/api/ai/respond", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: active?.messages || [], provider: "gemini" }) });
    const data = await res.json();
    if (active) {
      const aiMsg: Message = { id: Math.random().toString(36).slice(2), from: "ai", text: data.message || "رد آلي (placeholder)", ts: new Date().toISOString() };
      setConversations((prev) => prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, aiMsg] } : c)));
    }
  }

  return (
    <main className="p-6 grid gap-4 grid-cols-1 lg:grid-cols-[320px_1fr_320px]">
      <aside className="rounded-xl border p-4 grid gap-3">
        <input className="h-10 rounded-md border px-3" placeholder="بحث" />
        <div className="grid gap-2">
          {conversations.map((c) => (
            <button key={c.id} className={`text-start rounded-md border p-3 ${c.id === activeId ? "bg-gray-900 text-white" : "hover:bg-gray-50 dark:hover:bg-white/10"}`} onClick={() => setActiveId(c.id)}>
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-gray-500">{c.status}</div>
            </button>
          ))}
        </div>
      </aside>

      <section className="rounded-xl border grid grid-rows-[1fr_auto]">
        <div className="p-4 overflow-y-auto max-h-[60dvh] space-y-3">
          {active?.messages.map((m) => (
            <div key={m.id} className={`max-w-[85%] rounded-lg p-3 ${m.from === "customer" ? "bg-gray-100" : m.from === "agent" ? "bg-blue-100" : "bg-emerald-100"}`}>
              <div className="text-xs text-gray-500 mb-1">{m.from} • {new Date(m.ts).toLocaleTimeString()}</div>
              <div>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="border-t p-3 grid grid-cols-[auto_1fr_auto] items-center gap-2">
          <button className="h-10 rounded-md border px-3">رفع ملف</button>
          <input className="h-10 rounded-md border px-3" placeholder="اكتب رسالة" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
          <div className="flex items-center gap-2">
            <button className="h-10 rounded-md border px-3" onClick={aiReply}>رد ذكي</button>
            <button className="h-10 rounded-md bg-gray-900 text-white px-4" onClick={send}>إرسال</button>
          </div>
        </div>
      </section>

      <aside className="rounded-xl border p-4 grid gap-4">
        <div>
          <div className="font-medium mb-1">بيانات العميل</div>
          <div className="text-sm text-gray-500">اسم، رقم واتساب، آخر تفاعل</div>
        </div>
        <div>
          <div className="font-medium mb-1">خصائص المحادثة</div>
          <div className="text-sm text-gray-500">حالة، أولوية، وسم</div>
        </div>
      </aside>
    </main>
  );
}


"use client";

import { useMemo, useState, useEffect } from "react";
import EmptyState from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui";

type Message = {
  id: string;
  from: "customer" | "agent" | "ai";
  text: string;
  ts: string;
};

type Conversation = {
  id: string;
  title: string;
  status: "open" | "pending" | "closed";
  messages: Message[];
};

const seed: Conversation[] = [
  {
    id: "c1",
    title: "سؤال عن المنتج",
    status: "open",
    messages: [
      {
        id: "m1",
        from: "customer",
        text: "مرحبا، لدي استفسار.",
        ts: new Date().toISOString(),
      },
      {
        id: "m2",
        from: "agent",
        text: "أهلاً بك! كيف أستطيع المساعدة؟",
        ts: new Date().toISOString(),
      },
    ],
  },
];

export default function ConversationsPage() {
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);
  const [conversations, setConversations] = useState<Conversation[]>(seed);
  const [activeId, setActiveId] = useState<string>(seed[0]?.id || "");
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignedFilter, setAssignedFilter] = useState<string>("all");

  const active = conversations.find((c) => c.id === activeId);

  function send() {
    if (!input.trim() || !active) return;
    const newMsg: Message = {
      id: Math.random().toString(36).slice(2),
      from: "agent",
      text: input.trim(),
      ts: new Date().toISOString(),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id ? { ...c, messages: [...c.messages, newMsg] } : c,
      ),
    );
    setInput("");
  }

  async function aiReply() {
    const res = await fetch("/api/ai/respond", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: active?.messages || [],
        provider: "gemini",
      }),
    });
    const data = await res.json();
    if (active) {
      const aiMsg: Message = {
        id: Math.random().toString(36).slice(2),
        from: "ai",
        text: data.message || "رد آلي (placeholder)",
        ts: new Date().toISOString(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === active.id ? { ...c, messages: [...c.messages, aiMsg] } : c,
        ),
      );
    }
  }

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      const qok = c.title.includes(query);
      const sok =
        statusFilter === "all" ||
        c.status === (statusFilter as Conversation["status"]);
      return qok && sok;
    });
  }, [conversations, query, statusFilter]);

  return (
    <main className="min-h-screen bg-[var(--brand-surface)]">
      <div className="container-app py-6">
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-[320px_1fr_320px]">
          <aside className="card p-4 grid gap-3">
            <input
              className="form-input"
              placeholder="بحث"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                className="form-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">كل الحالات</option>
                <option value="open">مفتوحة</option>
                <option value="pending">قيد الانتظار</option>
                <option value="closed">مغلقة</option>
              </select>
              <select
                className="form-input"
                value={assignedFilter}
                onChange={(e) => setAssignedFilter(e.target.value)}
              >
                <option value="all">كل المعينين</option>
                <option value="me">معي</option>
              </select>
            </div>
            {loading ? (
              <div className="grid gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <EmptyState
                title="لا توجد محادثات"
                description="غيّر المرشحات أو ابدأ محادثة جديدة."
              />
            ) : (
              <div className="grid gap-2">
                {filtered.map((c) => (
                  <button
                    key={c.id}
                    className={`text-start card card-interactive p-3 ${c.id === activeId ? "bg-[var(--brand-primary)] text-white" : ""}`}
                    onClick={() => setActiveId(c.id)}
                  >
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-gray-500">{c.status}</div>
                  </button>
                ))}
              </div>
            )}
          </aside>

          <section className="card grid grid-rows-[1fr_auto]">
            <div className="p-4 overflow-y-auto max-h-[60dvh] space-y-3">
              {active?.messages.map((m) => (
                <div
                  key={m.id}
                  className={`max-w-[85%] rounded-lg p-3 ${m.from === "customer" ? "bg-surface" : m.from === "agent" ? "bg-[var(--brand-accent)]/10" : "bg-[var(--brand-success)]/10"}`}
                >
                  <div className="text-xs text-gray-500 mb-1">
                    {m.from} • {new Date(m.ts).toLocaleTimeString()}
                  </div>
                  <div>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="border-t p-3 grid grid-cols-[auto_1fr_auto_auto] items-center gap-2">
              <button className="btn btn-outline btn-sm">رفع ملف</button>
              <input
                className="form-input"
                placeholder="اكتب رسالة"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
              <div className="flex items-center gap-2">
                <button className="btn btn-outline btn-sm" onClick={aiReply}>
                  رد ذكي
                </button>
                <button className="btn btn-brand btn-sm" onClick={send}>
                  إرسال
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-outline btn-sm">
                  إعادة تفعيل البوت
                </button>
                <button className="btn btn-outline btn-sm">
                  إغلاق المحادثة
                </button>
              </div>
            </div>
          </section>

          <aside className="card p-4 grid gap-4">
            <div>
              <div className="font-medium mb-1">بيانات العميل</div>
              <div className="text-sm text-gray-500">
                اسم، رقم واتساب، آخر تفاعل
              </div>
            </div>
            <div>
              <div className="font-medium mb-1">خصائص المحادثة</div>
              <div className="text-sm text-gray-500">حالة، أولوية، وسم</div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

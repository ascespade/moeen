"use client";
import React, { useEffect, useMemo, useState } from "react";

type ProgressLine = {
  time: string;
  module: string;
  attempt: number;
  percent: number;
  status: "ok" | "failed" | "retrying";
};

type ProgressResponse = {
  time: string;
  lastUpdate: string | null;
  count: number;
  modules: Record<string, { percent: number; attempts: number; status: string; lastTime: string }>;
  lines: ProgressLine[];
};

export default function ProgressPage() {
  const [data, setData] = useState<ProgressResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    const fetcher = async () => {
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        const json = (await res.json()) as ProgressResponse;
        setData(json);
        setError(null);
      } catch (e: any) {
        setError(e?.message || "Failed to load progress");
      }
    };
    fetcher();
    timer = setInterval(fetcher, 5000);
    return () => clearInterval(timer);
  }, []);

  const rows = useMemo(() => {
    const entries = Object.entries(data?.modules || {});
    entries.sort((a, b) => a[0].localeCompare(b[0]));
    return entries;
  }, [data]);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Full Suite Progress Monitor</h1>
      <p style={{ color: "#666" }}>Updated: {data?.time || "--"} | Last event: {data?.lastUpdate || "--"}</p>
      {error && <div style={{ color: "#b91c1c", marginTop: 8 }}>{error}</div>}

      <div style={{ marginTop: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Module</th>
              <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Percent</th>
              <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Attempts</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Status</th>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Last Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, v]) => (
              <tr key={name}>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{name}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>{v.percent}%</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", textAlign: "right" }}>{v.attempts}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{v.status}</td>
                <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>{v.lastTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Recent Events</h2>
        <div style={{ marginTop: 8, maxHeight: 300, overflow: "auto", border: "1px solid #eee", padding: 8 }}>
          {(data?.lines || []).slice().reverse().map((l, i) => (
            <div key={i} style={{ fontFamily: "monospace", fontSize: 12 }}>
              {JSON.stringify(l)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

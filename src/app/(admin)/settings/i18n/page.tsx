"use client";

import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table'

type Row = { id: number; locale: 'ar'|'en'; namespace: string; key: string; value: string }

export default function I18nManagerPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [filter, setFilter] = useState('')
  const [locale, setLocale] = useState<'ar'|'en'>('ar')
  const [form, setForm] = useState({ key: '', value: '', namespace: 'common' })
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    const res = await fetch('/api/i18n/admin', { cache: 'no-store' })
    const json = await res.json()
    setRows(json.data || [])
  }

  useEffect(() => { refresh() }, [])

  const onSave = async () => {
    if (!form.key || !form.value) return
    setLoading(true)
    await fetch('/api/i18n/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale, namespace: form.namespace, key: form.key, value: form.value })
    })
    setForm({ key: '', value: '', namespace: 'common' })
    await refresh()
    setLoading(false)
  }

  const onDelete = async (id: number) => {
    setLoading(true)
    await fetch(`/api/i18n/admin?id=${id}`, { method: 'DELETE' })
    await refresh()
    setLoading(false)
  }

  const filtered = useMemo(() => rows.filter(r =>
    (!filter || r.key.includes(filter) || r.value.includes(filter))
  ), [rows, filter])

  const arKeys = new Set(filtered.filter(r => r.locale==='ar').map(r=>`${r.namespace}:${r.key}`))
  const enKeys = new Set(filtered.filter(r => r.locale==='en').map(r=>`${r.namespace}:${r.key}`))
  const missingInAr = [...enKeys].filter(k=>!arKeys.has(k))
  const missingInEn = [...arKeys].filter(k=>!enKeys.has(k))

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6 grid gap-6">
      <div className="grid md:grid-cols-4 gap-3">
        <Input placeholder="بحث في المفاتيح/القيم" value={filter} onChange={e=>setFilter(e.target.value)} />
        <select className="border rounded-md px-3" value={locale} onChange={e=>setLocale(e.target.value as any)}>
          <option value="ar">ar</option>
          <option value="en">en</option>
        </select>
        <Input placeholder="namespace" value={form.namespace} onChange={e=>setForm({...form, namespace:e.target.value})} />
        <div />
        <Input placeholder="key" value={form.key} onChange={e=>setForm({...form, key:e.target.value})} />
        <Input placeholder="value" value={form.value} onChange={e=>setForm({...form, value:e.target.value})} />
        <Button onClick={onSave} disabled={loading}>حفظ/تحديث</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-brand-border p-4">
          <div className="font-semibold mb-2">مفقود بالعربية ({missingInAr.length})</div>
          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc ps-5">
            {missingInAr.map(k=> (<li key={k}>{k}</li>))}
          </ul>
        </div>
        <div className="rounded-xl border border-brand-border p-4">
          <div className="font-semibold mb-2">مفقود بالإنجليزية ({missingInEn.length})</div>
          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc ps-5">
            {missingInEn.map(k=> (<li key={k}>{k}</li>))}
          </ul>
        </div>
      </div>

      <Table>
        <THead>
          <TR>
            <TH>id</TH><TH>locale</TH><TH>ns</TH><TH>key</TH><TH>value</TH><TH></TH>
          </TR>
        </THead>
        <TBody>
          {filtered.map(r => (
            <TR key={r.id}>
              <TD>{r.id}</TD>
              <TD>{r.locale}</TD>
              <TD>{r.namespace}</TD>
              <TD className="font-mono">{r.key}</TD>
              <TD>{r.value}</TD>
              <TD><Button variant="secondary" onClick={()=>onDelete(r.id)} disabled={loading}>حذف</Button></TD>
            </TR>
          ))}
        </TBody>
      </Table>
    </div>
  )
}


import { useState } from 'react'
import { createIssue } from '../api/issues'
export default function IssueForm({ cats, uid, onDone }) {
  const [f, setF] = useState({ title: '', description: '', address: '', category_id: '' }), [file, setFile] = useState(null), [ll, setLl] = useState(null), [msg, setMsg] = useState(''), [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const gps = () => navigator.geolocation ? navigator.geolocation.getCurrentPosition((p) => { const l = [p.coords.latitude, p.coords.longitude]; setLl(l); setF((v) => ({ ...v, address: v.address || l.map((n) => n.toFixed(5)).join(', ') })); setMsg('Location added') }, () => setMsg('Location not available')) : setMsg('Location not supported')
  const submit = async (e) => {
    e.preventDefault(); if (!f.title.trim()) return setMsg('Please add a title'); setBusy(true)
    try { await createIssue({ ...f, category_id: +(f.category_id || cats[0]?.id) || null, lat: ll?.[0], lng: ll?.[1] }, file, uid); setF({ title: '', description: '', address: '', category_id: '' }); setFile(null); setLl(null); setMsg(''); e.target.reset(); onDone?.() } catch (err) { setMsg(err.message) }
    setBusy(false)
  }
  return (
    <form onSubmit={submit} className="card">
      <label className="lbl">Title</label><input className="inp" value={f.title} onChange={set('title')} maxLength={80} />
      <label className="lbl">Type</label><select className="inp" value={f.category_id || cats[0]?.id || ''} onChange={set('category_id')}>{cats.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select>
      <label className="lbl">Details</label><textarea className="inp" rows={3} value={f.description} onChange={set('description')} maxLength={500} />
      <label className="lbl">Place / landmark</label><input className="inp" value={f.address} onChange={set('address')} maxLength={120} />
      <button type="button" className="btn alt w mt-3" onClick={gps}>📍 Use my location</button>
      <label className="lbl">Photo</label><input className="inp" type="file" accept="image/*" capture="environment" onChange={(e) => setFile(e.target.files[0])} />
      <button className="btn w mt-4" disabled={busy}>{busy ? 'Submitting…' : 'Submit report'}</button>
      {msg && <p className="mt-2 font-semibold text-pri">{msg}</p>}
    </form>
  )
}

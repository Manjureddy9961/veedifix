export const ST = ['new', 'assigned', 'progress', 'fixed']
export const SL = { new: 'Reported', assigned: 'Assigned', progress: 'In progress', fixed: 'Fixed' }
export const SE = { new: '🆕', assigned: '👷', progress: '🛠️', fixed: '✅' }
const COL = { new: '#ff9f43', assigned: '#8b5cf6', progress: '#0ea5e9', fixed: '#00b884' }
const CH = { new: 'bg-orange-100 text-orange-900', assigned: 'bg-violet-100 text-violet-800', progress: 'bg-sky-100 text-sky-900', fixed: 'bg-emerald-100 text-emerald-900' }
export function Stats({ list }) {
  const c = (s) => list.filter((x) => x.status === s).length
  const d = [['📊', 'Total', list.length, '#6c5ce7'], ['⏳', 'Pending', c('new') + c('assigned'), '#ff9f43'], ['🛠️', 'In progress', c('progress'), '#0ea5e9'], ['✅', 'Fixed', c('fixed'), '#00b884']]
  return <div className="grid grid-cols-4 gap-2 mb-3">{d.map(([e, l, n, col], i) => <div key={l} className="card !p-2 !mb-0 text-center" style={{ borderTop: `4px solid ${col}`, animationDelay: `${i * 70}ms` }}><div className="text-lg">{e}</div><b className="block text-xl" style={{ color: col }}>{n}</b><span className="text-xs text-slate-500">{l}</span></div>)}</div>
}
export default function IssueCard({ x, i = 0, onUp, onStatus, onDel }) {
  const c = x.categories || {}, n = ST.indexOf(x.status)
  return (
    <div className="card" style={{ borderLeft: `5px solid ${COL[x.status]}`, animationDelay: `${Math.min(i, 8) * 60}ms` }}>
      <div className="flex gap-3">
        {x.photo_url ? <img src={x.photo_url} alt="" loading="lazy" className="w-20 h-20 shrink-0 rounded-xl object-cover" /> : <div className="w-20 h-20 shrink-0 rounded-xl bg-gradient-to-br from-pri to-pri2 grid place-items-center text-4xl">{c.icon || '📌'}</div>}
        <div className="min-w-0">
          <h3 className="font-bold">{x.title}</h3>
          <div className="text-sm text-slate-500">{c.icon} {c.name || 'Other'} · 📍 {x.address || '—'} · 🗓️ {new Date(x.created_at).toLocaleDateString()}{x.profiles?.email && ` · ✉️ ${x.profiles.email}`}</div>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-bold ${CH[x.status]}`}>{SE[x.status]} {SL[x.status]}</span>
        </div>
      </div>
      {x.description && <p className="text-sm text-slate-600 mt-2">{x.description}</p>}
      <div className="flex gap-1 my-2">{ST.map((s, k) => <i key={k} className={`flex-1 h-2 rounded-full ${k <= n ? 'bar' : 'bg-slate-200'}`} style={k <= n ? { background: COL[x.status], animationDelay: `${k * 120}ms` } : undefined} />)}</div>
      <div className="flex flex-wrap items-center gap-2">
        {onStatus && <select className="inp auto" value={x.status} onChange={(e) => onStatus(x.id, e.target.value)}>{ST.map((s) => <option key={s} value={s}>{SE[s]} {SL[s]}</option>)}</select>}
        {onUp && <button key={x.upvotes} className="pill2 pop" onClick={() => onUp(x.id)}>👍 {x.upvotes}</button>}
        {x.lat && <a className="pill2 text-pri" target="_blank" rel="noreferrer" href={`https://maps.google.com/?q=${x.lat},${x.lng}`}>🗺️ Map</a>}
        {onDel && <button className="pill2 danger" onClick={() => confirm('Delete this issue?') && onDel(x.id)}>🗑️ Delete</button>}
      </div>
    </div>
  )
}
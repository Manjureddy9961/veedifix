import { useEffect, useState } from 'react'
import Shell from '../components/Shell'
import Tabs from '../components/Tabs'
import IssueCard, { Stats } from '../components/IssueCard'
import IssueForm from '../components/IssueForm'
import { useAuth } from '../context/AuthContext'
import { listIssues, setStatus, deleteIssue } from '../api/issues'
import { listCategories, addCategory, deleteCategory, listUsers, setRole } from '../api/admin'
const ICONS = ['🚧', '🛣️', '🚰', '🔌', '🌳', '🐕', '🕳️', '💧', '💡', '🗑️', '🌊', '📌']
export default function AdminHome() {
  const { user } = useAuth(), [tab, setTab] = useState('issues'), [issues, setIssues] = useState([]), [cats, setCats] = useState([]), [users, setUsers] = useState([]), [nc, setNc] = useState(''), [ic, setIc] = useState('🚧'), [err, setErr] = useState('')
  const load = async () => { try { setIssues(await listIssues()); setCats(await listCategories()); setUsers(await listUsers()) } catch (e) { setErr(e.message) } }
  useEffect(() => { load() }, [])
  const run = (fn) => async (...a) => { try { setErr(''); await fn(...a); await load() } catch (e) { setErr(e.message) } }
  const count = (id) => issues.filter((x) => x.user_id === id).length
  return (
    <Shell title="🛡️ Admin panel">
      <Tabs value={tab} onChange={setTab} tabs={[['issues', `📋 Issues (${issues.length})`], ['add', '➕ Add issue'], ['groups', `🗂️ Groups (${cats.length})`], ['users', `👥 Users (${users.length})`]]} />
      {err && <p className="mb-2 font-semibold text-red-600">{err}</p>}
      {tab === 'issues' && <><Stats list={issues} />{issues.map((x, i) => <IssueCard key={x.id} i={i} x={x} onStatus={run(setStatus)} onDel={run(deleteIssue)} />)}</>}
      {tab === 'add' && <IssueForm cats={cats} uid={user.id} onDone={() => { load(); setTab('issues') }} />}
      {tab === 'groups' && <div className="card">
        <b>Add a group (issue type)</b>
        <div className="flex gap-2 mt-2"><input className="inp" placeholder="e.g. Broken footpath" value={nc} onChange={(e) => setNc(e.target.value)} maxLength={40} /><select className="inp auto" value={ic} onChange={(e) => setIc(e.target.value)}>{ICONS.map((i) => <option key={i}>{i}</option>)}</select></div>
        <button className="btn mt-3" onClick={run(async () => { if (nc.trim()) { await addCategory(nc.trim(), ic); setNc('') } })}>Add group</button>
        <ul className="mt-4 divide-y">{cats.map((c) => <li key={c.id} className="flex items-center justify-between py-2"><span>{c.icon} {c.name} <span className="text-xs text-slate-500">· {issues.filter((x) => x.category_id === c.id).length} issues</span></span><button className="pill2 danger" onClick={() => confirm(`Delete group "${c.name}"?`) && run(deleteCategory)(c.id)}>Delete</button></li>)}</ul>
      </div>}
      {tab === 'users' && <div className="card"><ul className="divide-y">{users.map((u) => <li key={u.id} className="py-2 flex flex-wrap items-center justify-between gap-2"><span><b>{u.name || '—'}</b><br /><span className="text-sm text-slate-500">{u.email} · {count(u.id)} reports</span></span>
        <select className="inp auto" value={u.role} disabled={u.id === user.id} onChange={(e) => run(setRole)(u.id, e.target.value)}><option value="citizen">User</option><option value="authority">Authority</option><option value="admin">Admin</option></select></li>)}</ul></div>}
    </Shell>
  )
}
import { useEffect, useState } from 'react'
import Shell from '../components/Shell'
import Tabs from '../components/Tabs'
import IssueCard, { Stats, ST, SL } from '../components/IssueCard'
import Empty from '../components/Empty'
import { listIssues, setStatus } from '../api/issues'
export default function AuthorityHome() {
  const [all, setAll] = useState([]), [f, setF] = useState('all'), [err, setErr] = useState('')
  const load = async () => { try { setErr(''); setAll(await listIssues()) } catch (e) { setErr(e.message) } }
  useEffect(() => { load() }, [])
  const list = f === 'all' ? all : all.filter((x) => x.status === f)
  return (
    <Shell title="🏛️ Authority dashboard">
      {err && <p className="mb-2 font-semibold text-red-600">{err}</p>}
      <Stats list={all} />
      <Tabs value={f} onChange={setF} tabs={[['all', 'All'], ...ST.map((s) => [s, SL[s]])]} />
      {list.map((x, i) => <IssueCard key={x.id} i={i} x={x} onStatus={async (id, s) => { await setStatus(id, s); load() }} />)}
      {!list.length && <Empty icon="🎉" text="No issues here. All clear!" />}
    </Shell>
  )
}
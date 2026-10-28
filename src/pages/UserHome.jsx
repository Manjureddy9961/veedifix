import { useEffect, useState } from 'react'
import Shell from '../components/Shell'
import Tabs from '../components/Tabs'
import IssueCard, { Stats } from '../components/IssueCard'
import IssueForm from '../components/IssueForm'
import Empty from '../components/Empty'
import { useAuth } from '../context/AuthContext'
import { listIssues, upvote } from '../api/issues'
import { listCategories } from '../api/admin'
export default function UserHome() {
  const { user } = useAuth(), [tab, setTab] = useState('report'), [all, setAll] = useState([]), [cats, setCats] = useState([]), [err, setErr] = useState('')
  const load = async () => { try { setErr(''); setAll(await listIssues()) } catch (e) { setErr(e.message) } }
  useEffect(() => { load(); listCategories().then(setCats) }, [])
  const list = tab === 'my' ? all.filter((x) => x.user_id === user.id) : all
  return (
    <Shell title="Welcome 👋">
      <Tabs value={tab} onChange={setTab} tabs={[['report', '📝 Report issue'], ['my', '📋 My reports'], ['all', '🌍 All issues']]} />
      {err && <p className="mb-2 font-semibold text-red-600">{err}</p>}
      {tab === 'report' ? <IssueForm cats={cats} uid={user.id} onDone={() => { load(); setTab('my') }} /> : <><Stats list={list} />{list.map((x, i) => <IssueCard key={x.id} i={i} x={x} onUp={async (id) => { await upvote(id); load() }} />)}{!list.length && <Empty icon={tab === 'my' ? '🕊️' : '🏙️'} text={tab === 'my' ? 'You have not reported anything yet.' : 'No issues yet.'} />}</>}
    </Shell>
  )
}
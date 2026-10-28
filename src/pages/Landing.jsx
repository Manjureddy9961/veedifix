import { Link, Navigate } from 'react-router-dom'
import Shell from '../components/Shell'
import Logo from '../components/Logo'
import { useAuth, HOME } from '../context/AuthContext'
const FLOAT = [['🕳️', '6%', '14%', '0s'], ['💧', '84%', '10%', '.8s'], ['💡', '12%', '58%', '1.6s'], ['🗑️', '88%', '52%', '.4s'], ['🌊', '48%', '6%', '2.2s']]
const FLOW = [['👤', 'Citizen', 'reports'], ['📱', 'VeediFix', 'saves it'], ['📨', 'Telegram', 'alerts officers'], ['🏛️', 'Authority', 'takes action'], ['✅', 'Fixed', 'you can track it']]
const CATS = [['🕳️', 'Potholes'], ['💧', 'Water leaks'], ['💡', 'Street lights'], ['🗑️', 'Garbage'], ['🌊', 'Drainage'], ['🚧', 'Roadworks']]
export default function Landing() {
  const { ready, role } = useAuth()
  if (ready && role) return <Navigate to={HOME[role]} replace />
  return (
    <Shell>
      <section className="hero-bg relative overflow-hidden rounded-3xl text-white text-center px-5 pt-10 pb-24 shadow-xl">
        {FLOAT.map(([e, l, t, d]) => <span key={e} className="floaty" style={{ left: l, top: t, animationDelay: d }}>{e}</span>)}
        <div className="flex justify-center relative"><Logo size={76} /></div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 relative">Your street. Your voice. 📣</h1>
        <p className="max-w-md mx-auto mt-2 mb-6 opacity-95 relative">Report local problems, track them, and see them fixed.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
          <Link to="/login/user" className="btn acc">👤 Login as User</Link>
          <Link to="/login/authority" className="btn alt">🏛️ Login as Authority</Link>
        </div>
        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true">
          <g fill="rgba(255,255,255,.22)"><rect x="10" y="20" width="40" height="40" /><rect x="60" y="5" width="34" height="55" /><rect x="104" y="28" width="50" height="32" /><rect x="170" y="10" width="38" height="50" /><rect x="220" y="24" width="46" height="36" /><rect x="280" y="2" width="36" height="58" /><rect x="330" y="22" width="60" height="38" /></g>
          <rect y="60" width="400" height="10" fill="rgba(0,0,0,.28)" /><line x1="0" y1="65" x2="400" y2="65" stroke="#ffd166" strokeWidth="2" className="road" />
        </svg>
      </section>

      <h2 className="text-xl font-bold mt-6 mb-2">How it works 🔄</h2>
      <div className="flow card flex flex-wrap items-center justify-center gap-2 !p-4">
        {FLOW.map(([e, t, s], i) => (
          <div key={t} className="flex items-center gap-2" style={{ animationDelay: `${i * 150}ms` }}>
            <div className="text-center w-24"><div className="text-3xl bob" style={{ animationDelay: `${i * 300}ms`, fontSize: 34 }}>{e}</div><b className="block text-sm">{t}</b><span className="text-xs text-slate-500">{s}</span></div>
            {i < FLOW.length - 1 && <span className="text-pri text-2xl font-bold">➜</span>}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-6 mb-2">What can you report? 📝</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {CATS.map(([e, t], i) => <div key={t} className="chip-cat card !p-3 !mb-0 text-center cursor-default" style={{ animationDelay: `${i * 80}ms` }}><div className="text-3xl">{e}</div><span className="text-xs font-semibold">{t}</span></div>)}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-6 text-center">
        {[['🆓', 'Free to use'], ['⚡', 'Instant alerts'], ['🔒', 'Safe & secure']].map(([e, t]) => <div key={t} className="card !mb-0 !p-3"><div className="text-2xl">{e}</div><b className="text-sm">{t}</b></div>)}
      </div>
    </Shell>
  )
}
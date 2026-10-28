import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Shell from '../components/Shell'
import { useAuth, HOME } from '../context/AuthContext'
import { signIn, signUp, signOut } from '../api/auth'
const EMO = { citizen: '👤', authority: '🏛️', admin: '🛡️' }
const TITLE = { citizen: 'User login', authority: 'Authority login', admin: 'Admin login' }
export default function Login({ role }) {
  const nav = useNavigate(), { user, role: mine, ready } = useAuth()
  const [mode, setMode] = useState('in'), [f, setF] = useState({ name: '', email: '', password: '' }), [err, setErr] = useState(''), [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  useEffect(() => {
    if (!ready || !user || !mine) return
    if (mine === role) nav(HOME[mine], { replace: true })
    else { signOut(); setErr(`This account is not ${role === 'citizen' ? 'a user' : 'an ' + role} account.`) }
  }, [ready, user, mine])
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true)
    const r = mode === 'up' ? await signUp(f.email.trim(), f.password, f.name.trim()) : await signIn(f.email.trim(), f.password)
    if (r.error) setErr(r.error.message)
    else if (!r.data.session) setErr('Email confirmation is still ON in Supabase. Turn it off (see README).')
    setBusy(false) // on success the effect above logs the person straight in
  }
  return (
    <Shell>
      <form onSubmit={submit} className="card max-w-md mx-auto">
        <span className="bob">{mode === 'up' ? '🎉' : EMO[role]}</span>
        <h2 className="text-xl font-bold text-center">{mode === 'up' ? 'Create user account' : TITLE[role]}</h2>
        {mode === 'up' && <><label className="lbl">Name</label><input className="inp" value={f.name} onChange={set('name')} required /></>}
        <label className="lbl">Email</label><input className="inp" type="email" autoComplete="email" value={f.email} onChange={set('email')} required />
        <label className="lbl">Password</label><input className="inp" type="password" minLength={6} autoComplete={mode === 'up' ? 'new-password' : 'current-password'} value={f.password} onChange={set('password')} required />
        <button className="btn w mt-4" disabled={busy}>{mode === 'up' ? 'Sign up' : 'Login'}</button>
        {err && <p className="mt-3 font-semibold text-red-600">{err}</p>}
        {role === 'citizen' && <p className="mt-3 text-sm text-slate-500">{mode === 'up' ? 'Already registered? ' : 'New here? '}<button type="button" className="text-pri font-bold" onClick={() => { setMode(mode === 'up' ? 'in' : 'up'); setErr('') }}>{mode === 'up' ? 'Login' : 'Create account'}</button></p>}
      </form>
    </Shell>
  )
}